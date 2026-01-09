-- =====================================================
-- ÉPICO 1.2 - User Story 1.2.1
-- RLS para tabela empresas - Isolamento total de dados
-- =====================================================

-- Remover políticas RLS existentes (se houver)
DROP POLICY IF EXISTS "Users can view their own organization" ON public.organizations;
DROP POLICY IF EXISTS "Admins can manage all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view their own empresa" ON public.empresas;
DROP POLICY IF EXISTS "Admins can manage all empresas" ON public.empresas;

-- Função auxiliar para verificar se usuário é master admin
-- (Implementação temporária - será refinada no ÉPICO 1.3)
CREATE OR REPLACE FUNCTION public.is_master_admin(user_id UUID)
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
    AND role = 'master'
  )
$$;

-- Política RLS: Usuários podem ler apenas sua própria empresa
CREATE POLICY "Users can view their own empresa"
  ON public.empresas
  FOR SELECT
  TO authenticated
  USING (
    id = public.current_empresa_id()
  );

-- Política RLS: Master admins podem ler todas as empresas
CREATE POLICY "Master admins can view all empresas"
  ON public.empresas
  FOR SELECT
  TO authenticated
  USING (
    public.is_master_admin(auth.uid())
  );

-- Política RLS: Master admins podem criar empresas
CREATE POLICY "Master admins can create empresas"
  ON public.empresas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_master_admin(auth.uid())
  );

-- Política RLS: Master admins podem atualizar todas as empresas
CREATE POLICY "Master admins can update all empresas"
  ON public.empresas
  FOR UPDATE
  TO authenticated
  USING (
    public.is_master_admin(auth.uid())
  )
  WITH CHECK (
    public.is_master_admin(auth.uid())
  );

-- Política RLS: Admins da empresa podem atualizar sua própria empresa (apenas alguns campos)
-- Permitir que admins da empresa atualizem nome, contexto_ia, mas não plano_id ou stripe_customer_id
CREATE POLICY "Empresa admins can update own empresa"
  ON public.empresas
  FOR UPDATE
  TO authenticated
  USING (
    id = public.current_empresa_id()
    AND EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
      AND empresa_id = public.empresas.id
      AND role IN ('admin', 'master')
    )
  )
  WITH CHECK (
    id = public.current_empresa_id()
    -- Não permitir mudança de plano_id ou stripe_customer_id via esta política
    -- Apenas master admins podem mudar via política acima
    AND (plano_id IS NULL OR plano_id = (SELECT plano_id FROM public.empresas WHERE id = public.current_empresa_id()))
    AND (stripe_customer_id IS NULL OR stripe_customer_id = (SELECT stripe_customer_id FROM public.empresas WHERE id = public.current_empresa_id()))
  );

-- Política RLS: Master admins podem deletar empresas
CREATE POLICY "Master admins can delete empresas"
  ON public.empresas
  FOR DELETE
  TO authenticated
  USING (
    public.is_master_admin(auth.uid())
  );

-- Comentários
COMMENT ON POLICY "Users can view their own empresa" ON public.empresas IS 'Usuários autenticados podem ler apenas a empresa à qual pertencem.';
COMMENT ON POLICY "Master admins can view all empresas" ON public.empresas IS 'Master admins têm acesso de leitura a todas as empresas.';
COMMENT ON POLICY "Master admins can create empresas" ON public.empresas IS 'Apenas master admins podem criar novas empresas.';
COMMENT ON POLICY "Master admins can update all empresas" ON public.empresas IS 'Master admins podem atualizar qualquer empresa, incluindo plano e stripe_customer_id.';
COMMENT ON POLICY "Empresa admins can update own empresa" ON public.empresas IS 'Admins da empresa podem atualizar campos básicos (nome, contexto_ia) da própria empresa, mas não plano ou billing.';
COMMENT ON FUNCTION public.is_master_admin(UUID) IS 'Verifica se o usuário é master admin. Implementação temporária - será refinada no ÉPICO 1.3.';
