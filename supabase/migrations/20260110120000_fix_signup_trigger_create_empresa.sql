-- =====================================================
-- CORREÇÃO: Trigger de Signup - Criar Empresa Automaticamente
-- Problema: Após signup, profile é criado mas empresa não é criada automaticamente
-- Solução: Atualizar trigger handle_new_user para criar empresa e vincular profile
-- =====================================================

-- 1. Atualizar função handle_new_user para criar empresa automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_empresa_id BIGINT;
  empresa_nome TEXT;
  plano_free_id BIGINT;
BEGIN
  -- Obter nome da empresa do metadata ou usar email como fallback
  empresa_nome := COALESCE(
    NEW.raw_user_meta_data->>'company',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Se empresa_nome estiver vazio, usar padrão
  IF empresa_nome IS NULL OR empresa_nome = '' THEN
    empresa_nome := 'Minha Empresa';
  END IF;
  
  -- Buscar ID do plano Free (padrão para novos signups)
  SELECT id INTO plano_free_id
  FROM public.planos
  WHERE LOWER(nome) = 'free'
  LIMIT 1;
  
  -- Se não encontrar plano Free, usar o primeiro plano ativo
  IF plano_free_id IS NULL THEN
    SELECT id INTO plano_free_id
    FROM public.planos
    WHERE is_active = true
    ORDER BY preco_mensal ASC
    LIMIT 1;
  END IF;
  
  -- Criar nova empresa
  INSERT INTO public.empresas (nome, plano_id, status, is_active)
  VALUES (
    empresa_nome,
    plano_free_id,
    'active',
    true
  )
  RETURNING id INTO new_empresa_id;
  
  -- Criar profile vinculado à empresa
  INSERT INTO public.profiles (id, email, full_name, company, empresa_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company',
    new_empresa_id,
    'admin'  -- Primeiro usuário da empresa é admin
  );
  
  -- Atribuir role 'user' no sistema user_roles (compatibilidade)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, criar profile sem empresa_id (fallback)
    -- Isso permite que o usuário seja criado mesmo se houver problema na criação da empresa
    INSERT INTO public.profiles (id, email, full_name, company, role)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'company',
      'user'
    )
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log do erro (em produção, considerar usar uma tabela de logs)
    RAISE WARNING 'Error creating empresa for user %: %', NEW.id, SQLERRM;
    
    RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Garantir que a política RLS permite inserção via trigger (SECURITY DEFINER)
-- A função já é SECURITY DEFINER, então deve funcionar, mas vamos garantir
-- que não há política bloqueando

-- Verificar se há política que bloqueia INSERT em profiles
-- A política "Master admins can insert profiles" e "Empresa admins can insert empresa profiles"
-- podem bloquear, mas como é SECURITY DEFINER, deve bypassar RLS

-- 3. Garantir que usuário pode ler seu próprio profile (já existe, mas vamos garantir)
-- A política "Users can view own profile" já existe e deve funcionar

-- 4. Garantir que usuário pode ler sua própria empresa (já existe, mas vamos garantir)
-- A política "Users can view own empresa" já existe e deve funcionar

-- Comentários
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function que cria empresa e profile automaticamente após signup. O primeiro usuário da empresa recebe role admin.';
