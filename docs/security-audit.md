# Security Audit — Nuvia Customer Cloud

> Última atualização: 2026-02-22

---

## Rate Limiting Aplicado

Todas as Edge Functions críticas possuem rate limiting real utilizando a tabela `rate_limits` no Supabase (RLS bloqueia acesso de usuários — apenas service role).

### Tabela de Limites

| Function                       | Limite                | Janela | Estratégia   | Observação      |
| ------------------------------ | --------------------- | ------ | ------------ | --------------- |
| whatsapp-webhook               | 60                    | 60s    | IP           | webhook público |
| stripe-webhook                 | 60                    | 60s    | IP           | webhook público |
| whatsapp-send-message          | 30 user / 200 empresa | 60s    | user+empresa | autenticado     |
| stripe-create-checkout-session | 30 user / 200 empresa | 60s    | user+empresa | billing         |
| stripe-create-portal-session   | 30 user / 200 empresa | 60s    | user+empresa | billing         |
| stripe-list-invoices           | 60 user / 300 empresa | 60s    | user+empresa | leitura         |
| api-keys-insert                | 10                    | 60s    | user         | sensível        |
| send-invite                    | 10                    | 60s    | user         | anti-spam       |
| bot-process-message            | 30                    | 60s    | user/ip      | IA endpoint     |

### Implementação

- **Módulo compartilhado**: `supabase/functions/_shared/rate-limit.ts`
- **Import padrão**: `from "../_shared/rate-limit.ts"`
- **Fail-open**: Se a verificação de rate limit falhar (ex: erro de rede), a requisição é permitida para evitar downtime
- **Headers de resposta 429**: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Fluxo

```
Request → getClientIP(req) ou user.id → checkRateLimit(supabaseService, options) → allowed? → continue : 429
```

---

## Hardening de Logs

### Dados NUNCA logados

- ❌ `webhook_verify_token`
- ❌ `access_token` (WhatsApp, Stripe, APIs)
- ❌ Payload completo de webhooks
- ❌ Conteúdo de mensagens de usuários
- ❌ Respostas de IA (conteúdo)
- ❌ Chaves API (plain text)
- ❌ Telefones de usuários
- ❌ Tokens JWT

### Dados seguros logados

- ✅ Tipo de evento (ex: `event.type` do Stripe)
- ✅ IDs de conversa, empresa, mensagem
- ✅ Contagem de entries em webhooks
- ✅ Provider de IA utilizado
- ✅ Contagem de tokens consumidos
- ✅ Status HTTP de APIs externas
- ✅ Modo de processamento do bot

---

## RLS (Row Level Security)

### Tabela `rate_limits`

- **Policy**: `No user access to rate_limits`
- **Roles**: `authenticated`
- **Action**: `ALL`
- **qual**: `false` (bloqueia leitura)
- **with_check**: `false` (bloqueia escrita)
- **Acesso**: Apenas via `service_role` key

---

## Edge Functions — JWT Verification

| Function                       | verify_jwt | Motivo                          |
| ------------------------------ | ---------- | ------------------------------- |
| whatsapp-webhook               | false      | Webhook público do WhatsApp     |
| stripe-webhook                 | false      | Webhook público do Stripe       |
| bot-process-message            | false      | Chamado internamente + externo  |
| whatsapp-send-message          | true       | Requer autenticação             |
| stripe-create-checkout-session | true       | Requer autenticação             |
| stripe-create-portal-session   | true       | Requer autenticação             |
| stripe-list-invoices           | true       | Requer autenticação             |
| api-keys-insert                | true       | Requer autenticação + admin     |
| send-invite                    | true       | Requer autenticação + admin     |
