import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresa } from "@/hooks/useEmpresa";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, Users, MessageSquare, Bot, DollarSign, BarChart3 } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompanyMetrics {
  totalUsers: number;
  totalAgents: number;
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  activeConversations: number;
  closedConversations: number;
  messagesThisMonth: number;
  tokensThisMonth: number;
  growthRate: number;
  conversionRate: number;
}

interface PeriodComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

const AdminDashboard = () => {
  const { empresaId, profile } = useAuth();
  const { empresa } = useEmpresa();
  const [metrics, setMetrics] = useState<CompanyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    if (empresaId && (profile?.role === 'admin' || profile?.role === 'master')) {
      loadMetrics();
    }
  }, [empresaId, period]);

  const loadMetrics = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);

      const now = new Date();
      const periodStart = period === "7d" 
        ? subDays(now, 7)
        : period === "30d"
        ? subDays(now, 30)
        : subDays(now, 90);

      // Carregar métricas em paralelo
      const [
        usersResult,
        agentsResult,
        conversationsResult,
        messagesResult,
        usageResult,
        previousPeriodResult,
      ] = await Promise.all([
        // Total de usuários
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId),

        // Total de agentes de IA
        supabase
          .from('agentes_ia')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId)
          .eq('status', 'active'),

        // Total de conversas
        supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId),

        // Total de mensagens
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true }),

        // Uso do mês atual
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

        // Período anterior para comparação
        (async () => {
          const previousStart = period === "7d"
            ? subDays(periodStart, 7)
            : period === "30d"
            ? subDays(periodStart, 30)
            : subDays(periodStart, 90);

          const { count } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', empresaId)
            .gte('created_at', previousStart.toISOString())
            .lt('created_at', periodStart.toISOString());

          return count || 0;
        })(),
      ]);

      // Conversas ativas e fechadas
      const { count: activeConv } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .in('status', ['open', 'pending']);

      const { count: closedConv } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .eq('status', 'closed');

      // Conversas do período atual
      const { count: currentPeriodConv } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaId)
        .gte('created_at', periodStart.toISOString());

      const current = currentPeriodConv || 0;
      const previous = previousPeriodResult || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? ((change / previous) * 100) : (current > 0 ? 100 : 0);

      const usageData = usageResult.data;

      setMetrics({
        totalUsers: usersResult.count || 0,
        totalAgents: agentsResult.count || 0,
        totalConversations: conversationsResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalTokens: usageData?.tokens_consumidos || 0,
        activeConversations: activeConv || 0,
        closedConversations: closedConv || 0,
        messagesThisMonth: usageData?.mensagens_enviadas || 0,
        tokensThisMonth: usageData?.tokens_consumidos || 0,
        growthRate: changePercent,
        conversionRate: conversationsResult.count > 0 
          ? ((closedConv || 0) / conversationsResult.count) * 100 
          : 0,
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
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

  if (!metrics) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nenhuma métrica disponível</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard da Empresa</h2>
            <p className="text-muted-foreground mt-1">
              Métricas agregadas e performance da sua empresa
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "7d" | "30d" | "90d")}
              className="px-3 py-2 border rounded-md"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalUsers)}</div>
              <p className="text-xs text-muted-foreground">
                Total de colaboradores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes de IA</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalAgents)}</div>
              <p className="text-xs text-muted-foreground">
                Agentes ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.totalConversations)}</div>
              <div className="flex items-center gap-2 mt-1">
                {metrics.growthRate > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      +{metrics.growthRate.toFixed(1)}%
                    </span>
                  </>
                ) : metrics.growthRate < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600">
                      {metrics.growthRate.toFixed(1)}%
                    </span>
                  </>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.activeConversations} ativas, {metrics.closedConversations} fechadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metrics.messagesThisMonth)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Uso e Performance */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Uso de Recursos</CardTitle>
              <CardDescription>Consumo mensal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mensagens</span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(metrics.messagesThisMonth)}
                  </span>
                </div>
                {empresa?.plano && (
                  <div className="text-xs text-muted-foreground">
                    Limite: {formatNumber(empresa.plano.limite_mensagens_mes)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tokens</span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(metrics.tokensThisMonth)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão</CardTitle>
              <CardDescription>Conversas fechadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {metrics.closedConversations} de {metrics.totalConversations} conversas fechadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento</CardTitle>
              <CardDescription>Período: {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {metrics.growthRate > 0 ? (
                  <>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        +{metrics.growthRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Crescimento no período
                      </p>
                    </div>
                  </>
                ) : metrics.growthRate < 0 ? (
                  <>
                    <TrendingDown className="h-6 w-6 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {metrics.growthRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Variação no período
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">
                      Sem variação
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos (Placeholder) */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Conversas</CardTitle>
              <CardDescription>Últimos {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Gráfico de linha</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Conversas por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">Gráfico de pizza</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
