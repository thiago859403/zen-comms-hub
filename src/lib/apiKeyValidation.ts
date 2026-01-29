/**
 * Validação de chaves API para diferentes provedores
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  provider?: string;
}

/**
 * Valida formato básico de chave OpenAI
 */
function validateOpenAIKey(key: string): boolean {
  // OpenAI keys geralmente começam com "sk-" e têm pelo menos 32 caracteres
  return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
}

/**
 * Valida formato básico de chave Anthropic/Claude
 */
function validateAnthropicKey(key: string): boolean {
  // Anthropic keys geralmente começam com "sk-ant-" e têm pelo menos 40 caracteres
  return /^sk-ant-[a-zA-Z0-9-]{40,}$/.test(key);
}

/**
 * Valida formato básico de chave Google
 */
function validateGoogleKey(key: string): boolean {
  // Google API keys podem ter vários formatos, mas geralmente são longas
  return key.length >= 20;
}

/**
 * Valida chave fazendo uma chamada de teste à API do provedor
 */
async function validateKeyWithAPI(
  provider: string,
  key: string
): Promise<ValidationResult> {
  try {
    switch (provider) {
      case 'openai':
        // Teste básico com OpenAI (listar modelos)
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
          },
        });

        if (openaiResponse.status === 401) {
          return { valid: false, error: 'Chave inválida ou expirada' };
        }

        if (!openaiResponse.ok) {
          return { valid: false, error: 'Erro ao validar chave' };
        }

        return { valid: true, provider: 'openai' };

      case 'claude':
      case 'anthropic':
        // Teste básico com Anthropic (listar mensagens - endpoint simples)
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'test' }],
          }),
        });

        // 400 pode ser válido (erro de formato, mas chave aceita)
        // 401 significa chave inválida
        if (anthropicResponse.status === 401) {
          return { valid: false, error: 'Chave inválida ou expirada' };
        }

        // Outros erros podem ser de formato, mas a chave pode ser válida
        if (anthropicResponse.status >= 500) {
          return { valid: false, error: 'Erro no servidor do provedor' };
        }

        return { valid: true, provider };

      case 'google':
        // Google tem vários tipos de chaves, validação mais complexa
        // Por enquanto, apenas valida formato
        return { valid: validateGoogleKey(key), provider: 'google' };

      default:
        // Para outros provedores, apenas valida formato básico
        return { valid: key.length >= 10, provider: 'other' };
    }
  } catch (error: any) {
    return {
      valid: false,
      error: `Erro ao validar: ${error.message}`,
    };
  }
}

/**
 * Valida uma chave API
 * Primeiro valida o formato, depois faz chamada de teste se necessário
 */
export async function validateApiKey(
  provider: string,
  key: string,
  skipAPICall: boolean = false
): Promise<ValidationResult> {
  // Validação básica
  if (!key || key.trim().length === 0) {
    return { valid: false, error: 'Chave não pode ser vazia' };
  }

  if (key.length < 10) {
    return { valid: false, error: 'Chave muito curta' };
  }

  // Validação de formato por provedor
  let formatValid = false;
  switch (provider) {
    case 'openai':
      formatValid = validateOpenAIKey(key);
      if (!formatValid) {
        return { valid: false, error: 'Formato de chave OpenAI inválido' };
      }
      break;

    case 'claude':
    case 'anthropic':
      formatValid = validateAnthropicKey(key);
      if (!formatValid) {
        return { valid: false, error: 'Formato de chave Anthropic inválido' };
      }
      break;

    case 'google':
      formatValid = validateGoogleKey(key);
      if (!formatValid) {
        return { valid: false, error: 'Formato de chave Google inválido' };
      }
      break;

    default:
      formatValid = true; // Para outros, aceita qualquer formato razoável
  }

  // Se skipAPICall, retorna apenas validação de formato
  if (skipAPICall) {
    return { valid: formatValid, provider };
  }

  // Validação com API (opcional, pode ser desabilitada para testes)
  try {
    return await validateKeyWithAPI(provider, key);
  } catch (error: any) {
    // Se falhar a validação com API, ainda aceita se o formato estiver correto
    console.warn('Erro ao validar chave com API:', error);
    return { valid: formatValid, provider, error: 'Não foi possível validar com o provedor' };
  }
}

/**
 * Valida formato de chave sem fazer chamada à API (mais rápido)
 */
export async function validateApiKeyFormat(provider: string, key: string): Promise<ValidationResult> {
  return validateApiKey(provider, key, true);
}
