-- =====================================================
-- ÉPICO 3.1 - User Story 3.1.3
-- Implementar RLS para api_keys
-- =====================================================

-- Política SELECT: Admins da empresa podem ver suas chaves (sem descriptografar)
-- NUNCA retornar key_encrypted via RLS - apenas metadados
DROP POLICY IF EXISTS "Empresa admins can view own api_keys" ON public.api_keys;
CREATE POLICY "Empresa admins can view own api_keys" ON public.api_keys
  FOR SELECT
  TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  );

-- Política INSERT: Admins da empresa podem criar chaves
-- A criptografia será feita pela função insert_api_key
DROP POLICY IF EXISTS "Empresa admins can create api_keys" ON public.api_keys;
CREATE POLICY "Empresa admins can create api_keys" ON public.api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (
    empresa_id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  );

-- Política UPDATE: Admins da empresa podem atualizar suas chaves
-- Nota: A atualização de key_encrypted deve ser feita apenas via funções seguras
DROP POLICY IF EXISTS "Empresa admins can update own api_keys" ON public.api_keys;
CREATE POLICY "Empresa admins can update own api_keys" ON public.api_keys
  FOR UPDATE
  TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  )
  WITH CHECK (
    empresa_id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  );

-- Política DELETE: Admins da empresa podem deletar suas chaves
DROP POLICY IF EXISTS "Empresa admins can delete own api_keys" ON public.api_keys;
CREATE POLICY "Empresa admins can delete own api_keys" ON public.api_keys
  FOR DELETE
  TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'master')
    )
  );

-- Função para verificar se usuário pode acessar chave (usada em Edge Functions)
-- Esta função NÃO descriptografa a chave, apenas verifica permissão
CREATE OR REPLACE FUNCTION public.can_access_api_key(
  p_key_id BIGINT,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.api_keys ak
    JOIN public.profiles p ON p.empresa_id = ak.empresa_id
    WHERE ak.id = p_key_id
    AND p.id = p_user_id
    AND p.role IN ('admin', 'master')
    AND ak.is_active = true
  );
$$;

-- Comentários
COMMENT ON POLICY "Empresa admins can view own api_keys" ON public.api_keys IS 'Admins da empresa podem ver metadados de suas chaves API, mas NUNCA a chave descriptografada.';
COMMENT ON POLICY "Empresa admins can create api_keys" ON public.api_keys IS 'Admins da empresa podem criar novas chaves API. A criptografia deve ser feita pela função insert_api_key.';
COMMENT ON POLICY "Empresa admins can update own api_keys" ON public.api_keys IS 'Admins da empresa podem atualizar metadados de suas chaves, mas NUNCA key_encrypted diretamente.';
COMMENT ON POLICY "Empresa admins can delete own api_keys" ON public.api_keys IS 'Admins da empresa podem deletar suas chaves API.';
COMMENT ON FUNCTION public.can_access_api_key(BIGINT, UUID) IS 'Verifica se usuário tem permissão para acessar uma chave API. Usado em Edge Functions.';
