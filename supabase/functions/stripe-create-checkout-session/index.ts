import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateCheckoutRequest {
  plano_id: number;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter perfil e empresa do usuário
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.empresa_id) {
      return new Response(
        JSON.stringify({ error: 'Empresa não encontrada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { plano_id, success_url, cancel_url }: CreateCheckoutRequest = await req.json();

    if (!plano_id) {
      return new Response(
        JSON.stringify({ error: 'plano_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar plano
    const { data: plano, error: planoError } = await supabaseClient
      .from('planos')
      .select('id, nome, preco_mensal, stripe_price_id')
      .eq('id', plano_id)
      .single();

    if (planoError || !plano) {
      return new Response(
        JSON.stringify({ error: 'Plano não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!plano.stripe_price_id) {
      return new Response(
        JSON.stringify({ error: 'Plano não configurado no Stripe' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar empresa
    const { data: empresa, error: empresaError } = await supabaseClient
      .from('empresas')
      .select('id, nome, stripe_customer_id')
      .eq('id', profile.empresa_id)
      .single();

    if (empresaError || !empresa) {
      return new Response(
        JSON.stringify({ error: 'Empresa não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Stripe se não existir
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Stripe não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let stripeCustomerId = empresa.stripe_customer_id;

    if (!stripeCustomerId) {
      // Criar cliente no Stripe
      const createCustomerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email || '',
          name: empresa.nome,
          metadata: JSON.stringify({
            empresa_id: empresa.id.toString(),
            user_id: user.id,
          }),
        }),
      });

      if (!createCustomerResponse.ok) {
        const errorText = await createCustomerResponse.text();
        console.error('Erro ao criar cliente Stripe:', errorText);
        return new Response(
          JSON.stringify({ error: 'Erro ao criar cliente no Stripe' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const customerData = await createCustomerResponse.json();
      stripeCustomerId = customerData.id;

      // Atualizar empresa com stripe_customer_id
      const { error: updateError } = await supabaseClient
        .from('empresas')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', empresa.id);

      if (updateError) {
        console.error('Erro ao atualizar stripe_customer_id:', updateError);
      }
    }

    // Criar sessão de checkout
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000';
    const defaultSuccessUrl = `${baseUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${baseUrl}/dashboard/settings?canceled=true`;

    const checkoutParams = new URLSearchParams({
      'line_items[0][price]': plano.stripe_price_id,
      'line_items[0][quantity]': '1',
      mode: 'subscription',
      success_url: success_url || defaultSuccessUrl,
      cancel_url: cancel_url || defaultCancelUrl,
      customer: stripeCustomerId,
      client_reference_id: empresa.id.toString(),
      metadata: JSON.stringify({
        empresa_id: empresa.id.toString(),
        plano_id: plano_id.toString(),
        user_id: user.id,
      }),
    });

    const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: checkoutParams,
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Erro ao criar checkout session:', errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar sessão de checkout' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await checkoutResponse.json();

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
