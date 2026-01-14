-- =====================================================
-- SCRIPT PARA CRIAR/ATUALIZAR USUÁRIO MASTER ADMIN
-- =====================================================
-- IMPORTANTE: Execute este script APÓS criar o usuário no Supabase Dashboard
-- O usuário precisa ser criado primeiro em: Authentication > Users > Add User
--
-- Credenciais:
-- Email: Nuviaadmcloud859402@nuvia.com
-- Password: Itaulthiagoguimaraes859402
-- =====================================================

-- 1. Verificar se o usuário existe no auth.users
-- Execute esta query primeiro para ver se o usuário foi criado:
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'Nuviaadmcloud859402@nuvia.com';

-- 2. Se o usuário existir, atualizar o perfil com role master
-- Execute esta query após criar o usuário no Dashboard:
UPDATE profiles
SET 
  role = 'master',
  empresa_id = NULL,
  full_name = 'Administrador Master Nuvia',
  status = 'active'
WHERE email = 'Nuviaadmcloud859402@nuvia.com';

-- 3. Verificar se foi atualizado corretamente:
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  p.role,
  p.empresa_id,
  p.status,
  p.full_name
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'Nuviaadmcloud859402@nuvia.com';

-- O resultado deve mostrar:
-- role = 'master'
-- empresa_id = NULL
-- status = 'active'
