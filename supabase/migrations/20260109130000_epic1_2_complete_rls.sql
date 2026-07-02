-- =====================================================
-- ÉPICO 1.2 - Implementação Completa de RLS
-- User Stories: 1.2.1, 1.2.2, 1.2.3
-- =====================================================

-- =====================================================
-- US-1.2.3: Criar funções helper para RLS
-- =====================================================

-- Função para verificar se usuário é admin da empresa
CREATE OR REPLACE FUNCTION public.is_empresa_admin(p_empresa_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND empresa_id = p_empresa_id
    AND role IN ('admin', 'master')
  )
$$;

-- Função para verificar se usuário é master admin (admin da plataforma)
CREATE OR REPLACE FUNCTION public.is_master_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'master'
  )
$$;

-- Função para verificar se usuário pertence à empresa (já existe, mas vamos garantir)
-- Remover função antiga se existir com assinatura diferente
DROP FUNCTION IF EXISTS public.user_belongs_to_empresa(UUID, BIGINT);
DROP FUNCTION IF EXISTS public.user_belongs_to_empresa(user_id UUID, empresa_id_check BIGINT);

CREATE OR REPLACE FUNCTION public.user_belongs_to_empresa(p_user_id UUID, p_empresa_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = p_user_id
    AND empresa_id = p_empresa_id
  )
$$;

-- Comentários
COMMENT ON FUNCTION public.is_empresa_admin(BIGINT) IS 'Verifica se o usuário autenticado é admin da empresa especificada (role admin ou master).';
COMMENT ON FUNCTION public.is_master_admin() IS 'Verifica se o usuário autenticado é master admin (admin da plataforma).';
COMMENT ON FUNCTION public.user_belongs_to_empresa(UUID, BIGINT) IS 'Verifica se um usuário pertence à empresa especificada.';

-- =====================================================
-- US-1.2.1: Implementar RLS em empresas (tenants)
-- =====================================================

-- Remover TODAS as políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their own organization" ON public.empresas;
DROP POLICY IF EXISTS "Admins can manage all organizations" ON public.empresas;
DROP POLICY IF EXISTS "Users can view their own empresa" ON public.empresas;
DROP POLICY IF EXISTS "Users can view own empresa" ON public.empresas;
DROP POLICY IF EXISTS "Empresa admins can update own empresa" ON public.empresas;
DROP POLICY IF EXISTS "Empresa admins can update empresa" ON public.empresas;
DROP POLICY IF EXISTS "Master admins can create empresas" ON public.empresas;
DROP POLICY IF EXISTS "Master admins can delete empresas" ON public.empresas;
DROP POLICY IF EXISTS "Master admins can update all empresas" ON public.empresas;
DROP POLICY IF EXISTS "Master admins can view all empresas" ON public.empresas;

-- Política SELECT: usuários só veem sua própria empresa
CREATE POLICY "Users can view own empresa"
  ON public.empresas FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT empresa_id 
      FROM public.profiles 
      WHERE id = auth.uid()
      AND empresa_id IS NOT NULL
    )
  );

-- Política UPDATE: apenas admins da empresa podem atualizar
CREATE POLICY "Empresa admins can update empresa"
  ON public.empresas FOR UPDATE
  TO authenticated
  USING (public.is_empresa_admin(id))
  WITH CHECK (public.is_empresa_admin(id));

-- Política INSERT: apenas master admins podem criar empresas
CREATE POLICY "Master admins can create empresas"
  ON public.empresas FOR INSERT
  TO authenticated
  WITH CHECK (public.is_master_admin());

-- Política DELETE: apenas master admins podem deletar empresas
CREATE POLICY "Master admins can delete empresas"
  ON public.empresas FOR DELETE
  TO authenticated
  USING (public.is_master_admin());

-- =====================================================
-- US-1.2.2: Implementar RLS em todas as tabelas sensíveis
-- =====================================================

-- 1. PLANOS
-- Remover políticas antigas
DROP POLICY IF EXISTS "Authenticated users can view active plans" ON public.planos;
DROP POLICY IF EXISTS "Admins can manage plans" ON public.planos;

-- Todos usuários autenticados podem ler planos ativos
CREATE POLICY "Authenticated users can view active plans"
  ON public.planos FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Apenas master admins podem gerenciar planos
CREATE POLICY "Master admins can manage planos"
  ON public.planos FOR ALL
  TO authenticated
  USING (public.is_master_admin())
  WITH CHECK (public.is_master_admin());

-- 2. PROFILES
-- Remover políticas antigas
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem inserir perfis" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem atualizar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem deletar perfis" ON public.profiles;

-- Usuários podem ver próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuários podem ver perfis da mesma empresa
CREATE POLICY "Users can view empresa profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Master admins podem ver todos perfis
CREATE POLICY "Master admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_master_admin());

-- Usuários podem atualizar próprio perfil (limitado)
-- Nota: Não podemos usar OLD em políticas RLS, então a validação de empresa_id e role
-- deve ser feita via trigger ou no código da aplicação
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins da empresa podem atualizar perfis da empresa
CREATE POLICY "Empresa admins can update empresa profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
  )
  WITH CHECK (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
    -- Não permitir mudar para master
    AND role != 'master'
  );

-- Master admins podem inserir perfis
CREATE POLICY "Master admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_master_admin());

-- Admins da empresa podem inserir perfis na empresa (para convites)
CREATE POLICY "Empresa admins can insert empresa profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
    AND role != 'master'
  );

-- Master admins podem deletar perfis
CREATE POLICY "Master admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_master_admin());

-- Admins da empresa podem deletar perfis da empresa (exceto master)
CREATE POLICY "Empresa admins can delete empresa profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
    AND role != 'master'
  );

-- 3. AGENTES_IA
-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view agentes_ia" ON public.agentes_ia;
DROP POLICY IF EXISTS "Users can insert agentes_ia" ON public.agentes_ia;
DROP POLICY IF EXISTS "Users can update agentes_ia" ON public.agentes_ia;
DROP POLICY IF EXISTS "Users can delete agentes_ia" ON public.agentes_ia;

-- Usuários podem ver agentes da própria empresa
CREATE POLICY "Users can view empresa agentes_ia"
  ON public.agentes_ia FOR SELECT
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Master admins podem ver todos agentes
CREATE POLICY "Master admins can view all agentes_ia"
  ON public.agentes_ia FOR SELECT
  TO authenticated
  USING (public.is_master_admin());

-- Admins da empresa podem gerenciar agentes da empresa
CREATE POLICY "Empresa admins can manage empresa agentes_ia"
  ON public.agentes_ia FOR ALL
  TO authenticated
  USING (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
  )
  WITH CHECK (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
  );

-- 4. CONVERSAS (CONVERSATIONS)
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem gerenciar conversas" ON public.conversations;
DROP POLICY IF EXISTS "Agentes podem ver conversas atribuídas" ON public.conversations;
DROP POLICY IF EXISTS "Agentes podem atualizar conversas atribuídas" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Agents can update assigned conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;

-- Usuários podem ver conversas da própria empresa
CREATE POLICY "Users can view empresa conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Usuários podem ver conversas atribuídas a eles
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR assigned_agent_id IN (
      SELECT id FROM public.agents WHERE user_id = auth.uid()
    )
  );

-- Master admins podem ver todas conversas
CREATE POLICY "Master admins can view all conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (public.is_master_admin());

-- Usuários podem inserir conversas na própria empresa
CREATE POLICY "Users can insert empresa conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Usuários podem atualizar conversas da empresa (se atribuídas ou se forem admin)
CREATE POLICY "Users can update empresa conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND (
      user_id = auth.uid()
      OR assigned_agent_id IN (
        SELECT id FROM public.agents WHERE user_id = auth.uid()
      )
      OR public.is_empresa_admin(empresa_id)
    )
  )
  WITH CHECK (
    empresa_id = public.current_empresa_id()
    AND (
      user_id = auth.uid()
      OR assigned_agent_id IN (
        SELECT id FROM public.agents WHERE user_id = auth.uid()
      )
      OR public.is_empresa_admin(empresa_id)
    )
  );

-- Admins da empresa podem deletar conversas da empresa
CREATE POLICY "Empresa admins can delete empresa conversations"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (
    public.is_empresa_admin(empresa_id)
    AND empresa_id = public.current_empresa_id()
  );

-- 5. USO_RECURSOS
-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view uso_recursos" ON public.uso_recursos;
DROP POLICY IF EXISTS "Users can insert uso_recursos" ON public.uso_recursos;
DROP POLICY IF EXISTS "Users can update uso_recursos" ON public.uso_recursos;

-- Usuários podem ver uso da própria empresa
CREATE POLICY "Users can view empresa uso_recursos"
  ON public.uso_recursos FOR SELECT
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Master admins podem ver todos os usos
CREATE POLICY "Master admins can view all uso_recursos"
  ON public.uso_recursos FOR SELECT
  TO authenticated
  USING (public.is_master_admin());

-- Sistema pode inserir/atualizar uso (via Edge Functions com service role)
-- Não criamos política INSERT/UPDATE para usuários normais
-- Edge Functions usarão service role que bypassa RLS

-- 6. AUDITORIA
-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view auditoria" ON public.auditoria;
DROP POLICY IF EXISTS "Users can insert auditoria" ON public.auditoria;

-- Usuários podem ver auditoria da própria empresa
CREATE POLICY "Users can view empresa auditoria"
  ON public.auditoria FOR SELECT
  TO authenticated
  USING (
    empresa_id = public.current_empresa_id()
    AND empresa_id IS NOT NULL
  );

-- Master admins podem ver toda auditoria
CREATE POLICY "Master admins can view all auditoria"
  ON public.auditoria FOR SELECT
  TO authenticated
  USING (public.is_master_admin());

-- Sistema pode inserir auditoria (via Edge Functions)
CREATE POLICY "System can insert auditoria"
  ON public.auditoria FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. MESSAGES (já tem RLS, mas vamos atualizar para usar empresa_id)
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem gerenciar mensagens" ON public.messages;
DROP POLICY IF EXISTS "Agentes podem ver mensagens de suas conversas" ON public.messages;
DROP POLICY IF EXISTS "Agentes podem inserir mensagens" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;

-- Usuários podem ver mensagens de conversas da empresa
CREATE POLICY "Users can view empresa messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND c.empresa_id = public.current_empresa_id()
      AND c.empresa_id IS NOT NULL
    )
  );

-- Usuários podem inserir mensagens em conversas da empresa
CREATE POLICY "Users can insert empresa messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND c.empresa_id = public.current_empresa_id()
      AND c.empresa_id IS NOT NULL
    )
  );

-- 8. AGENTS (atualizar para usar empresa_id via profiles)
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem gerenciar agentes" ON public.agents;
DROP POLICY IF EXISTS "Agentes podem ver próprio perfil" ON public.agents;
DROP POLICY IF EXISTS "Agentes podem atualizar próprio status" ON public.agents;
DROP POLICY IF EXISTS "Users can view agents" ON public.agents;
DROP POLICY IF EXISTS "Users can update own agent" ON public.agents;
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;

-- Usuários podem ver agentes da própria empresa
CREATE POLICY "Users can view empresa agents"
  ON public.agents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = agents.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND p.empresa_id IS NOT NULL
    )
  );

-- Usuários podem ver próprio agente
CREATE POLICY "Users can view own agent"
  ON public.agents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Usuários podem atualizar próprio agente
CREATE POLICY "Users can update own agent"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins da empresa podem gerenciar agentes da empresa
CREATE POLICY "Empresa admins can manage empresa agents"
  ON public.agents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = agents.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND public.is_empresa_admin(p.empresa_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = agents.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND public.is_empresa_admin(p.empresa_id)
    )
  );

-- 9. WHATSAPP_CONFIG (atualizar para usar empresa_id)
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem gerenciar config WhatsApp" ON public.whatsapp_config;
DROP POLICY IF EXISTS "Users can view own whatsapp config" ON public.whatsapp_config;
DROP POLICY IF EXISTS "Users can insert own whatsapp config" ON public.whatsapp_config;
DROP POLICY IF EXISTS "Users can update own whatsapp config" ON public.whatsapp_config;
DROP POLICY IF EXISTS "Users can delete own whatsapp config" ON public.whatsapp_config;

-- Usuários podem ver config da própria empresa (via user_id -> profiles -> empresa_id)
CREATE POLICY "Users can view empresa whatsapp_config"
  ON public.whatsapp_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = whatsapp_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND p.empresa_id IS NOT NULL
    )
  );

-- Usuários podem gerenciar config da própria empresa
CREATE POLICY "Users can manage empresa whatsapp_config"
  ON public.whatsapp_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = whatsapp_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND (
        p.id = auth.uid()
        OR public.is_empresa_admin(p.empresa_id)
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = whatsapp_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND (
        p.id = auth.uid()
        OR public.is_empresa_admin(p.empresa_id)
      )
    )
  );

-- 10. BOT_CONFIG (atualizar para usar empresa_id)
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem gerenciar bot config" ON public.bot_config;

-- Usuários podem ver bot_config da própria empresa
CREATE POLICY "Users can view empresa bot_config"
  ON public.bot_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = bot_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND p.empresa_id IS NOT NULL
    )
  );

-- Admins da empresa podem gerenciar bot_config da empresa
CREATE POLICY "Empresa admins can manage empresa bot_config"
  ON public.bot_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = bot_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND public.is_empresa_admin(p.empresa_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = bot_config.user_id
      AND p.empresa_id = public.current_empresa_id()
      AND public.is_empresa_admin(p.empresa_id)
    )
  );

-- Comentários finais
COMMENT ON FUNCTION public.is_empresa_admin(BIGINT) IS 'Verifica se o usuário autenticado é admin da empresa especificada. Usado em políticas RLS.';
COMMENT ON FUNCTION public.is_master_admin() IS 'Verifica se o usuário autenticado é master admin (admin da plataforma). Usado em políticas RLS.';
