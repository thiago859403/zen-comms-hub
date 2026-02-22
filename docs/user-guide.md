# Guia do Usuário — Nuvia Customer Cloud

**Versão:** 0.9 (Pré-Go-Live)  
**Última atualização:** 2026-02-22  
**Status:** 🚧 GO-LIVE PENDING — AGUARDANDO CRM COMERCIAL

---

## 1. Sobre a Nuvia

A **Nuvia Customer Cloud** é uma plataforma omnichannel de atendimento ao cliente e automação comercial, projetada para empresas que precisam centralizar comunicação, gestão de clientes e processos de vendas em um único lugar.

### Principais características

- **Plataforma omnichannel** — Centralização de comunicação via WhatsApp, email e outros canais (em implantação).
- **Gestão de clientes** — Organização de contatos, conversas e histórico de atendimento.
- **Automação inteligente** — Bot com IA (BYOK — Bring Your Own Key), fluxos visuais e respostas automáticas por palavras-chave.
- **Multi-empresa (multi-tenant)** — Cada empresa opera de forma isolada, com seus próprios dados, usuários e configurações.
- **Segurança robusta** — RLS (Row-Level Security), criptografia de chaves API, rate limiting, auditoria automática e mascaramento de dados sensíveis.

---

## 2. Onboarding Inicial

### 2.1 Cadastro e Login

1. Acesse a plataforma Nuvia.
2. Clique em **"Criar conta"**.
3. Preencha seu email e senha.
4. Confirme seu email através do link enviado.
5. Ao fazer o primeiro login, uma empresa será criada automaticamente para você.

### 2.2 Criação de Empresa

- Ao se cadastrar, uma **empresa** é criada automaticamente vinculada à sua conta.
- Você será o **administrador (admin)** dessa empresa.
- A empresa recebe o **plano Free** por padrão, que pode ser atualizado nas configurações.

### 2.3 Convite de Usuários

Administradores podem convidar novos membros para a empresa:

1. Acesse **Configurações** → **Equipe**.
2. Clique em **"Convidar membro"**.
3. Informe o email e o papel (admin ou usuário).
4. O convidado receberá um email com link para aceitar o convite.

**Papéis disponíveis:**

| Papel | Permissões |
|---|---|
| **Master** | Acesso total à plataforma (superadmin) |
| **Admin** | Gerencia empresa, usuários, configurações e chaves API |
| **Usuário** | Acesso às funcionalidades operacionais da empresa |

### 2.4 Estrutura Básica do Sistema

O sistema é organizado em torno dos seguintes conceitos:

- **Empresa** — Unidade organizacional isolada. Todos os dados pertencem a uma empresa.
- **Perfil (Profile)** — Cada usuário tem um perfil vinculado a uma empresa.
- **Plano** — Define limites de uso (usuários, agentes IA, mensagens/mês).
- **Agentes IA** — Bots configuráveis com instruções personalizadas para atendimento automático.
- **Conversas** — Interações com clientes via canais de comunicação.
- **Mensagens** — Mensagens trocadas dentro de conversas.

> **Nota:** Algumas funcionalidades de conversas e mensagens estarão plenamente disponíveis após a ativação do módulo CRM Comercial e integração completa do WhatsApp.

---

## 3. Funcionalidades Disponíveis Atualmente

### ✅ Autenticação e Autorização
- Login/cadastro seguro via Supabase Auth
- Confirmação de email obrigatória
- Sessões protegidas por JWT

### ✅ Multi-tenant (Multi-empresa)
- Isolamento completo de dados por empresa
- Row-Level Security (RLS) em todas as tabelas
- Cada empresa possui seu próprio contexto de dados

### ✅ Sistema de Convites
- Convite de membros por email
- Definição de papéis (admin/usuário)
- Validação de limites do plano (máx. usuários)

### ✅ Gestão de Planos e Assinaturas
- Planos Free, Starter, Professional, Enterprise
- Integração com Stripe para checkout e portal de pagamentos
- Controle de limites por plano

### ✅ Integrações Backend (Edge Functions)
- 9 Edge Functions ativas no Supabase
- Integração com WhatsApp Business API (backend pronto)
- Integração com Stripe (checkout, portal, webhooks, faturas)
- Processamento de bot com IA multi-provider (OpenAI, Anthropic, Google)

### ✅ Chaves API (BYOK)
- Armazenamento criptografado (AES-256) de chaves API
- Modelo BYOK — cada empresa traz suas próprias chaves de IA
- Gerenciamento por admins da empresa

### ✅ Segurança e Auditoria
- Rate limiting em todas as Edge Functions críticas
- Audit Log automático via triggers (tabelas: empresas, profiles, api_keys, agentes_ia)
- Mascaramento automático de dados sensíveis nos logs
- RLS em todas as tabelas

### ✅ Monitoramento de Erros
- Sentry integrado para captura de erros
- Contexto de usuário/empresa nos relatórios
- Filtragem automática de tokens/secrets

---

## 4. Limitações Atuais

### 🚧 Funcionalidades em implantação

As seguintes funcionalidades serão disponibilizadas nas próximas versões:

| Funcionalidade | Status | Observação |
|---|---|---|
| **CRM Comercial** | 🚧 Em desenvolvimento | Módulo de gestão de clientes e pipeline |
| **Gestão completa de contatos** | 🚧 Em desenvolvimento | Cadastro, importação CSV, histórico |
| **Pipeline de vendas** | 🚧 Em desenvolvimento | Funil com etapas configuráveis |
| **Atendimento WhatsApp integrado** | 🚧 Backend pronto | Interface de chat e fluxo completo pendentes |
| **Flow Builder visual** | 🚧 Em desenvolvimento | Editor visual de fluxos de automação |
| **Dashboard de métricas** | 🚧 Parcial | Dados de uso disponíveis, painéis em evolução |

### Observações

- As Edge Functions de WhatsApp e bot já estão deployadas e funcionais no backend.
- A integração completa (frontend ↔ WhatsApp ↔ CRM) será ativada junto com o módulo CRM.
- O Go-Live público será realizado **após** a conclusão do CRM Comercial.

---

## 5. Suporte

Para dúvidas ou problemas técnicos:

- Consulte a documentação técnica em `docs/technical-docs.md`
- Verifique o status de segurança em `docs/security-audit.md`
- Consulte o troubleshooting em `docs/TROUBLESHOOTING_SIGNUP.md`

---

> 🚧 **Este guia será expandido conforme novas funcionalidades forem liberadas.** A versão completa será publicada junto com o Go-Live da plataforma.
