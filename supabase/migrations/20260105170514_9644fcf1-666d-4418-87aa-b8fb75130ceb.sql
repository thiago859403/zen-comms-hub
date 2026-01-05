-- =====================================================
-- CORREÇÃO DE SEGURANÇA: Políticas RLS para tabelas vulneráveis
-- =====================================================

-- 1. CONVERSATION_CONTEXT - Adicionar políticas RLS
-- Permite apenas acesso a contextos de conversas que o usuário participa

ALTER TABLE public.conversation_context ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversation context" ON public.conversation_context;
CREATE POLICY "Users can view conversation context"
ON public.conversation_context
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_context.conversation_id
  )
);

DROP POLICY IF EXISTS "Users can insert conversation context" ON public.conversation_context;
CREATE POLICY "Users can insert conversation context"
ON public.conversation_context
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_context.conversation_id
  )
);

DROP POLICY IF EXISTS "Users can update conversation context" ON public.conversation_context;
CREATE POLICY "Users can update conversation context"
ON public.conversation_context
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_context.conversation_id
  )
);

-- 2. FLOW_EXECUTIONS - Adicionar políticas RLS
-- Permite apenas acesso a execuções de fluxo de conversas do usuário

ALTER TABLE public.flow_executions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view flow executions" ON public.flow_executions;
CREATE POLICY "Users can view flow executions"
ON public.flow_executions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = flow_executions.conversation_id
  )
);

DROP POLICY IF EXISTS "Users can insert flow executions" ON public.flow_executions;
CREATE POLICY "Users can insert flow executions"
ON public.flow_executions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = flow_executions.conversation_id
  )
);

DROP POLICY IF EXISTS "Users can update flow executions" ON public.flow_executions;
CREATE POLICY "Users can update flow executions"
ON public.flow_executions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = flow_executions.conversation_id
  )
);

-- 3. TWO_FACTOR_TOKENS - Adicionar políticas RLS restritas
-- Tokens 2FA devem ser acessíveis apenas pelo próprio usuário

ALTER TABLE public.two_factor_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own 2fa tokens" ON public.two_factor_tokens;
CREATE POLICY "Users can view own 2fa tokens"
ON public.two_factor_tokens
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own 2fa tokens" ON public.two_factor_tokens;
CREATE POLICY "Users can insert own 2fa tokens"
ON public.two_factor_tokens
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own 2fa tokens" ON public.two_factor_tokens;
CREATE POLICY "Users can delete own 2fa tokens"
ON public.two_factor_tokens
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 4. CONVERSATION_AUDIT - Adicionar políticas RLS
-- Logs de auditoria acessíveis apenas por admins e agentes envolvidos

ALTER TABLE public.conversation_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversation audit" ON public.conversation_audit;
CREATE POLICY "Users can view conversation audit"
ON public.conversation_audit
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Agents can insert conversation audit" ON public.conversation_audit;
CREATE POLICY "Agents can insert conversation audit"
ON public.conversation_audit
FOR INSERT
TO authenticated
WITH CHECK (
  agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
);

-- 5. CONVERSATIONS - Políticas mais restritivas
-- Conversas acessíveis por agentes da organização

DROP POLICY IF EXISTS "Authenticated users can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (
  assigned_agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
  OR assigned_agent_id IS NULL
);

DROP POLICY IF EXISTS "Agents can update assigned conversations" ON public.conversations;
CREATE POLICY "Agents can update assigned conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (
  assigned_agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
CREATE POLICY "Users can insert conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. WHATSAPP_CONFIG - Políticas RLS restritas ao proprietário
-- Configurações do WhatsApp devem ser acessíveis apenas pelo usuário que criou

ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own whatsapp config" ON public.whatsapp_config;
CREATE POLICY "Users can view own whatsapp config"
ON public.whatsapp_config
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own whatsapp config" ON public.whatsapp_config;
CREATE POLICY "Users can insert own whatsapp config"
ON public.whatsapp_config
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own whatsapp config" ON public.whatsapp_config;
CREATE POLICY "Users can update own whatsapp config"
ON public.whatsapp_config
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own whatsapp config" ON public.whatsapp_config;
CREATE POLICY "Users can delete own whatsapp config"
ON public.whatsapp_config
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 7. MESSAGES - Garantir políticas RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
CREATE POLICY "Users can view messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
  )
);

DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
CREATE POLICY "Users can insert messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 8. AGENTS - Políticas RLS para agentes
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view agents" ON public.agents;
CREATE POLICY "Users can view agents"
ON public.agents
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Users can update own agent" ON public.agents;
CREATE POLICY "Users can update own agent"
ON public.agents
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
CREATE POLICY "Admins can manage agents"
ON public.agents
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));