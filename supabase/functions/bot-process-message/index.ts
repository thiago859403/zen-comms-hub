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
          botResponse = await processAIMode(supabaseClient, botConfig, messageHistory, message, contact_name, conversation_id);
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
            botResponse = await processAIMode(supabaseClient, botConfig, messageHistory, message, contact_name, conversation_id);
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

// MODO 2: IA (BYOK - Bring Your Own Key)
async function processAIMode(
  supabaseClient: any,
  botConfig: any,
  messageHistory: any[],
  message: string,
  contactName: string,
  conversationId: string
): Promise<string> {
  try {
    // Buscar empresa_id e agente_id da conversa
    const { data: conversation } = await supabaseClient
      .from('conversations')
      .select('empresa_id, tokens_usados, agente_id')
      .eq('id', conversationId)
      .single();

    let apiKey: string | null = null;
    let apiKeyId: number | null = null;
    let provider: string = 'openai'; // Default provider

    // Tentar buscar chave da empresa (BYOK)
    if (conversation?.empresa_id) {
      try {
        // Tentar buscar chave padrão da empresa (prioridade: openai, claude, anthropic, google)
        const providers = ['openai', 'claude', 'anthropic', 'google'];
        
        for (const prov of providers) {
          const { data: decryptedKey, error: keyError } = await supabaseClient.rpc(
            'get_default_decrypted_api_key',
            {
              p_empresa_id: conversation.empresa_id,
              p_provider: prov,
            }
          );

          if (!keyError && decryptedKey) {
            apiKey = decryptedKey;
            provider = prov;
            
            // Buscar ID da chave usada
            const { data: keyData } = await supabaseClient
              .from('api_keys')
              .select('id')
              .eq('empresa_id', conversation.empresa_id)
              .eq('provider', prov)
              .eq('is_default', true)
              .eq('is_active', true)
              .single();
            
            if (keyData) {
              apiKeyId = keyData.id;
            }
            
            console.log(`Using BYOK key for provider: ${prov}`);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching BYOK key:', error);
      }
    }

    // Fallback: usar chave padrão da plataforma (se configurada)
    if (!apiKey) {
      const PLATFORM_API_KEY = Deno.env.get('LOVABLE_API_KEY') || Deno.env.get('OPENAI_API_KEY');
      if (PLATFORM_API_KEY) {
        apiKey = PLATFORM_API_KEY;
        provider = 'openai'; // Assumir OpenAI para chave padrão
        console.log('Using platform default API key (fallback)');
      } else {
        console.log('No API key available (neither BYOK nor platform default), skipping AI mode');
        return '';
      }
    }

    // Buscar agente de IA se especificado na conversa
    let agenteInstrucoes = '';
    let contextoEmpresa = '';
    
    if (conversation?.agente_id) {
      const { data: agente } = await supabaseClient
        .from('agentes_ia')
        .select('instrucoes')
        .eq('id', conversation.agente_id)
        .eq('status', 'active')
        .single();
      
      if (agente) {
        agenteInstrucoes = agente.instrucoes;
      }
    }

    // Buscar contexto da empresa se disponível
    if (conversation?.empresa_id) {
      const { data: empresa } = await supabaseClient
        .from('empresas')
        .select('contexto_ia')
        .eq('id', conversation.empresa_id)
        .single();
      
      if (empresa?.contexto_ia && typeof empresa.contexto_ia === 'object') {
        contextoEmpresa = JSON.stringify(empresa.contexto_ia);
      }
    }

    // Get knowledge base if enabled
    let knowledgeContext = '';
    if (botConfig.knowledge_base_enabled) {
      // Buscar na base de conhecimento (implementar conforme necessário)
      knowledgeContext = 'Base de conhecimento disponível.';
    }

    // Usar instruções do agente se disponível, senão usar do bot_config
    const instrucoesBase = agenteInstrucoes || botConfig.ai_instructions;
    
    const systemPrompt = `${instrucoesBase}
${contextoEmpresa ? `\n\nContexto da Empresa:\n${contextoEmpresa}` : ''}

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

    console.log('Calling AI with messages:', messages.length, 'Provider:', provider);

    // Determinar endpoint e headers baseado no provider
    let apiUrl = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    switch (provider) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'claude':
      case 'anthropic':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'google':
        // Google pode usar diferentes endpoints, assumindo Vertex AI ou similar
        apiUrl = 'https://ai.gateway.lovable.dev/v1/chat/completions'; // Fallback para gateway
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      default:
        // Fallback para gateway Lovable
        apiUrl = 'https://ai.gateway.lovable.dev/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Preparar body baseado no provider
    let requestBody: any;
    if (provider === 'claude' || provider === 'anthropic') {
      // Anthropic usa formato diferente
      requestBody = {
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: messages.filter(m => m.role !== 'system').map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        system: messages.find((m: any) => m.role === 'system')?.content || '',
      };
    } else {
      // OpenAI e outros usam formato padrão
      requestBody = {
        model: provider === 'openai' ? 'gpt-3.5-turbo' : 'google/gemini-2.5-flash',
        messages,
        temperature: 0.7,
        max_tokens: 200,
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    
    // Extrair resposta baseado no provider
    let aiResponse = '';
    let tokensUsed = 0;

    if (provider === 'claude' || provider === 'anthropic') {
      aiResponse = data.content?.[0]?.text || '';
      tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    } else {
      aiResponse = data.choices?.[0]?.message?.content || '';
      tokensUsed = data.usage?.total_tokens || 0;
    }

    console.log('AI response:', aiResponse, 'Tokens:', tokensUsed);

    // Atualizar conversa com api_key_id e tokens_usados
    if (conversation?.empresa_id) {
      const updateData: any = {
        tokens_usados: (conversation.tokens_usados || 0) + tokensUsed,
      };

      if (apiKeyId) {
        updateData.api_key_id = apiKeyId;
      }

      await supabaseClient
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);
    }
    
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