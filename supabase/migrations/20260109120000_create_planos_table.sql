-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.1
-- Criar tabela planos conforme PRD
-- =====================================================

-- Criar tabela planos
CREATE TABLE IF NOT EXISTS public.planos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  preco_mensal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  max_usuarios INTEGER NOT NULL DEFAULT 1,
  max_agentes INTEGER NOT NULL DEFAULT 1,
  limite_mensagens_mes INTEGER NOT NULL DEFAULT 1000,
  stripe_price_id TEXT UNIQUE,
  features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  cor TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_planos_nome ON public.planos(nome);
CREATE INDEX IF NOT EXISTS idx_planos_is_active ON public.planos(is_active);
CREATE INDEX IF NOT EXISTS idx_planos_stripe_price_id ON public.planos(stripe_price_id);

-- Habilitar RLS
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para planos
-- Todos usuários autenticados podem ler planos ativos
CREATE POLICY "Authenticated users can view active plans"
  ON public.planos FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Apenas master admins podem gerenciar planos (será implementado após sistema de roles)
-- Por enquanto, apenas admins podem inserir/atualizar
CREATE POLICY "Admins can manage plans"
  ON public.planos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger para updated_at
CREATE TRIGGER update_planos_updated_at
  BEFORE UPDATE ON public.planos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Inserir planos padrão
INSERT INTO public.planos (nome, preco_mensal, max_usuarios, max_agentes, limite_mensagens_mes, features, cor) VALUES
  (
    'Free',
    0.00,
    1,
    1,
    1000,
    '{"whatsapp": true, "instagram": false, "ia_basica": true, "suporte_email": true}'::jsonb,
    '#6B7280'
  ),
  (
    'Pro',
    99.00,
    5,
    3,
    10000,
    '{"whatsapp": true, "instagram": true, "ia_avancada": true, "suporte_prioritario": true, "relatorios": true}'::jsonb,
    '#3B82F6'
  ),
  (
    'Business',
    299.00,
    20,
    10,
    50000,
    '{"whatsapp": true, "instagram": true, "ia_avancada": true, "suporte_prioritario": true, "relatorios": true, "api_access": true, "white_label": false}'::jsonb,
    '#8B5CF6'
  ),
  (
    'Enterprise',
    999.00,
    100,
    50,
    200000,
    '{"whatsapp": true, "instagram": true, "ia_avancada": true, "suporte_prioritario": true, "relatorios": true, "api_access": true, "white_label": true, "dedicated_support": true}'::jsonb,
    '#F59E0B'
  )
ON CONFLICT (nome) DO NOTHING;

COMMENT ON TABLE public.planos IS 'Tabela de planos da plataforma NUVIA. Define limites e recursos por plano.';
COMMENT ON COLUMN public.planos.stripe_price_id IS 'ID do Price no Stripe para integração de pagamentos. Deve ser preenchido manualmente após criar no Stripe.';
