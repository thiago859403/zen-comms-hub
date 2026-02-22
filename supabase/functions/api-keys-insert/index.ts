import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InsertApiKeyRequest {
  provider: string;
  key_name: string;
  key_value: string;
  is_default?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Service role client para rate limiting e inserção
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limit sensível: 10 req/min por user
    const rlUser = await checkRateLimit(supabaseAdmin, {
      key: 'api-keys-insert',
      limit: 10,
      windowSeconds: 60,
      identifier: `user-${user.id}`,
    });
    if (!rlUser.allowed) {
      return createRateLimitResponse(rlUser);
    }

    // Obter empresa do usuário
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('empresa_id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.empresa_id) {
      return new Response(
        JSON.stringify({ error: 'Empresa não encontrada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se é admin
    if (profile.role !== 'admin' && profile.role !== 'master') {
      return new Response(
        JSON.stringify({ error: 'Apenas admins podem gerenciar chaves API' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { provider, key_name, key_value, is_default = false }: InsertApiKeyRequest = await req.json();

    if (!provider || !key_name || !key_value) {
      return new Response(
        JSON.stringify({ error: 'provider, key_name e key_value são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar provider
    const validProviders = ['openai', 'claude', 'anthropic', 'google', 'other'];
    if (!validProviders.includes(provider)) {
      return new Response(
        JSON.stringify({ error: 'Provider inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Chamar função insert_api_key que criptografa automaticamente
    const { data: keyId, error: insertError } = await supabaseAdmin.rpc('insert_api_key', {
      p_empresa_id: profile.empresa_id,
      p_provider: provider,
      p_key_name: key_name,
      p_plain_key: key_value,
      p_is_default: is_default,
      p_created_by: user.id,
      p_metadata: {},
    });

    if (insertError) {
      console.error('Error inserting API key:', insertError.message);
      return new Response(
        JSON.stringify({ error: insertError.message || 'Erro ao inserir chave' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('API key inserted:', { provider, key_name, empresa_id: profile.empresa_id });

    return new Response(
      JSON.stringify({
        success: true,
        key_id: keyId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
