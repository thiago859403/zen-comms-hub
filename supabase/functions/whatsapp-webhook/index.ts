import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookMessage {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          image?: any;
          audio?: any;
          video?: any;
          document?: any;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Webhook verification (GET request from WhatsApp)
    if (req.method === 'GET') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification request:', { mode, token });

      // Get verify token from database
      const { data: config } = await supabaseClient
        .from('whatsapp_config')
        .select('webhook_verify_token')
        .single();

      if (mode === 'subscribe' && token === config?.webhook_verify_token) {
        console.log('Webhook verified successfully');
        return new Response(challenge, { 
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      console.log('Webhook verification failed');
      return new Response('Forbidden', { status: 403 });
    }

    // Handle incoming messages (POST request)
    if (req.method === 'POST') {
      const body: WebhookMessage = await req.json();
      console.log('Received webhook:', JSON.stringify(body, null, 2));

      // Process each entry
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const { value } = change;

          // Process incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              const contact = value.contacts?.[0];
              const contactName = contact?.profile?.name || message.from;
              const contactPhone = message.from;

              // Find or create conversation
              let { data: conversation } = await supabaseClient
                .from('conversations')
                .select('id')
                .eq('contact_phone', contactPhone)
                .single();

              if (!conversation) {
                const { data: newConv, error: convError } = await supabaseClient
                  .from('conversations')
                  .insert({
                    contact_name: contactName,
                    contact_phone: contactPhone,
                    status: 'open',
                    priority: 'medium',
                  })
                  .select('id')
                  .single();

                if (convError) {
                  console.error('Error creating conversation:', convError);
                  continue;
                }
                conversation = newConv;
              } else {
                // Reopen conversation if closed
                await supabaseClient
                  .from('conversations')
                  .update({ 
                    status: 'open',
                    last_message_at: new Date().toISOString()
                  })
                  .eq('id', conversation.id);
              }

              // Save message
              const messageContent = message.text?.body || '[Media message]';
              const messageType = message.type;

              const { error: msgError } = await supabaseClient
                .from('messages')
                .insert({
                  conversation_id: conversation.id,
                  sender_type: 'user',
                  content: messageContent,
                  message_type: messageType,
                  status: 'sent',
                  whatsapp_message_id: message.id,
                  metadata: {
                    timestamp: message.timestamp,
                    raw_message: message
                  }
                });

              if (msgError) {
                console.error('Error saving message:', msgError);
              }

              console.log('Message processed:', {
                conversation_id: conversation.id,
                message_id: message.id
              });
            }
          }

          // Process message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await supabaseClient
                .from('messages')
                .update({ status: status.status })
                .eq('whatsapp_message_id', status.id);

              console.log('Message status updated:', {
                message_id: status.id,
                status: status.status
              });
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});