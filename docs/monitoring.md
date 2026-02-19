# Monitoramento — Sentry

## Visão Geral

O projeto usa [Sentry](https://sentry.io) para captura automática de erros, performance tracing e session replay. A integração é feita via `@sentry/react` e centralizada em `src/lib/monitoring.ts`.

Quando `VITE_SENTRY_DSN` **não está definido**, o sistema opera em **no-op mode** — nenhum dado é enviado e nenhum erro ocorre.

---

## Configuração

### 1. Obter o DSN

1. Acesse [sentry.io](https://sentry.io) → seu projeto → **Settings → Client Keys (DSN)**.
2. Copie o valor do **DSN** (formato: `https://xxxxx@o0.ingest.sentry.io/0`).

### 2. Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SENTRY_DSN` | Não* | DSN público do Sentry. Sem ele, monitoring roda em no-op mode. |
| `VITE_APP_ENV` | Não | Ambiente (`development`, `staging`, `production`). Default: `development`. |
| `VITE_APP_VERSION` | Não | Versão da release para rastreamento no Sentry. |

\* Obrigatória apenas se quiser ativar monitoramento real.

### 3. Configurar no Netlify

1. Vá em **Site Settings → Environment Variables**.
2. Adicione:
   - `VITE_SENTRY_DSN` = `<seu DSN>`
   - `VITE_APP_ENV` = `production`
   - `VITE_APP_VERSION` = `1.0.0` (ou use a variável `COMMIT_REF` do Netlify)
3. Faça redeploy.

### 4. Configurar no GitHub Actions (opcional)

Se quiser monitorar builds de CI:

```yaml
env:
  VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
  VITE_APP_ENV: ci
```

Adicione o secret `VITE_SENTRY_DSN` em **Settings → Secrets and variables → Actions**.

---

## Como Funciona

### Inicialização

`initMonitoring()` é chamado no nível de módulo em `src/App.tsx` (antes de qualquer render):

```typescript
import { initMonitoring } from "@/lib/monitoring";
initMonitoring();
```

### Identificação de Usuário

Quando o usuário autentica, `setUser()` é chamado automaticamente pelo `AuthProvider`:

```typescript
setUser({ id: user.id, email: user.email, empresa_id: empresaId });
```

No logout, `setUser(null)` limpa a identificação.

### Captura Manual de Erros

```typescript
import { captureException, captureMessage, addBreadcrumb } from '@/lib/monitoring';

// Capturar exceção com contexto extra
try {
  await riskyOperation();
} catch (error) {
  captureException(error, { operation: 'riskyOperation', userId: '...' });
}

// Capturar mensagem informativa
captureMessage('Usuário fez upgrade de plano', 'info');

// Adicionar breadcrumb para contexto
addBreadcrumb('Clicou em "Enviar mensagem"', 'user-action', { to: '+55...' });
```

---

## Segurança

- **Tokens/JWTs** são automaticamente redatados via `beforeSend`.
- **Headers sensíveis** (`Authorization`, `Cookie`, `apikey`) são substituídos por `[REDACTED]`.
- **Session Replay** mascara todo texto e bloqueia mídia por padrão.
- **Erros comuns de rede** (`Failed to fetch`, `AbortError`) são ignorados para reduzir ruído.

---

## Validação

### Em desenvolvimento (sem DSN)

```bash
pnpm dev
# Console deve exibir: [Monitoring] VITE_SENTRY_DSN not set — running in no-op mode
# App funciona normalmente sem erros
```

### Em produção (com DSN)

1. Configure `VITE_SENTRY_DSN` no `.env.production` ou Netlify.
2. Faça build e acesse a aplicação.
3. Provoque um erro (ex: acessar rota inexistente ou `throw new Error('test')` no console).
4. Verifique no painel do Sentry se o erro apareceu.

---

## Arquitetura

```
src/lib/monitoring.ts     ← Módulo central (init, capture, setUser)
src/App.tsx               ← Chama initMonitoring() no boot
src/hooks/useAuth.tsx     ← Chama setUser() no login/logout
```

## Sample Rates (produção)

| Feature | Taxa | Descrição |
|---|---|---|
| Traces | 20% | Performance monitoring |
| Session Replay | 10% | Replay de sessões normais |
| Replay on Error | 100% | Replay quando há erro |
