# Como Criar o Usuário Master Admin

O usuário master admin do SaaS precisa ser criado via API do Supabase, pois não é possível criar usuários no `auth.users` diretamente via SQL.

## Credenciais do Master Admin

- **Email/Usuário:** `Nuviaadmcloud859402@nuvia.com` (ou usar o formato que preferir)
- **Senha:** `Itaulthiagoguimaraes859402`
- **Role:** `master`

## Opção 1: Criar via Supabase Dashboard

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns
2. Vá em **Authentication** → **Users**
3. Clique em **Add User** → **Create new user**
4. Preencha:
   - **Email:** `Nuviaadmcloud859402@nuvia.com`
   - **Password:** `Itaulthiagoguimaraes859402`
   - **Auto Confirm User:** ✅ (para não precisar confirmar email)
5. Clique em **Create User**

Após criar o usuário, execute o SQL abaixo para atualizar o perfil com role `master`:

```sql
-- Atualizar perfil do usuário master admin
UPDATE profiles
SET 
  role = 'master',
  empresa_id = NULL  -- Master admin não pertence a nenhuma empresa
WHERE email = 'Nuviaadmcloud859402@nuvia.com';
```

## Opção 2: Criar via API (Script)

Você pode usar o Supabase Admin API ou criar via código frontend temporariamente.

## Opção 3: Criar via SQL (Depois de criar o usuário no Dashboard)

Após criar o usuário no Supabase Dashboard, execute:

```sql
-- Encontrar o ID do usuário criado
SELECT id, email FROM auth.users WHERE email = 'Nuviaadmcloud859402@nuvia.com';

-- Atualizar o perfil (substitua USER_ID pelo ID retornado acima)
UPDATE profiles
SET 
  role = 'master',
  empresa_id = NULL,
  full_name = 'Administrador Master Nuvia'
WHERE id = 'USER_ID_AQUI';
```

## Verificação

Para verificar se o usuário foi criado corretamente:

```sql
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.empresa_id
FROM profiles p
WHERE p.email = 'Nuviaadmcloud859402@nuvia.com';
```

O resultado deve mostrar:
- `role = 'master'`
- `empresa_id = NULL`

## Login

Após criar o usuário, você pode fazer login na aplicação usando:
- **Email:** `Nuviaadmcloud859402@nuvia.com`
- **Senha:** `Itaulthiagoguimaraes859402`

O usuário terá acesso ao painel Admin em `/dashboard/admin`.
