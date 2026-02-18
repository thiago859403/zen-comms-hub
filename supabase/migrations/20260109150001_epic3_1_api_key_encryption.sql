-- =====================================================
-- ÉPICO 3.1 - User Story 3.1.2
-- Implementar funções de criptografia/descriptografia de chaves API
-- =====================================================

-- Função para gerar chave de criptografia baseada em empresa_id
-- Usa uma combinação de empresa_id e uma secret do ambiente
CREATE OR REPLACE FUNCTION public.generate_encryption_key(p_empresa_id BIGINT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret TEXT;
  v_key TEXT;
BEGIN
  -- Obter secret do ambiente (deve ser configurado no Supabase)
  -- Se não existir, usar um fallback baseado em empresa_id (menos seguro, mas funcional)
  v_secret := current_setting('app.encryption_secret', true);
  
  IF v_secret IS NULL OR v_secret = '' THEN
    -- Fallback: usar hash do empresa_id (NÃO RECOMENDADO PARA PRODUÇÃO)
    -- Em produção, sempre configure app.encryption_secret no Supabase
    v_secret := encode(digest(p_empresa_id::TEXT || 'fallback_secret_key', 'sha256'), 'hex');
  END IF;
  
  -- Gerar chave de 32 bytes (256 bits) para AES-256
  v_key := encode(digest(p_empresa_id::TEXT || v_secret, 'sha256'), 'hex');
  
  RETURN v_key;
END;
$$;

-- Função para criptografar chave API
-- Esta função deve ser chamada apenas em contextos seguros (Edge Functions com service role)
CREATE OR REPLACE FUNCTION public.encrypt_api_key(
  p_plain_key TEXT,
  p_empresa_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_encryption_key TEXT;
  v_encrypted TEXT;
BEGIN
  -- Validar entrada
  IF p_plain_key IS NULL OR p_plain_key = '' THEN
    RAISE EXCEPTION 'Chave API não pode ser vazia';
  END IF;
  
  IF p_empresa_id IS NULL THEN
    RAISE EXCEPTION 'empresa_id é obrigatório';
  END IF;
  
  -- Gerar chave de criptografia
  v_encryption_key := public.generate_encryption_key(p_empresa_id);
  
  -- Criptografar usando pgcrypto (AES-256)
  -- Usar encode para armazenar como texto
  v_encrypted := encode(
    encrypt(
      p_plain_key::bytea,
      v_encryption_key::bytea,
      'aes'
    ),
    'base64'
  );
  
  RETURN v_encrypted;
END;
$$;

-- Função para descriptografar chave API
-- ATENÇÃO: Esta função deve ser usada APENAS em Edge Functions com service role
-- NUNCA expor via API pública ou RLS policies
CREATE OR REPLACE FUNCTION public.decrypt_api_key(
  p_encrypted_key TEXT,
  p_empresa_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_encryption_key TEXT;
  v_decrypted TEXT;
BEGIN
  -- Validar entrada
  IF p_encrypted_key IS NULL OR p_encrypted_key = '' THEN
    RAISE EXCEPTION 'Chave criptografada não pode ser vazia';
  END IF;
  
  IF p_empresa_id IS NULL THEN
    RAISE EXCEPTION 'empresa_id é obrigatório';
  END IF;
  
  -- Gerar chave de criptografia (mesma usada na criptografia)
  v_encryption_key := public.generate_encryption_key(p_empresa_id);
  
  -- Descriptografar
  BEGIN
    v_decrypted := convert_from(
      decrypt(
        decode(p_encrypted_key, 'base64'),
        v_encryption_key::bytea,
        'aes'
      ),
      'UTF8'
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao descriptografar chave: %', SQLERRM;
  END;
  
  RETURN v_decrypted;
END;
$$;

-- Função para gerar hash SHA-256 de uma chave (para validação)
CREATE OR REPLACE FUNCTION public.hash_api_key(p_plain_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_plain_key IS NULL OR p_plain_key = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN encode(digest(p_plain_key, 'sha256'), 'hex');
END;
$$;

-- Função helper para inserir chave API (criptografa automaticamente)
-- Esta função deve ser chamada apenas em contextos seguros
CREATE OR REPLACE FUNCTION public.insert_api_key(
  p_empresa_id BIGINT,
  p_provider TEXT,
  p_key_name TEXT,
  p_plain_key TEXT,
  p_is_default BOOLEAN DEFAULT false,
  p_created_by UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id BIGINT;
  v_encrypted TEXT;
  v_hash TEXT;
BEGIN
  -- Validar provider
  IF p_provider NOT IN ('openai', 'claude', 'anthropic', 'google', 'other') THEN
    RAISE EXCEPTION 'Provider inválido: %', p_provider;
  END IF;
  
  -- Criptografar chave
  v_encrypted := public.encrypt_api_key(p_plain_key, p_empresa_id);
  
  -- Gerar hash
  v_hash := public.hash_api_key(p_plain_key);
  
  -- Se for chave padrão, desativar outras chaves padrão do mesmo provider
  IF p_is_default THEN
    UPDATE public.api_keys
    SET is_default = false
    WHERE empresa_id = p_empresa_id
    AND provider = p_provider
    AND is_default = true;
  END IF;
  
  -- Inserir chave
  INSERT INTO public.api_keys (
    empresa_id,
    provider,
    key_name,
    key_encrypted,
    key_hash,
    is_default,
    created_by,
    metadata
  )
  VALUES (
    p_empresa_id,
    p_provider,
    p_key_name,
    v_encrypted,
    v_hash,
    p_is_default,
    p_created_by,
    p_metadata
  )
  RETURNING id INTO v_key_id;
  
  RETURN v_key_id;
END;
$$;

-- Função para obter chave descriptografada (APENAS para uso em Edge Functions)
-- Esta função NUNCA deve ser exposta via RLS ou API pública
CREATE OR REPLACE FUNCTION public.get_decrypted_api_key(
  p_key_id BIGINT,
  p_empresa_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_encrypted TEXT;
  v_decrypted TEXT;
BEGIN
  -- Buscar chave criptografada
  SELECT key_encrypted INTO v_encrypted
  FROM public.api_keys
  WHERE id = p_key_id
  AND empresa_id = p_empresa_id
  AND is_active = true;
  
  IF v_encrypted IS NULL THEN
    RAISE EXCEPTION 'Chave API não encontrada ou inativa';
  END IF;
  
  -- Descriptografar
  v_decrypted := public.decrypt_api_key(v_encrypted, p_empresa_id);
  
  -- Atualizar last_used_at e usage_count
  UPDATE public.api_keys
  SET last_used_at = now(),
      usage_count = usage_count + 1
  WHERE id = p_key_id;
  
  RETURN v_decrypted;
END;
$$;

-- Função para obter chave padrão descriptografada de um provider
CREATE OR REPLACE FUNCTION public.get_default_decrypted_api_key(
  p_empresa_id BIGINT,
  p_provider TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id BIGINT;
  v_decrypted TEXT;
BEGIN
  -- Buscar chave padrão
  SELECT id INTO v_key_id
  FROM public.api_keys
  WHERE empresa_id = p_empresa_id
  AND provider = p_provider
  AND is_default = true
  AND is_active = true
  LIMIT 1;
  
  IF v_key_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Obter chave descriptografada
  v_decrypted := public.get_decrypted_api_key(v_key_id, p_empresa_id);
  
  RETURN v_decrypted;
END;
$$;

-- Comentários
COMMENT ON FUNCTION public.generate_encryption_key(BIGINT) IS 'Gera chave de criptografia baseada em empresa_id. Usa app.encryption_secret do ambiente.';
COMMENT ON FUNCTION public.encrypt_api_key(TEXT, BIGINT) IS 'Criptografa chave API usando AES-256. Deve ser chamada apenas em contextos seguros.';
COMMENT ON FUNCTION public.decrypt_api_key(TEXT, BIGINT) IS 'Descriptografa chave API. APENAS para uso em Edge Functions com service role. NUNCA expor via API pública.';
COMMENT ON FUNCTION public.hash_api_key(TEXT) IS 'Gera hash SHA-256 de uma chave para validação sem descriptografar.';
COMMENT ON FUNCTION public.insert_api_key(BIGINT, TEXT, TEXT, TEXT, BOOLEAN, UUID, JSONB) IS 'Insere chave API criptografando automaticamente. Deve ser chamada apenas em contextos seguros.';
COMMENT ON FUNCTION public.get_decrypted_api_key(BIGINT, BIGINT) IS 'Obtém chave API descriptografada. APENAS para Edge Functions. Atualiza last_used_at e usage_count.';
COMMENT ON FUNCTION public.get_default_decrypted_api_key(BIGINT, TEXT) IS 'Obtém chave padrão descriptografada de um provider. APENAS para Edge Functions.';
