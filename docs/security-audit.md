# Auditoria de Segurança — Nuvia Customer Cloud

**Data da Auditoria**: 2026-01-10  
**Epic**: 6.3.1 — Segurança e Performance  
**Status**: ✅ Concluído

---

## 1. Row-Level Security (RLS)

### ✅ Tabelas com RLS Habilitado

| Tabela | RLS | Status |
|---|---|---|
| `profiles` | ✅ | Habilitado |
| `empresas` | ✅ | Habilitado |
| `planos` | ✅ | Habilitado |
| `agentes_ia` | ✅ | Habilitado |
| `api_keys` | ✅ | Habilitado |
| `auditoria` | ✅ | Habilitado |
| `uso_recursos` | ✅ | Habilitado |
| `user_roles` | ✅ | Habilitado |
| `org_to_empresa_mapping` | ✅ | **Corrigido** (habilitado na migration `epic_6_3_1_fix_insecure_rls_policies`) |

### 🔒 Políticas RLS Implementadas

#### **profiles**
- ✅ Usuários podem ver próprio perfil
- ✅ Usuários podem ver perfis da mesma empresa
- ✅ Usuários podem atualizar próprio perfil
- ✅ Admins da empresa podem gerenciar perfis da empresa
- ✅ Master admins podem ver todos os perfis

#### **empresas**
- ✅ Usuários podem ver apenas sua própria empresa
- ✅ Admins da empresa podem atualizar sua empresa
- ✅ Master admins podem criar/atualizar/deletar todas as empresas

#### **planos**
- ✅ Todos usuários autenticados podem ler planos ativos
- ✅ **CORRIGIDO**: Apenas master admins podem gerenciar planos (anteriormente tinha `USING (true)` - inseguro)

#### **agentes_ia**
- ✅ Usuários podem ver agentes da própria empresa
- ✅ Usuários podem criar agentes na própria empresa
- ✅ Usuários podem atualizar próprios agentes
- ✅ Admins podem gerenciar agentes da empresa
- ✅ Master admins podem ver todos os agentes

#### **api_keys**
- ✅ Apenas admins da empresa podem ver/gerenciar chaves da empresa
- ✅ Chaves nunca são retornadas descriptografadas via API pública

#### **auditoria**
- ✅ Usuários podem ver logs da própria empresa
- ✅ Master admins podem ver todos os logs

#### **uso_recursos**
- ✅ Usuários podem ver uso da própria empresa
- ✅ Master admins podem ver todos os usos

### ⚠️ Problemas Encontrados e Corrigidos

1. **Política insegura em `planos`**
   - **Problema**: Policy "Admins can manage plans" tinha `USING (true)` e `WITH CHECK (true)`
   - **Risco**: Qualquer admin poderia modificar qualquer plano
   - **Correção**: Substituída por policy que verifica `is_master_admin()`
   - **Migration**: `epic_6_3_1_fix_insecure_rls_policies`

2. **Tabela `org_to_empresa_mapping` sem RLS**
   - **Problema**: Tabela de migração sem RLS habilitado
   - **Risco**: Acesso não controlado a dados de migração
   - **Correção**: RLS habilitado + policy apenas para master admins
   - **Migration**: `epic_6_3_1_fix_insecure_rls_policies`

---

## 2. Criptografia de Dados Sensíveis

### ✅ Dados Criptografados

| Tabela | Coluna | Método | Status |
|---|---|---|---|
| `api_keys` | `key_encrypted` | AES-256 (pgcrypto) | ✅ Criptografado |
| `api_keys` | `key_hash` | SHA-256 | ✅ Hash para validação |

### 🔒 Implementação

- **Extensão**: `pgcrypto` habilitada
- **Funções**:
  - `encrypt_api_key()`: Criptografa chave usando chave derivada de `empresa_id`
  - `decrypt_api_key()`: Descriptografa (apenas service role, nunca via API pública)
  - `hash_api_key()`: Gera hash SHA-256 para validação

### ⚠️ Recomendações

1. **Nunca logar chaves descriptografadas**
   - ✅ Função `decrypt_api_key()` é `SECURITY DEFINER` e não exposta via RLS
   - ✅ Edge Functions que usam chaves devem usar service role

2. **Rotação de chaves de criptografia**
   - ⚠️ **Pendente**: Implementar rotação periódica das chaves de criptografia (derivadas de `empresa_id`)

3. **Secrets no frontend**
   - ✅ Nenhum secret é logado no frontend
   - ✅ Monitoramento (Sentry) filtra tokens/secrets antes de enviar

---

## 3. Rate Limiting

### ✅ Implementação

Rate limiting foi implementado e **deployado com sucesso** em todas as Edge Functions críticas usando a infraestrutura baseada em Supabase (`rate_limits` table + `_shared/rate-limit.ts`).

- **Helper compartilhado:** `supabase/functions/_shared/rate-limit.ts`
- **Tabela:** `public.rate_limits` (criada por migration `epic_6_3_1_create_rate_limits_table`)
- **Comportamento em erro:** Fail-open (permite requisição se o check de rate limit falhar)
- **Limpeza automática:** Trigger `cleanup_rate_limits_after_change` remove entradas expiradas
- **RLS:** apenas service role pode acessar

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

---

## 4. Validação de Inputs

### ✅ Implementações Existentes

- ✅ Validação de schemas com Zod no frontend
- ✅ Constraints no banco de dados (CHECK, FOREIGN KEY)
- ✅ Sanitização de inputs em Edge Functions

### ⚠️ Recomendações

1. **Validação adicional em Edge Functions**
   - Validar tamanho máximo de payloads
   - Validar tipos de dados antes de inserir no banco

2. **Proteção contra SQL Injection**
   - ✅ Usar Supabase client (parametrized queries)
   - ✅ Nunca concatenar strings em queries SQL

---

## 5. Auditoria e Logging

### ✅ Tabela `auditoria` (manual, legado)

- ✅ Registra ações críticas (criação, atualização, deleção)
- ✅ Captura IP, user_agent, timestamp
- ✅ Isolamento por `empresa_id` via RLS

### ✅ Audit Log automático (via triggers)

**Implementado em:** 2026-02-22 (via Supabase MCP)
**Migration:** `create_audit_log_system`

#### Tabela `public.audit_log`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | PK, gerado automaticamente |
| `created_at` | timestamptz | Timestamp do evento |
| `empresa_id` | bigint | Inferido da linha (ou `id` para tabela `empresas`) |
| `actor_user_id` | uuid | `auth.uid()` quando disponível |
| `table_name` | text | Nome da tabela (TG_TABLE_NAME) |
| `action` | text | INSERT / UPDATE / DELETE |
| `record_id` | text | ID do registro afetado |
| `before` | jsonb | Estado anterior (UPDATE/DELETE), **mascarado** |
| `after` | jsonb | Estado posterior (INSERT/UPDATE), **mascarado** |
| `context` | jsonb | Reservado para IP, user_agent, request_id |

#### Tabelas cobertas por triggers automáticos

| Tabela | Trigger | Campos sensíveis mascarados |
|---|---|---|
| `empresas` | `trg_audit_empresas` | `stripe_customer_id` |
| `profiles` | `trg_audit_profiles` | — |
| `api_keys` | `trg_audit_api_keys` | `key_encrypted`, `key_hash`, `plain_key` |
| `agentes_ia` | `trg_audit_agentes_ia` | — |

#### Campos mascarados automaticamente

A função `public.mask_sensitive_jsonb()` substitui por `"***masked***"` qualquer campo cujo nome (case-insensitive) contenha:

- `token`, `access_token`, `refresh_token`
- `api_key`, `secret`, `password`
- `webhook_verify_token`, `authorization`
- `key_encrypted`, `key_hash`, `plain_key`
- `stripe_secret`, `brevo_api_key`

#### Exemplo de registro no `audit_log`

```json
{
  "id": "a1b2c3d4-...",
  "created_at": "2026-02-22T15:30:00Z",
  "empresa_id": 42,
  "actor_user_id": "uuid-do-usuario",
  "table_name": "api_keys",
  "action": "INSERT",
  "record_id": "7",
  "before": null,
  "after": {
    "id": 7,
    "empresa_id": 42,
    "provider": "openai",
    "key_name": "Prod Key",
    "key_encrypted": "***masked***",
    "key_hash": "***masked***",
    "is_active": true
  }
}
```

> **Privacidade:** Nenhum token, chave API, senha ou credencial é armazenado em texto claro no `audit_log`. A função `mask_sensitive_jsonb()` é executada **antes** da inserção no log.

#### RLS do `audit_log`

- ✅ RLS habilitado
- ✅ Usuário autenticado: `SELECT` apenas onde `empresa_id` = empresa do usuário (via `profiles`)
- ✅ INSERT/UPDATE/DELETE bloqueados para usuários (apenas triggers escrevem)
- ✅ Service role: bypass total (padrão Supabase)

#### Observações

- Trigger usa `SECURITY DEFINER` para garantir acesso à tabela `audit_log` independente do contexto RLS
- `auth.uid()` é capturado quando disponível (operações via client autenticado)
- Para tabela `empresas`, `empresa_id` é inferido do próprio `id` da linha
- Tabelas futuras (`conversations`, `messages`, `whatsapp_config`) receberão triggers quando forem criadas

### ⚠️ Recomendações pendentes

1. **Retenção de logs**
   - ⚠️ **Pendente**: Implementar política de retenção (ex: 90 dias)

---

## 6. Checklist de Segurança

- [x] Todas as tabelas sensíveis têm RLS habilitado
- [x] Nenhuma policy permissiva (`USING (true)`)
- [x] Dados sensíveis (chaves API) estão criptografados
- [x] Secrets nunca são logados no frontend
- [x] Rate limiting implementado (infraestrutura pronta)
- [x] Rate limiting aplicado em todas as Edge Functions críticas
- [x] Validação de inputs com Zod
- [x] Auditoria de ações críticas
- [x] Triggers automáticos de auditoria (`audit_log` com máscara de dados sensíveis)
- [ ] Rotação de chaves de criptografia (pendente)
- [ ] Política de retenção de logs (pendente)

---

## 7. Próximos Passos

1. ~~Aplicar rate limiting nas Edge Functions críticas~~ ✅ Concluído
2. ~~Criar triggers automáticos de auditoria~~ ✅ Concluído (migration `create_audit_log_system`)
3. **Implementar rotação de chaves de criptografia**
4. **Configurar política de retenção de logs** (audit_log + auditoria)
5. **Adicionar triggers em tabelas futuras** (conversations, messages, whatsapp_config)
6. **Migrar rate limiting para Redis (opcional, para melhor performance)**

---

**Conclusão**: A base de segurança está sólida. RLS está correto, dados sensíveis estão criptografados, rate limiting está **totalmente implementado e deployado** em todas as Edge Functions críticas, e auditoria automática via triggers está ativa em 4 tabelas críticas (`empresas`, `profiles`, `api_keys`, `agentes_ia`) com máscara de campos sensíveis garantindo que nenhum token/secret é gravado em claro.
