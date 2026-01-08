# **Documento de Requisitos do Produto (PRD) – Versão Final**

## **Nome do Projeto:** **NUVIA Customer Cloud**

---

## **1. Visão Geral (Overview)**

A **Nuvia Customer Cloud** é uma plataforma **SaaS multi-tenant**, criada para centralizar **atendimento, dados de clientes, automação e crescimento**, utilizando Inteligência Artificial como motor estratégico de performance.

A Nuvia permite que **empresas (tenants)** se cadastrem, gerenciem seus times, atendam clientes via **WhatsApp e Instagram**, utilizem **Agentes de IA personalizados** e escalem resultados com o módulo **Nuvia Meta Growth AI (Ads)** — tudo em um único ecossistema.

A plataforma foi projetada desde a base para ser **segura, escalável e orientada a dados**, conectando **conversas → leads → vendas → anúncios → ROI real**.

---

### **Pilares do Produto**

- **Arquitetura Multi-tenant Segura (RLS):**
    
    Isolamento total de dados entre empresas, garantindo segurança e compliance.
    
- **Customer Cloud Unificado:**
    
    Atendimento, IA, automação, anúncios e métricas em um único ambiente.
    
- **IA Aplicada ao Crescimento:**
    
    Uso de Agentes de IA para atendimento, qualificação, suporte e otimização de campanhas.
    
- **Gestão Completa por Perfis:**
    
    Dashboards distintos para:
    
    - **Admin Master da Plataforma (NUVIA)**
    - **Admins das Empresas (Tenants)**
    - **Colaboradores**

---

## **2. Metas do Produto**

- Implementar **multi-tenancy segura** com Row-Level Security (RLS)
- Centralizar **atendimento omnichannel** (WhatsApp e Instagram)
- Permitir criação e gestão de **Agentes de IA personalizados por empresa**
- Integrar o **Nuvia Meta Growth AI (Ads)** para criação, otimização e mensuração de anúncios
- Implementar **modelo SaaS escalável** com planos e limites claros
- Criar dashboards completos de **performance, conversão e ROI**
- Garantir **segurança de dados e compliance (LGPD)**
- Automatizar comunicações críticas (onboarding, alertas, billing)

---

## **3. Stack Tecnológica e Integrações**

- **Framework Frontend:** React + Vite
- **Roteamento:** React Router DOM
- **Desenvolvimento:** Cursor + VSCode
- **Banco de Dados & Auth:** Supabase (PostgreSQL, Auth, RLS, Storage)
- **Pagamentos:** Stripe (Assinaturas SaaS, Webhooks)
- **E-mails Transacionais:** Brevo
- **IA / LLM:** OpenAI / Claude (via integração segura)
- **Hosting / CI-CD:** Netlify
- **UI / Design System:** Shadcn UI

---

## **4. Páginas e Funcionalidades Essenciais**

### **Aquisição e Acesso**

- **Landing Page / Página de Vendas**
    
    Apresentação da Nuvia, diferenciais e planos.
    
- **Autenticação (Login / Cadastro)**
    
    Criação de empresa (tenant) e usuários.
    

### **Ambiente do Usuário**

- **Dashboard do Colaborador**
    
    Acesso a atendimentos, IA e histórico.
    
- **Central de Atendimento**
    
    WhatsApp e Instagram integrados.
    
- **Chat com Agentes de IA**
    
    Atendimento automatizado e assistido.
    

### **Admin da Empresa (Tenant)**

- **Admin Dashboard da Empresa**
    - Gerenciar colaboradores (CRUD)
    - Criar e configurar Agentes de IA
    - Definir contexto e regras da IA
    - Visualizar métricas e conversões
- **Nuvia Meta Growth AI (Ads)**
    - Criação automática de anúncios
    - Integração com WhatsApp/Instagram
    - Otimização de campanhas e orçamento
    - ROI real por conversa e venda

### **Admin Master (Plataforma Nuvia)**

- **Dashboard Master**
    - Visão geral de todos os tenants
    - Monitoramento de planos e faturamento
    - Auditoria de uso e ações
    - Métricas globais da plataforma

### **Outros Módulos**

- **Faturamento & Assinaturas (Stripe)**
- **Controle de Limites e Uso**
- **Sistema de Auditoria Completo**

---

## **5. Modelo de Dados (Data Model)**

**Padrões:**

- PK: int8 (Bigint)
- Timestamps: TIMESTAMPTZ
- Segurança baseada em `empresa_id` (RLS)

---

### **Tabela: planos**

Define os planos da Nuvia.

- id (PK)
- nome
- preco_mensal
- max_usuarios
- max_agentes
- limite_mensagens_mes
- stripe_price_id (UNIQUE)
- features, is_active, cor, created_at, updated_at

---

### **Tabela: empresas (Tenants)**

Empresas clientes da Nuvia.

- id (PK)
- nome
- plano_id (FK → planos)
- contexto_ia (JSONB)
- stripe_customer_id
- status, is_active, created_at, updated_at

---

### **Tabela: perfis (Usuários)**

Usuários vinculados às empresas.

- id (PK / FK → auth.users)
- empresa_id (FK → empresas)
- role (master, admin, user)
- dados de perfil e timestamps

---

### **Tabela: agentes_ia**

Agentes de IA customizados por empresa.

- id (PK)
- empresa_id (FK)
- nome
- instrucoes (System Prompt)
- created_by
- status e timestamps

---

### **Tabela: conversas**

Histórico de atendimentos e chats.

- id (PK)
- conversation_uuid
- empresa_id
- user_id
- agente_id
- mensagens (JSONB)
- tokens_usados, status, timestamps

---

### **Tabela: uso_recursos**

Controle de consumo mensal.

- id (PK)
- empresa_id
- mes_referencia
- mensagens_enviadas
- tokens_consumidos
- created_at, updated_at

---

### **Tabela: auditoria**

Logs administrativos e rastreabilidade.

- id (PK)
- user_id
- empresa_id
- acao
- entidade_tipo
- entidade_id
- ip_address, user_agent, created_at

---

## **6. Segurança e Compliance**

### **Requisitos de Segurança**

- Row-Level Security (RLS) em todas as tabelas sensíveis
- Criptografia de dados críticos
- Auditoria completa de ações
- Rate limiting por empresa
- Validação e sanitização de inputs

### **Compliance**

- LGPD
- PCI DSS (Stripe)
- Boas práticas de segurança SaaS