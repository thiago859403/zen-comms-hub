# Criar Usuário Master Admin - Passo a Passo

## Problema Identificado

O usuário `Nuviaadmcloud859402@nuvia.com` ainda não foi criado no Supabase. É necessário criar o usuário primeiro antes de fazer login.

## Solução: Criar o Usuário

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns/auth/users

2. **Criar o Usuário:**
   - Clique em **"Add User"** ou **"Create new user"**
   - Preencha os campos:
     - **Email:** `Nuviaadmcloud859402@nuvia.com`
     - **Password:** `Itaulthiagoguimaraes859402`
     - **Auto Confirm User:** ✅ (marcar para não precisar confirmar email)
   - Clique em **"Create User"**

3. **Após criar, execute este SQL no SQL Editor:**

```sql
-- Atualizar perfil do usuário master admin
UPDATE profiles
SET 
  role = 'master',
  empresa_id = NULL,
  full_name = 'Administrador Master Nuvia',
  status = 'active'
WHERE email = 'Nuviaadmcloud859402@nuvia.com';
```

### Opção 2: Via API (Edge Function ou Script)

Você pode criar o usuário programaticamente usando a Admin API do Supabase, mas isso requer configuração adicional.

## Limpar Bloqueio de Tentativas

Se a conta estiver bloqueada temporariamente no navegador (devido às tentativas incorretas), você pode:

1. **Aguardar 5 minutos** (o bloqueio expira automaticamente)
2. **Ou limpar o localStorage do navegador:**
   - Abra o Console do Navegador (F12)
   - Execute: `localStorage.clear()`
   - Recarregue a página

## Verificação

Após criar o usuário, execute esta query para verificar:

```sql
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
```

O resultado deve mostrar:
- `email = 'Nuviaadmcloud859402@nuvia.com'`
- `role = 'master'`
- `empresa_id = NULL`
- `status = 'active'`

## Login

Após criar o usuário e atualizar o perfil, você pode fazer login usando:
- **Email:** `Nuviaadmcloud859402@nuvia.com`
- **Senha:** `Itaulthiagoguimaraes859402`

O login será feito na página `/admin/login` e você terá acesso ao painel Admin em `/dashboard/admin`.
