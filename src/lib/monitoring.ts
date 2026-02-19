// =====================================================
// Monitoramento — Sentry Integration
// =====================================================
//
// Fornece funções para inicializar o Sentry, capturar erros,
// mensagens e identificar usuários. Opera em "no-op mode"
// quando VITE_SENTRY_DSN não está configurado.
// =====================================================

import * as Sentry from '@sentry/react';

// Flag que indica se o Sentry foi inicializado com sucesso
let isInitialized = false;

// Padrões de dados sensíveis que devem ser sanitizados
const SENSITIVE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  /eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_.+/=]*/g, // JWT
  /sb_[a-zA-Z0-9_-]+/g, // Supabase keys
  /sk_[a-zA-Z0-9_-]+/g, // Stripe secret keys
  /pk_[a-zA-Z0-9_-]+/g, // Stripe publishable keys
  /supabase_service_role_key[^&\s]*/gi,
  /password["\s:=]+["']?[^"'\s&]+/gi,
  /secret["\s:=]+["']?[^"'\s&]+/gi,
];

/**
 * Sanitiza um valor removendo tokens, secrets e dados sensíveis.
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  let sanitized = value;
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  return sanitized;
}

/**
 * beforeSend hook para filtrar/sanitizar eventos antes de enviar ao Sentry.
 */
function beforeSend(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
  // Sanitizar breadcrumbs
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
      if (breadcrumb.data) {
        const sanitizedData: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(breadcrumb.data)) {
          sanitizedData[key] = sanitizeValue(val);
        }
        breadcrumb.data = sanitizedData;
      }
      if (breadcrumb.message) {
        breadcrumb.message = sanitizeValue(breadcrumb.message) as string;
      }
      return breadcrumb;
    });
  }

  // Sanitizar headers de request se presentes
  if (event.request?.headers) {
    const sanitizedHeaders: Record<string, string> = {};
    for (const [key, val] of Object.entries(event.request.headers)) {
      if (['authorization', 'cookie', 'x-api-key', 'apikey'].includes(key.toLowerCase())) {
        sanitizedHeaders[key] = '[REDACTED]';
      } else {
        sanitizedHeaders[key] = sanitizeValue(val) as string;
      }
    }
    event.request.headers = sanitizedHeaders;
  }

  return event;
}

interface InitMonitoringOptions {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
}

/**
 * Inicializa o Sentry. Seguro para chamar sem DSN (opera em no-op mode).
 *
 * Deve ser chamado o mais cedo possível no boot da aplicação (App.tsx ou main.tsx).
 */
export function initMonitoring(options: InitMonitoringOptions = {}): void {
  // Evitar re-inicialização
  if (isInitialized) {
    console.debug('[Monitoring] Já inicializado, ignorando nova chamada');
    return;
  }

  const dsn = options.dsn || import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.debug('[Monitoring] VITE_SENTRY_DSN not set — running in no-op mode');
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: options.environment || import.meta.env.VITE_APP_ENV || 'development',
      release: options.release || import.meta.env.VITE_APP_VERSION || undefined,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: options.tracesSampleRate ?? 0.2,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend,
      // Ignorar erros comuns de rede / browser que não são acionáveis
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        'AbortError',
      ],
    });
    isInitialized = true;
    console.debug('[Monitoring] Sentry initialized successfully');
  } catch (error) {
    console.warn('[Monitoring] Failed to initialize Sentry:', error);
  }
}

/**
 * Captura uma exceção no Sentry. No-op se Sentry não estiver inicializado.
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (!isInitialized) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

/**
 * Captura uma mensagem no Sentry. No-op se Sentry não estiver inicializado.
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
): void {
  if (!isInitialized) return;
  Sentry.captureMessage(message, level);
}

/**
 * Identifica o usuário autenticado no Sentry.
 * Deve ser chamado após login/signup e limpo no logout.
 *
 * @param user - Dados do usuário (id, email, empresa_id). Passar `null` para limpar.
 */
export function setUser(
  user: { id: string; email?: string; empresa_id?: number | null } | null
): void {
  if (!isInitialized) return;

  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      // empresa_id como tag customizada para filtrar por tenant no Sentry
      ...(user.empresa_id ? { empresa_id: String(user.empresa_id) } : {}),
    } as Sentry.User);
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Adiciona um breadcrumb para contexto de debugging.
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, unknown>
): void {
  if (!isInitialized) return;
  Sentry.addBreadcrumb({
    message,
    category: category || 'app',
    data,
    level: 'info',
  });
}

/**
 * Adiciona contexto adicional ao próximo evento.
 */
export function setContext(key: string, context: Record<string, unknown>): void {
  if (!isInitialized) return;
  Sentry.setContext(key, context);
}

/**
 * Verifica se o monitoramento está habilitado.
 */
export function isMonitoringEnabled(): boolean {
  return isInitialized;
}

/**
 * Re-exporta o ErrorBoundary do Sentry para uso no App.
 * Em no-op mode, retorna um fragment wrapper que apenas renderiza children.
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;
