-- Sincroniza user_roles com profiles.role = 'master'
-- Idempotente — não altera planos, empresas ou outros dados

UPDATE public.user_roles ur
SET role = 'master'::public.app_role
FROM public.profiles p
WHERE p.id = ur.user_id
  AND p.role = 'master'
  AND ur.role <> 'master'::public.app_role;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'master'::public.app_role
FROM public.profiles p
WHERE p.role = 'master'
ON CONFLICT (user_id, role) DO NOTHING;

-- Garantir overload de is_master_admin() compatível com policies do backup
CREATE OR REPLACE FUNCTION public.is_master_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'master'
  )
$$;
