# Correção do Erro "Invalid API Key" no Signup

## Problema Identificado
Erro 401 "Invalid API key" ao tentar criar conta, mesmo após corrigir o código.

## Correções Aplicadas

### 1. Código Atualizado
- ✅ `src/integrations/supabase/client.ts` - Prioriza VITE_SUPABASE_ANON_KEY explicitamente
- ✅ `src/pages/Auth.tsx` - Removido emailRedirectTo que pode causar problemas
- ✅ Função `handle_new_user()` atualizada para criar empresa automaticamente

### 2. Variáveis de Ambiente
O arquivo `.env.local` contém:
```
VITE_SUPABASE_URL=https://zlqpgxvmiqadavimqtns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Qp0SH6ekBeaOUPfPQ_tXlw_ruiitqyR
```

## Diagnóstico do Problema

O erro 401 "Invalid API key" pode ter várias causas:

### Possível Causa 1: Auth Provider Email não está habilitado
No Supabase Dashboard, verifique:
1. Acesse: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns/auth/providers
2. Verifique se "Email" está **habilitado**
3. Se não estiver, habilite e salve

### Possível Causa 2: Confirmação de Email habilitada
1. Acesse: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns/auth/providers
2. Clique em "Email"
3. Verifique a opção "Confirm email"
4. Para desenvolvimento, você pode **desabilitar** temporariamente
5. Ou configure o redirect URL corretamente (ver abaixo)

### Possível Causa 3: Redirect URLs não configuradas
1. Acesse: https://supabase.com/dashboard/project/zlqpgxvmiqadavimqtns/auth/url-configuration
2. Adicione as seguintes URLs nas "Redirect URLs":
   - `http://localhost:8080/**`
   - `http://192.168.0.211:8080/**`
   - `http://127.0.0.1:8080/**`
3. Site URL pode ser: `http://localhost:8080`

### Possível Causa 4: Cache do navegador
1. Limpar cache completo do navegador (Ctrl+Shift+Delete)
2. Ou usar modo anônimo/privado
3. Ou fazer Hard Refresh (Ctrl+Shift+R)

### Possível Causa 5: Servidor não foi reiniciado
Certifique-se de que:
1. Parou completamente o servidor anterior
2. Executou `pnpm dev` novamente
3. Aguardou o servidor iniciar completamente

## Teste Rápido

Após aplicar todas as correções e reiniciar o servidor:

1. Abra o console do navegador (F12)
2. Procure pelo log: `Supabase Config:`
3. Verifique:
   - `url`: deve mostrar a URL correta
   - `key`: deve mostrar "✓ Definido (eyJ...)" 
   - `keyType`: deve mostrar "Anon (JWT)"
   - `usingKey`: deve mostrar "ANON_KEY"

4. Se aparecer `usingKey: "PUBLISHABLE_KEY"`, há um problema - a VITE_SUPABASE_ANON_KEY não está sendo carregada

## Solução Definitiva

Se após verificar tudo acima o erro persistir:

### Opção 1: Verificar no Supabase Dashboard se Email Auth está habilitado
1. Dashboard → Authentication → Providers
2. Verificar se "Email" está ON

### Opção 2: Testar com curl (para isolar o problema)
```bash
curl -X POST 'https://zlqpgxvmiqadavimqtns.supabase.co/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscXBneHZtaXFhZGF2aW1xdG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjM4NDcsImV4cCI6MjA4MzUzOTg0N30.VHRi1XUxyN21yq3z2o-rGfXbrFd-xwTbLLtJGRiuCPU" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "teste123456",
    "data": {
      "full_name": "Teste"
    }
  }'
```

Se este curl retornar 401, o problema está na configuração do Supabase (Auth Provider desabilitado ou chave incorreta).

## Próximos Passos

1. **Reiniciar servidor**: `pnpm dev` (pare e inicie novamente)
2. **Verificar Supabase Dashboard**: Auth Providers → Email deve estar habilitado
3. **Limpar cache do navegador**
4. **Testar novamente**

Se o problema persistir após seguir todos os passos, o erro pode estar relacionado a:
- Configuração do Supabase Auth no Dashboard
- Chave API desabilitada no Supabase
- Problema de CORS ou rede
