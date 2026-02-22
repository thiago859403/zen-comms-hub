import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse, getClientIP } from "./_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verificar assinatura do webhook do Stripe usando HMAC SHA-256
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Extrair timestamp e assinaturas do header
    const elements = signature.split(',');
    const timestamp = elements.find((e) => e.startsWith('t='))?.split('=')[1];
    const signatures = elements
      .filter((e) => e.startsWith('v1='))
      .map((e) => e.split('=')[1]);

    if (!timestamp || signatures.length === 0) {
      return false;
    }

    // Criar payload assinado: timestamp + payload
    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    // Importar chave para HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Calcular assinatura
    const signatureData = encoder.encode(signedPayload);
    const computedSignature = await crypto.subtle.sign('HMAC', key, signatureData);
    
    // Converter para hex
    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Comparar com assinaturas recebidas (usar timing-safe comparison)
    return signatures.some((sig) => {
      // Comparação segura contra timing attacks
      if (computedHex.length !== sig.length) return false;
      let result = 0;
      for (let i = 0; i < computedHex.length; i++) {
        result |= computedHex.charCodeAt(i) ^ sig.charCodeAt(i);
      }
      return result === 0;
    });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting: 60 requisições/minuto por IP (webhook público do Stripe)
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(supabaseService, {
      key: 'stripe-webhook',
      limit: 60,
      windowSeconds: 60,
      identifier: clientIP,
    });
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET não configurado');
      return new Response(
        JSON.stringify({ error: 'Webhook secret não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter assinatura do header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ler body como texto (raw)
    const payload = await req.text();

    // Verificar assinatura
    const isValid = await verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET);
    if (!isValid) {
      console.error('Assinatura inválida');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse do evento
    const event = JSON.parse(payload);

    // Cliente Supabase com service role (bypass RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processando evento Stripe: ${event.type}`);

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const empresaId = metadata.empresa_id ? parseInt(metadata.empresa_id) : null;
        const planoId = metadata.plano_id ? parseInt(metadata.plano_id) : null;

        if (!empresaId || !planoId) {
          console.error('Metadata incompleto no checkout.session.completed');
          break;
        }

        // Atualizar empresa com plano e stripe_customer_id
        const updates: any = {
          plano_id: planoId,
          status: 'active',
        };

        if (session.customer && typeof session.customer === 'string') {
          updates.stripe_customer_id = session.customer;
        }

        const { error: updateError } = await supabaseClient
          .from('empresas')
          .update(updates)
          .eq('id', empresaId);

        if (updateError) {
          console.error('Erro ao atualizar empresa:', updateError);
        } else {
          console.log(`Empresa ${empresaId} atualizada com plano ${planoId}`);
        }

        // Registrar auditoria
        await supabaseClient.rpc('log_auditoria', {
          p_user_id: metadata.user_id || null,
          p_empresa_id: empresaId,
          p_acao: 'checkout_completed',
          p_entidade_tipo: 'empresa',
          p_entidade_id: empresaId,
          p_metadata: JSON.stringify({
            session_id: session.id,
            plano_id: planoId,
            customer_id: session.customer,
          }),
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Buscar empresa pelo stripe_customer_id
        const { data: empresa, error: empresaError } = await supabaseClient
          .from('empresas')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (empresaError || !empresa) {
          console.error('Empresa não encontrada para customer:', customerId);
          break;
        }

        // Buscar plano pelo price_id da subscription
        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId) {
          const { data: plano, error: planoError } = await supabaseClient
            .from('planos')
            .select('id')
            .eq('stripe_price_id', priceId)
            .single();

          if (!planoError && plano) {
            // Atualizar plano da empresa
            const { error: updateError } = await supabaseClient
              .from('empresas')
              .update({ plano_id: plano.id })
              .eq('id', empresa.id);

            if (updateError) {
              console.error('Erro ao atualizar plano:', updateError);
            } else {
              console.log(`Plano atualizado para empresa ${empresa.id}`);
            }
          }
        }

        // Atualizar status baseado no status da subscription
        let status = 'active';
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          status = 'suspended';
        }

        await supabaseClient
          .from('empresas')
          .update({ status })
          .eq('id', empresa.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Buscar empresa
        const { data: empresa, error: empresaError } = await supabaseClient
          .from('empresas')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (empresaError || !empresa) {
          console.error('Empresa não encontrada para customer:', customerId);
          break;
        }

        // Buscar plano Free
        const { data: planoFree, error: planoFreeError } = await supabaseClient
          .from('planos')
          .select('id')
          .eq('nome', 'Free')
          .single();

        if (!planoFreeError && planoFree) {
          // Rebaixar para plano Free
          await supabaseClient
            .from('empresas')
            .update({
              plano_id: planoFree.id,
              status: 'active',
            })
            .eq('id', empresa.id);

          console.log(`Empresa ${empresa.id} rebaixada para Free`);
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        // Buscar empresa
        const { data: empresa, error: empresaError } = await supabaseClient
          .from('empresas')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!empresaError && empresa) {
          // Suspender empresa
          await supabaseClient
            .from('empresas')
            .update({ status: 'suspended' })
            .eq('id', empresa.id);

          console.log(`Empresa ${empresa.id} suspensa por falha no pagamento`);
        }

        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
