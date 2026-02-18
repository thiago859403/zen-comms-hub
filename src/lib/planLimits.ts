import { supabase } from '@/integrations/supabase/client';

export interface PlanLimits {
  max_usuarios: number;
  max_agentes: number;
  limite_mensagens_mes: number;
}

export interface CurrentUsage {
  usuarios_atuais: number;
  agentes_atuais: number;
  mensagens_este_mes: number;
}

/**
 * Busca os limites do plano atual da empresa
 */
export async function getPlanLimits(empresaId: number): Promise<PlanLimits | null> {
  try {
    // Buscar empresa com plano
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('plano_id')
      .eq('id', empresaId)
      .single();

    if (empresaError || !empresa || !empresa.plano_id) {
      return null;
    }

    // Buscar plano
    const { data: plano, error: planoError } = await supabase
      .from('planos')
      .select('max_usuarios, max_agentes, limite_mensagens_mes')
      .eq('id', empresa.plano_id)
      .single();

    if (planoError || !plano) {
      return null;
    }

    return {
      max_usuarios: plano.max_usuarios,
      max_agentes: plano.max_agentes,
      limite_mensagens_mes: plano.limite_mensagens_mes,
    };
  } catch (error) {
    console.error('Erro ao buscar limites do plano:', error);
    return null;
  }
}

/**
 * Busca o uso atual da empresa
 */
export async function getCurrentUsage(empresaId: number): Promise<CurrentUsage | null> {
  try {
    // Contar usuários
    const { count: usuariosCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId);

    // Contar agentes ativos
    const { count: agentesCount } = await supabase
      .from('agentes_ia')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('status', 'active');

    // Buscar uso do mês atual
    const mesAtual = new Date();
    mesAtual.setDate(1);
    const { data: usoData } = await supabase
      .from('uso_recursos')
      .select('mensagens_enviadas')
      .eq('empresa_id', empresaId)
      .eq('mes_referencia', mesAtual.toISOString().split('T')[0])
      .single();

    return {
      usuarios_atuais: usuariosCount || 0,
      agentes_atuais: agentesCount || 0,
      mensagens_este_mes: usoData?.mensagens_enviadas || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar uso atual:', error);
    return null;
  }
}

/**
 * Verifica se a empresa pode adicionar mais usuários
 */
export async function canAddUser(empresaId: number): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
}> {
  const limits = await getPlanLimits(empresaId);
  const usage = await getCurrentUsage(empresaId);

  if (!limits || !usage) {
    return {
      allowed: false,
      reason: 'Não foi possível verificar limites',
      current: 0,
      limit: 0,
    };
  }

  if (usage.usuarios_atuais >= limits.max_usuarios) {
    return {
      allowed: false,
      reason: `Limite de ${limits.max_usuarios} usuário(s) atingido`,
      current: usage.usuarios_atuais,
      limit: limits.max_usuarios,
    };
  }

  return {
    allowed: true,
    current: usage.usuarios_atuais,
    limit: limits.max_usuarios,
  };
}

/**
 * Verifica se a empresa pode criar mais agentes de IA
 */
export async function canAddAgente(empresaId: number): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
}> {
  const limits = await getPlanLimits(empresaId);
  const usage = await getCurrentUsage(empresaId);

  if (!limits || !usage) {
    return {
      allowed: false,
      reason: 'Não foi possível verificar limites',
      current: 0,
      limit: 0,
    };
  }

  if (usage.agentes_atuais >= limits.max_agentes) {
    return {
      allowed: false,
      reason: `Limite de ${limits.max_agentes} agente(s) atingido`,
      current: usage.agentes_atuais,
      limit: limits.max_agentes,
    };
  }

  return {
    allowed: true,
    current: usage.agentes_atuais,
    limit: limits.max_agentes,
  };
}

/**
 * Verifica se a empresa pode enviar mais mensagens
 */
export async function canSendMessage(empresaId: number): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
}> {
  const limits = await getPlanLimits(empresaId);
  const usage = await getCurrentUsage(empresaId);

  if (!limits || !usage) {
    return {
      allowed: false,
      reason: 'Não foi possível verificar limites',
      current: 0,
      limit: 0,
    };
  }

  if (usage.mensagens_este_mes >= limits.limite_mensagens_mes) {
    return {
      allowed: false,
      reason: `Limite de ${limits.limite_mensagens_mes.toLocaleString('pt-BR')} mensagens/mês atingido`,
      current: usage.mensagens_este_mes,
      limit: limits.limite_mensagens_mes,
    };
  }

  return {
    allowed: true,
    current: usage.mensagens_este_mes,
    limit: limits.limite_mensagens_mes,
  };
}

