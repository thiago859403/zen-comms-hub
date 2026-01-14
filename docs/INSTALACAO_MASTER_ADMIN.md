# 🚀 Guia Rápido: Criar Usuário Master Admin

## ⚠️ IMPORTANTE: O usuário ainda não foi criado!

O erro "Acesso negado - Apenas o administrador master pode acessar esta página" aparece porque o usuário `Nuviaadmcloud859402@nuvia.com` ainda não existe no banco de dados.

## 📋 Passo a Passo Completo

### **PASSO 1: Criar o Usuário no Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns/auth/users

2. Clique em **"Add User"** ou **"Create new user"**

3. Preencha os campos:
   ```
   Email: Nuviaadmcloud859402@nuvia.com
   Password: Itaulthiagoguimaraes859402
   Auto Confirm User: ✅ (MARQUE ESTA OPÇÃO!)
   ```

4. Clique em **"Create User"**

### **PASSO 2: Atualizar o Perfil com Role Master**

Após criar o usuário, acesse o **SQL Editor** no Supabase Dashboard e execute:

```sql
UPDATE profiles
SET 
  role = 'master',
  empresa_id = NULL,
  full_name = 'Administrador Master Nuvia',
  status = 'active'
WHERE email = 'Nuviaadmcloud859402@nuvia.com';
```

### **PASSO 3: Verificar se Foi Criado Corretamente**

Execute esta query para verificar:

```sql
SELECT 
  au.email,
  p.role,
  p.empresa_id,
  p.status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'Nuviaadmcloud859402@nuvia.com';
```

**Resultado esperado:**
- `email = 'Nuviaadmcloud859402@nuvia.com'`
- `role = 'master'` ✅
- `empresa_id = NULL` ✅
- `status = 'active'` ✅

### **PASSO 4: Fazer Login**

1. Acesse: `/admin/login`
2. Use as credenciais:
   - **Email:** `Nuviaadmcloud859402@nuvia.com`
   - **Senha:** `Itaulthiagoguimaraes859402`
3. Você será redirecionado para `/dashboard/admin`

## 🔧 Solução Rápida Alternativa (Temporária)

Se você quiser testar rapidamente, pode atualizar o usuário existente `marcioteste1@gmail.com` para master:

```sql
UPDATE profiles
SET role = 'master'
WHERE email = 'marcioteste1@gmail.com';
```

⚠️ **Nota:** Isso é apenas para teste. O usuário correto deve ser `Nuviaadmcloud859402@nuvia.com`.

## ❓ Problemas Comuns

### "Acesso negado - Apenas o administrador master pode acessar esta página"
- **Causa:** O usuário não tem role "master" no perfil
- **Solução:** Execute o PASSO 2 acima

### "Credenciais inválidas"
- **Causa:** O usuário não foi criado no Supabase
- **Solução:** Execute o PASSO 1 acima

### "Conta bloqueada"
- **Causa:** Múltiplas tentativas de login incorretas
- **Solução:** Aguarde 5 minutos OU limpe o localStorage:
  ```javascript
  // No console do navegador (F12):
  localStorage.clear();
  location.reload();
  ```
