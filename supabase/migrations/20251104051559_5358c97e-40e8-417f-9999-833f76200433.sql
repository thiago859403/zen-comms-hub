-- Criar tabela de logs de atividades administrativas
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_logs_target_user ON public.admin_activity_logs(target_user_id);

-- Habilitar RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas admins podem ver os logs
CREATE POLICY "Admins podem ver todos logs"
ON public.admin_activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Apenas admins podem inserir logs
CREATE POLICY "Admins podem criar logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar campos para rastreamento de tentativas de login (se não existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'failed_login_attempts') THEN
    ALTER TABLE public.profiles ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'locked_until') THEN
    ALTER TABLE public.profiles ADD COLUMN locked_until TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Criar tabela para armazenar tokens 2FA temporários
CREATE TABLE IF NOT EXISTS public.two_factor_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para limpeza de tokens expirados
CREATE INDEX idx_2fa_expires_at ON public.two_factor_tokens(expires_at);
CREATE INDEX idx_2fa_user_id ON public.two_factor_tokens(user_id);

-- Habilitar RLS
ALTER TABLE public.two_factor_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios tokens
CREATE POLICY "Usuários podem ver próprios tokens"
ON public.two_factor_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Sistema pode inserir tokens (via edge function)
CREATE POLICY "Sistema pode criar tokens"
ON public.two_factor_tokens
FOR INSERT
WITH CHECK (true);

-- Policy: Sistema pode atualizar tokens
CREATE POLICY "Sistema pode atualizar tokens"
ON public.two_factor_tokens
FOR UPDATE
USING (true);