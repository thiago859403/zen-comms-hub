-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.3
-- Atualizar tabela perfis para modelo do PRD
-- Adicionar empresa_id e role, migrar dados
-- =====================================================

-- Primeiro, atualizar enum app_role para incluir 'master'
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'master';

-- Adicionar coluna empresa_id na tabela perfis
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS empresa_id BIGINT REFERENCES public.empresas(id) ON DELETE CASCADE;

-- Adicionar coluna role diretamente na tabela perfis (além do sistema user_roles para compatibilidade)
-- Por padrão será 'user', mas pode ser 'admin' ou 'master'
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('master', 'admin', 'user'));

-- Migrar dados: mapear org_id -> empresa_id usando a tabela de mapeamento
UPDATE public.profiles p
SET empresa_id = m.empresa_id
FROM public.org_to_empresa_mapping m
WHERE p.org_id = m.org_id
AND p.empresa_id IS NULL;

-- Para perfis que têm role 'admin' no sistema user_roles, atualizar role na coluna
UPDATE public.profiles p
SET role = 'admin'
WHERE EXISTS (
  SELECT 1 
  FROM public.user_roles ur 
  WHERE ur.user_id = p.id 
  AND ur.role = 'admin'::public.app_role
)
AND p.role = 'user';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_id ON public.profiles(empresa_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_role ON public.profiles(empresa_id, role);

-- Criar função helper para obter empresa_id do usuário atual
CREATE OR REPLACE FUNCTION public.current_empresa_id()
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Criar função helper para verificar se usuário pertence à empresa
CREATE OR REPLACE FUNCTION public.user_belongs_to_empresa(user_id UUID, empresa_id_check BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = user_id 
    AND empresa_id = empresa_id_check
  )
$$;

-- Atualizar comentários
COMMENT ON COLUMN public.profiles.empresa_id IS 'ID da empresa (tenant) à qual o usuário pertence. Substitui org_id no modelo PRD.';
COMMENT ON COLUMN public.profiles.role IS 'Role do usuário na empresa: master (admin plataforma), admin (admin empresa), user (colaborador).';
COMMENT ON FUNCTION public.current_empresa_id() IS 'Retorna o ID da empresa do usuário autenticado atual.';
COMMENT ON FUNCTION public.user_belongs_to_empresa(UUID, BIGINT) IS 'Verifica se um usuário pertence à empresa especificada.';

-- NOTA: empresa_id não será NOT NULL ainda para permitir migração gradual
-- Será definido como NOT NULL após confirmação de migração completa
