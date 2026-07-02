# Testes End-to-End (E2E)

Este diretório contém os testes E2E da aplicação Nuvia Customer Cloud usando Playwright.

## Configuração

### Instalação

```bash
pnpm install
```

### Instalar navegadores do Playwright

```bash
pnpm exec playwright install
```

## Executando os Testes

### Executar todos os testes

```bash
pnpm test:e2e
```

### Executar com interface gráfica

```bash
pnpm test:e2e:ui
```

### Executar em modo headed (com navegador visível)

```bash
pnpm test:e2e:headed
```

### Executar em modo debug

```bash
pnpm test:e2e:debug
```

### Executar testes específicos

```bash
pnpm exec playwright test critical-flows
pnpm exec playwright test stripe-integration
```

## Estrutura dos Testes

- `setup.ts`: Configuração inicial e autenticação
- `critical-flows.spec.ts`: Testes de fluxos críticos (cadastro, multi-tenancy, RLS, limites)
- `stripe-integration.spec.ts`: Testes de integração com Stripe

## Variáveis de Ambiente

Use `.env.local` ou exporte antes de rodar:

```env
PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:4173
VITE_SUPABASE_URL=https://dztevycwxlnrrvnvutyc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key  # recomendado no CI
E2E_EMAIL_DOMAIN=nuvia.com  # não usar @test.com (bloqueado pelo Auth)
```

No GitHub Actions, configure os secrets `VITE_SUPABASE_*` e `SUPABASE_SERVICE_ROLE_KEY` do projeto `dztevycwxlnrrvnvutyc`.

## Notas

- Os testes usam dados de teste que são criados e limpos automaticamente
- Para testes de Stripe, é necessário configurar um mock server ou usar Stripe CLI
- Os testes de multi-tenancy verificam isolamento de dados entre empresas
- Os testes de RLS verificam que usuários não acessam dados de outras empresas
