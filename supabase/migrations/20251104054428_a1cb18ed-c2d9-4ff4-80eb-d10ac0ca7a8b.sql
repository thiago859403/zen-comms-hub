-- Tabela de configuração do WhatsApp Business
CREATE TABLE public.whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number_id TEXT,
  business_account_id TEXT,
  access_token TEXT,
  webhook_verify_token TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'validating', 'disconnected')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  connected_number TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de agentes
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'away')),
  max_conversations INTEGER DEFAULT 5,
  current_conversations INTEGER DEFAULT 0,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin', 'supervisor', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de filas
CREATE TABLE public.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de conversas
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  queue_id UUID REFERENCES public.queues(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_breach BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de tags de conversas (muitos para muitos)
CREATE TABLE public.conversation_tags (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, tag_id)
);

-- Tabela de mensagens
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'agent', 'system', 'bot')),
  sender_id UUID,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document', 'location')),
  media_url TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  whatsapp_message_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de templates de mensagens
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  approved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de respostas rápidas
CREATE TABLE public.quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcut TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(shortcut)
);

-- Tabela de métricas de conversas
CREATE TABLE public.conversation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  first_response_time INTEGER, -- em segundos
  resolution_time INTEGER, -- em segundos
  messages_count INTEGER DEFAULT 0,
  agent_messages_count INTEGER DEFAULT 0,
  satisfaction_score INTEGER,
  satisfaction_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de auditoria
CREATE TABLE public.conversation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_assigned_agent ON public.conversations(assigned_agent_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_agents_status ON public.agents(status);

-- Triggers para updated_at
CREATE TRIGGER update_whatsapp_config_updated_at
  BEFORE UPDATE ON public.whatsapp_config
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON public.message_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies

-- whatsapp_config
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar config WhatsApp"
  ON public.whatsapp_config FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar agentes"
  ON public.agents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agentes podem ver próprio perfil"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Agentes podem atualizar próprio status"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

-- conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar conversas"
  ON public.conversations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agentes podem ver conversas atribuídas"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Agentes podem atualizar conversas atribuídas"
  ON public.conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE agents.id = assigned_agent_id AND agents.user_id = auth.uid()
    )
  );

-- messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar mensagens"
  ON public.messages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agentes podem ver mensagens de suas conversas"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.agents a ON a.id = c.assigned_agent_id
      WHERE c.id = conversation_id AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Agentes podem inserir mensagens"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE user_id = auth.uid()
    )
  );

-- tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tags"
  ON public.tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem gerenciar tags"
  ON public.tags FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- queues
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver filas"
  ON public.queues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem gerenciar filas"
  ON public.queues FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- conversation_tags
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agentes podem ver tags de conversas"
  ON public.conversation_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agentes podem gerenciar tags"
  ON public.conversation_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

-- message_templates
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver templates"
  ON public.message_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem gerenciar templates"
  ON public.message_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- quick_replies
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver respostas rápidas"
  ON public.quick_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agentes podem criar respostas rápidas"
  ON public.quick_replies FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Criadores podem atualizar suas respostas"
  ON public.quick_replies FOR UPDATE
  USING (auth.uid() = created_by);

-- conversation_metrics
ALTER TABLE public.conversation_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar métricas"
  ON public.conversation_metrics FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agentes podem ver métricas"
  ON public.conversation_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents WHERE user_id = auth.uid()
    )
  );

-- conversation_audit
ALTER TABLE public.conversation_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver auditoria"
  ON public.conversation_audit FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sistema pode inserir logs"
  ON public.conversation_audit FOR INSERT
  WITH CHECK (true);

-- Enable realtime para mensagens e conversas
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;