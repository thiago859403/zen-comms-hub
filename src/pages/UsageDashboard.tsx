import { useState, useEffect } from "react";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Users, Bot, TrendingUp, AlertTriangle } from "lucide-react";
import { UsageAlerts } from "@/components/usage/UsageAlerts";

interface UsageStats {
  usuarios_atuais: number;
  agentes_atuais: number;
  mensagens_este_mes: number;
  tokens_este_mes: number;
}

interface HistoricalUsage {
  mes: string;
  mensagens: number;
  tokens: number;
}

const UsageDashboard = () => {
  const { empresa } = useEmpresa();
  const { empresaId } = useAuth();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [historicalUsage, setHistoricalUsage] = useState<HistoricalUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) {
      loadUsageData();
    }
  }, [empresaId]);

  const loadUsageData = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);

      // Carregar estatísticas atuais
      const [usuariosResult, agentesResult, usoAtualResult, historicoResult] = await Promise.all([
        // Contar usuários
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId),
        
        // Contar agentes ativos
        supabase
          .from('agentes_ia')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId)
          .eq('status', 'active'),
        
        // Buscar uso do mês atual
        (async () => {
          const mesAtual = new Date();
          mesAtual.setDate(1);
          return await supabase
            .from('uso_recursos')
            .select('mensagens_enviadas, tokens_consumidos')
            .eq('empresa_id', empresaId)
            .eq('mes_referencia', mesAtual.toISOString().split('T')[0])
            .single();
        })(),
        
        // Buscar histórico dos últimos 6 meses
        (async () => {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setDate(1);
          
          const { data } = await supabase
            .from('uso_recursos')
            .select('mes_referencia, mensagens_enviadas, tokens_consumidos')
            .eq('empresa_id', empresaId)
            .gte('mes_referencia', sixMonthsAgo.toISOString().split('T')[0])
            .order('mes_referencia', { ascending: false })
            .limit(6);
          
          return data || [];
        })(),
      ]);

      const stats: UsageStats = {
        usuarios_atuais: usuariosResult.count || 0,
        agentes_atuais: agentesResult.count || 0,
        mensagens_este_mes: usoAtualResult.data?.mensagens_enviadas || 0,
        tokens_este_mes: usoAtualResult.data?.tokens_consumidos || 0,
      };

      setUsageStats(stats);

      // Formatar histórico
      const historico: HistoricalUsage[] = (historicoResult as any[]).map((item) => ({
        mes: new Date(item.mes_referencia).toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        }),
        mensagens: item.mensagens_enviadas || 0,
        tokens: item.tokens_consumidos || 0,
      }));

      setHistoricalUsage(historico);
    } catch (error) {
      console.error('Erro ao carregar dados de uso:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercent = (current: number, limit: number): number => {
    if (limit === 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percent: number): string => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!empresa?.plano) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não possui um plano ativo
            </p>
            <Button onClick={() => (window.location.href = '/dashboard/pricing')}>
              Ver Planos
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const plano = empresa.plano;

  const usuariosPercent = getUsagePercent(usageStats?.usuarios_atuais || 0, plano.max_usuarios);
  const agentesPercent = getUsagePercent(usageStats?.agentes_atuais || 0, plano.max_agentes);
  const mensagensPercent = getUsagePercent(
    usageStats?.mensagens_este_mes || 0,
    plano.limite_mensagens_mes
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard de Uso</h2>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu consumo mensal de recursos
          </p>
        </div>

        {/* Alertas */}
        <UsageAlerts />

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Usuários</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">
                {usageStats?.usuarios_atuais || 0} / {plano.max_usuarios}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={usuariosPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(usuariosPercent)}% do limite utilizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Agentes de IA</CardDescription>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">
                {usageStats?.agentes_atuais || 0} / {plano.max_agentes}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={agentesPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(agentesPercent)}% do limite utilizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Mensagens este mês</CardDescription>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">
                {usageStats?.mensagens_este_mes.toLocaleString('pt-BR') || 0} /{' '}
                {plano.limite_mensagens_mes.toLocaleString('pt-BR')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={mensagensPercent}
                className={`h-2 ${getUsageColor(mensagensPercent)}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(mensagensPercent)}% do limite utilizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes de Uso */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Uso de Mensagens</CardTitle>
              <CardDescription>Consumo mensal de mensagens enviadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Este mês</span>
                  <Badge variant="outline">
                    {usageStats?.mensagens_este_mes.toLocaleString('pt-BR') || 0} mensagens
                  </Badge>
                </div>
                <div className="space-y-2">
                  {historicalUsage.length > 0 ? (
                    historicalUsage.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.mes}</span>
                        <span className="font-medium">
                          {item.mensagens.toLocaleString('pt-BR')} mensagens
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum histórico disponível
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso de Tokens</CardTitle>
              <CardDescription>Consumo mensal de tokens de IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Este mês</span>
                  <Badge variant="outline">
                    {usageStats?.tokens_este_mes.toLocaleString('pt-BR') || 0} tokens
                  </Badge>
                </div>
                <div className="space-y-2">
                  {historicalUsage.length > 0 ? (
                    historicalUsage.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.mes}</span>
                        <span className="font-medium">
                          {item.tokens.toLocaleString('pt-BR')} tokens
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum histórico disponível
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        {(mensagensPercent >= 80 || usuariosPercent >= 80 || agentesPercent >= 80) && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Limite próximo ou excedido</h3>
                  <p className="text-sm text-muted-foreground">
                    Considere fazer upgrade do seu plano para continuar usando todos os recursos
                  </p>
                </div>
                <Button onClick={() => (window.location.href = '/dashboard/pricing')}>
                  Ver Planos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsageDashboard;
