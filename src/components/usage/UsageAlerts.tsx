import { useEffect, useState } from "react";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UsageStats {
  usuarios_atuais: number;
  agentes_atuais: number;
  mensagens_este_mes: number;
}

interface AlertState {
  show: boolean;
  type: 'warning' | 'error';
  message: string;
  resource: 'usuarios' | 'agentes' | 'mensagens';
  percent: number;
}

export const UsageAlerts = () => {
  const { empresa } = useEmpresa();
  const { empresaId } = useAuth();
  const { toast } = useToast();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresa && empresaId) {
      loadUsageStats();
    }
  }, [empresa, empresaId]);

  const loadUsageStats = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);

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

      const stats: UsageStats = {
        usuarios_atuais: usuariosCount || 0,
        agentes_atuais: agentesCount || 0,
        mensagens_este_mes: usoData?.mensagens_enviadas || 0,
      };

      setUsageStats(stats);
      checkLimits(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLimits = (stats: UsageStats) => {
    if (!empresa?.plano) return;

    const plano = empresa.plano;
    const newAlerts: AlertState[] = [];

    // Verificar limite de usuários
    if (plano.max_usuarios > 0) {
      const usuariosPercent = (stats.usuarios_atuais / plano.max_usuarios) * 100;
      if (usuariosPercent >= 100) {
        newAlerts.push({
          show: true,
          type: 'error',
          message: `Limite de ${plano.max_usuarios} usuário(s) excedido. Você não pode adicionar mais usuários.`,
          resource: 'usuarios',
          percent: usuariosPercent,
        });
      } else if (usuariosPercent >= 90) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(usuariosPercent)}% do limite de usuários (${stats.usuarios_atuais}/${plano.max_usuarios}).`,
          resource: 'usuarios',
          percent: usuariosPercent,
        });
      } else if (usuariosPercent >= 80) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(usuariosPercent)}% do limite de usuários.`,
          resource: 'usuarios',
          percent: usuariosPercent,
        });
      }
    }

    // Verificar limite de agentes
    if (plano.max_agentes > 0) {
      const agentesPercent = (stats.agentes_atuais / plano.max_agentes) * 100;
      if (agentesPercent >= 100) {
        newAlerts.push({
          show: true,
          type: 'error',
          message: `Limite de ${plano.max_agentes} agente(s) excedido. Você não pode criar mais agentes.`,
          resource: 'agentes',
          percent: agentesPercent,
        });
      } else if (agentesPercent >= 90) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(agentesPercent)}% do limite de agentes (${stats.agentes_atuais}/${plano.max_agentes}).`,
          resource: 'agentes',
          percent: agentesPercent,
        });
      } else if (agentesPercent >= 80) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(agentesPercent)}% do limite de agentes.`,
          resource: 'agentes',
          percent: agentesPercent,
        });
      }
    }

    // Verificar limite de mensagens
    if (plano.limite_mensagens_mes > 0) {
      const mensagensPercent = (stats.mensagens_este_mes / plano.limite_mensagens_mes) * 100;
      if (mensagensPercent >= 100) {
        newAlerts.push({
          show: true,
          type: 'error',
          message: `Limite de ${plano.limite_mensagens_mes.toLocaleString('pt-BR')} mensagens/mês excedido. Você não pode enviar mais mensagens este mês.`,
          resource: 'mensagens',
          percent: mensagensPercent,
        });
      } else if (mensagensPercent >= 90) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(mensagensPercent)}% do limite de mensagens (${stats.mensagens_este_mes.toLocaleString('pt-BR')}/${plano.limite_mensagens_mes.toLocaleString('pt-BR')}).`,
          resource: 'mensagens',
          percent: mensagensPercent,
        });
      } else if (mensagensPercent >= 80) {
        newAlerts.push({
          show: true,
          type: 'warning',
          message: `Você está usando ${Math.round(mensagensPercent)}% do limite de mensagens.`,
          resource: 'mensagens',
          percent: mensagensPercent,
        });
      }
    }

    setAlerts(newAlerts);
  };

  const handleDismiss = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpgrade = () => {
    window.location.href = '/dashboard/pricing';
  };

  if (loading || !empresa?.plano || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          variant={alert.type === 'error' ? 'destructive' : 'default'}
          className="flex items-start justify-between"
        >
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <AlertTitle>
                {alert.type === 'error' ? 'Limite Excedido' : 'Atenção: Limite Próximo'}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {alert.message}
                {alert.type === 'error' && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto ml-2 text-inherit underline"
                    onClick={handleUpgrade}
                  >
                    Faça upgrade agora
                  </Button>
                )}
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleDismiss(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
};

/**
 * Hook para verificar se uma ação pode ser executada baseado nos limites
 */
export const useCanPerformAction = () => {
  const { empresa } = useEmpresa();
  const { empresaId } = useAuth();

  const canAddUser = async (): Promise<{ allowed: boolean; reason?: string }> => {
    if (!empresa?.plano || !empresaId) {
      return { allowed: false, reason: 'Plano não encontrado' };
    }

    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId);

    const current = count || 0;
    const limit = empresa.plano.max_usuarios;

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit} usuário(s) atingido. Faça upgrade para adicionar mais.`,
      };
    }

    return { allowed: true };
  };

  const canAddAgente = async (): Promise<{ allowed: boolean; reason?: string }> => {
    if (!empresa?.plano || !empresaId) {
      return { allowed: false, reason: 'Plano não encontrado' };
    }

    const { count } = await supabase
      .from('agentes_ia')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId)
      .eq('status', 'active');

    const current = count || 0;
    const limit = empresa.plano.max_agentes;

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit} agente(s) atingido. Faça upgrade para criar mais.`,
      };
    }

    return { allowed: true };
  };

  const canSendMessage = async (): Promise<{ allowed: boolean; reason?: string }> => {
    if (!empresa?.plano || !empresaId) {
      return { allowed: false, reason: 'Plano não encontrado' };
    }

    const mesAtual = new Date();
    mesAtual.setDate(1);
    const { data: usoData } = await supabase
      .from('uso_recursos')
      .select('mensagens_enviadas')
      .eq('empresa_id', empresaId)
      .eq('mes_referencia', mesAtual.toISOString().split('T')[0])
      .single();

    const current = usoData?.mensagens_enviadas || 0;
    const limit = empresa.plano.limite_mensagens_mes;

    if (current >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit.toLocaleString('pt-BR')} mensagens/mês atingido. Faça upgrade para enviar mais.`,
      };
    }

    return { allowed: true };
  };

  return {
    canAddUser,
    canAddAgente,
    canSendMessage,
  };
};
