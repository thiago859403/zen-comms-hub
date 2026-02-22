# Checklist Pré Go-Live — Nuvia Customer Cloud

**Última atualização:** 2026-02-22  
**Status:** 🚧 **GO-LIVE PENDING — AGUARDANDO CRM COMERCIAL**

---

## ✅ Infraestrutura

- [x] Variáveis de ambiente configuradas (Netlify + Supabase)
- [x] Sentry ativo e capturando erros
- [x] Contexto de usuário/empresa nos relatórios Sentry
- [x] Filtragem automática de tokens/secrets no Sentry
- [x] Edge Functions deployadas e ACTIVE (9 funções)
- [x] Rate limiting validado em todas as Edge Functions críticas
- [x] Audit Log automático funcionando (triggers em 4 tabelas)
- [x] Mascaramento de dados sensíveis nos logs
- [x] Tabela `rate_limits` criada e operacional
- [x] Tabela `audit_log` criada com índices e RLS
- [x] Frontend buildando sem erros (`pnpm build`)
- [x] Netlify deploy funcional

---

## ✅ Segurança

- [x] RLS habilitado em todas as tabelas públicas
- [x] Nenhuma policy permissiva (`USING (true)`) em tabelas sensíveis
- [x] Chaves API criptografadas (AES-256 + SHA-256 hash)
- [x] Secrets nunca logados no frontend ou backend
- [x] Webhooks protegidos por verificação de assinatura (Stripe HMAC SHA-256)
- [x] Webhooks protegidos por rate limiting (60 req/min por IP)
- [x] Endpoints sensíveis com rate limit restritivo (10 req/min)
- [x] `mask_sensitive_jsonb()` ativo no audit log
- [x] Função `audit_log_trigger()` com `SECURITY DEFINER` e `search_path` fixo
- [x] Nenhum service_role key exposto ao frontend

---

## ✅ Testes

- [x] Testes E2E configurados (Playwright)
- [x] Fluxos críticos testados (`critical-flows.spec.ts`)
- [x] Integração Stripe testada (`stripe-integration.spec.ts`)

---

## ✅ Documentação

- [x] `docs/security-audit.md` — Auditoria de segurança completa
- [x] `docs/user-guide.md` — Guia do usuário
- [x] `docs/technical-docs.md` — Documentação técnica
- [x] `docs/go-live-checklist.md` — Este checklist
- [x] `docs/stripe-setup.md` — Configuração do Stripe
- [x] `docs/prd.md` — Product Requirements Document

---

## 🚧 PENDENTE — CRM COMERCIAL

> ⛔ **GO-LIVE BLOQUEADO** até que os itens abaixo sejam concluídos:

### Módulo CRM Comercial
- [ ] Tabelas de CRM criadas (`conversations`, `messages`, `contacts`, `whatsapp_config`)
- [ ] CRUD completo de contatos
- [ ] Importação de contatos via CSV
- [ ] Pipeline de vendas com etapas configuráveis
- [ ] Dashboard de métricas do CRM

### Integração WhatsApp Operacional
- [ ] Interface de chat no frontend
- [ ] Fluxo completo: receber mensagem → exibir no chat → responder
- [ ] Configuração de WhatsApp Business pelo admin
- [ ] Histórico de conversas por contato

### Fluxo Conversa → Cliente → CRM
- [ ] Conversas vinculadas a contatos do CRM
- [ ] Criação automática de contato ao receber mensagem
- [ ] Visualização de histórico de interações por cliente
- [ ] Transferência bot → humano funcional na UI

### Flow Builder
- [ ] Editor visual de fluxos de automação funcional
- [ ] Execução de fluxos vinculada a triggers

### Triggers de Audit Log (tabelas futuras)
- [ ] Triggers em `conversations` (quando criada)
- [ ] Triggers em `messages` (quando criada)
- [ ] Triggers em `whatsapp_config` (quando criada)

---

## 🔜 Recomendações Pré Go-Live

### Segurança
- [ ] Habilitar Leaked Password Protection no Supabase Auth
- [ ] Implementar rotação periódica de chaves de criptografia
- [ ] Adicionar policy RLS na tabela `user_roles`
- [ ] Implementar política de retenção de logs (ex: 90 dias)

### Performance
- [ ] Avaliar migração de rate limiting para Redis (se necessário)
- [ ] Configurar cache headers no Netlify para assets estáticos
- [ ] Monitorar latência de Edge Functions em produção

### Operacional
- [ ] Configurar alertas de billing no Stripe
- [ ] Definir processo de on-call para incidentes
- [ ] Configurar backups automatizados (Supabase provê por padrão)
- [ ] Documentar runbook de incidentes

---

## Status Atual da Plataforma

| Item | Status |
|---|---|
| **Status geral** | 🟡 Pré-Produção Técnica |
| **Go-Live** | ❌ Pendente |
| **Bloqueador principal** | CRM Comercial + Integração WhatsApp |
| **Infraestrutura** | ✅ Pronta |
| **Segurança** | ✅ Implementada |
| **Backend (Edge Functions)** | ✅ Deployado e operacional |
| **Frontend** | 🟡 Parcial (funcionalidades core ok, CRM pendente) |
| **Testes** | 🟡 Parcial (fluxos existentes testados) |
| **Documentação** | ✅ Atualizada |

---

> 🚧 **Este documento será atualizado conforme os itens pendentes forem concluídos.**  
> O Go-Live será executado somente após todos os bloqueadores serem resolvidos e validados.
