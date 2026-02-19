# Monitoramento — Sentry Integration

## Visão Geral

O projeto utiliza o [Sentry](https://sentry.io) para captura de erros, monitoramento de performance e session replay em produção.

A integração é implementada em `src/lib/monitoring.ts` e opera em dois modos:

| Modo | Condição | Comportamento |
|------|----------|---------------|
| **Ativo** | `VITE_SENTRY_DSN` configurado | Erros, mensagens e breadcrumbs são enviados ao Sentry |
| **No-op** | `VITE_SENTRY_DSN` ausente | Todas as chamadas são silenciosas (não quebram a app) |

## Configuração

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SENTRY_DSN` | Sim (para ativar) | DSN do projeto Sentry |
| `VITE_APP_ENV` | Não | Environment (`development`, `staging`, `production`) |
| `VITE_APP_VERSION` | Não | Versão/release da aplicação |

### Inicialização

O monitoramento é inicializado **no nível do módulo** em `src/App.tsx`, antes de qualquer render:

```typescript
import { initMonitoring } from "@/lib/monitoring";

// Executa antes do React render
initMonitoring();
```

Isso garante que erros que ocorram durante o bootstrap da aplicação também sejam capturados.

## API Disponível

### `initMonitoring(options?)`
Inicializa o Sentry. Seguro para chamar sem DSN. Possui guarda contra re-inicialização.

### `captureException(error, context?)`
Captura uma exceção. No-op se Sentry não estiver inicializado.

### `captureMessage(message, level?)`
Captura uma mensagem. Níveis: `'info'`, `'warning'`, `'error'`, `'fatal'`.

### `setUser(user | null)`
Identifica o usuário autenticado. Passar `null` para limpar (logout).

### `addBreadcrumb(message, category?, data?)`
Adiciona contexto de debugging ao próximo evento.

### `setContext(key, context)`
Adiciona contexto adicional ao próximo evento.

### `isMonitoringEnabled()`
Retorna `true` se o Sentry está ativo.

### `SentryErrorBoundary`
Re-exporta o `ErrorBoundary` do Sentry para uso como componente React.

## Segurança

- **Sanitização automática**: O hook `beforeSend` remove tokens JWT, chaves Supabase/Stripe, passwords e secrets de todos os eventos antes de enviá-los ao Sentry.
- **Headers sensíveis**: `Authorization`, `Cookie`, `x-api-key` e `apikey` são substituídos por `[REDACTED]`.
- **Erros ignorados**: Erros comuns de rede (`Failed to fetch`, `AbortError`, `ResizeObserver`) são filtrados.
- **Session Replay**: Texto mascarado e mídia bloqueada por padrão.

## Teste Manual do Sentry

### Página de Debug

Uma página de teste interna está disponível para validar que o Sentry está recebendo eventos corretamente.

**URL:** `/debug/sentry?key=NUVIA_TEST`

> ⚠️ **Segurança:** A página só é acessível com a query string `?key=NUVIA_TEST`. Sem a key correta, o usuário é redirecionado para `/`. **Altere ou remova a key antes de liberar para clientes em produção.**

### Passo a Passo

1. **Acesse a URL de debug:**
   ```
   http://localhost:3000/debug/sentry?key=NUVIA_TEST
   ```

2. **Verifique o status exibido na página:**
   - **Sentry Ativo (verde)** → DSN configurado, eventos serão enviados.
   - **No-op (cinza)** → DSN ausente, eventos não serão enviados ao Sentry (apenas logs no console).

3. **Clique em "Enviar ERRO de teste"**
   - Dispara `captureException(new Error("Teste Sentry Nuvia (manual)"))`.
   - Um toast de confirmação será exibido.

4. **Clique em "Enviar MENSAGEM de teste"**
   - Dispara `captureMessage("Teste Sentry Nuvia (message)", "info")`.
   - Um toast de confirmação será exibido.

5. **Verifique no Sentry:**
   - Acesse [sentry.io](https://sentry.io) → seu projeto → **Issues**.
   - Procure por:
     - `Error: Teste Sentry Nuvia (manual)` (exceção)
     - `Teste Sentry Nuvia (message)` (mensagem)
   - Os eventos devem incluir breadcrumbs com `source: "debug-page"`.

### Observações

- Se o Sentry estiver em modo **no-op**, os botões funcionam, mas os eventos **não** são enviados ao Sentry (apenas registrados no console).
- Em ambiente de CI, o DSN normalmente não está configurado — isso é esperado e não impacta os testes.
- **Antes de liberar para produção**: altere ou remova a key `NUVIA_TEST` para evitar acesso não autorizado.
