-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.5
-- Atualizar tabela conversas para modelo do PRD
-- Adicionar campos: conversation_uuid, empresa_id, user_id, agente_id, mensagens, tokens_usados
-- =====================================================

-- Adicionar campos do PRD à tabela conversations existente
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS conversation_uuid UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS empresa_id BIGINT REFERENCES public.empresas(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS agente_id BIGINT REFERENCES public.agentes_ia(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS mensagens JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tokens_usados BIGINT DEFAULT 0;

-- Preencher conversation_uuid com o próprio id para registros existentes (se NULL)
UPDATE public.conversations 
SET conversation_uuid = id 
WHERE conversation_uuid IS NULL;

-- Migrar empresa_id baseado em assigned_agent_id -> agents -> profiles -> empresa_id
-- Se não conseguir mapear, deixar NULL (será necessário atualizar manualmente ou via script)
UPDATE public.conversations c
SET empresa_id = p.empresa_id
FROM public.agents a
JOIN public.profiles p ON p.id = a.user_id
WHERE c.assigned_agent_id = a.id
AND c.empresa_id IS NULL
AND p.empresa_id IS NOT NULL;

-- Alternativamente, tentar mapear via user_id se existir no metadata
-- Se metadata contém user_id, usar para buscar empresa_id
UPDATE public.conversations c
SET empresa_id = p.empresa_id
FROM public.profiles p
WHERE (c.metadata->>'user_id')::UUID = p.id
AND c.empresa_id IS NULL
AND p.empresa_id IS NOT NULL;

-- Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_conversations_empresa_id ON public.conversations(empresa_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agente_id ON public.conversations(agente_id);
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_uuid ON public.conversations(conversation_uuid);

-- Criar índice GIN para busca em mensagens JSONB (se houver muitos dados)
CREATE INDEX IF NOT EXISTS idx_conversations_mensagens_gin ON public.conversations USING GIN (mensagens);

-- Adicionar comentários
COMMENT ON COLUMN public.conversations.conversation_uuid IS 'UUID único da conversa para integração externa. Geralmente igual ao id, mas pode ser diferente para compatibilidade.';
COMMENT ON COLUMN public.conversations.empresa_id IS 'ID da empresa (tenant) à qual a conversa pertence. Isolamento multi-tenant.';
COMMENT ON COLUMN public.conversations.user_id IS 'ID do usuário que iniciou ou está responsável pela conversa.';
COMMENT ON COLUMN public.conversations.agente_id IS 'ID do agente de IA atribuído à conversa (FK para agentes_ia). Diferente de assigned_agent_id que é para agents humanos.';
COMMENT ON COLUMN public.conversations.mensagens IS 'Array JSONB com histórico de mensagens da conversa. Formato: [{"role": "user|assistant|system", "content": "...", "timestamp": "..."}]';
COMMENT ON COLUMN public.conversations.tokens_usados IS 'Total de tokens consumidos nesta conversa (para controle de uso e billing).';

-- NOTA: Os campos antigos (assigned_agent_id, contact_name, etc.) são mantidos para compatibilidade
-- Podem ser removidos em migration futura após migração completa do frontend
