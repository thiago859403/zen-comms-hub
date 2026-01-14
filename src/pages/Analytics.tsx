import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Users, MessageSquare, Clock, Target, Star } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { 
  isDemoAccount, 
  getDemoChartData, 
  getDemoAnalyticsKPIs,
  getDemoChannelPerformance,
  getDemoChatbotPerformance,
  getDemoHeatmapData,
  getDemoFunnelData
} from "@/utils/demoData";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const { user } = useAuth();
  const isDemo = isDemoAccount(user?.email);

  // Dados
  const kpis = isDemo ? getDemoAnalyticsKPIs() : null;
  const chartData = isDemo ? getDemoChartData() : [];
  const channelData = isDemo ? getDemoChannelPerformance() : [];
  const chatbotData = isDemo ? getDemoChatbotPerformance() : [];
  const heatmapData = isDemo ? getDemoHeatmapData() : [];
  const funnelData = isDemo ? getDemoFunnelData() : [];

  const chartConfig = {
    disparos: {
      label: "Disparos",
      color: "hsl(var(--primary))",
    },
    atendimentos: {
      label: "Atendimentos",
      color: "hsl(var(--accent))",
    },
  };

  const pieConfig = {
    whatsapp: { label: "WhatsApp", color: "hsl(var(--primary))" },
    messenger: { label: "Messenger", color: "hsl(var(--accent))" },
    instagram: { label: "Instagram", color: "#E1306C" },
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#E1306C'];

  // Formatar número para exibição
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Preparar dados do heatmap (agrupar por hora para simplificar visualização)
  const heatmapChartData = heatmapData.length > 0 
    ? Array.from({ length: 24 }, (_, hour) => {
        const hourData = heatmapData.filter(d => d.hour === hour);
        const avgValue = hourData.reduce((sum, d) => sum + d.value, 0) / hourData.length;
        return {
          hour: `${hour}h`,
          value: Math.round(avgValue),
        };
      })
    : [];

  // Preparar dados do pie chart
  const pieChartData = channelData.map(ch => ({
    name: ch.channel,
    value: ch.messages,
  }));

  // Preparar dados do funil
  const funnelChartData = funnelData.map((item, index) => ({
    name: item.stage,
    value: item.value,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Análises</h1>
          <p className="text-muted-foreground mt-2">
            Métricas e insights sobre o desempenho da plataforma
          </p>
        </div>

        {/* KPIs Principais */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? formatNumber(kpis.mensagens.value) : '0'}
              </div>
              {kpis && (
                <p className={cn(
                  "text-xs flex items-center gap-1",
                  kpis.mensagens.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {kpis.mensagens.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpis.mensagens.change >= 0 ? '+' : ''}{kpis.mensagens.change}% {kpis.mensagens.period}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? kpis.usuariosAtivos.value.toLocaleString('pt-BR') : '0'}
              </div>
              {kpis && (
                <p className={cn(
                  "text-xs flex items-center gap-1",
                  kpis.usuariosAtivos.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {kpis.usuariosAtivos.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  +{kpis.usuariosAtivos.change}% {kpis.usuariosAtivos.period}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? `${kpis.taxaConversao.value.toFixed(1)}%` : '0%'}
              </div>
              {kpis && (
                <p className={cn(
                  "text-xs flex items-center gap-1",
                  kpis.taxaConversao.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {kpis.taxaConversao.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  +{kpis.taxaConversao.change}% {kpis.taxaConversao.period}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? `${kpis.tempoResposta.value.toFixed(1)}s` : '0s'}
              </div>
              {kpis && (
                <p className={cn(
                  "text-xs flex items-center gap-1",
                  kpis.tempoResposta.change >= 0 ? "text-red-600" : "text-green-600"
                )}>
                  {kpis.tempoResposta.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpis.tempoResposta.change >= 0 ? '+' : ''}{kpis.tempoResposta.change.toFixed(1)}s {kpis.tempoResposta.period}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? `${kpis.satisfacao.value.toFixed(1)}/5` : '0/5'}
              </div>
              {kpis && (
                <p className="text-xs text-muted-foreground">
                  {kpis.satisfacao.totalAvaliacoes.toLocaleString('pt-BR')} avaliações
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpis ? `${kpis.roi.value}%` : '0%'}
              </div>
              {kpis && (
                <p className="text-xs text-muted-foreground">
                  {kpis.roi.description}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Principais */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 1. Volume x Atendimento */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Volume de Disparos e Atendimentos</CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-64">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: '12px' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="disparos" fill="hsl(var(--primary))" name="Disparos" />
                    <Line 
                      type="monotone" 
                      dataKey="atendimentos" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Atendimentos"
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ChartContainer>
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Sem dados para exibir</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Distribuição de Canais */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Distribuição por Canal</CardTitle>
              <CardDescription>Mensagens por canal de comunicação</CardDescription>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ChartContainer config={pieConfig} className="h-64">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Sem dados para exibir</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Mapa de Calor de Horários */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Mapa de Calor - Atividade por Horário</CardTitle>
              <CardDescription>Média de mensagens por hora do dia</CardDescription>
            </CardHeader>
            <CardContent>
              {heatmapChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-64">
                  <ComposedChart data={heatmapChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: '11px' }}
                    />
                    <YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: '12px' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Mensagens" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ChartContainer>
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Sem dados para exibir</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Funil de Engajamento */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Funil de Engajamento</CardTitle>
              <CardDescription>Jornada de conversão do usuário</CardDescription>
            </CardHeader>
            <CardContent>
              {funnelChartData.length > 0 ? (
                <div className="h-64 flex flex-col justify-center">
                  <div className="space-y-2">
                    {funnelData.map((item, index) => {
                      const maxValue = funnelData[0].value;
                      const widthPercent = (item.value / maxValue) * 100;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.stage}</span>
                            <span className="text-muted-foreground">
                              {item.value.toLocaleString('pt-BR')} ({item.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${widthPercent}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Sem dados para exibir</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Métricas Secundárias */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Canal</CardTitle>
              <CardDescription>Métricas de cada canal de comunicação</CardDescription>
            </CardHeader>
            <CardContent>
              {channelData.length > 0 ? (
                <div className="space-y-4">
                  {channelData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <span className="font-medium">{item.channel}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{formatNumber(item.messages)} msgs</span>
                        <span className="text-green-600 font-medium">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Sem dados para exibir</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Chatbots por Performance</CardTitle>
              <CardDescription>Bots com melhor desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              {chatbotData.length > 0 ? (
                <div className="space-y-4">
                  {chatbotData.map((bot, i) => (
                    <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <span className="font-medium">{bot.name}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{formatNumber(bot.interactions)}</span>
                        <span className="text-green-600 font-medium">{bot.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Sem dados para exibir</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
