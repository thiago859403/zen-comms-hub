-- =====================================================
-- ÉPICO 3.1 - User Story 3.1.1
-- Criar tabela api_keys para armazenar chaves criptografadas (BYOK)
-- =====================================================

-- Verificar se a extensão pgcrypto está disponível
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar tabela api_keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'claude', 'anthropic', 'google', 'other')),
  key_name TEXT NOT NULL, -- Nome descritivo da chave (ex: "Chave OpenAI Produção")
  key_encrypted TEXT NOT NULL, -- Chave criptografada com AES-256
  key_hash TEXT NOT NULL, -- Hash SHA-256 da chave original (para validação sem descriptografar)
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Chave padrão da empresa
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_used_at TIMESTAMPTZ,
  usage_count BIGINT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb, -- Informações adicionais (modelo preferido, etc.)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Garantir que apenas uma chave padrão por empresa/provider
CREATE UNIQUE INDEX IF NOT EXISTS unique_default_key_per_empresa_provider
  ON public.api_keys (empresa_id, provider)
  WHERE is_default = true;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_api_keys_empresa_id ON public.api_keys(empresa_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON public.api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_empresa_provider_active ON public.api_keys(empresa_id, provider, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_default ON public.api_keys(empresa_id, provider, is_default) WHERE is_default = true;

-- Trigger para updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar RLS (políticas serão criadas no US-3.1.3)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Comentários
COMMENT ON TABLE public.api_keys IS 'Armazena chaves API criptografadas das empresas (modelo BYOK - Bring Your Own Key).';
COMMENT ON COLUMN public.api_keys.key_encrypted IS 'Chave API criptografada usando AES-256. Nunca descriptografar via API pública.';
COMMENT ON COLUMN public.api_keys.key_hash IS 'Hash SHA-256 da chave original. Usado para validação sem precisar descriptografar.';
COMMENT ON COLUMN public.api_keys.is_default IS 'Indica se esta é a chave padrão para o provider. Apenas uma chave padrão por empresa/provider.';
COMMENT ON COLUMN public.api_keys.usage_count IS 'Contador de quantas vezes a chave foi usada.';
COMMENT ON COLUMN public.api_keys.metadata IS 'Metadados adicionais: modelo preferido, configurações específicas, etc.';
