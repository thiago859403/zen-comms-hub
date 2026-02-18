// =====================================================
// EPIC 6.3.1 - Rate Limiting Helper
// =====================================================
// 
// Helper para implementar rate limiting em Edge Functions.
// Usa Supabase para armazenar contadores por IP/empresa_id.
// =====================================================

interface RateLimitOptions {
  key: string; // Identificador único (ex: "login", "api-call")
  limit: number; // Número máximo de requisições
  windowSeconds: number; // Janela de tempo em segundos
  identifier?: string; // IP ou empresa_id (opcional, usa IP se não fornecido)
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Timestamp Unix
  retryAfter?: number; // Segundos até poder tentar novamente
}

/**
 * Verifica se uma requisição está dentro do limite de taxa.
 * 
 * @param supabase - Cliente Supabase (service role)
 * @param options - Opções de rate limiting
 * @returns Resultado da verificação
 */
export async function checkRateLimit(
  supabase: any,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { key, limit, windowSeconds, identifier } = options;
  
  // Usar IP como fallback se identifier não fornecido
  const rateLimitKey = identifier || 'ip-unknown';
  const cacheKey = `rate_limit:${key}:${rateLimitKey}`;
  
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;
  
  try {
    // Buscar contador atual (usar uma tabela temporária ou KV store)
    // Por simplicidade, vamos usar uma tabela rate_limits
    // Se não existir, criar dinamicamente ou usar cache em memória
    
    // Por enquanto, implementação simples usando Supabase Storage ou uma tabela
    // Em produção, considere usar Redis ou Supabase Realtime para melhor performance
    
    // Verificar se existe registro
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('count, reset_at')
      .eq('key', cacheKey)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking rate limit:', selectError);
      // Em caso de erro, permitir a requisição (fail open)
      return {
        allowed: true,
        remaining: limit,
        resetAt: now + windowSeconds,
      };
    }
    
    const resetAt = existing?.reset_at || (now + windowSeconds);
    const currentCount = existing?.count || 0;
    
    // Se a janela expirou, resetar
    if (resetAt <= now) {
      // Resetar contador
      await supabase
        .from('rate_limits')
        .upsert({
          key: cacheKey,
          count: 1,
          reset_at: now + windowSeconds,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'key',
        });
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: now + windowSeconds,
      };
    }
    
    // Verificar se excedeu o limite
    if (currentCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: resetAt - now,
      };
    }
    
    // Incrementar contador
    await supabase
      .from('rate_limits')
      .upsert({
        key: cacheKey,
        count: currentCount + 1,
        reset_at: resetAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
      });
    
    return {
      allowed: true,
      remaining: limit - (currentCount + 1),
      resetAt,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - permitir requisição em caso de erro
    return {
      allowed: true,
      remaining: limit,
      resetAt: now + windowSeconds,
    };
  }
}

/**
 * Cria resposta HTTP 429 (Too Many Requests) com headers apropriados.
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-RateLimit-Limit': result.resetAt.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
  });
  
  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers,
    }
  );
}
