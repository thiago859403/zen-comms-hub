import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Users,
  Send,
  Code,
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Info,
  X,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold">Olá, Admin!</h1>
          <p className="text-muted-foreground mt-1">
            Com o Nuvia Customer Cloud você pode atrair e fidelizar clientes, aumentar conversões, criar chatbots inteligentes e acompanhar seus resultados.
          </p>
        </div>

        {/* Top cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Comece por aqui */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comece por aqui</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">Adicionar equipe</p>
                    <Badge variant="secondary" className="text-xs">Contratar</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prepare-se para atender seus clientes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Importar base de contatos</p>
                  <p className="text-sm text-muted-foreground">
                    Conecte dados e conheça melhor seu público
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Disparar mensagem</p>
                  <p className="text-sm text-muted-foreground">
                    Atraia mais clientes com mensagens multicanais
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Plano ativo */}
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Plano ativo</h3>
                <Badge>Expert</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Período: 23/07/2024 - 22/08/2024
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Canais</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm">R$ 8,15/R$ 1.000,00</span>
                </div>
                <Progress value={1} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">InteractionZ</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm">35/2000</span>
                </div>
                <Progress value={1.75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Usuários</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm">14/30</span>
                </div>
                <Progress value={47} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Atualizado em: 21/08/2024 às 12:08
              </p>
            </div>
            <Button variant="link" className="mt-4 p-0 h-auto">
              Relatório de consumo
            </Button>
          </Card>

          {/* Dicas da Zoe */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Dicas da Zoe</h3>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Usuários</h4>
              <p className="text-sm text-muted-foreground">
                É a equipe que você adicionou, ou seja, a quantidade de pessoas que podem acessar e usar o zCC.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="link" className="p-0 h-auto text-primary">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Ver outra dica
              </Button>
            </div>
          </Card>
        </div>

        {/* Ações rápidas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate("/dashboard/message-sending")}
            >
              <Send className="h-6 w-6" />
              <span>Disparar mensagens</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate("/dashboard/contacts")}
            >
              <Users className="h-6 w-6" />
              <span>Gerir contatos</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate("/dashboard/chats")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Atender clientes</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate("/dashboard/settings")}
            >
              <Code className="h-6 w-6" />
              <span>Habilitar canal</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => navigate("/dashboard/settings")}
            >
              <FileText className="h-6 w-6" />
              <span>Ver faturas</span>
            </Button>
          </div>
        </div>

        {/* Painel de contatos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Painel de contatos</h2>
              <p className="text-sm text-muted-foreground">
                Conheça seus clientes: acompanhe o alcance dos seus disparos e a conversão dos atendimentos da sua equipe.
              </p>
            </div>
            <Button variant="link" className="gap-2">
              Acessar painel de contatos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Base de contatos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Total de contatos adicionados
              </p>
              <p className="text-4xl font-bold mb-2">47</p>
              <p className="text-xs text-muted-foreground">
                Período: Desde o início
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Contatos alcançados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contatos que receberam mensagem
              </p>
              <p className="text-4xl font-bold mb-2">8</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-green-600">+4</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">100%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Período: 21/07/2024 - 20/08/2024
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Contatos atendidos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contatos que receberam algum atendimento
              </p>
              <p className="text-4xl font-bold mb-2">5</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-green-600">+1</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">25%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Período: 21/07/2024 - 20/08/2024
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Taxa de atendimentos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Percentual de contatos atendidos após receberem mensagem
              </p>
              <p className="text-4xl font-bold mb-2">62,5%</p>
              <p className="text-xs text-muted-foreground mt-4">
                Período: 21/07/2024 - 20/08/2024
              </p>
            </Card>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Volume de disparos e atendimentos comerciais
            </h3>
            <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground">Gráfico de linha e barras</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Período: 21/07/2024 - 20/08/2024
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição geográfica</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Distribuição dos contatos por disparo e atendimento
            </p>
            <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground">Mapa do Brasil</p>
            </div>
          </Card>
        </div>

        {/* Footer slogan */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Conecte, atraia, atenda e converta mais!</h2>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;