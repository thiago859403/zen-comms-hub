-- FASE 1.5: Multi-tenancy Base
-- Criar tabela de organizações
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar org_id nas profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);

-- Enable RLS na tabela organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para organizations
CREATE POLICY "Users can view their own organization"
ON public.organizations FOR SELECT
USING (id IN (SELECT org_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all organizations"
ON public.organizations FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Função para obter org_id do usuário atual
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Função para criar organização automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_org_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  org_name TEXT;
BEGIN
  -- Gerar nome da org baseado no nome do usuário ou email
  org_name := COALESCE(NEW.full_name, split_part(NEW.email, '@', 1)) || '''s Organization';
  
  -- Criar nova organização
  INSERT INTO public.organizations (name, slug, plan)
  VALUES (
    org_name,
    lower(regexp_replace(org_name || '-' || substring(gen_random_uuid()::text, 1, 8), '[^a-z0-9-]', '-', 'g')),
    'free'
  )
  RETURNING id INTO new_org_id;
  
  -- Atualizar profile com org_id
  NEW.org_id := new_org_id;
  
  RETURN NEW;
END;
$$;

-- Atualizar trigger handle_new_user para incluir org
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company'
  );
  
  -- Atribuir role 'user' por padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para criar org após inserção do profile
CREATE TRIGGER on_profile_created_create_org
  BEFORE INSERT ON public.profiles
  FOR EACH ROW 
  WHEN (NEW.org_id IS NULL)
  EXECUTE FUNCTION public.handle_new_org_on_signup();

-- Migrar usuários existentes (criar org para cada profile sem org)
DO $$
DECLARE
  profile_record RECORD;
  new_org_id UUID;
BEGIN
  FOR profile_record IN 
    SELECT id, email, full_name FROM public.profiles WHERE org_id IS NULL
  LOOP
    -- Criar organização para cada usuário existente
    INSERT INTO public.organizations (name, slug, plan)
    VALUES (
      COALESCE(profile_record.full_name, split_part(profile_record.email, '@', 1)) || '''s Organization',
      lower(regexp_replace(COALESCE(profile_record.full_name, split_part(profile_record.email, '@', 1)) || '-' || substring(gen_random_uuid()::text, 1, 8), '[^a-z0-9-]', '-', 'g')),
      'free'
    )
    RETURNING id INTO new_org_id;
    
    -- Atualizar profile com nova org
    UPDATE public.profiles 
    SET org_id = new_org_id 
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Tornar org_id NOT NULL após migração
ALTER TABLE public.profiles 
ALTER COLUMN org_id SET NOT NULL;

-- Trigger para updated_at em organizations
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();