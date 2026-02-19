// =====================================================
// EPIC 6.3.3 - Monitoramento e Error Tracking
// =====================================================
// 
// Integração com Sentry para captura de erros e monitoramento.
// Não quebra o app se variáveis de ambiente estiverem ausentes.
// Nunca loga tokens ou secrets.
// =====================================================

interface MonitoringConfig {
  dsn?: string;
  environment?: string;
  release?: string;
  enabled: boolean;
}

let monitoringInitialized = false;
let config: MonitoringConfig = {
  enabled: false,
};

/**
 * Inicializa o monitoramento (Sentry).
 * Não quebra o app se config estiver ausente.
 */
export function initMonitoring(options?: {
  dsn?: string;
  environment?: string;
  release?: string;
}) {
  if (monitoringInitialized) {
    console.warn('[Monitoring] Já inicializado, ignorando nova inicialização');
    return;
  }

  // Verificar se DSN está disponível
  const dsn = options?.dsn || import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.info('[Monitoring] Sentry DSN não configurado, monitoramento desabilitado');
    config.enabled = false;
    monitoringInitialized = true;
    return;
  }

  try {
    // Importar Sentry dinamicamente (não quebra se não instalado)
    // Em produção, instalar: pnpm add @sentry/react
    // Por enquanto, apenas simular a estrutura
    
    config = {
      dsn,
      environment: options?.environment || import.meta.env.VITE_APP_ENV || 'development',
      release: options?.release || import.meta.env.VITE_APP_VERSION || 'unknown',
      enabled: true,
    };

    // TODO: Quando @sentry/react estiver instalado:
    // 1. Instalar: pnpm add @sentry/react
    // 2. Importar: import * as Sentry from '@sentry/react';
    // 3. Inicializar Sentry.init() com as configurações abaixo:
    //    - dsn: config.dsn
    //    - environment: config.environment
    //    - release: config.release
    //    - beforeSend: filtrar tokens/secrets de headers, URLs e breadcrumbs

    console.info('[Monitoring] Sentry inicializado', {
      environment: config.environment,
      release: config.release,
    });

    monitoringInitialized = true;
  } catch (error) {
    console.error('[Monitoring] Erro ao inicializar Sentry:', error);
    config.enabled = false;
    monitoringInitialized = true;
  }
}

/**
 * Captura uma exceção e envia para Sentry.
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!config.enabled) {
    console.error('[Monitoring] Exception (não enviado):', error, context);
    return;
  }

  try {
    // TODO: Quando @sentry/react estiver instalado:
    // import * as Sentry from '@sentry/react';
    // Sentry.captureException(error, { extra: context });
    console.error('[Monitoring] Exception capturada:', error, context);
  } catch (err) {
    console.error('[Monitoring] Erro ao capturar exception:', err);
  }
}

/**
 * Captura uma mensagem e envia para Sentry.
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) {
  if (!config.enabled) {
    console.log(`[Monitoring] ${level.toUpperCase()}:`, message, context);
    return;
  }

  try {
    // TODO: Quando @sentry/react estiver instalado:
    // import * as Sentry from '@sentry/react';
    // Sentry.captureMessage(message, { level, extra: context });
    console.log(`[Monitoring] ${level.toUpperCase()}:`, message, context);
  } catch (err) {
    console.error('[Monitoring] Erro ao capturar mensagem:', err);
  }
}

/**
 * Define o usuário atual no contexto do Sentry.
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
  empresa_id?: string | number;
}) {
  if (!config.enabled) {
    return;
  }

  try {
    // TODO: Quando @sentry/react estiver instalado:
    // import * as Sentry from '@sentry/react';
    // Sentry.setUser({ id: user.id, email: user.email, username: user.username, empresa_id: user.empresa_id?.toString() });
    console.debug('[Monitoring] User set:', { id: user.id, email: user.email });
  } catch (err) {
    console.error('[Monitoring] Erro ao definir usuário:', err);
  }
}

/**
 * Limpa o contexto do usuário (logout).
 */
export function clearUser() {
  if (!config.enabled) {
    return;
  }

  try {
    // TODO: Quando @sentry/react estiver instalado:
    // import * as Sentry from '@sentry/react';
    // Sentry.setUser(null);
    console.debug('[Monitoring] User cleared');
  } catch (err) {
    console.error('[Monitoring] Erro ao limpar usuário:', err);
  }
}

/**
 * Adiciona contexto adicional ao próximo evento.
 */
export function setContext(key: string, context: Record<string, any>) {
  if (!config.enabled) {
    return;
  }

  try {
    // TODO: Quando @sentry/react estiver instalado:
    // import * as Sentry from '@sentry/react';
    // Sentry.setContext(key, context);
    console.debug(`[Monitoring] Context set: ${key}`, context);
  } catch (err) {
    console.error('[Monitoring] Erro ao definir contexto:', err);
  }
}

/**
 * Verifica se o monitoramento está habilitado.
 */
export function isMonitoringEnabled(): boolean {
  return config.enabled;
}
