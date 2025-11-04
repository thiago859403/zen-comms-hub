-- Tabela de configuração do bot behavior
CREATE TABLE public.bot_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bot_mode TEXT DEFAULT 'hybrid' CHECK (bot_mode IN ('keyword', 'ai', 'flow', 'hybrid')),
  fallback_to_human BOOLEAN DEFAULT true,
  auto_close_after_minutes INTEGER DEFAULT 30,
  welcome_message TEXT DEFAULT 'Olá! 👋 Como posso ajudar você hoje?',
  menu_message TEXT DEFAULT 'Digite:\n1️⃣ - Vendas\n2️⃣ - Suporte\n3️⃣ - Falar com humano',
  transfer_message TEXT DEFAULT 'Transferindo você para um de nossos atendentes. Um momento!',
  offline_message TEXT DEFAULT 'No momento estamos offline. Deixe sua mensagem que retornaremos em breve!',
  knowledge_base_enabled BOOLEAN DEFAULT true,
  ai_personality TEXT DEFAULT 'profissional e prestativo',
  ai_instructions TEXT DEFAULT 'Você é um assistente da Nuvia Cloud. Seja educado, profissional e ajude o cliente com suas dúvidas.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de palavras-chave (auto-resposta)
CREATE TABLE public.bot_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_config_id UUID REFERENCES public.bot_config(id) ON DELETE CASCADE NOT NULL,
  keyword TEXT NOT NULL,
  response TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mapeamento fluxo -> trigger
CREATE TABLE public.bot_flow_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_config_id UUID REFERENCES public.bot_config(id) ON DELETE CASCADE NOT NULL,
  flow_name TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('keyword', 'intent', 'always', 'menu_option')),
  trigger_value TEXT,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de contexto de conversa (para IA manter histórico)
CREATE TABLE public.conversation_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  message_history JSONB DEFAULT '[]'::jsonb,
  current_intent TEXT,
  user_data JSONB DEFAULT '{}'::jsonb,
  bot_state TEXT DEFAULT 'idle',
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id)
);

-- Tabela de execução de fluxos
CREATE TABLE public.flow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  flow_name TEXT NOT NULL,
  current_node TEXT,
  variables JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_bot_keywords_keyword ON public.bot_keywords(keyword);
CREATE INDEX idx_conversation_context_conversation ON public.conversation_context(conversation_id);
CREATE INDEX idx_flow_executions_conversation ON public.flow_executions(conversation_id);
CREATE INDEX idx_flow_executions_status ON public.flow_executions(status);

-- Triggers
CREATE TRIGGER update_bot_config_updated_at
  BEFORE UPDATE ON public.bot_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_conversation_context_updated_at
  BEFORE UPDATE ON public.conversation_context
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar bot config"
  ON public.bot_config FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.bot_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar keywords"
  ON public.bot_keywords FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.bot_config
      WHERE bot_config.id = bot_keywords.bot_config_id
      AND has_role(auth.uid(), 'admin'::app_role)
    )
  );

ALTER TABLE public.bot_flow_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar flow triggers"
  ON public.bot_flow_triggers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.bot_config
      WHERE bot_config.id = bot_flow_triggers.bot_config_id
      AND has_role(auth.uid(), 'admin'::app_role)
    )
  );

ALTER TABLE public.conversation_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sistema pode gerenciar contexto"
  ON public.conversation_context FOR ALL
  USING (true);

ALTER TABLE public.flow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver execuções"
  ON public.flow_executions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sistema pode gerenciar execuções"
  ON public.flow_executions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sistema pode atualizar execuções"
  ON public.flow_executions FOR UPDATE
  USING (true);