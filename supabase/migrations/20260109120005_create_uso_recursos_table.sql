-- =====================================================
-- ÉPICO 1.1 - User Story 1.1.6
-- Criar tabela uso_recursos para controle de consumo mensal
-- =====================================================

-- Criar tabela uso_recursos
CREATE TABLE IF NOT EXISTS public.uso_recursos (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL, -- Primeiro dia do mês (YYYY-MM-01)
  mensagens_enviadas INTEGER DEFAULT 0 NOT NULL,
  tokens_consumidos BIGINT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Garantir um único registro por empresa/mês
  CONSTRAINT unique_empresa_mes UNIQUE (empresa_id, mes_referencia)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_uso_recursos_empresa_id ON public.uso_recursos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_uso_recursos_mes_referencia ON public.uso_recursos(mes_referencia);
CREATE INDEX IF NOT EXISTS idx_uso_recursos_empresa_mes ON public.uso_recursos(empresa_id, mes_referencia DESC);

-- Habilitar RLS (políticas serão criadas no ÉPICO 1.2)
ALTER TABLE public.uso_recursos ENABLE ROW LEVEL SECURITY;

-- Trigger para updated_at
CREATE TRIGGER update_uso_recursos_updated_at
  BEFORE UPDATE ON public.uso_recursos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Função helper para obter ou criar registro de uso do mês atual
CREATE OR REPLACE FUNCTION public.get_or_create_uso_recursos_current_month(p_empresa_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mes_referencia DATE;
  v_uso_id BIGINT;
BEGIN
  -- Primeiro dia do mês atual
  v_mes_referencia := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  -- Tentar buscar registro existente
  SELECT id INTO v_uso_id
  FROM public.uso_recursos
  WHERE empresa_id = p_empresa_id
  AND mes_referencia = v_mes_referencia;
  
  -- Se não existir, criar
  IF v_uso_id IS NULL THEN
    INSERT INTO public.uso_recursos (empresa_id, mes_referencia)
    VALUES (p_empresa_id, v_mes_referencia)
    RETURNING id INTO v_uso_id;
  END IF;
  
  RETURN v_uso_id;
END;
$$;

-- Função para incrementar uso de recursos
CREATE OR REPLACE FUNCTION public.increment_uso_recursos(
  p_empresa_id BIGINT,
  p_mensagens INTEGER DEFAULT 0,
  p_tokens BIGINT DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mes_referencia DATE;
BEGIN
  -- Primeiro dia do mês atual
  v_mes_referencia := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  -- Inserir ou atualizar (upsert)
  INSERT INTO public.uso_recursos (empresa_id, mes_referencia, mensagens_enviadas, tokens_consumidos)
  VALUES (p_empresa_id, v_mes_referencia, p_mensagens, p_tokens)
  ON CONFLICT (empresa_id, mes_referencia)
  DO UPDATE SET
    mensagens_enviadas = public.uso_recursos.mensagens_enviadas + p_mensagens,
    tokens_consumidos = public.uso_recursos.tokens_consumidos + p_tokens,
    updated_at = now();
END;
$$;

-- Comentários
COMMENT ON TABLE public.uso_recursos IS 'Controle de consumo mensal de recursos por empresa. Uma linha por empresa/mês.';
COMMENT ON COLUMN public.uso_recursos.mes_referencia IS 'Primeiro dia do mês de referência (formato: YYYY-MM-01).';
COMMENT ON FUNCTION public.get_or_create_uso_recursos_current_month(BIGINT) IS 'Obtém ou cria registro de uso do mês atual para a empresa. Retorna o ID do registro.';
COMMENT ON FUNCTION public.increment_uso_recursos(BIGINT, INTEGER, BIGINT) IS 'Incrementa contadores de mensagens e tokens para o mês atual da empresa. Faz upsert se necessário.';
