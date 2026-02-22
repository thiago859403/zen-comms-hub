import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, createRateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendInviteRequest {
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
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

    // Service role client para rate limiting e operações admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limit sensível: 10 req/min por user (anti-spam)
    const rlUser = await checkRateLimit(supabaseAdmin, {
      key: 'send-invite',
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
        JSON.stringify({ error: 'Apenas admins podem enviar convites' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, full_name, role }: SendInviteRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar limite de usuários
    // Buscar plano da empresa
    const { data: empresa } = await supabaseAdmin
      .from('empresas')
      .select('plano_id')
      .eq('id', profile.empresa_id)
      .single();

    if (empresa?.plano_id) {
      const { data: plano } = await supabaseAdmin
        .from('planos')
        .select('max_usuarios')
        .eq('id', empresa.plano_id)
        .single();

      if (plano) {
        // Contar usuários atuais
        const { count } = await supabaseAdmin
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', profile.empresa_id);

        if (count !== null && count >= plano.max_usuarios) {
          return new Response(
            JSON.stringify({
              error: `Limite de ${plano.max_usuarios} usuário(s) atingido. Faça upgrade do plano.`,
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Verificar se usuário já existe
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    if (existingUser?.user) {
      // Verificar se já está na empresa
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('empresa_id')
        .eq('id', existingUser.user.id)
        .single();

      if (existingProfile?.empresa_id === profile.empresa_id) {
        return new Response(
          JSON.stringify({ error: 'Este usuário já faz parte da empresa' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Gerar token único para o convite
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Válido por 7 dias

    // Criar usuário no Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false, // Usuário precisa confirmar email
      user_metadata: {
        full_name: full_name || '',
        empresa_id: profile.empresa_id,
        invite_token: inviteToken,
      },
    });

    if (createError) {
      // Se usuário já existe, apenas adicionar à empresa
      if (createError.message.includes('already registered')) {
        const { data: existingUserData } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        if (existingUserData?.user) {
          // Atualizar profile para adicionar à empresa
          await supabaseAdmin
            .from('profiles')
            .update({
              empresa_id: profile.empresa_id,
              role: role,
              status: 'pending',
            })
            .eq('id', existingUserData.user.id);
        }
      } else {
        throw createError;
      }
    } else if (newUser?.user) {
      // Criar profile para o novo usuário
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email: email,
          full_name: full_name || null,
          empresa_id: profile.empresa_id,
          role: role,
          status: 'pending',
        });
    }

    // Enviar email via Brevo
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    const BREVO_SENDER_EMAIL = Deno.env.get('BREVO_SENDER_EMAIL') || 'noreply@nuvia.com';
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';

    if (BREVO_API_KEY) {
      const inviteUrl = `${SUPABASE_URL}/auth/accept-invite?token=${inviteToken}&email=${encodeURIComponent(email)}`;

      const emailData = {
        sender: {
          name: 'Nuvia Customer Cloud',
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: email,
            name: full_name || email,
          },
        ],
        subject: 'Convite para Nuvia Customer Cloud',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Você foi convidado para a Nuvia Customer Cloud</h2>
            <p>Olá ${full_name || email},</p>
            <p>Você foi convidado para fazer parte da equipe na Nuvia Customer Cloud.</p>
            <p>Clique no link abaixo para aceitar o convite e criar sua conta:</p>
            <p style="margin: 20px 0;">
              <a href="${inviteUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Aceitar Convite
              </a>
            </p>
            <p>Este link é válido por 7 dias.</p>
            <p>Se você não solicitou este convite, pode ignorar este email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              Nuvia Customer Cloud - Plataforma de atendimento e automação
            </p>
          </div>
        `,
      };

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!brevoResponse.ok) {
        console.error('Email sending failed, status:', brevoResponse.status);
        // Não falhar o processo se o email não for enviado
      }
    }

    console.log('Invite sent successfully:', { empresa_id: profile.empresa_id, role });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Convite enviado com sucesso',
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
