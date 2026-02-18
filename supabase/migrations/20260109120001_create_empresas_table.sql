-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.2
-- Criar tabela empresas (tenants) conforme PRD
-- Migrar dados de organizations para empresas
-- =====================================================

-- Criar tabela empresas
CREATE TABLE IF NOT EXISTS public.empresas (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  plano_id BIGINT REFERENCES public.planos(id) ON DELETE SET NULL,
  contexto_ia JSONB DEFAULT '{}'::jsonb,
  stripe_customer_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive', 'pending')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_empresas_nome ON public.empresas(nome);
CREATE INDEX IF NOT EXISTS idx_empresas_plano_id ON public.empresas(plano_id);
CREATE INDEX IF NOT EXISTS idx_empresas_status ON public.empresas(status);
CREATE INDEX IF NOT EXISTS idx_empresas_is_active ON public.empresas(is_active);
CREATE INDEX IF NOT EXISTS idx_empresas_stripe_customer_id ON public.empresas(stripe_customer_id);

-- Habilitar RLS (políticas serão criadas no ÉPICO 1.2)
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Trigger para updated_at
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Criar tabela de mapeamento organizations -> empresas (para migração)
CREATE TABLE IF NOT EXISTS public.org_to_empresa_mapping (
  org_id UUID NOT NULL,
  empresa_id BIGINT NOT NULL,
  PRIMARY KEY (org_id, empresa_id),
  FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE
);

-- Migrar dados de organizations para empresas
-- Mapear planos antigos (text) para novos IDs
DO $$
DECLARE
  org_record RECORD;
  new_empresa_id BIGINT;
  plano_id_mapped BIGINT;
BEGIN
  FOR org_record IN 
    SELECT id, name, plan, settings, created_at, updated_at 
    FROM public.organizations
  LOOP
    -- Mapear plan antigo para novo plano_id
    SELECT id INTO plano_id_mapped
    FROM public.planos
    WHERE LOWER(nome) = LOWER(org_record.plan)
    LIMIT 1;
    
    -- Se não encontrar plano, usar Free como padrão
    IF plano_id_mapped IS NULL THEN
      SELECT id INTO plano_id_mapped FROM public.planos WHERE nome = 'Free' LIMIT 1;
    END IF;
    
    -- Inserir nova empresa
    INSERT INTO public.empresas (nome, plano_id, contexto_ia, status, is_active, created_at, updated_at)
    VALUES (
      org_record.name,
      plano_id_mapped,
      COALESCE(org_record.settings, '{}'::jsonb),
      'active',
      true,
      org_record.created_at,
      org_record.updated_at
    )
    RETURNING id INTO new_empresa_id;
    
    -- Criar mapeamento
    INSERT INTO public.org_to_empresa_mapping (org_id, empresa_id)
    VALUES (org_record.id, new_empresa_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Adicionar comentários
COMMENT ON TABLE public.empresas IS 'Tabela de empresas (tenants) da plataforma NUVIA. Cada empresa é isolada via RLS.';
COMMENT ON COLUMN public.empresas.contexto_ia IS 'Contexto e configurações específicas de IA da empresa (JSONB).';
COMMENT ON COLUMN public.empresas.stripe_customer_id IS 'ID do Customer no Stripe para gestão de assinaturas.';
COMMENT ON TABLE public.org_to_empresa_mapping IS 'Tabela de mapeamento temporária para migração de organizations (UUID) para empresas (BIGINT). Pode ser removida após migração completa.';
