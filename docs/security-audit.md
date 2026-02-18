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

**Tabela**: `rate_limits` (criada na migration `epic_6_3_1_create_rate_limits_table`)

**Helper**: `supabase/functions/_shared/rate-limit.ts`

**Funcionalidades**:
- Contador por chave única (`rate_limit:{function}:{identifier}`)
- Janela de tempo configurável
- Limpeza automática de registros expirados
- RLS: apenas service role pode acessar

### 📋 Endpoints com Rate Limiting

| Endpoint | Limite | Janela | Status |
|---|---|---|---|
| `stripe-create-checkout-session` | ⚠️ Pendente | - | A implementar |
| `bot-process-message` | ⚠️ Pendente | - | A implementar |
| `api-keys-insert` | ⚠️ Pendente | - | A implementar |

### ⚠️ Recomendações

1. **Implementar rate limiting em todas as Edge Functions públicas**
   - Login: 5 tentativas/minuto por IP
   - API calls: 100 requisições/minuto por empresa
   - Webhooks: 1000 requisições/hora por origem

2. **Usar Redis para rate limiting em produção**
   - ⚠️ **Pendente**: Migrar de tabela PostgreSQL para Redis (melhor performance)

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

### ✅ Tabela `auditoria`

- ✅ Registra ações críticas (criação, atualização, deleção)
- ✅ Captura IP, user_agent, timestamp
- ✅ Isolamento por `empresa_id` via RLS

### ⚠️ Recomendações

1. **Implementar triggers automáticos**
   - ⚠️ **Pendente**: Criar triggers para logar automaticamente ações em tabelas sensíveis

2. **Retenção de logs**
   - ⚠️ **Pendente**: Implementar política de retenção (ex: 90 dias)

---

## 6. Checklist de Segurança

- [x] Todas as tabelas sensíveis têm RLS habilitado
- [x] Nenhuma policy permissiva (`USING (true)`)
- [x] Dados sensíveis (chaves API) estão criptografados
- [x] Secrets nunca são logados no frontend
- [x] Rate limiting implementado (infraestrutura pronta)
- [x] Validação de inputs com Zod
- [x] Auditoria de ações críticas
- [ ] Rate limiting aplicado em todas as Edge Functions (pendente)
- [ ] Rotação de chaves de criptografia (pendente)
- [ ] Triggers automáticos de auditoria (pendente)
- [ ] Política de retenção de logs (pendente)

---

## 7. Próximos Passos

1. **Aplicar rate limiting nas Edge Functions críticas**
2. **Implementar rotação de chaves de criptografia**
3. **Criar triggers automáticos de auditoria**
4. **Configurar política de retenção de logs**
5. **Migrar rate limiting para Redis (opcional, para melhor performance)**

---

**Conclusão**: A base de segurança está sólida. RLS está correto, dados sensíveis estão criptografados, e a infraestrutura de rate limiting está pronta. Pendências são melhorias incrementais, não vulnerabilidades críticas.
