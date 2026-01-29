-- =====================================================
-- ÉPICO 3.3 - User Story 3.3.3
-- Adicionar tracking de uso por chave API
-- =====================================================

-- Adicionar coluna api_key_id na tabela conversations (se a tabela existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations'
  ) THEN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'conversations' 
      AND column_name = 'api_key_id'
    ) THEN
      ALTER TABLE public.conversations
      ADD COLUMN api_key_id BIGINT REFERENCES public.api_keys(id) ON DELETE SET NULL;
      
      -- Criar índice
      CREATE INDEX IF NOT EXISTS idx_conversations_api_key_id ON public.conversations(api_key_id);
      
      -- Comentário
      COMMENT ON COLUMN public.conversations.api_key_id IS 'ID da chave API usada nesta conversa. Usado para tracking de uso por chave (BYOK).';
    END IF;
  END IF;
END $$;
