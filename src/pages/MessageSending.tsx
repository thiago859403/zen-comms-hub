import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Users, Clock, Calendar, Eye, MessageSquare, Target, ArrowUpRight, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";
import { messageSchema } from "@/lib/validations";
import { z } from "zod";

interface Campaign {
  id: string;
  name: string;
  type: string;
  channel: string;
  segment: string;
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  converted: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
  status: "completed" | "scheduled" | "sending";
  createdAt: string;
}

interface Filters {
  period: "7D" | "15D" | "30D" | "90D" | "12M" | "custom";
  channel: string;
  segment: string;
  compare: string;
}

const MessageSending = () => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("create");
  const [message, setMessage] = useState({
    campaignType: "",
    recipients: "all",
    template: "",
    content: "",
    scheduleDate: "",
    scheduleTime: "",
  });

  const [scheduleNow, setScheduleNow] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    period: "30D",
    channel: "all",
    segment: "all",
    compare: "none",
  });

  // Dados de exemplo para campanhas (expandidos com canal e segmento)
  const allCampaigns: Campaign[] = [
    {
      id: "1",
      name: "Campanha Black Friday",
      type: "Promocional",
      channel: "whatsapp",
      segment: "campanha",
      sent: 5421,
      delivered: 5380,
      opened: 4120,
      replied: 1245,
      converted: 342,
      openRate: 76.6,
      replyRate: 23.1,
      conversionRate: 6.4,
      status: "completed",
      createdAt: "2024-11-25",
    },
    {
      id: "2",
      name: "Newsletter Semanal",
      type: "Informativo",
      channel: "email",
      segment: "campanha",
      sent: 3200,
      delivered: 3185,
      opened: 2100,
      replied: 450,
      converted: 89,
      openRate: 65.9,
      replyRate: 14.1,
      conversionRate: 2.8,
      status: "completed",
      createdAt: "2024-11-20",
    },
    {
      id: "3",
      name: "Follow-up Vendas",
      type: "Follow-up",
      channel: "whatsapp",
      segment: "chatbot",
      sent: 1890,
      delivered: 1875,
      opened: 1420,
      replied: 520,
      converted: 156,
      openRate: 75.7,
      replyRate: 27.7,
      conversionRate: 8.3,
      status: "completed",
      createdAt: "2024-11-18",
    },
    {
      id: "4",
      name: "Promoção Instagram",
      type: "Promocional",
      channel: "instagram",
      segment: "campanha",
      sent: 2150,
      delivered: 2130,
      opened: 1680,
      replied: 420,
      converted: 95,
      openRate: 78.9,
      replyRate: 25.0,
      conversionRate: 4.4,
      status: "completed",
      createdAt: "2024-11-22",
    },
    {
      id: "5",
      name: "Mensagem Messenger",
      type: "Notificação",
      channel: "messenger",
      segment: "operador",
      sent: 1200,
      delivered: 1185,
      opened: 890,
      replied: 210,
      converted: 45,
      openRate: 75.1,
      replyRate: 23.6,
      conversionRate: 3.8,
      status: "completed",
      createdAt: "2024-11-19",
    },
  ];

  // Filtrar campanhas baseado nos filtros
  const campaigns = useMemo(() => {
    let filtered = [...allCampaigns];
    
    if (filters.channel !== "all") {
      filtered = filtered.filter(c => c.channel === filters.channel);
    }
    
    if (filters.segment !== "all") {
      filtered = filtered.filter(c => c.segment === filters.segment);
    }
    
    return filtered;
  }, [filters.channel, filters.segment]);

  // Métricas agregadas
  const metrics = useMemo(() => {
    const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
    const totalReplied = campaigns.reduce((sum, c) => sum + c.replied, 0);
    const totalConverted = campaigns.reduce((sum, c) => sum + c.converted, 0);
    
    return {
      totalSent,
      totalDelivered,
      totalOpened,
      totalReplied,
      totalConverted,
      avgOpenRate: totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0,
      avgReplyRate: totalOpened > 0 ? (totalReplied / totalOpened) * 100 : 0,
      avgConversionRate: totalReplied > 0 ? (totalConverted / totalReplied) * 100 : 0,
    };
  }, [campaigns]);

  // Gerar dados de histórico baseado no período
  const historyData = useMemo(() => {
    const days = filters.period === "7D" ? 7 : filters.period === "15D" ? 15 : filters.period === "30D" ? 30 : filters.period === "90D" ? 90 : 30;
    const data = [];
    
    const baseData = [
      { date: "20/11", enviadas: 3200, abertas: 2100, respondidas: 450 },
      { date: "21/11", enviadas: 2800, abertas: 1850, respondidas: 380 },
      { date: "22/11", enviadas: 3500, abertas: 2250, respondidas: 520 },
      { date: "23/11", enviadas: 4100, abertas: 2650, respondidas: 620 },
      { date: "24/11", enviadas: 3800, abertas: 2400, respondidas: 580 },
      { date: "25/11", enviadas: 5421, abertas: 4120, respondidas: 1245 },
      { date: "26/11", enviadas: 2900, abertas: 1950, respondidas: 420 },
    ];
    
    // Ajustar dados baseado no período e filtros
    const multiplier = filters.channel !== "all" ? 0.6 : 1;
    return baseData.slice(0, days <= 7 ? days : 7).map(d => ({
      ...d,
      enviadas: Math.round(d.enviadas * multiplier),
      abertas: Math.round(d.abertas * multiplier),
      respondidas: Math.round(d.respondidas * multiplier),
    }));
  }, [filters.period, filters.channel]);

  // Dados para gráfico de performance por campanha (filtrados)
  const campaignPerformanceData = useMemo(() => {
    return campaigns.map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
      "Taxa de Abertura": c.openRate,
      "Taxa de Resposta": c.replyRate,
      "Taxa de Conversão": c.conversionRate,
    }));
  }, [campaigns]);

  const handleSendMessage = () => {
    setErrors({});
    
    try {
      const validatedData = messageSchema.parse({
        recipients: message.recipients,
        message: message.content,
        scheduledDate: message.scheduleDate,
        scheduledTime: message.scheduleTime,
      });

      toast({
        title: "Campanha criada!",
        description: scheduleNow 
          ? "Sua campanha está sendo enviada agora."
          : "Sua campanha foi agendada com sucesso.",
      });

      setMessage({
        campaignType: "",
        recipients: "all",
        template: "",
        content: "",
        scheduleDate: "",
        scheduleTime: "",
      });
      setActiveTab("history");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const fieldName = err.path[0].toString() === 'message' ? 'content' : err.path[0].toString();
            fieldErrors[fieldName] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os erros no formulário.",
          variant: "destructive",
        });
      }
    }
  };

  const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  // Componente de barra de filtros
  const FilterBar = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <CardTitle className="text-lg">Filtros</CardTitle>
        </div>
        <CardDescription>
          Ajuste os filtros para analisar performance e comparar resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={filters.period} onValueChange={(value: Filters["period"]) => setFilters({ ...filters, period: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7D">Últimos 7 dias</SelectItem>
                <SelectItem value="15D">Últimos 15 dias</SelectItem>
                <SelectItem value="30D">Últimos 30 dias</SelectItem>
                <SelectItem value="90D">Últimos 90 dias</SelectItem>
                <SelectItem value="12M">Últimos 12 meses</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Canal</Label>
            <Select value={filters.channel} onValueChange={(value) => setFilters({ ...filters, channel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os canais</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="messenger">Messenger</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Segmentação</Label>
            <Select value={filters.segment} onValueChange={(value) => setFilters({ ...filters, segment: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="campanha">Campanha</SelectItem>
                <SelectItem value="chatbot">Chatbot</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="tag">Tag</SelectItem>
                <SelectItem value="origem">Origem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comparação</Label>
            <Select value={filters.compare} onValueChange={(value) => setFilters({ ...filters, compare: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="previous">vs Período Anterior</SelectItem>
                <SelectItem value="channel">vs Canal</SelectItem>
                <SelectItem value="chatbot">vs Chatbot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filters.period === "custom" && (
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label>Data inicial</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Data final</Label>
              <Input type="date" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Nuvia Blast</h1>
          <p className="text-muted-foreground mt-2">
            Dispare mensagens em escala para sua base de contatos, automatizando comunicações e aumentando o alcance da sua operação
          </p>
        </div>

        {/* KPIs Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Atingidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSent.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">
                {campaigns.length} campanha(s) ativa(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgOpenRate.toFixed(1)}%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+2.3% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgReplyRate.toFixed(1)}%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+1.8% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalConverted.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.avgConversionRate.toFixed(1)}% de taxa de conversão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Mensagens programadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Criar Campanha / Histórico / Resultados */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="create">Nova Campanha</TabsTrigger>
            <TabsTrigger value="history">Histórico de Disparos</TabsTrigger>
            <TabsTrigger value="results">Resultados por Campanha</TabsTrigger>
          </TabsList>

          {/* Tab: Nova Campanha */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Campanha de Mensagens</CardTitle>
                <CardDescription>
                  Permita que sua empresa se comunique com múltiplos contatos ao mesmo tempo através de campanhas, fluxos ou disparos manuais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-type">Tipo de Campanha</Label>
                    <Select value={message.campaignType} onValueChange={(value) => setMessage({ ...message, campaignType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de campanha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notification">Notificações</SelectItem>
                        <SelectItem value="promo">Campanhas Promocionais</SelectItem>
                        <SelectItem value="info">Informativos</SelectItem>
                        <SelectItem value="transactional">Mensagens Transacionais</SelectItem>
                        <SelectItem value="followup">Follow-ups Comerciais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Destinatários</Label>
                    <Select value={message.recipients} onValueChange={(value) => setMessage({ ...message, recipients: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os contatos</SelectItem>
                        <SelectItem value="clients">Apenas clientes</SelectItem>
                        <SelectItem value="leads">Apenas leads</SelectItem>
                        <SelectItem value="vip">Clientes VIP</SelectItem>
                        <SelectItem value="custom">Seleção personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template (opcional)</Label>
                  <Select value={message.template} onValueChange={(value) => setMessage({ ...message, template: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template pré-definido" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Boas-vindas</SelectItem>
                      <SelectItem value="promo">Promoção</SelectItem>
                      <SelectItem value="reminder">Lembrete</SelectItem>
                      <SelectItem value="notification">Notificação</SelectItem>
                      <SelectItem value="transactional">Transacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Mensagem</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite sua mensagem aqui..."
                    value={message.content}
                    onChange={(e) => setMessage({ ...message, content: e.target.value })}
                    rows={6}
                  />
                  {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Use variáveis para personalização: {"{{nome}}"}, {"{{empresa}}"}, {"{{produto}}"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {message.content.length} caracteres
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="schedule-now" 
                      checked={scheduleNow}
                      onCheckedChange={(checked) => setScheduleNow(checked as boolean)}
                    />
                    <label
                      htmlFor="schedule-now"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enviar agora
                    </label>
                  </div>

                  {!scheduleNow && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="schedule-date">
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Data de envio
                        </Label>
                        <Input
                          id="schedule-date"
                          type="date"
                          value={message.scheduleDate}
                          onChange={(e) => setMessage({ ...message, scheduleDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schedule-time">
                          <Clock className="inline h-4 w-4 mr-2" />
                          Horário de envio
                        </Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          value={message.scheduleTime}
                          onChange={(e) => setMessage({ ...message, scheduleTime: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    {scheduleNow ? "Enviar Agora" : "Agendar Envio"}
                  </Button>
                  <Button variant="outline" onClick={() => setMessage({
                    campaignType: "",
                    recipients: "all",
                    template: "",
                    content: "",
                    scheduleDate: "",
                    scheduleTime: "",
                  })}>
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Histórico de Disparos */}
          <TabsContent value="history" className="space-y-6">
            <FilterBar />
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Disparos</CardTitle>
                <CardDescription>
                  Acompanhe o desempenho das suas campanhas ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="enviadas" fill="#8b5cf6" name="Enviadas" radius={[8, 8, 0, 0]} />
                      <Line type="monotone" dataKey="abertas" stroke="#10b981" strokeWidth={2} name="Abertas" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="respondidas" stroke="#3b82f6" strokeWidth={2} name="Respondidas" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Campanhas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Enviadas</TableHead>
                      <TableHead>Abertas</TableHead>
                      <TableHead>Respondidas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{campaign.channel}</Badge>
                        </TableCell>
                        <TableCell>{campaign.sent.toLocaleString('pt-BR')}</TableCell>
                        <TableCell>
                          {campaign.opened.toLocaleString('pt-BR')}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({campaign.openRate.toFixed(1)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          {campaign.replied.toLocaleString('pt-BR')}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({campaign.replyRate.toFixed(1)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={campaign.status === "completed" ? "default" : "secondary"}
                          >
                            {campaign.status === "completed" ? "Concluída" : campaign.status === "scheduled" ? "Agendada" : "Enviando"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Resultados por Campanha */}
          <TabsContent value="results" className="space-y-6">
            <FilterBar />
            
            <Card>
              <CardHeader>
                <CardTitle>Performance por Campanha</CardTitle>
                <CardDescription>
                  Compare o desempenho das suas campanhas através de métricas-chave
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="Taxa de Abertura" fill="#8b5cf6" name="Taxa de Abertura (%)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Taxa de Resposta" fill="#10b981" name="Taxa de Resposta (%)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Taxa de Conversão" fill="#3b82f6" name="Taxa de Conversão (%)" radius={[8, 8, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </div>
                    <CardDescription>
                      Enviada em {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Enviadas</p>
                        <p className="text-2xl font-bold">{campaign.sent.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entregues</p>
                        <p className="text-2xl font-bold">{campaign.delivered.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Abertas</p>
                        <p className="text-2xl font-bold">{campaign.opened.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-green-600">{campaign.openRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Respondidas</p>
                        <p className="text-2xl font-bold">{campaign.replied.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-blue-600">{campaign.replyRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Conversões</span>
                        <span className="text-lg font-bold text-primary">{campaign.converted}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Taxa de conversão</span>
                          <span>{campaign.conversionRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(campaign.conversionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MessageSending;
