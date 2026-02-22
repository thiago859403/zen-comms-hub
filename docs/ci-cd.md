# CI/CD — Nuvia Customer Cloud

## Visão Geral

| Pipeline | Plataforma | Trigger | O que faz |
|---|---|---|---|
| **Frontend Deploy** | Netlify | Push em `main` | Build + deploy automático |
| **Preview Deploy** | Netlify | Pull Request | Gera URL temporária para revisar PR |
| **E2E Tests** | GitHub Actions | Push/PR em `main`, `dev` | Roda Playwright (Chromium) |
| **Edge Functions** | GitHub Actions + Supabase CLI | Push em `main` (quando `supabase/functions/**` muda) | Deploy das Edge Functions no Supabase |

---

## 1. Netlify — Frontend Deploy

### Conectar o repositório

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site" → "Import an existing project"**
3. Selecione **GitHub** e autorize acesso
4. Escolha o repositório `zen-comms-hub`
5. O Netlify detectará automaticamente o `netlify.toml` e configurará:
   - **Build command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Publish directory**: `dist`
   - **Production branch**: `main`
6. Clique em **"Deploy site"**

### Configurar variáveis de ambiente

Vá em **Site settings → Environment variables** e adicione:

| Variável | Valor | Contexto |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://zlqpgxvmiqadavimqtns.supabase.co` | All contexts |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (JWT anon key) | All contexts |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (opcional) | All contexts |

> **⚠️ IMPORTANTE**: Nunca commite segredos no repositório. Sempre configure no Netlify UI.

### Deploy automático

- Todo push em `main` gera um **deploy de produção** automaticamente.
- A branch `dev` pode ser configurada como **branch deploy** (URL separada).

---

## 2. Preview Deployments (PRs)

Quando você abre um Pull Request:

1. O Netlify gera automaticamente uma **URL de preview** (ex: `deploy-preview-42--seu-site.netlify.app`)
2. A URL aparece como **check status** no PR do GitHub
3. O preview usa as mesmas env vars de produção por padrão

### Usar um Supabase de staging (opcional)

Se você tiver um projeto Supabase de staging separado:

1. Vá em **Site settings → Environment variables**
2. Em cada variável (`VITE_SUPABASE_URL`, etc.), clique **"Edit"**
3. Adicione um valor diferente para o contexto **"Deploy previews"**

### Validar um preview

1. Abra o PR no GitHub
2. Clique no link "Deploy Preview" no check do Netlify
3. Teste a aplicação na URL de preview
4. Se estiver OK, faça merge do PR

---

## 3. Edge Functions — Deploy Automático

### Como funciona

O workflow `.github/workflows/deploy-edge-functions.yml` faz deploy das Edge Functions do Supabase quando:

- Push em `main` altera arquivos em `supabase/functions/**` ou `supabase/config.toml`
- Você dispara manualmente via GitHub Actions (workflow_dispatch)

### Configurar o secret

1. Acesse [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Clique **"Generate new token"** e copie o token
3. Acesse `https://github.com/SEU-USUARIO/zen-comms-hub/settings/secrets/actions`
4. Clique **"New repository secret"**
5. Nome: `SUPABASE_ACCESS_TOKEN`, Valor: o token copiado

### Deploy manual de uma function específica

1. Vá em **Actions → Deploy Edge Functions**
2. Clique **"Run workflow"**
3. (Opcional) preencha o campo `function` com o slug (ex: `stripe-webhook`)
4. Clique **"Run workflow"**

### Debugar falhas

1. Vá em **Actions → Deploy Edge Functions → run que falhou**
2. Abra o step **"Deploy Edge Functions"** para ver os logs
3. Erros comuns:
   - `SUPABASE_ACCESS_TOKEN` ausente → adicione o secret
   - `Function not found` → verifique que o diretório existe em `supabase/functions/`
   - `Permission denied` → token expirado, gere um novo

### Edge Functions configuradas

| Function | JWT | Descrição |
|---|---|---|
| `stripe-create-checkout-session` | ✅ | Cria sessão de checkout Stripe |
| `stripe-webhook` | ❌ | Recebe webhooks do Stripe |
| `stripe-create-portal-session` | ✅ | Abre portal de billing Stripe |
| `stripe-list-invoices` | ✅ | Lista faturas do Stripe |
| `api-keys-insert` | ✅ | Insere chaves API (BYOK) |
| `bot-process-message` | ❌ | Processa mensagens via IA |
| `send-invite` | ✅ | Envia convite para colaborador |
| `whatsapp-webhook` | ❌ | Recebe webhooks do WhatsApp |
| `whatsapp-send-message` | ✅ | Envia mensagem via WhatsApp |

> Functions com JWT ❌ são acessíveis publicamente (webhooks externos).

---

## 4. GitHub Actions — E2E Tests

### Secrets necessários

| Secret | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key (JWT) do Supabase |

### Quando roda

- Push em `main` ou `dev`
- Pull Request para `main` ou `dev`

### Artifacts

Mesmo se os testes falharem, os artifacts são salvos:
- **playwright-report**: relatório HTML completo
- **test-results**: screenshots, vídeos, traces

Para baixar: vá em **Actions → E2E → run → Artifacts** (no final da página).
