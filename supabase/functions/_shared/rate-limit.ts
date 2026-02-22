import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
  identifier: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Extrai o IP real do cliente a partir dos headers do request.
 * Suporta proxies (x-forwarded-for, x-real-ip, cf-connecting-ip).
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Verifica rate limit usando a tabela `rate_limits` no Supabase.
 * Requer um client com service_role (RLS bloqueia acesso de usuários).
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { key, limit, windowSeconds, identifier } = options;
  const compositeKey = `rate_limit:${key}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSeconds;

  try {
    // Buscar registro existente
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', compositeKey)
      .single();

    // Janela expirada ou sem registro — criar/resetar
    if (!existing || existing.reset_at <= now) {
      await supabase
        .from('rate_limits')
        .upsert(
          {
            key: compositeKey,
            count: 1,
            reset_at: resetAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
      return { allowed: true, remaining: limit - 1, resetAt, limit };
    }

    // Janela ativa — verificar limite
    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: existing.reset_at,
        limit,
      };
    }

    // Incrementar contador
    await supabase
      .from('rate_limits')
      .update({
        count: existing.count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('key', compositeKey);

    return {
      allowed: true,
      remaining: limit - existing.count - 1,
      resetAt: existing.reset_at,
      limit,
    };
  } catch (error) {
    // Em caso de falha no rate limiting, permitir a requisição (fail-open)
    console.warn('[RateLimit] Check failed, allowing request');
    return { allowed: true, remaining: limit, resetAt, limit };
  }
}

/**
 * Cria uma resposta HTTP 429 padronizada com headers de rate limit.
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = Math.max(0, result.resetAt - Math.floor(Date.now() / 1000));
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retry_after: retryAfter,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetAt),
      },
    }
  );
}
