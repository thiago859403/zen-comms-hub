# Auditoria de Segurança - Nuvia Customer Cloud

## Rate Limiting Aplicado

Rate limiting foi implementado e **deployado com sucesso** em todas as Edge Functions críticas usando a infraestrutura baseada em Supabase (`rate_limits` table + `_shared/rate-limit.ts`).

### Status de Deploy — Todas as funções ativas ✅

| Function | Limite | Janela | Chave de Identificação | verify_jwt | Versão | Status |
|----------|--------|--------|------------------------|------------|--------|--------|
| `stripe-create-checkout-session` | 10 req/min | 60s | `user_id` | `true` | v3 | ✅ ACTIVE |
| `api-keys-insert` | 5 req/min | 60s | `empresa-{empresa_id}` | `true` | v3 | ✅ ACTIVE |
| `send-invite` | 10 req/min | 60s | `empresa-{empresa_id}` | `true` | v3 | ✅ ACTIVE |
| `whatsapp-send-message` | 10 req/min (user) + 200 req/min (empresa) | 60s | `user-{user_id}` + `empresa-{empresa_id}` | `true` | v5 | ✅ ACTIVE |
| `stripe-webhook` | 60 req/min | 60s | `IP` | `false` | v3 | ✅ ACTIVE |
| `whatsapp-webhook` | 60 req/min | 60s | `IP` (apenas POST) | `false` | v2 | ✅ ACTIVE |
| `bot-process-message` | 100 req/min | 60s | `IP` | `false` | v4 | ✅ ACTIVE |

### Funções sem rate limiting (não críticas)

| Function | Motivo |
|----------|--------|
| `hello` | Função de teste/health-check, sem risco |
| `stripe-create-portal-session` | Baixo volume, protegida por JWT |
| `stripe-list-invoices` | Apenas leitura, protegida por JWT |

### Implementação

- **Helper compartilhado:** `supabase/functions/_shared/rate-limit.ts`
- **Tabela:** `public.rate_limits` (criada por migration `epic_6_3_1_create_rate_limits_table`)
- **Comportamento em erro:** Fail-open (permite requisição se o check de rate limit falhar)
- **Limpeza automática:** Trigger `cleanup_rate_limits_after_change` remove entradas expiradas

### Headers de Resposta (HTTP 429)

Quando o limite é excedido, a resposta inclui:
- `X-RateLimit-Limit`: Limite configurado
- `X-RateLimit-Remaining`: Requisições restantes (0)
- `X-RateLimit-Reset`: Timestamp Unix de reset da janela
- `Retry-After`: Segundos até poder tentar novamente

### Estratégias de Identificação

1. **Por `user_id`**: Funções autenticadas com `verify_jwt: true` que precisam de granularidade por usuário (ex: `stripe-create-checkout-session`)
2. **Por `empresa_id`**: Funções que operam no contexto de empresa/multi-tenancy (ex: `api-keys-insert`, `send-invite`)
3. **Duplo (`user_id` + `empresa_id`)**: Funções autenticadas de alto volume onde é necessário proteger contra abuso individual E coletivo. Evita bloqueio por IP em redes compartilhadas (ex: `whatsapp-send-message` — 10 req/min por user + 200 req/min por empresa)
4. **Por `IP`**: Funções públicas/webhooks onde não há autenticação disponível (ex: `stripe-webhook`, `whatsapp-webhook`, `bot-process-message`)

### Notas de Segurança

- Rate limiting é aplicado **antes** da lógica principal da função
- Em caso de erro no check de rate limit, a função adota comportamento "fail-open" (permite a requisição) para não bloquear tráfego legítimo
- Contadores são armazenados na tabela `rate_limits` com janela de tempo fixa
- Limites são conservadores para funções críticas (5 req/min para chaves API, 10 req/min para checkout/convites)
- Webhooks públicos têm limite mais generoso (60 req/min) para não bloquear eventos legítimos do Stripe/WhatsApp
- O `bot-process-message` tem o limite mais alto (100 req/min) por ser chamado internamente pelo `whatsapp-webhook`
- `whatsapp-send-message` usa rate limiting **duplo** (user_id + empresa_id) em vez de IP, pois é uma rota autenticada (`verify_jwt=true`). Isso evita que toda uma equipe na mesma rede corporativa seja bloqueada por um único IP. Se `empresa_id` não for encontrado, a função retorna 403 sem expor dados internos

### Data do deploy

- **Deploy realizado em:** 2026-02-19 (via Supabase MCP)
- **Projeto:** `zlqpgxvmiqadavimqtns` (sa-east-1)
