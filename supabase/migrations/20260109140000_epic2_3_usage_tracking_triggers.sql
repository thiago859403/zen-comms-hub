-- =====================================================
-- ÉPICO 2.3 - User Story 2.3.1
-- Implementar tracking automático de uso mensal
-- =====================================================

-- Função para obter empresa_id de uma conversa
CREATE OR REPLACE FUNCTION public.get_empresa_id_from_conversation(p_conversation_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_empresa_id BIGINT;
BEGIN
  -- Verificar se a tabela conversations existe e tem a coluna empresa_id
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'empresa_id'
  ) THEN
    SELECT empresa_id INTO v_empresa_id
    FROM public.conversations
    WHERE id = p_conversation_id
    LIMIT 1;
  END IF;
  
  RETURN v_empresa_id;
END;
$$;

-- Função para obter empresa_id de um perfil
CREATE OR REPLACE FUNCTION public.get_empresa_id_from_profile(p_profile_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id
  FROM public.profiles
  WHERE id = p_profile_id
  LIMIT 1;
$$;

-- Trigger function para incrementar mensagens enviadas
CREATE OR REPLACE FUNCTION public.track_message_sent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_empresa_id BIGINT;
  v_sender_empresa_id BIGINT;
BEGIN
  -- Obter empresa_id da conversa
  v_empresa_id := public.get_empresa_id_from_conversation(NEW.conversation_id);
  
  -- Se não encontrou pela conversa, tentar pelo sender_id (se for agent/user)
  IF v_empresa_id IS NULL AND NEW.sender_id IS NOT NULL AND NEW.sender_type IN ('agent', 'user') THEN
    v_sender_empresa_id := public.get_empresa_id_from_profile(NEW.sender_id);
    IF v_sender_empresa_id IS NOT NULL THEN
      v_empresa_id := v_sender_empresa_id;
    END IF;
  END IF;
  
  -- Se encontrou empresa_id e a mensagem foi enviada (não apenas criada)
  IF v_empresa_id IS NOT NULL AND NEW.status = 'sent' THEN
    -- Incrementar apenas mensagens enviadas (não contar mensagens recebidas)
    IF NEW.sender_type IN ('agent', 'bot', 'system') THEN
      PERFORM public.increment_uso_recursos(v_empresa_id, p_mensagens := 1, p_tokens := 0);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela messages
DROP TRIGGER IF EXISTS track_message_sent_trigger ON public.messages;
CREATE TRIGGER track_message_sent_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  WHEN (NEW.status = 'sent')
  EXECUTE FUNCTION public.track_message_sent();

-- Trigger function para atualizar tokens consumidos em conversas
CREATE OR REPLACE FUNCTION public.track_conversation_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tokens_diff BIGINT;
BEGIN
  -- Calcular diferença de tokens
  IF OLD.tokens_usados IS NULL THEN
    v_tokens_diff := COALESCE(NEW.tokens_usados, 0);
  ELSE
    v_tokens_diff := COALESCE(NEW.tokens_usados, 0) - OLD.tokens_usados;
  END IF;
  
  -- Se houve incremento de tokens e temos empresa_id
  IF v_tokens_diff > 0 AND NEW.empresa_id IS NOT NULL THEN
    PERFORM public.increment_uso_recursos(NEW.empresa_id, p_mensagens := 0, p_tokens := v_tokens_diff);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela conversations para tokens
DROP TRIGGER IF EXISTS track_conversation_tokens_trigger ON public.conversations;
CREATE TRIGGER track_conversation_tokens_trigger
  AFTER UPDATE OF tokens_usados ON public.conversations
  FOR EACH ROW
  WHEN (NEW.tokens_usados IS NOT NULL AND (OLD.tokens_usados IS NULL OR NEW.tokens_usados > OLD.tokens_usados))
  EXECUTE FUNCTION public.track_conversation_tokens();

-- Função para garantir que existe registro de uso do mês atual
-- Esta função será chamada automaticamente pelo increment_uso_recursos,
-- mas podemos criar uma função auxiliar para garantir criação antecipada
CREATE OR REPLACE FUNCTION public.ensure_uso_recursos_current_month(p_empresa_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Chamar increment com valores zero para garantir que o registro existe
  PERFORM public.increment_uso_recursos(p_empresa_id, 0, 0);
END;
$$;

-- Comentários
COMMENT ON FUNCTION public.get_empresa_id_from_conversation(UUID) IS 'Obtém empresa_id de uma conversa. Usado em triggers de tracking.';
COMMENT ON FUNCTION public.get_empresa_id_from_profile(UUID) IS 'Obtém empresa_id de um perfil. Usado em triggers de tracking.';
COMMENT ON FUNCTION public.track_message_sent() IS 'Trigger function que incrementa contador de mensagens enviadas quando uma mensagem é criada com status sent.';
COMMENT ON FUNCTION public.track_conversation_tokens() IS 'Trigger function que incrementa contador de tokens quando tokens_usados é atualizado em uma conversa.';
COMMENT ON FUNCTION public.ensure_uso_recursos_current_month(BIGINT) IS 'Garante que existe registro de uso do mês atual para a empresa.';
