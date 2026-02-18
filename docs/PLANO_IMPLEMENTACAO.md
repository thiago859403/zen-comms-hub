# Plano de Implementação - NUVIA Customer Cloud

## Visão Geral
Este documento apresenta o plano de implementação faseado para construir a plataforma SaaS NUVIA Customer Cloud conforme o PRD, com foco nos pilares críticos: arquitetura multi-tenant (RLS), integração Stripe (modelo BYOK), e gestão segura de chaves API.

---

## FASE 1: Fundação Multi-Tenant e Modelo de Dados

### ÉPICO 1.1: Migração do Modelo de Dados para o PRD
**Objetivo:** Ajustar o modelo atual (`organizations`, `profiles`) para o modelo do PRD (`empresas`, `perfis`, `planos`), mantendo compatibilidade com dados existentes.

#### User Story 1.1.1: Criar tabela `planos` e dados iniciais
- Criar migration SQL com tabela `planos` conforme PRD
- Campos: id (BIGINT), nome, preco_mensal, max_usuarios, max_agentes, limite_mensagens_mes, stripe_price_id (UNIQUE), features (JSONB), is_active, cor, timestamps
- Inserir planos padrão (Free, Pro, Business, Enterprise) via seed
- Implementar RLS básico (apenas leitura para authenticated, escrita apenas para master admin)

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_planos_table.sql`
- `supabase/seed/planos_initial_data.sql` (opcional)

#### User Story 1.1.2: Criar tabela `empresas` (tenants) e migrar dados de `organizations`
- Criar migration SQL com tabela `empresas` conforme PRD
- Campos: id (BIGINT), nome, plano_id (FK), contexto_ia (JSONB), stripe_customer_id, status, is_active, timestamps
- Criar script de migração de dados: migrar `organizations` → `empresas`
- Mapear planos antigos (free, pro, business, enterprise) para novos IDs
- Manter `organizations` temporariamente para compatibilidade

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_empresas_table.sql`
- `supabase/migrations/YYYYMMDDHHMMSS_migrate_organizations_to_empresas.sql`

#### User Story 1.1.3: Atualizar tabela `perfis` para modelo do PRD
- Adicionar coluna `empresa_id` (FK → empresas) mantendo `org_id` temporariamente
- Adicionar coluna `role` com valores: master, admin, user (atualizar enum `app_role`)
- Migrar dados: mapear `org_id` → `empresa_id`
- Criar índices para performance: idx_perfis_empresa_id, idx_perfis_role
- Atualizar triggers e funções auxiliares

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_update_perfis_for_prd.sql`
- Atualizar `src/integrations/supabase/types.ts` (gerar novos tipos)

#### User Story 1.1.4: Criar tabela `agentes_ia`
- Criar migration SQL com tabela `agentes_ia` conforme PRD
- Campos: id (BIGINT), empresa_id (FK), nome, instrucoes (TEXT - System Prompt), created_by (FK → perfis), status, timestamps
- Implementar RLS: usuários da mesma empresa podem ler; apenas admins podem criar/editar

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_agentes_ia_table.sql`

#### User Story 1.1.5: Atualizar tabela `conversas` para modelo do PRD
- Adicionar campos: `conversation_uuid` (UUID), `empresa_id` (FK), `user_id` (FK), `agente_id` (FK → agentes_ia), `mensagens` (JSONB), `tokens_usados` (BIGINT)
- Migrar dados existentes: extrair `empresa_id` de `assigned_agent_id` ou criar mapping
- Manter campos existentes compatíveis temporariamente

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_update_conversas_for_prd.sql`

#### User Story 1.1.6: Criar tabela `uso_recursos`
- Criar migration SQL para controle de consumo mensal
- Campos: id (BIGINT), empresa_id (FK), mes_referencia (DATE), mensagens_enviadas (INT), tokens_consumidos (BIGINT), timestamps
- Criar índice único: (empresa_id, mes_referencia)
- Implementar RLS: empresas veem apenas seus próprios dados

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_uso_recursos_table.sql`

#### User Story 1.1.7: Criar/Atualizar tabela `auditoria`
- Verificar se `conversation_audit` existe e expandir para `auditoria` conforme PRD
- Campos: id (BIGINT), user_id (FK), empresa_id (FK), acao (TEXT), entidade_tipo (TEXT), entidade_id (BIGINT), ip_address, user_agent, created_at
- Implementar RLS: usuários veem apenas auditoria de sua empresa; master admins veem tudo
- Criar índices para consultas frequentes

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_auditoria_table.sql`

---

### ÉPICO 1.2: Row-Level Security (RLS) Completo
**Objetivo:** Implementar isolamento total de dados entre empresas usando RLS em todas as tabelas sensíveis.

#### User Story 1.2.1: RLS para tabela `empresas`
- Criar política: usuários podem ler apenas sua própria empresa (via `perfis.empresa_id`)
- Criar política: apenas master admins podem criar/atualizar/deletar empresas
- Criar função auxiliar: `current_empresa_id()` (equivalente a `current_org_id()`)
- Testar isolamento: criar duas empresas e verificar que não veem dados uma da outra

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_rls_empresas.sql`
- Testes em `supabase/tests/rls_empresas.test.sql` (opcional)

#### User Story 1.2.2: RLS para tabela `perfis` (multi-tenant)
- Atualizar políticas existentes para usar `empresa_id`
- Política: usuários podem ler perfis da mesma empresa
- Política: admins da empresa podem gerenciar perfis da mesma empresa
- Política: master admins podem ver todos os perfis
- Remover políticas antigas baseadas apenas em `user_id`

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_rls_perfis_multi_tenant.sql`

#### User Story 1.2.3: RLS para tabelas de negócio (`agentes_ia`, `conversas`, `uso_recursos`)
- Implementar RLS em `agentes_ia`: filtrar por `empresa_id`
- Implementar RLS em `conversas`: filtrar por `empresa_id` (atualizar políticas existentes)
- Implementar RLS em `uso_recursos`: filtrar por `empresa_id`
- Garantir que todas as queries automáticas respeitam o contexto da empresa

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_rls_business_tables.sql`

#### User Story 1.2.4: RLS para tabelas relacionadas (mensagens, templates, etc.)
- Atualizar RLS de `messages` para usar `empresa_id` via JOIN com `conversas`
- Atualizar RLS de `message_templates` para filtrar por `empresa_id` (adicionar campo se necessário)
- Atualizar RLS de outras tabelas que precisam isolamento (tags, queues, etc.)
- Criar função helper: `ensure_empresa_context()` para validar contexto em Edge Functions

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_rls_related_tables.sql`
- Atualizar Edge Functions existentes

#### User Story 1.2.5: Funções auxiliares e triggers para RLS
- Criar função `get_empresa_id_for_user(user_id UUID)` para uso em triggers
- Criar trigger que automaticamente preenche `empresa_id` em inserções baseado no `user_id`
- Criar função de validação: `validate_empresa_access(empresa_id BIGINT)` retorna boolean
- Documentar funções em comentários SQL

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_rls_helper_functions.sql`

---

### ÉPICO 1.3: Sistema de Roles e Permissões
**Objetivo:** Implementar sistema de roles (master, admin, user) com permissões granulares por empresa.

#### User Story 1.3.1: Atualizar enum `app_role` e criar função `has_role_empresa`
- Adicionar role `master` ao enum `app_role`
- Criar função `has_role_empresa(user_id UUID, role_name TEXT, empresa_id BIGINT)` para verificar role em contexto de empresa
- Criar função `is_master_admin(user_id UUID)` para identificar admins master da plataforma
- Atualizar função `has_role` existente se necessário

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_update_roles_system.sql`

#### User Story 1.3.2: Componente React para verificação de roles no frontend
- Criar hook `useHasRole(role: string, empresaId?: number)` em `src/hooks/useHasRole.tsx`
- Criar componente `RequireRole` wrapper para proteger rotas
- Atualizar `ProtectedRoute` para aceitar prop `requiredRole` e `requiredEmpresaId`
- Integrar com contexto de autenticação existente

**Artefatos:**
- `src/hooks/useHasRole.tsx`
- `src/components/auth/RequireRole.tsx`
- Atualizar `src/components/auth/ProtectedRoute.tsx`

#### User Story 1.3.3: Atualizar políticas RLS para usar novo sistema de roles
- Atualizar políticas existentes para usar `has_role_empresa` onde aplicável
- Garantir que master admins têm acesso global (bypass RLS via políticas específicas)
- Testar cenários: admin de empresa A não acessa dados de empresa B
- Documentar matriz de permissões

**Artefatos:**
- Atualizar migrations anteriores com políticas refinadas
- `docs/permissions_matrix.md`

---

## FASE 2: Integração Stripe e Modelo SaaS BYOK

### ÉPICO 2.1: Integração Stripe - Infraestrutura Base
**Objetivo:** Configurar Stripe para gerenciar assinaturas, planos e webhooks.

#### User Story 2.1.1: Configurar variáveis de ambiente e SDK Stripe
- Adicionar variáveis ao `.env.local.example`: `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Instalar dependência: `@stripe/stripe-js` e `stripe` (apenas server-side)
- Criar arquivo de configuração: `src/lib/stripe/config.ts` (client-side)
- Criar arquivo: `supabase/functions/_shared/stripe.ts` (server-side com secret key)

**Artefatos:**
- Atualizar `.env.local.example`
- `package.json` (adicionar dependências)
- `src/lib/stripe/config.ts`
- `supabase/functions/_shared/stripe.ts`

#### User Story 2.1.2: Criar Edge Function para webhook do Stripe
- Criar `supabase/functions/stripe-webhook/index.ts`
- Implementar verificação de assinatura do webhook (usar `STRIPE_WEBHOOK_SECRET`)
- Processar eventos: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Atualizar `empresas.stripe_customer_id` e `empresas.plano_id` conforme eventos

**Artefatos:**
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/functions/stripe-webhook/deno.json`

#### User Story 2.1.3: Sincronizar planos Stripe com tabela `planos`
- Criar migration para popular `planos.stripe_price_id` com IDs reais do Stripe (ou usar variáveis de ambiente)
- Criar função SQL `sync_plano_from_stripe(stripe_price_id TEXT)` para atualizar plano da empresa
- Criar Edge Function `sync-stripe-plans` (opcional, para sincronização periódica)

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_sync_stripe_plans.sql`
- `supabase/functions/sync-stripe-plans/index.ts` (opcional)

---

### ÉPICO 2.2: Checkout e Gestão de Assinaturas
**Objetivo:** Permitir que empresas façam upgrade/downgrade de planos via Stripe Checkout.

#### User Story 2.2.1: Criar Edge Function para criar sessão de checkout
- Criar `supabase/functions/create-checkout-session/index.ts`
- Receber `empresa_id` e `plano_id` (ou `stripe_price_id`)
- Criar ou recuperar `stripe_customer_id` da empresa
- Criar sessão de checkout Stripe com `success_url` e `cancel_url`
- Retornar URL da sessão para redirecionamento

**Artefatos:**
- `supabase/functions/create-checkout-session/index.ts`

#### User Story 2.2.2: Página de Planos e Upgrade no Frontend
- Criar/atualizar página `src/pages/Pricing.tsx` ou `src/pages/Planos.tsx`
- Listar planos da tabela `planos` (buscar via Supabase)
- Botão "Assinar" que chama Edge Function e redireciona para Stripe Checkout
- Exibir plano atual da empresa e limites (max_usuarios, max_agentes, etc.)

**Artefatos:**
- `src/pages/Planos.tsx` (ou atualizar página existente)
- Adicionar rota em `src/App.tsx`

#### User Story 2.2.3: Página de Sucesso e Cancelamento do Checkout
- Criar `src/pages/CheckoutSuccess.tsx`: exibir confirmação, atualizar estado da empresa
- Criar `src/pages/CheckoutCancel.tsx`: mensagem amigável, opção de tentar novamente
- Integrar com webhook: após sucesso, verificar se assinatura foi criada e atualizar UI

**Artefatos:**
- `src/pages/CheckoutSuccess.tsx`
- `src/pages/CheckoutCancel.tsx`
- Atualizar rotas e `success_url`/`cancel_url` na Edge Function

#### User Story 2.2.4: Dashboard de Billing e Gestão de Assinatura
- Criar página `src/pages/Billing.tsx` (ou seção em Settings)
- Exibir: plano atual, data de renovação, histórico de pagamentos (buscar do Stripe via Edge Function)
- Permitir upgrade/downgrade (botões que criam nova sessão de checkout)
- Permitir cancelamento (chamar Edge Function que cancela assinatura no Stripe)
- Exibir uso atual vs. limites do plano (mensagens, tokens, etc.)

**Artefatos:**
- `src/pages/Billing.tsx`
- Edge Function `manage-subscription/index.ts` (cancelar, atualizar)

---

### ÉPICO 2.3: Modelo BYOK (Bring Your Own Key) - Gestão de Chaves API
**Objetivo:** Permitir que empresas usem suas próprias chaves de API (OpenAI/Claude) em vez de chaves gerenciadas pela Nuvia.

#### User Story 2.3.1: Criar tabela `api_keys` (empresa)
- Criar migration SQL com tabela `api_keys`
- Campos: id (BIGINT), empresa_id (FK), provider (openai, claude, anthropic), key_encrypted (TEXT - criptografada), is_active, created_at, updated_at
- Implementar RLS: apenas admins da empresa podem ler/escrever suas próprias chaves
- Criar função PostgreSQL para criptografia/descriptografia usando `pgcrypto` (usar secret do Supabase)

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_create_api_keys_table.sql`

#### User Story 2.3.2: Edge Function para validar e armazenar chave API
- Criar `supabase/functions/save-api-key/index.ts`
- Receber `empresa_id`, `provider`, `api_key` (plain text)
- Validar chave fazendo request de teste à API do provider (OpenAI ou Claude)
- Se válida: criptografar usando Supabase Vault ou função de criptografia
- Armazenar em `api_keys` criptografada
- Retornar sucesso/erro

**Artefatos:**
- `supabase/functions/save-api-key/index.ts`

#### User Story 2.3.3: UI para cadastro e gestão de chaves API
- Atualizar `src/pages/Settings.tsx` (seção API) ou criar `src/pages/ApiKeys.tsx`
- Formulário: selecionar provider (OpenAI/Claude), input para chave (type="password")
- Botão "Validar e Salvar" que chama Edge Function
- Listar chaves cadastradas (mostrar apenas últimos 4 caracteres, ex: `sk-...xxxx`)
- Permitir ativar/desativar e deletar chaves
- Aviso de segurança sobre proteção de chaves

**Artefatos:**
- Atualizar `src/pages/Settings.tsx` ou criar `src/pages/ApiKeys.tsx`
- Componente `ApiKeyForm.tsx` em `src/components/settings/`

#### User Story 2.3.4: Integrar uso de chaves BYOK nas Edge Functions de IA
- Atualizar `supabase/functions/bot-process-message/index.ts`
- Ao processar mensagem com IA, verificar se empresa tem chave própria ativa
- Se sim: usar chave da empresa (descriptografar e usar)
- Se não: usar chave padrão da Nuvia (variável de ambiente)
- Registrar uso de tokens por empresa em `uso_recursos`

**Artefatos:**
- Atualizar `supabase/functions/bot-process-message/index.ts`
- Criar helper `get_empresa_api_key(empresa_id)` em função compartilhada

#### User Story 2.3.5: Lógica de fallback e monitoramento de chaves
- Implementar fallback: se chave BYOK falhar (rate limit, inválida), tentar chave padrão da Nuvia
- Registrar erros de API em tabela de auditoria
- Criar alerta (email via Brevo) se chave BYOK falhar 3 vezes consecutivas
- Dashboard admin: visualizar quais empresas usam BYOK vs. chave padrão

**Artefatos:**
- Lógica de fallback nas Edge Functions
- Atualizar `auditoria` com tipo de ação "api_key_failure"

---

## FASE 3: Automação e Comunicações

### ÉPICO 3.1: Integração Brevo para E-mails Transacionais
**Objetivo:** Configurar Brevo (Sendinblue) para envio de e-mails automatizados.

#### User Story 3.1.1: Configurar Brevo e criar Edge Function base
- Adicionar variáveis: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`
- Instalar dependência `@getbrevo/brevo` (ou usar fetch nativo)
- Criar `supabase/functions/_shared/brevo.ts` com funções helper: `sendEmail(to, subject, htmlContent)`

**Artefatos:**
- Atualizar `.env.local.example`
- `supabase/functions/_shared/brevo.ts`

#### User Story 3.1.2: Templates de e-mail e função de envio
- Criar templates HTML em `supabase/functions/_shared/email-templates.ts`:
  - Welcome/Onboarding (após signup)
  - Plano atualizado (após checkout)
  - Alerta de limite próximo (uso de recursos)
  - Falha de pagamento
  - Resumo semanal/mensal (opcional)
- Função `sendTemplateEmail(templateName, variables, to)`

**Artefatos:**
- `supabase/functions/_shared/email-templates.ts`

#### User Story 3.1.3: Triggers automáticos para envio de e-mails
- Criar trigger SQL que dispara após inserção em `empresas` → enviar welcome email (via Edge Function)
- Criar trigger após atualização de `empresas.plano_id` → enviar email de plano atualizado
- Criar função que verifica `uso_recursos` e envia alerta se próximo do limite (executar via cron ou Edge Function agendada)

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_email_triggers.sql`
- Edge Function `send-welcome-email/index.ts`
- Edge Function `check-usage-limits/index.ts` (executar periodicamente)

---

### ÉPICO 3.2: Controle de Limites e Uso de Recursos
**Objetivo:** Implementar sistema que monitora e aplica limites de planos (usuários, agentes, mensagens).

#### User Story 3.2.1: Funções SQL para verificar limites
- Criar função `check_empresa_limits(empresa_id BIGINT, resource_type TEXT)` retorna boolean
- Verificar: `max_usuarios` (contar perfis da empresa), `max_agentes` (contar agentes_ia), `limite_mensagens_mes` (verificar `uso_recursos`)
- Criar função `increment_uso_recursos(empresa_id BIGINT, mensagens INT, tokens BIGINT)` para atualizar contadores

**Artefatos:**
- `supabase/migrations/YYYYMMDDHHMMSS_limit_functions.sql`

#### User Story 3.2.2: Aplicar limites nas operações críticas
- Atualizar Edge Functions e triggers para verificar limites antes de:
  - Criar novo perfil (verificar `max_usuarios`)
  - Criar novo agente_ia (verificar `max_agentes`)
  - Enviar mensagem (verificar `limite_mensagens_mes`)
- Retornar erro amigável se limite excedido, sugerindo upgrade

**Artefatos:**
- Atualizar Edge Functions existentes
- Criar componente `LimitExceededModal.tsx` para exibir no frontend

#### User Story 3.2.3: Dashboard de uso de recursos
- Criar seção em `src/pages/Dashboard.tsx` ou página `src/pages/Usage.tsx`
- Exibir: gráficos de uso (mensagens no mês, tokens consumidos, usuários ativos, agentes criados)
- Barras de progresso mostrando uso vs. limite do plano
- Alerta visual se próximo do limite (>80%)
- Botão "Upgrade" se limite atingido

**Artefatos:**
- Atualizar `src/pages/Dashboard.tsx` ou criar `src/pages/Usage.tsx`
- Componente `UsageChart.tsx` usando recharts

---

## FASE 4: Dashboards e Analytics

### ÉPICO 4.1: Dashboard Admin da Empresa (Tenant)
**Objetivo:** Dashboard completo para admins de empresas gerenciarem sua organização.

#### User Story 4.1.1: CRUD de Colaboradores (Perfis)
- Criar/atualizar página `src/pages/TeamManagement.tsx` ou seção em Admin
- Listar todos os perfis da empresa (filtrar por `empresa_id`)
- Ações: Criar, Editar, Desativar, Deletar colaborador
- Formulário: nome, email, role (admin/user), status
- Validação: verificar limite `max_usuarios` antes de criar

**Artefatos:**
- `src/pages/TeamManagement.tsx`
- Componentes: `CreateUserDialog.tsx`, `EditUserDialog.tsx`

#### User Story 4.1.2: CRUD de Agentes de IA
- Criar/atualizar página `src/pages/AgentesIA.tsx` (pode integrar com `SpecialistAgents.tsx` existente)
- Listar agentes_ia da empresa
- Criar: formulário com nome, instruções (System Prompt), status
- Editar: atualizar instruções e nome
- Deletar: soft delete (status = 'inactive') ou hard delete com confirmação
- Validação: verificar limite `max_agentes`

**Artefatos:**
- `src/pages/AgentesIA.tsx`
- Componentes: `CreateAgenteDialog.tsx`, `EditAgenteDialog.tsx`

#### User Story 4.1.3: Métricas e Conversões do Dashboard Admin
- Seção de métricas em Dashboard Admin:
  - Total de conversas (abertas, fechadas, pendentes)
  - Tempo médio de resposta
  - Taxa de conversão (conversas → vendas, se aplicável)
  - Uso de recursos (mensagens, tokens) vs. plano
  - Gráficos de tendências (últimos 30 dias)
- Buscar dados agregados via Supabase queries ou criar view materializada

**Artefatos:**
- Atualizar `src/pages/Dashboard.tsx` ou criar `src/pages/AdminDashboard.tsx`
- Criar views SQL: `v_empresa_metrics`, `v_empresa_conversations_summary`

---

### ÉPICO 4.2: Dashboard Master Admin (Plataforma NUVIA)
**Objetivo:** Dashboard para administradores master gerenciarem toda a plataforma.

#### User Story 4.2.1: Visão geral de todos os tenants
- Criar página `src/pages/MasterAdmin.tsx` (ou atualizar `Admin.tsx` se for master-only)
- Tabela listando todas as empresas: nome, plano, status, data criação, último acesso
- Filtros: por plano, por status, por data
- Ações: ver detalhes, editar empresa, suspender/ativar

**Artefatos:**
- `src/pages/MasterAdmin.tsx`
- Componente `TenantsTable.tsx`

#### User Story 4.2.2: Monitoramento de planos e faturamento
- Seção em Master Admin:
  - Receita recorrente mensal (MRR) agregada
  - Distribuição de empresas por plano (gráfico pizza)
  - Empresas com pagamento pendente (integrar com Stripe)
  - Próximas renovações (próximos 7 dias)
- Buscar dados do Stripe via Edge Function ou cache local

**Artefatos:**
- Atualizar `src/pages/MasterAdmin.tsx`
- Edge Function `get-billing-overview/index.ts`

#### User Story 4.2.3: Auditoria de uso e ações
- Criar página `src/pages/AuditLog.tsx` ou seção em Master Admin
- Tabela de auditoria: user, empresa, ação, entidade, timestamp, IP
- Filtros: por empresa, por usuário, por tipo de ação, por período
- Exportar para CSV
- Buscar de `auditoria` com paginação

**Artefatos:**
- `src/pages/AuditLog.tsx`
- Componente `AuditLogTable.tsx`

#### User Story 4.2.4: Métricas globais da plataforma
- Dashboard com KPIs:
  - Total de empresas ativas
  - Total de usuários ativos
  - Total de mensagens processadas (mês atual)
  - Total de tokens consumidos (mês atual)
  - Taxa de crescimento (novas empresas/semana)
- Gráficos de tendências e comparações

**Artefatos:**
- Seção em `src/pages/MasterAdmin.tsx`
- Views SQL agregadas para performance

---

## FASE 5: Preparação para Lançamento

### ÉPICO 5.1: Testes End-to-End (E2E)
**Objetivo:** Garantir que todos os fluxos críticos funcionam corretamente antes do lançamento.

#### User Story 5.1.1: Setup de ferramenta de testes E2E
- Escolher ferramenta: Playwright (recomendado) ou Cypress
- Instalar dependências: `@playwright/test` ou `cypress`
- Configurar arquivos de configuração: `playwright.config.ts` ou `cypress.config.ts`
- Criar estrutura de testes: `tests/e2e/`

**Artefatos:**
- `package.json` (adicionar scripts de teste)
- `playwright.config.ts` ou `cypress.config.ts`
- `.github/workflows/e2e-tests.yml` (opcional, CI)

#### User Story 5.1.2: Testes E2E de autenticação e multi-tenancy
- Teste: Signup → criação de empresa → login
- Teste: Login como admin empresa A → não ver dados de empresa B
- Teste: Criação de perfil → verificar limite de usuários
- Teste: Troca de empresa (se usuário pertencer a múltiplas)

**Artefatos:**
- `tests/e2e/auth.spec.ts`
- `tests/e2e/multi-tenant.spec.ts`

#### User Story 5.1.3: Testes E2E de fluxo Stripe
- Teste: Navegar para página de planos → selecionar plano → checkout → sucesso
- Teste: Webhook do Stripe → verificar atualização de plano da empresa
- Teste: Cancelamento de assinatura → verificar downgrade
- Usar Stripe Test Mode e webhooks locais (Stripe CLI)

**Artefatos:**
- `tests/e2e/stripe.spec.ts`
- Documentação de setup Stripe Test Mode

#### User Story 5.1.4: Testes E2E de funcionalidades core
- Teste: Criar agente IA → usar em conversa → verificar processamento
- Teste: Enviar mensagem WhatsApp (mock) → verificar criação de conversa
- Teste: Dashboard admin → criar usuário → editar → deletar
- Teste: Cadastro de chave API BYOK → validação → uso em conversa

**Artefatos:**
- `tests/e2e/core-features.spec.ts`

---

### ÉPICO 5.2: Configuração CI/CD (Netlify)
**Objetivo:** Automatizar deploy e garantir qualidade de código em cada push.

#### User Story 5.2.1: Configurar build no Netlify
- Criar `netlify.toml` na raiz do projeto
- Configurar: build command (`pnpm build`), publish directory (`dist`), Node version
- Configurar variáveis de ambiente no Netlify Dashboard (VITE_SUPABASE_URL, etc.)
- Testar build local: `pnpm build`

**Artefatos:**
- `netlify.toml`

#### User Story 5.2.2: Integração contínua (CI) para Supabase
- Configurar GitHub Actions ou usar Supabase CI nativo
- Workflow: ao push em `main`, executar migrations automaticamente (usar MCP Supabase)
- Workflow: validar SQL migrations (syntax check)
- Workflow: deploy Edge Functions automaticamente

**Artefatos:**
- `.github/workflows/deploy-supabase.yml`
- Ou usar Supabase GitHub Integration

#### User Story 5.2.3: Preview Deploys e Branch Deploys
- Configurar Netlify para criar previews de PRs
- Configurar branch deploys para `develop` (staging) e `main` (production)
- Adicionar comentários automáticos em PRs com links de preview
- Documentar processo de deploy

**Artefatos:**
- Configuração no Netlify Dashboard
- `.github/workflows/netlify-preview.yml` (opcional)

#### User Story 5.2.4: Monitoramento e alertas pós-deploy
- Configurar Netlify Analytics (se disponível no plano)
- Integrar Sentry ou similar para error tracking (opcional)
- Configurar alertas de email se deploy falhar
- Documentar rollback procedure

**Artefatos:**
- Configurações de monitoramento
- `docs/deployment.md`

---

### ÉPICO 5.3: Go-Live e Checklist Final
**Objetivo:** Executar checklist completo antes do lançamento público.

#### User Story 5.3.1: Checklist de segurança
- [ ] Revisar todas as políticas RLS
- [ ] Verificar que nenhuma chave API está hardcoded
- [ ] Validar criptografia de dados sensíveis (chaves BYOK)
- [ ] Revisar headers de segurança (CORS, CSP)
- [ ] Testar rate limiting nas Edge Functions
- [ ] Validar sanitização de inputs em todos os forms

**Artefatos:**
- `docs/security-checklist.md` (preenchido)

#### User Story 5.3.2: Checklist de performance
- [ ] Otimizar queries SQL (adicionar índices onde necessário)
- [ ] Testar carga: simular 100 empresas simultâneas
- [ ] Validar cache de queries frequentes (se aplicável)
- [ ] Otimizar bundle size do frontend (analisar com `pnpm build --analyze`)
- [ ] Configurar CDN no Netlify (automático, verificar)

**Artefatos:**
- Relatório de performance
- Índices SQL adicionais se necessário

#### User Story 5.3.3: Checklist de documentação
- [ ] README.md atualizado com instruções de setup
- [ ] Documentação de API (Edge Functions) - criar `docs/api.md`
- [ ] Guia de deployment - `docs/deployment.md`
- [ ] Troubleshooting guide - `docs/troubleshooting.md`
- [ ] Changelog inicial - `CHANGELOG.md`

**Artefatos:**
- Documentação completa

#### User Story 5.3.4: Dados iniciais e seed
- [ ] Criar seed de planos Stripe (usar IDs de produção)
- [ ] Configurar plano "Free" como padrão para novos signups
- [ ] Criar usuário master admin inicial (via migration ou script)
- [ ] Validar fluxo de onboarding completo

**Artefatos:**
- `supabase/seed/production_seed.sql`
- Script de criação de admin master

#### User Story 5.3.5: Deploy em produção e smoke tests
- [ ] Deploy frontend no Netlify (production)
- [ ] Deploy migrations no Supabase (production)
- [ ] Deploy Edge Functions (production)
- [ ] Configurar webhook Stripe em produção (usar URL de produção)
- [ ] Smoke tests: login, criar empresa, assinar plano, usar IA
- [ ] Monitorar logs por 24h

**Artefatos:**
- Deploy completo
- Relatório de smoke tests

---

## Resumo de Dependências e Ordem de Execução

### Dependências entre Épicos:
1. **FASE 1** (Fundação) deve ser completada antes das outras
2. **FASE 2** (Stripe) depende de FASE 1 (precisa de `empresas` e `planos`)
3. **FASE 3** (Automação) depende de FASE 1 e 2
4. **FASE 4** (Dashboards) depende de FASE 1, 2 e 3
5. **FASE 5** (Lançamento) depende de todas as anteriores

### Priorização dentro de cada Fase:
- Dentro de cada ÉPICO, seguir ordem das User Stories (numeradas)
- User Stories marcadas como "críticas" devem ter prioridade

---

## Notas de Implementação

- **Migrações SQL**: Sempre criar migrations incrementais, nunca modificar migrations existentes
- **Edge Functions**: Usar Deno runtime, verificar tipos com `deno check`
- **Frontend**: Manter consistência com Shadcn UI já existente
- **Testes**: Priorizar testes E2E dos fluxos críticos (auth, billing, multi-tenant)
- **Segurança**: Sempre validar `empresa_id` em Edge Functions, nunca confiar apenas no frontend
- **Performance**: Usar índices SQL, paginação em listagens, lazy loading no frontend

---

## Próximos Passos

Após aprovação deste plano:
1. Iniciar com **ÉPICO 1.1: Migração do Modelo de Dados para o PRD**
2. Trabalhar em uma User Story por vez
3. Apresentar trabalho completo do ÉPICO antes de prosseguir
4. Aguardar aprovação antes de iniciar próximo ÉPICO
