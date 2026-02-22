import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limit.ts";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extrair user do JWT para rate limiting
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') ?? '';
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar empresa_id para rate limiting duplo
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .single();

    // Rate limit por user: 30 req/min
    const rlUser = await checkRateLimit(supabaseClient, {
      key: 'whatsapp-send-message',
      limit: 30,
      windowSeconds: 60,
      identifier: `user-${user.id}`,
    });
    if (!rlUser.allowed) {
      return createRateLimitResponse(rlUser);
    }

    // Rate limit por empresa: 200 req/min
    if (profile?.empresa_id) {
      const rlEmpresa = await checkRateLimit(supabaseClient, {
        key: 'whatsapp-send-message',
        limit: 200,
        windowSeconds: 60,
        identifier: `empresa-${profile.empresa_id}`,
      });
      if (!rlEmpresa.allowed) {
        return createRateLimitResponse(rlEmpresa);
      }
    }

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

    // Get WhatsApp config
    const { data: config, error: configError } = await supabaseClient
      .from('whatsapp_config')
      .select('*')
      .eq('status', 'connected')
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

    // Send message via WhatsApp Business API
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
      console.error('WhatsApp API error, status:', response.status);
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

    // Save message to database if conversation_id provided
    if (conversation_id) {
      await supabaseClient
        .from('messages')
        .insert({
          conversation_id,
          sender_type: 'agent',
          sender_id: user.id,
          content: message,
          message_type: 'text',
          status: 'sent',
          whatsapp_message_id: responseData.messages[0].id
        });
    }

    console.log('Message sent successfully:', { message_id: responseData.messages[0]?.id });

    return new Response(
      JSON.stringify({ 
        success: true,
        message_id: responseData.messages[0].id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error sending message:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
