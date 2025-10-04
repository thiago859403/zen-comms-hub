import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MessageSquare, Clock, Target } from "lucide-react";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Análises</h1>
          <p className="text-muted-foreground mt-2">
            Métricas e insights sobre o desempenho da plataforma
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2k</div>
              <p className="text-xs text-muted-foreground">+20% vs mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,429</div>
              <p className="text-xs text-muted-foreground">+12% esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-muted-foreground">+3.2% vs semana passada</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4s</div>
              <p className="text-xs text-muted-foreground">-0.3s vs ontem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7/5</div>
              <p className="text-xs text-muted-foreground">892 avaliações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340%</div>
              <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Canal</CardTitle>
              <CardDescription>Métricas de cada canal de comunicação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { channel: "WhatsApp", messages: "28.5k", rate: "92%" },
                  { channel: "Messenger", messages: "12.3k", rate: "88%" },
                  { channel: "Instagram", messages: "4.4k", rate: "85%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <span className="font-medium">{item.channel}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{item.messages} msgs</span>
                      <span className="text-green-600 font-medium">{item.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Chatbots por Performance</CardTitle>
              <CardDescription>Bots com melhor desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Atendimento Comercial", score: "96%", interactions: "12.5k" },
                  { name: "Suporte Técnico", score: "94%", interactions: "8.2k" },
                  { name: "FAQ Automático", score: "91%", interactions: "15.3k" },
                ].map((bot, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <span className="font-medium">{bot.name}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{bot.interactions}</span>
                      <span className="text-green-600 font-medium">{bot.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
