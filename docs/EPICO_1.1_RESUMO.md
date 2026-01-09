# ÉPICO 1.1 - Resumo da Implementação

## Status: ✅ COMPLETO

### Objetivo
Migração do modelo de dados atual para o modelo do PRD, criando as tabelas base (`planos`, `empresas`, `agentes_ia`, `uso_recursos`, `auditoria`) e atualizando tabelas existentes (`perfis`, `conversas`).

---

## User Stories Implementadas

### ✅ User Story 1.1.1: Criar tabela `planos` e dados iniciais
**Arquivo:** `supabase/migrations/20260109120000_create_planos_table.sql`

**Implementado:**
- Tabela `planos` com todos os campos do PRD (BIGINT id, nome, preco_mensal, max_usuarios, max_agentes, limite_mensagens_mes, stripe_price_id, features JSONB, is_active, cor)
- RLS habilitado com políticas: usuários autenticados podem ler planos ativos, admins podem gerenciar
- 4 planos padrão inseridos: Free, Pro, Business, Enterprise com configurações de limites e features
- Índices criados para performance (nome, is_active, stripe_price_id)
- Trigger para updated_at

---

### ✅ User Story 1.1.2: Criar tabela `empresas` e migrar dados
**Arquivo:** `supabase/migrations/20260109120001_create_empresas_table.sql`

**Implementado:**
- Tabela `empresas` conforme PRD (BIGINT id, nome, plano_id FK, contexto_ia JSONB, stripe_customer_id, status, is_active)
- Script de migração automática: converte `organizations` (UUID) → `empresas` (BIGINT)
- Mapeamento de planos antigos (text: 'free', 'pro', etc.) para novos IDs da tabela `planos`
- Tabela de mapeamento `org_to_empresa_mapping` criada para rastreamento da migração
- RLS habilitado (políticas serão criadas no ÉPICO 1.2)
- Índices criados (nome, plano_id, status, is_active, stripe_customer_id)

**Nota:** `organizations` é mantida temporariamente para compatibilidade.

---

### ✅ User Story 1.1.3: Atualizar tabela `perfis` para modelo PRD
**Arquivo:** `supabase/migrations/20260109120002_update_perfis_for_prd.sql`

**Implementado:**
- Adicionado enum value 'master' ao `app_role`
- Coluna `empresa_id` (BIGINT FK → empresas) adicionada
- Coluna `role` adicionada diretamente na tabela (valores: 'master', 'admin', 'user')
- Migração automática de dados: `org_id` → `empresa_id` via tabela de mapeamento
- Migração de roles: perfis com role 'admin' no sistema `user_roles` são atualizados
- Funções helper criadas:
  - `current_empresa_id()` - retorna empresa_id do usuário atual
  - `user_belongs_to_empresa(user_id, empresa_id)` - valida pertencimento
- Índices criados (empresa_id, role, empresa_id+role)

**Nota:** `empresa_id` ainda permite NULL para migração gradual. Será NOT NULL após confirmação.

---

### ✅ User Story 1.1.4: Criar tabela `agentes_ia`
**Arquivo:** `supabase/migrations/20260109120003_create_agentes_ia_table.sql`

**Implementado:**
- Tabela `agentes_ia` conforme PRD (BIGINT id, empresa_id FK, nome, instrucoes TEXT, created_by FK, status, timestamps)
- Constraint UNIQUE (empresa_id, nome) para evitar nomes duplicados por empresa
- RLS habilitado (políticas serão criadas no ÉPICO 1.2)
- Índices criados (empresa_id, status, created_by)
- Trigger para updated_at

---

### ✅ User Story 1.1.5: Atualizar tabela `conversas` para modelo PRD
**Arquivo:** `supabase/migrations/20260109120004_update_conversas_for_prd.sql`

**Implementado:**
- Campos adicionados: `conversation_uuid`, `empresa_id`, `user_id`, `agente_id` (FK → agentes_ia), `mensagens` JSONB, `tokens_usados`
- Migração automática de `empresa_id` via dois métodos:
  1. Via `assigned_agent_id` → `agents` → `profiles` → `empresa_id`
  2. Via `metadata->>'user_id'` → `profiles` → `empresa_id`
- `conversation_uuid` preenchido com `id` para registros existentes
- Índices criados (empresa_id, user_id, agente_id, conversation_uuid)
- Índice GIN para busca em `mensagens` JSONB

**Nota:** Campos antigos mantidos para compatibilidade (assigned_agent_id, contact_name, etc.)

---

### ✅ User Story 1.1.6: Criar tabela `uso_recursos`
**Arquivo:** `supabase/migrations/20260109120005_create_uso_recursos_table.sql`

**Implementado:**
- Tabela `uso_recursos` conforme PRD (BIGINT id, empresa_id FK, mes_referencia DATE, mensagens_enviadas, tokens_consumidos, timestamps)
- Constraint UNIQUE (empresa_id, mes_referencia) - uma linha por empresa/mês
- Funções helper criadas:
  - `get_or_create_uso_recursos_current_month(empresa_id)` - obtém ou cria registro do mês atual
  - `increment_uso_recursos(empresa_id, mensagens, tokens)` - incrementa contadores (faz upsert)
- RLS habilitado (políticas serão criadas no ÉPICO 1.2)
- Índices criados (empresa_id, mes_referencia, empresa_id+mes_referencia)

---

### ✅ User Story 1.1.7: Criar/Atualizar tabela `auditoria`
**Arquivo:** `supabase/migrations/20260109120006_create_auditoria_table.sql`

**Implementado:**
- Tabela `auditoria` genérica conforme PRD (BIGINT id, user_id, empresa_id, acao, entidade_tipo, entidade_id, ip_address, user_agent, metadata JSONB, created_at)
- Função helper `log_auditoria()` para facilitar registro de ações
- Migração de dados: `conversation_audit` → `auditoria` (mantendo conversation_audit para compatibilidade)
- Índices criados para consultas frequentes (user_id, empresa_id, acao, entidade_tipo, entidade, created_at, empresa+created_at)
- RLS habilitado (políticas serão criadas no ÉPICO 1.2)

---

## Arquivos Criados

1. `supabase/migrations/20260109120000_create_planos_table.sql`
2. `supabase/migrations/20260109120001_create_empresas_table.sql`
3. `supabase/migrations/20260109120002_update_perfis_for_prd.sql`
4. `supabase/migrations/20260109120003_create_agentes_ia_table.sql`
5. `supabase/migrations/20260109120004_update_conversas_for_prd.sql`
6. `supabase/migrations/20260109120005_create_uso_recursos_table.sql`
7. `supabase/migrations/20260109120006_create_auditoria_table.sql`

---

## Decisões de Design

### 1. Compatibilidade com Dados Existentes
- Tabelas antigas (`organizations`, campos antigos em `conversas`) foram mantidas temporariamente
- Migração de dados automática sempre que possível
- Campos podem ser NULL inicialmente para migração gradual

### 2. Tipos de Dados
- IDs principais usando BIGSERIAL/BIGINT conforme PRD (exceto onde já existiam UUIDs como `conversations.id`)
- JSONB para campos flexíveis (features, contexto_ia, mensagens, metadata)

### 3. Funções Helper
- Criadas funções auxiliares para facilitar uso futuro (`current_empresa_id`, `increment_uso_recursos`, `log_auditoria`)
- Funções com `SECURITY DEFINER` para garantir contexto correto

### 4. Índices
- Índices criados para campos de busca frequente e FKs
- Índice GIN para campos JSONB grandes (mensagens)

---

## Próximos Passos (ÉPICO 1.2)

As políticas RLS completas serão implementadas no ÉPICO 1.2, incluindo:
- RLS para `empresas` com isolamento total
- RLS para `perfis` multi-tenant
- RLS para todas as tabelas de negócio (`agentes_ia`, `conversas`, `uso_recursos`, `auditoria`)
- Funções auxiliares e triggers para garantir contexto de empresa

---

## Observações Importantes

1. **Migração de Dados:** As migrations incluem scripts de migração automática, mas recomenda-se testar em ambiente de staging primeiro.

2. **Stripe Price IDs:** Os planos foram criados sem `stripe_price_id`. Esses IDs devem ser preenchidos manualmente após criar os produtos/prices no Stripe Dashboard.

3. **Master Admin:** O sistema de roles inclui 'master', mas ainda não há lógica específica para identificar master admins. Isso será implementado no ÉPICO 1.3.

4. **RLS Temporário:** As políticas RLS são básicas ou estão comentadas. O ÉPICO 1.2 implementará RLS completo conforme PRD.

---

## Testes Recomendados

Antes de aplicar em produção, testar:
1. Aplicar migrations em ordem
2. Verificar migração de `organizations` → `empresas`
3. Verificar migração de `org_id` → `empresa_id` em perfis
4. Validar constraints e índices
5. Testar funções helper (`get_or_create_uso_recursos_current_month`, `increment_uso_recursos`, `log_auditoria`)

---

**Data de Conclusão:** 09/01/2025  
**Status:** ✅ PRONTO PARA REVISÃO
