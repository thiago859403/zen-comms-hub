# Troubleshooting - Erro "Invalid API Key" no Signup

## Problema
Erro "Invalid API key" ao tentar criar uma conta.

## Soluções Aplicadas

### 1. Correção do Código
- ✅ Atualizado `src/integrations/supabase/client.ts` para suportar `VITE_SUPABASE_ANON_KEY`
- ✅ Adicionado trim() para remover espaços em branco
- ✅ Adicionado logs de debug em desenvolvimento
- ✅ Melhorado tratamento de erros em `src/pages/Auth.tsx`

### 2. Correção do Trigger de Signup
- ✅ Atualizada função `handle_new_user()` para criar empresa automaticamente

## Passos para Resolver

### Passo 1: Reiniciar o Servidor de Desenvolvimento
**IMPORTANTE:** O servidor precisa ser reiniciado para carregar as variáveis de ambiente atualizadas.

1. Pare o servidor atual (Ctrl+C no terminal)
2. Execute novamente:
```bash
pnpm dev
```

### Passo 2: Verificar Variáveis de Ambiente
Certifique-se de que o arquivo `.env.local` na raiz do projeto contém:

```env
VITE_SUPABASE_URL=https://zlqpgxvmiqadavimqtns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscXBneHZtaXFhZGF2aW1xdG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjM4NDcsImV4cCI6MjA4MzUzOTg0N30.VHRi1XUxyN21yq3z2o-rGfXbrFd-xwTbLLtJGRiuCPU
```

**Importante:**
- Não deve haver espaços antes ou depois do `=`
- Não deve haver aspas ao redor dos valores
- O arquivo deve estar na raiz do projeto (mesmo nível do `package.json`)

### Passo 3: Limpar Cache do Navegador
1. Abra o DevTools (F12)
2. Vá em Application > Storage > Clear site data
3. Ou use Ctrl+Shift+Delete para limpar cache

### Passo 4: Verificar Console do Navegador
Após reiniciar o servidor, abra o console do navegador (F12) e verifique se aparece:
```
Supabase Config: {
  url: "✓ Definido",
  key: "✓ Definido (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
}
```

Se aparecer "✗ Não definido", as variáveis não estão sendo carregadas.

### Passo 5: Verificar se a Chave está Correta
A chave anon key deve ser:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscXBneHZtaXFhZGF2aW1xdG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjM4NDcsImV4cCI6MjA4MzUzOTg0N30.VHRi1XUxyN21yq3z2o-rGfXbrFd-xwTbLLtJGRiuCPU
```

## Se o Problema Persistir

1. **Verificar se o arquivo .env.local está na raiz:**
   ```bash
   # No PowerShell
   Get-Content .env.local
   ```

2. **Verificar se não há arquivo .env (sem .local) que possa estar sobrescrevendo:**
   ```bash
   Test-Path .env
   ```

3. **Tentar usar a chave publishable (mais moderna):**
   No `.env.local`, adicione também:
   ```env
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Qp0SH6ekBeaOUPfPQ_tXlw_ruiitqyR
   ```

4. **Verificar logs do servidor:**
   O servidor deve mostrar se as variáveis foram carregadas. Procure por mensagens de erro relacionadas a variáveis de ambiente.

## Verificação Final

Após seguir todos os passos, tente criar uma conta novamente. Se ainda houver erro:

1. Abra o console do navegador (F12)
2. Tente criar a conta
3. Veja a mensagem de erro completa no console
4. Compartilhe a mensagem de erro completa para diagnóstico adicional
