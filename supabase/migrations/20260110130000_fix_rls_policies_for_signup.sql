-- =====================================================
-- CORREÇÃO: Políticas RLS para permitir leitura imediata após signup
-- Problema: Políticas RLS podem estar bloqueando leitura do profile/empresa recém-criados
-- Solução: Garantir que políticas permitam leitura imediata após criação via trigger
-- =====================================================

-- 1. Garantir que usuário pode ler seu próprio profile (mesmo se empresa_id for NULL)
-- A política "Users can view own profile" já existe e deve funcionar, mas vamos garantir
-- que está correta e tem prioridade

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Recriar política com garantia de funcionamento
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Garantir que usuário pode ler sua própria empresa
-- A política atual usa subquery que pode falhar se profile não existir ainda
-- Vamos garantir que funciona mesmo com empresa_id NULL temporariamente

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Users can view own empresa" ON public.empresas;

-- Recriar política que funciona mesmo se profile ainda não tiver empresa_id
-- Usar função helper que retorna NULL se não encontrar (mais seguro)
CREATE POLICY "Users can view own empresa"
  ON public.empresas FOR SELECT
  TO authenticated
  USING (
    id = (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid()
      LIMIT 1
    )
    AND id IS NOT NULL
  );

-- 3. Garantir que trigger pode inserir profile (SECURITY DEFINER já bypassa RLS, mas vamos garantir)
-- A função handle_new_user é SECURITY DEFINER, então deve bypassar RLS automaticamente
-- Mas vamos garantir que não há política conflitante

-- Verificar se há política que bloqueia INSERT em profiles para novos usuários
-- A política "Master admins can insert profiles" e "Empresa admins can insert empresa profiles"
-- não devem bloquear porque SECURITY DEFINER bypassa RLS

-- 4. Comentários explicativos
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
  'Permite que usuário leia seu próprio profile imediatamente após signup, mesmo se empresa_id for NULL.';

COMMENT ON POLICY "Users can view own empresa" ON public.empresas IS 
  'Permite que usuário leia sua própria empresa via vínculo no profile. Funciona mesmo se profile ainda não tiver empresa_id (retorna vazio).';
