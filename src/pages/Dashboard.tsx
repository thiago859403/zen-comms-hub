import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Send,
  Eye,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import dashboardIllustration from "@/assets/dashboard-illustration.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const stats = [
    {
      label: "Mensagens Enviadas",
      value: "12,345",
      change: "+12%",
      icon: Send,
      color: "text-primary",
    },
    {
      label: "Mensagens Entregues",
      value: "11,890",
      change: "+8%",
      icon: MessageSquare,
      color: "text-accent",
    },
    {
      label: "Contatos Ativos",
      value: "3,456",
      change: "+23%",
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Taxa de Leitura",
      value: "87%",
      change: "+5%",
      icon: Eye,
      color: "text-accent",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Bem-vindo de volta! 👋</h2>
            <p className="text-muted-foreground mt-1">
              Aqui está o resumo das suas campanhas
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/campaigns")}>
            <Send className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg bg-secondary p-2", stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-accent">
                    <TrendingUp className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts and recent activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart placeholder */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mensagens nos últimos 7 dias</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard/analytics")}
              >
                Ver detalhes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground">Gráfico de mensagens</p>
            </div>
          </Card>

          {/* Recent campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campanhas Recentes</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard/campaigns")}
              >
                Ver todas
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">Campanha de Boas-vindas {i}</p>
                    <p className="text-sm text-muted-foreground">1.234 envios • 87% entregues</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent">Ativa</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={dashboardIllustration} 
              alt="Dashboard illustration" 
              className="w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Comece a automatizar agora</h3>
              <p className="text-muted-foreground mb-4">
                Configure sua primeira campanha e comece a enviar mensagens automatizadas para seus contatos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate("/dashboard/campaigns")}>
                  Criar Campanha
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard/contacts")}
                >
                  Importar Contatos
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard/templates")}
                >
                  Criar Template
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;