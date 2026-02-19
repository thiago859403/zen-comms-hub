import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse } from "./_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendMessageRequest {
  to: string;
  message: string;
  conversation_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ─── 1. Autenticação ───────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cliente autenticado (respeita RLS)
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 2. Buscar empresa_id do usuário ───────────────────────
    const { data: profile, error: profileError } = await supabaseAuth
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.empresa_id) {
      return new Response(
        JSON.stringify({ error: 'Empresa não encontrada para este usuário' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const empresaId = profile.empresa_id;

    // ─── 3. Rate Limiting duplo (service role para bypass RLS) ─
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 3a. Rate limit por user_id: 10 req/min (evita abuso individual)
    const userRateLimit = await checkRateLimit(supabaseService, {
      key: 'whatsapp-send-msg',
      limit: 10,
      windowSeconds: 60,
      identifier: `user-${user.id}`,
    });

    if (!userRateLimit.allowed) {
      return createRateLimitResponse(userRateLimit);
    }

    // 3b. Rate limit por empresa_id: 200 req/min (protege infra global)
    const empresaRateLimit = await checkRateLimit(supabaseService, {
      key: 'whatsapp-send-msg',
      limit: 200,
      windowSeconds: 60,
      identifier: `empresa-${empresaId}`,
    });

    if (!empresaRateLimit.allowed) {
      return createRateLimitResponse(empresaRateLimit);
    }

    // ─── 4. Validar payload ────────────────────────────────────
    const { to, message, conversation_id }: SendMessageRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, message' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // ─── 5. Buscar config do WhatsApp ──────────────────────────
    const { data: config, error: configError } = await supabaseService
      .from('whatsapp_config')
      .select('phone_number_id, access_token')
      .eq('status', 'connected')
      .eq('empresa_id', empresaId)
      .single();

    if (configError || !config) {
      return new Response(
        JSON.stringify({ error: 'WhatsApp não configurado ou não conectado' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // ─── 6. Enviar mensagem via WhatsApp Business API ──────────
    const whatsappUrl = `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`;
    
    const response = await fetch(whatsappUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message
        }
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error status:', response.status);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao enviar mensagem via WhatsApp',
          details: responseData
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // ─── 7. Salvar mensagem no banco (se conversation_id) ──────
    if (conversation_id) {
      await supabaseService
        .from('messages')
        .insert({
          conversation_id,
          sender_type: 'agent',
          sender_id: user.id,
          content: message,
          message_type: 'text',
          status: 'sent',
          whatsapp_message_id: responseData.messages?.[0]?.id
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message_id: responseData.messages?.[0]?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-send-message');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
