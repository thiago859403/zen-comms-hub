# Documentação Técnica — Nuvia Customer Cloud

**Versão:** 0.9 (Pré-Go-Live)  
**Última atualização:** 2026-02-22  
**Status:** 🚧 GO-LIVE PENDING — AGUARDANDO CRM COMERCIAL

---

## 1. Arquitetura Geral

### Visão geral

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend       │     │   Supabase       │     │   Serviços       │
│   React + Vite   │────▶│   (Backend)      │────▶│   Externos       │
│   Netlify        │     │   Edge Functions │     │                  │
└──────────────────┘     │   PostgreSQL     │     │  WhatsApp API    │
                         │   Auth           │     │  Stripe          │
                         │   Storage        │     │  Brevo (email)   │
                         └──────────────────┘     │  OpenAI/Claude   │
                                                  └──────────────────┘
```

### Stack tecnológico

| Camada | Tecnologia | Detalhes |
|---|---|---|
| **Frontend** | React 18 + TypeScript | SPA com Vite como bundler |
| **UI** | shadcn/ui + Tailwind CSS | Componentes acessíveis e responsivos |
| **Roteamento** | React Router v6 | Rotas protegidas por autenticação |
| **Estado** | TanStack Query | Cache e sincronização com backend |
| **Backend** | Supabase | PostgreSQL + Auth + Edge Functions + Storage |
| **Edge Functions** | Deno (TypeScript) | Serverless, deployadas via Supabase MCP |
| **Monitoramento** | Sentry | Captura de erros, context de usuário/empresa |
| **Pagamentos** | Stripe | Checkout, Portal, Webhooks, Faturas |
| **Email** | Brevo (SendInBlue) | Envio de convites |
| **IA** | Multi-provider (BYOK) | OpenAI, Anthropic (Claude), Google |
| **Hosting** | Netlify | Deploy automático do frontend |
| **Testes E2E** | Playwright | Fluxos críticos e integração Stripe |

### Multi-tenant via `empresa_id`

O sistema opera em modelo **multi-tenant** com isolamento por `empresa_id`:

- Cada registro de dados pertence a uma empresa.
- **Row-Level Security (RLS)** garante que usuários só acessam dados da própria empresa.
- A relação `profiles.empresa_id` é a chave do isolamento.
- Edge Functions usam `service_role` internamente e validam `empresa_id` antes de operar.

### Row-Level Security (RLS)

Todas as tabelas públicas possuem RLS habilitado:

| Tabela | RLS | Políticas |
|---|---|---|
| `profiles` | ✅ | Usuário vê próprio perfil + mesma empresa |
| `empresas` | ✅ | Usuário vê apenas própria empresa |
| `planos` | ✅ | Leitura pública, escrita apenas master |
| `agentes_ia` | ✅ | Isolamento por empresa_id |
| `api_keys` | ✅ | Apenas admins da empresa |
| `auditoria` | ✅ | Isolamento por empresa_id |
| `audit_log` | ✅ | Isolamento por empresa_id (auto) |
| `uso_recursos` | ✅ | Isolamento por empresa_id |
| `user_roles` | ✅ | RLS habilitado |
| `rate_limits` | ✅ | Apenas service role |

---

## 2. Segurança Implementada

### 2.1 Rate Limiting Global

Rate limiting aplicado em **todas as 9 Edge Functions críticas** usando tabela `rate_limits` + módulo `_shared/rate-limit.ts`.

| Tipo | Estratégia | Exemplo |
|---|---|---|
| Webhooks públicos | IP (60 req/min) | `whatsapp-webhook`, `stripe-webhook` |
| Endpoints autenticados | user_id (30/min) + empresa_id (200/min) | `whatsapp-send-message`, Stripe sessions |
| Endpoints sensíveis | user_id (10/min) | `api-keys-insert`, `send-invite` |
| Bot (misto) | user_id + empresa_id (auth) ou IP (público) | `bot-process-message` |

- Comportamento em falha: **fail-open** (permite requisição se check falhar)
- Resposta: HTTP 429 com headers `Retry-After`, `X-RateLimit-*`

### 2.2 Audit Log com Triggers Automáticos

Auditoria automática via triggers PL/pgSQL na tabela `audit_log`:

- **Tabelas cobertas:** `empresas`, `profiles`, `api_keys`, `agentes_ia`
- **Operações capturadas:** INSERT, UPDATE, DELETE
- **Dados registrados:** before/after (JSONB), actor_user_id, empresa_id, timestamp
- **Trigger function:** `audit_log_trigger()` (SECURITY DEFINER)

### 2.3 Mascaramento Automático de Secrets

Função `mask_sensitive_jsonb()` aplicada automaticamente em `before`/`after` do audit log.

**Campos mascarados** (substituídos por `"***masked***"`):

`token`, `access_token`, `refresh_token`, `api_key`, `secret`, `password`, `webhook_verify_token`, `authorization`, `key_encrypted`, `key_hash`, `plain_key`, `stripe_secret`, `brevo_api_key`

### 2.4 Criptografia de Dados

- Chaves API criptografadas com **AES-256** via `pgcrypto`
- Hash SHA-256 para validação sem descriptografar
- Descriptografia apenas via `service_role` (nunca exposta via API pública)

### 2.5 RLS por Empresa

- Isolamento total de dados por `empresa_id`
- Nenhuma policy com `USING (true)` em tabelas sensíveis
- Verificação via `auth.uid()` → `profiles.empresa_id`

---

## 3. Estrutura do Projeto

```
zen-comms-hub/
├── src/                          # Código-fonte do frontend
│   ├── components/               # Componentes React reutilizáveis
│   │   ├── auth/                 # Rotas protegidas, login
│   │   ├── chat/                 # Componentes de chat (em implantação)
│   │   ├── contacts/             # Gestão de contatos (em implantação)
│   │   ├── flowBuilder/          # Editor visual de fluxos (em implantação)
│   │   ├── subscription/         # Gestão de planos/assinaturas
│   │   ├── ui/                   # Componentes shadcn/ui
│   │   └── usage/                # Alertas de uso
│   ├── hooks/                    # Custom hooks (auth, empresa, dashboard)
│   ├── integrations/supabase/    # Cliente Supabase e tipos
│   ├── lib/                      # Utilitários (validação, monitoring, etc.)
│   ├── pages/                    # Páginas da aplicação (35 páginas)
│   ├── config/                   # Configurações (release, etc.)
│   ├── App.tsx                   # Roteamento principal
│   └── main.tsx                  # Entry point
│
├── supabase/
│   ├── functions/                # Edge Functions (Deno)
│   │   ├── _shared/              # Módulos compartilhados
│   │   │   └── rate-limit.ts     # Rate limiting helper
│   │   ├── api-keys-insert/      # Inserção de chaves API (BYOK)
│   │   ├── bot-process-message/  # Processamento de mensagens com bot/IA
│   │   ├── send-invite/          # Envio de convites por email
│   │   ├── stripe-create-checkout-session/
│   │   ├── stripe-create-portal-session/
│   │   ├── stripe-list-invoices/
│   │   ├── stripe-webhook/       # Webhook do Stripe
│   │   ├── whatsapp-send-message/
│   │   └── whatsapp-webhook/     # Webhook do WhatsApp
│   ├── migrations/               # Migrations SQL (22 arquivos)
│   └── config.toml               # Configuração local do Supabase
│
├── tests/
│   └── e2e/                      # Testes end-to-end (Playwright)
│       ├── critical-flows.spec.ts
│       ├── stripe-integration.spec.ts
│       └── setup.ts
│
├── docs/                         # Documentação do projeto
│   ├── security-audit.md         # Auditoria de segurança
│   ├── user-guide.md             # Guia do usuário
│   ├── technical-docs.md         # Documentação técnica (este arquivo)
│   ├── go-live-checklist.md      # Checklist pré go-live
│   ├── prd.md                    # Product Requirements Document
│   ├── stripe-setup.md           # Configuração do Stripe
│   └── ...                       # Outros documentos
│
├── netlify.toml                  # Configuração do Netlify (deploy)
├── playwright.config.ts          # Configuração do Playwright
├── vite.config.ts                # Configuração do Vite
├── tailwind.config.ts            # Configuração do Tailwind CSS
├── package.json                  # Dependências npm
└── tsconfig.json                 # Configuração TypeScript
```

---

## 4. Edge Functions

### Inventário completo

| Function | Propósito | Auth | Rate Limit |
|---|---|---|---|
| `api-keys-insert` | Inserção de chaves API (BYOK) | JWT | 10/min user |
| `bot-process-message` | Processamento de mensagens com bot/IA | Misto | 30/min user ou IP |
| `send-invite` | Envio de convites por email (Brevo) | JWT | 10/min user |
| `stripe-create-checkout-session` | Criação de sessão de checkout | JWT | 30/min user + 200/min empresa |
| `stripe-create-portal-session` | Acesso ao portal de pagamentos | JWT | 30/min user + 200/min empresa |
| `stripe-list-invoices` | Listagem de faturas | JWT | 60/min user + 300/min empresa |
| `stripe-webhook` | Recebimento de eventos Stripe | Público | 60/min IP |
| `whatsapp-send-message` | Envio de mensagens WhatsApp | JWT | 30/min user + 200/min empresa |
| `whatsapp-webhook` | Recebimento de mensagens WhatsApp | Público | 60/min IP |

### Módulo compartilhado: `_shared/rate-limit.ts`

Exporta:
- `checkRateLimit()` — Verifica e incrementa contador
- `createRateLimitResponse()` — Resposta HTTP 429 padronizada
- `getClientIP()` — Extração de IP real (suporta proxies)

---

## 5. Banco de Dados

### Tabelas principais (public schema)

| Tabela | Linhas | Propósito |
|---|---|---|
| `empresas` | ~521 | Empresas (tenants) |
| `profiles` | ~521 | Perfis de usuários |
| `planos` | 4 | Planos da plataforma |
| `agentes_ia` | ~180 | Agentes de IA configuráveis |
| `api_keys` | 0 | Chaves API criptografadas (BYOK) |
| `user_roles` | ~521 | Mapeamento de papéis |
| `auditoria` | 0 | Auditoria manual (legado) |
| `audit_log` | — | Auditoria automática (triggers) |
| `rate_limits` | — | Contadores de rate limiting |
| `uso_recursos` | 0 | Tracking de uso por empresa |

### Funções PL/pgSQL relevantes

| Função | Propósito |
|---|---|
| `mask_sensitive_jsonb()` | Mascara campos sensíveis em JSONB |
| `audit_log_trigger()` | Trigger genérico de auditoria |
| `insert_api_key()` | Insere chave API com criptografia |
| `decrypt_api_key()` | Descriptografa chave (service role) |
| `get_default_decrypted_api_key()` | Busca chave padrão descriptografada |
| `is_master_admin()` | Verifica se usuário é master admin |
| `log_auditoria()` | Registra ação na tabela auditoria (manual) |

---

## 6. Deploy e Ambiente

### Frontend → Netlify

- **Build command:** `pnpm build` (ou `npm run build`)
- **Publish directory:** `dist/`
- **Node version:** 18+
- **Configuração:** `netlify.toml`
- **SPA redirect:** Todas as rotas redirecionam para `index.html`
- **Headers de segurança:** CSP, X-Frame-Options, X-Content-Type-Options configurados

### Backend → Supabase (MCP)

- **Projeto:** `zlqpgxvmiqadavimqtns` (região: sa-east-1)
- **Deploy de Edge Functions:** Via Supabase MCP (não CLI local)
- **Migrations:** Aplicadas via MCP (`apply_migration`)
- **Variáveis de ambiente gerenciadas pelo Supabase Dashboard**

### Variáveis de ambiente necessárias

| Variável | Onde | Propósito |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend (Netlify) | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend (Netlify) | Chave pública do Supabase |
| `VITE_SENTRY_DSN` | Frontend (Netlify) | DSN do Sentry |
| `SUPABASE_URL` | Edge Functions (auto) | URL do projeto (injetado) |
| `SUPABASE_ANON_KEY` | Edge Functions (auto) | Chave pública (injetado) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions (auto) | Chave service role (injetado) |
| `STRIPE_SECRET_KEY` | Edge Functions (secret) | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Edge Functions (secret) | Secret para verificação de webhooks |
| `BREVO_API_KEY` | Edge Functions (secret) | Chave API do Brevo para emails |
| `SITE_URL` | Edge Functions (secret) | URL base do frontend |

### Testes E2E → Playwright

- **Configuração:** `playwright.config.ts`
- **Testes:** `tests/e2e/`
- **Fluxos testados:**
  - `critical-flows.spec.ts` — Login, navegação, funcionalidades core
  - `stripe-integration.spec.ts` — Fluxo de pagamento Stripe
- **Execução:** `npx playwright test`

---

## 7. Fluxos Principais

### Fluxo de Autenticação

```
Usuário → Login/Cadastro → Supabase Auth → JWT → Frontend
                                         ↓
                                   Trigger: criar empresa + profile
                                         ↓
                                   Redirect → Dashboard
```

### Fluxo de Webhook WhatsApp

```
WhatsApp API → POST /whatsapp-webhook → Rate Limit (IP)
                                       ↓
                                 Verificar assinatura
                                       ↓
                                 Salvar mensagem (conversations/messages)
                                       ↓
                                 Chamar bot-process-message
                                       ↓
                                 Resposta automática (se configurado)
```

### Fluxo de Pagamento Stripe

```
Usuário → Selecionar plano → stripe-create-checkout-session
                                       ↓
                                 Stripe Checkout (hosted)
                                       ↓
                                 stripe-webhook (checkout.session.completed)
                                       ↓
                                 Atualizar empresa.plano_id
```

---

> 🚧 **O Go-Live completo será executado após a conclusão do módulo CRM Comercial.** Esta documentação será atualizada conforme novas funcionalidades forem implementadas.
