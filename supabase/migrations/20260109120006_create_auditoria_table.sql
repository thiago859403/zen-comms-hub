-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.7
-- Criar tabela auditoria conforme PRD
-- Tabela genérica para logs administrativos e rastreabilidade
-- =====================================================

-- Criar tabela auditoria (genérica, não apenas para conversas)
CREATE TABLE IF NOT EXISTS public.auditoria (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  empresa_id BIGINT REFERENCES public.empresas(id) ON DELETE CASCADE,
  acao TEXT NOT NULL, -- Ex: 'create_user', 'update_plan', 'delete_conversation', etc.
  entidade_tipo TEXT NOT NULL, -- Ex: 'user', 'conversation', 'empresa', 'agente_ia', etc.
  entidade_id BIGINT, -- ID da entidade afetada (pode ser NULL se não aplicável)
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Dados adicionais da ação
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_auditoria_user_id ON public.auditoria(user_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa_id ON public.auditoria(empresa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_acao ON public.auditoria(acao);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade_tipo ON public.auditoria(entidade_tipo);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade ON public.auditoria(entidade_tipo, entidade_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_created_at ON public.auditoria(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa_created ON public.auditoria(empresa_id, created_at DESC);

-- Habilitar RLS (políticas serão criadas no ÉPICO 1.2)
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

-- Função helper para registrar ação de auditoria
CREATE OR REPLACE FUNCTION public.log_auditoria(
  p_user_id UUID,
  p_empresa_id BIGINT,
  p_acao TEXT,
  p_entidade_tipo TEXT,
  p_entidade_id BIGINT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_audit_id BIGINT;
BEGIN
  INSERT INTO public.auditoria (
    user_id,
    empresa_id,
    acao,
    entidade_tipo,
    entidade_id,
    ip_address,
    user_agent,
    metadata
  )
  VALUES (
    p_user_id,
    p_empresa_id,
    p_acao,
    p_entidade_tipo,
    p_entidade_id,
    p_ip_address,
    p_user_agent,
    p_metadata
  )
  RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$;

-- Migrar dados de conversation_audit para auditoria (se existirem)
-- Manter conversation_audit para compatibilidade, mas registrar também em auditoria
INSERT INTO public.auditoria (
  user_id,
  empresa_id,
  acao,
  entidade_tipo,
  entidade_id,
  metadata,
  created_at
)
SELECT 
  a.user_id, -- Se agents tiver user_id
  c.empresa_id,
  ca.action,
  'conversation',
  NULL, -- conversation_id é UUID, não BIGINT, então NULL
  jsonb_build_object('conversation_id', ca.conversation_id::TEXT, 'agent_id', ca.agent_id::TEXT, 'details', ca.details),
  ca.created_at
FROM public.conversation_audit ca
LEFT JOIN public.conversations c ON c.id = ca.conversation_id
LEFT JOIN public.agents a ON a.id = ca.agent_id
WHERE c.empresa_id IS NOT NULL
ON CONFLICT DO NOTHING; -- Evitar duplicatas se executar múltiplas vezes

-- Comentários
COMMENT ON TABLE public.auditoria IS 'Tabela de auditoria genérica para rastreabilidade de todas as ações administrativas e críticas na plataforma.';
COMMENT ON COLUMN public.auditoria.acao IS 'Nome da ação executada (ex: create_user, update_plan, delete_conversation).';
COMMENT ON COLUMN public.auditoria.entidade_tipo IS 'Tipo da entidade afetada (ex: user, conversation, empresa, agente_ia, plano).';
COMMENT ON COLUMN public.auditoria.entidade_id IS 'ID da entidade afetada (BIGINT). Pode ser NULL se não aplicável.';
COMMENT ON COLUMN public.auditoria.metadata IS 'Dados adicionais da ação em formato JSONB (ex: valores antigos/novos, contexto adicional).';
COMMENT ON FUNCTION public.log_auditoria(UUID, BIGINT, TEXT, TEXT, BIGINT, INET, TEXT, JSONB) IS 'Função helper para registrar ações de auditoria. Retorna o ID do registro criado.';

-- NOTA: conversation_audit é mantida para compatibilidade e pode ser removida em migration futura
-- após migração completa do código que a utiliza
