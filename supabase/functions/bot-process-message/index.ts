import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessMessageRequest {
  conversation_id: string;
  message: string;
  contact_name: string;
  contact_phone: string;
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

    const { conversation_id, message, contact_name, contact_phone }: ProcessMessageRequest = await req.json();

    console.log('Processing message:', { conversation_id, message });

    // Get bot config
    const { data: botConfig } = await supabaseClient
      .from('bot_config')
      .select('*')
      .single();

    if (!botConfig) {
      console.log('No bot config found, skipping bot processing');
      return new Response(JSON.stringify({ success: true, bot_processed: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get or create conversation context
    let { data: context } = await supabaseClient
      .from('conversation_context')
      .select('*')
      .eq('conversation_id', conversation_id)
      .single();

    if (!context) {
      const { data: newContext } = await supabaseClient
        .from('conversation_context')
        .insert({
          conversation_id,
          message_history: [],
          bot_state: 'new_conversation'
        })
        .select()
        .single();
      context = newContext;
    }

    // Update message history
    const messageHistory = context?.message_history || [];
    messageHistory.push({ role: 'user', content: message, timestamp: new Date().toISOString() });

    let botResponse = '';
    let shouldTransferToHuman = false;
    let processingMode = '';

    // Check for transfer keywords
    const transferKeywords = ['humano', 'atendente', 'pessoa', 'falar com alguém'];
    if (transferKeywords.some(kw => message.toLowerCase().includes(kw))) {
      shouldTransferToHuman = true;
      botResponse = botConfig.transfer_message;
      processingMode = 'transfer';
    } else {
      // Process based on bot mode
      switch (botConfig.bot_mode) {
        case 'keyword':
          botResponse = await processKeywordMode(supabaseClient, botConfig, message);
          processingMode = 'keyword';
          break;
          
        case 'ai':
          botResponse = await processAIMode(supabaseClient, botConfig, messageHistory, message, contact_name);
          processingMode = 'ai';
          break;
          
        case 'flow':
          botResponse = await processFlowMode(supabaseClient, botConfig, conversation_id, message);
          processingMode = 'flow';
          break;
          
        case 'hybrid':
        default:
          // Try keyword first
          botResponse = await processKeywordMode(supabaseClient, botConfig, message);
          if (!botResponse) {
            // Try AI
            botResponse = await processAIMode(supabaseClient, botConfig, messageHistory, message, contact_name);
          }
          processingMode = 'hybrid';
          break;
      }
    }

    // Send welcome message for new conversations
    if (context?.bot_state === 'new_conversation' && !shouldTransferToHuman) {
      await sendWhatsAppMessage(supabaseClient, contact_phone, botConfig.welcome_message, conversation_id);
      if (botConfig.menu_message) {
        await sendWhatsAppMessage(supabaseClient, contact_phone, botConfig.menu_message, conversation_id);
      }
    }

    // Send bot response
    if (botResponse) {
      messageHistory.push({ role: 'bot', content: botResponse, timestamp: new Date().toISOString() });
      await sendWhatsAppMessage(supabaseClient, contact_phone, botResponse, conversation_id);
    }

    // Update context
    await supabaseClient
      .from('conversation_context')
      .update({
        message_history: messageHistory,
        bot_state: shouldTransferToHuman ? 'transferred' : 'active',
        last_interaction_at: new Date().toISOString()
      })
      .eq('id', context.id);

    // Transfer to human if needed
    if (shouldTransferToHuman) {
      await supabaseClient
        .from('conversations')
        .update({
          status: 'pending',
          priority: 'high'
        })
        .eq('id', conversation_id);
    }

    console.log('Message processed successfully:', {
      mode: processingMode,
      response: botResponse,
      transferred: shouldTransferToHuman
    });

    return new Response(JSON.stringify({
      success: true,
      bot_processed: true,
      mode: processingMode,
      response: botResponse,
      transferred_to_human: shouldTransferToHuman
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing message:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// MODO 1: Palavras-chave
async function processKeywordMode(supabaseClient: any, botConfig: any, message: string): Promise<string> {
  const { data: keywords } = await supabaseClient
    .from('bot_keywords')
    .select('*')
    .eq('bot_config_id', botConfig.id)
    .eq('active', true)
    .order('priority', { ascending: false });

  if (keywords) {
    const normalizedMessage = message.toLowerCase();
    for (const kw of keywords) {
      if (normalizedMessage.includes(kw.keyword.toLowerCase())) {
        console.log('Keyword matched:', kw.keyword);
        return kw.response;
      }
    }
  }

  return '';
}

// MODO 2: IA (Lovable AI)
async function processAIMode(
  supabaseClient: any,
  botConfig: any,
  messageHistory: any[],
  message: string,
  contactName: string
): Promise<string> {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.log('LOVABLE_API_KEY not set, skipping AI mode');
      return '';
    }

    // Get knowledge base if enabled
    let knowledgeContext = '';
    if (botConfig.knowledge_base_enabled) {
      // Buscar na base de conhecimento (implementar conforme necessário)
      knowledgeContext = 'Base de conhecimento disponível.';
    }

    const systemPrompt = `${botConfig.ai_instructions}

Personalidade: ${botConfig.ai_personality}

Nome do cliente: ${contactName}

${knowledgeContext}

IMPORTANTE: 
- Seja breve e direto (máximo 2-3 frases por resposta)
- Use emojis moderadamente
- Se não souber responder algo, sugira falar com um atendente humano
- Mantenha tom ${botConfig.ai_personality}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...messageHistory.slice(-10).map((m: any) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    console.log('Calling AI with messages:', messages.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    console.log('AI response:', aiResponse);
    
    return aiResponse;
  } catch (error) {
    console.error('Error in AI mode:', error);
    return '';
  }
}

// MODO 3: Fluxos visuais
async function processFlowMode(
  supabaseClient: any,
  botConfig: any,
  conversationId: string,
  message: string
): Promise<string> {
  try {
    // Get flow triggers
    const { data: triggers } = await supabaseClient
      .from('bot_flow_triggers')
      .select('*')
      .eq('bot_config_id', botConfig.id)
      .eq('active', true)
      .order('priority', { ascending: false });

    if (!triggers || triggers.length === 0) {
      return '';
    }

    // Check if message matches any trigger
    for (const trigger of triggers) {
      let shouldTrigger = false;

      switch (trigger.trigger_type) {
        case 'keyword':
          shouldTrigger = message.toLowerCase().includes(trigger.trigger_value.toLowerCase());
          break;
        case 'menu_option':
          shouldTrigger = message.trim() === trigger.trigger_value;
          break;
        case 'always':
          shouldTrigger = true;
          break;
      }

      if (shouldTrigger) {
        console.log('Flow triggered:', trigger.flow_name);
        
        // Create flow execution
        await supabaseClient
          .from('flow_executions')
          .insert({
            conversation_id: conversationId,
            flow_name: trigger.flow_name,
            status: 'running',
            variables: {}
          });

        return `Iniciando fluxo: ${trigger.flow_name}... (Implementação completa em desenvolvimento)`;
      }
    }

    return '';
  } catch (error) {
    console.error('Error in flow mode:', error);
    return '';
  }
}

// Helper para enviar mensagem via WhatsApp
async function sendWhatsAppMessage(
  supabaseClient: any,
  to: string,
  message: string,
  conversationId: string
): Promise<void> {
  try {
    const { data: config } = await supabaseClient
      .from('whatsapp_config')
      .select('*')
      .eq('status', 'connected')
      .single();

    if (!config) {
      console.log('WhatsApp not configured, message not sent');
      return;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: message }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // Save to database
      await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'bot',
          content: message,
          message_type: 'text',
          status: 'sent',
          whatsapp_message_id: data.messages[0].id
        });

      console.log('Message sent successfully');
    } else {
      console.error('Failed to send WhatsApp message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}