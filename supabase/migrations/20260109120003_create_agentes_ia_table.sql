-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.4
-- Criar tabela agentes_ia conforme PRD
-- =====================================================

-- Criar tabela agentes_ia
CREATE TABLE IF NOT EXISTS public.agentes_ia (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  instrucoes TEXT NOT NULL, -- System Prompt
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Garantir que não haja nomes duplicados na mesma empresa
  CONSTRAINT unique_agente_nome_empresa UNIQUE (empresa_id, nome)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_agentes_ia_empresa_id ON public.agentes_ia(empresa_id);
CREATE INDEX IF NOT EXISTS idx_agentes_ia_status ON public.agentes_ia(status);
CREATE INDEX IF NOT EXISTS idx_agentes_ia_created_by ON public.agentes_ia(created_by);

-- Habilitar RLS (políticas serão criadas no ÉPICO 1.2)
ALTER TABLE public.agentes_ia ENABLE ROW LEVEL SECURITY;

-- Trigger para updated_at
CREATE TRIGGER update_agentes_ia_updated_at
  BEFORE UPDATE ON public.agentes_ia
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Comentários
COMMENT ON TABLE public.agentes_ia IS 'Agentes de IA customizados por empresa. Cada empresa pode ter múltiplos agentes com diferentes instruções (System Prompts).';
COMMENT ON COLUMN public.agentes_ia.instrucoes IS 'System Prompt do agente de IA. Define comportamento, personalidade e contexto do agente.';
COMMENT ON COLUMN public.agentes_ia.created_by IS 'ID do usuário que criou o agente.';
