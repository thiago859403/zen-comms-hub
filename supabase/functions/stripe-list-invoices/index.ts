import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Obter empresa do usuário
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

    // Service role client para rate limiting
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limit por user: 60 req/min (leitura)
    const rlUser = await checkRateLimit(supabaseService, {
      key: 'stripe-list-invoices',
      limit: 60,
      windowSeconds: 60,
      identifier: `user-${user.id}`,
    });
    if (!rlUser.allowed) {
      return createRateLimitResponse(rlUser);
    }

    // Rate limit por empresa: 300 req/min (leitura)
    const rlEmpresa = await checkRateLimit(supabaseService, {
      key: 'stripe-list-invoices',
      limit: 300,
      windowSeconds: 60,
      identifier: `empresa-${profile.empresa_id}`,
    });
    if (!rlEmpresa.allowed) {
      return createRateLimitResponse(rlEmpresa);
    }

    // Buscar empresa
    const { data: empresa, error: empresaError } = await supabaseClient
      .from('empresas')
      .select('stripe_customer_id')
      .eq('id', profile.empresa_id)
      .single();

    if (empresaError || !empresa || !empresa.stripe_customer_id) {
      return new Response(
        JSON.stringify({ invoices: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Stripe não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Listar invoices do Stripe
    const invoicesParams = new URLSearchParams({
      customer: empresa.stripe_customer_id,
      limit: '100',
    });

    const invoicesResponse = await fetch(
      `https://api.stripe.com/v1/invoices?${invoicesParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!invoicesResponse.ok) {
      console.error('Error listing invoices, status:', invoicesResponse.status);
      return new Response(
        JSON.stringify({ error: 'Erro ao listar faturas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const invoicesData = await invoicesResponse.json();

    // Formatar invoices
    const invoices = (invoicesData.data || []).map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount_paid || invoice.amount_due,
      currency: invoice.currency,
      status: invoice.status,
      created: invoice.created,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      number: invoice.number,
    }));

    return new Response(
      JSON.stringify({ invoices }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
