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

Crie um arquivo `.env.test` com as seguintes variáveis:

```env
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Notas

- Os testes usam dados de teste que são criados e limpos automaticamente
- Para testes de Stripe, é necessário configurar um mock server ou usar Stripe CLI
- Os testes de multi-tenancy verificam isolamento de dados entre empresas
- Os testes de RLS verificam que usuários não acessam dados de outras empresas
