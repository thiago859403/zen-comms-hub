// =============================================================================
// Sentry Context — Multi-tenant Observability
// =============================================================================
//
// Centraliza o enriquecimento de contexto no Sentry:
//   • User:         id, email, username
//   • Tenant:       tenant_id, tenant_name, tenant_status
//   • Subscription: plan, plan_id, status
//   • Tags:         app_version, app_env, tenant_id, plan, route
//
// Nenhum dado sensível (tokens, keys, PII extra) é enviado.
// Seguro para chamar sem dados — limpa contexto graciosamente.
// =============================================================================

import * as Sentry from '@sentry/react';
import { APP_VERSION, APP_ENV } from '@/config/release';
import { isMonitoringEnabled } from '@/lib/monitoring';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface SentryUserInfo {
  id: string;
  email?: string;
  name?: string;
}

export interface SentryTenantInfo {
  id: number;
  name: string;
  status?: string;
}

export interface SentryPlanInfo {
  id: number | null;
  name: string;
}

export interface SentryContextParams {
  user?: SentryUserInfo | null;
  tenant?: SentryTenantInfo | null;
  plan?: SentryPlanInfo | null;
}

// ─── Estado interno ──────────────────────────────────────────────────────────

let currentContext: SentryContextParams = {};

// ─── Funções públicas ────────────────────────────────────────────────────────

/**
 * Define o contexto completo do Sentry (user + tenant + plan + tags).
 *
 * Chamado pelo AuthProvider a cada mudança de sessão/login.
 * Seguro para chamar com dados parciais ou nulos.
 */
export function setSentryContext(params: SentryContextParams): void {
  if (!isMonitoringEnabled()) return;

  currentContext = { ...params };

  // ── User ──
  if (params.user) {
    Sentry.setUser({
      id: params.user.id,
      email: params.user.email,
      username: params.user.name,
    });
  } else {
    Sentry.setUser(null);
  }

  // ── Tenant context ──
  if (params.tenant) {
    Sentry.setContext('tenant', {
      id: params.tenant.id,
      name: params.tenant.name,
      status: params.tenant.status ?? 'unknown',
    });
    Sentry.setTag('tenant_id', String(params.tenant.id));
  } else {
    Sentry.setContext('tenant', null);
    Sentry.setTag('tenant_id', '');
  }

  // ── Subscription/plan context ──
  if (params.plan) {
    Sentry.setContext('subscription', {
      plan_id: params.plan.id,
      plan: params.plan.name,
    });
    Sentry.setTag('plan', params.plan.name);
  } else {
    Sentry.setContext('subscription', null);
    Sentry.setTag('plan', '');
  }

  // ── Global tags (sempre presentes) ──
  Sentry.setTag('app_version', APP_VERSION);
  Sentry.setTag('app_env', APP_ENV);
  Sentry.setTag('route', window.location.pathname);
}

/**
 * Limpa todo o contexto do Sentry (logout / sessão expirada).
 */
export function clearSentryContext(): void {
  if (!isMonitoringEnabled()) return;

  currentContext = {};

  Sentry.setUser(null);
  Sentry.setContext('tenant', null);
  Sentry.setContext('subscription', null);
  Sentry.setTag('tenant_id', '');
  Sentry.setTag('plan', '');
  Sentry.setTag('route', '');
}

/**
 * Atualiza apenas a tag `route` no Sentry (chamado em cada navegação).
 */
export function updateSentryRoute(pathname: string): void {
  if (!isMonitoringEnabled()) return;
  Sentry.setTag('route', pathname);
}

/**
 * Retorna o contexto atual do Sentry (para exibição em debug/diagnóstico).
 * Não expõe dados sensíveis.
 */
export function getCurrentSentryContext(): SentryContextParams {
  return { ...currentContext };
}
