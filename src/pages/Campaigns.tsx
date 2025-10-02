import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreVertical,
  Send,
  Pause,
  Play,
  Trash2,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const campaigns = [
    {
      id: 1,
      name: "Campanha de Boas-vindas",
      status: "active",
      sent: 1234,
      delivered: 1180,
      read: 890,
      lastSent: "Há 2 horas",
    },
    {
      id: 2,
      name: "Promoção Black Friday",
      status: "scheduled",
      sent: 0,
      delivered: 0,
      read: 0,
      lastSent: "Agendado para 24/11",
    },
    {
      id: 3,
      name: "Follow-up de Vendas",
      status: "paused",
      sent: 856,
      delivered: 820,
      read: 650,
      lastSent: "Há 1 dia",
    },
    {
      id: 4,
      name: "Newsletter Semanal",
      status: "active",
      sent: 3421,
      delivered: 3350,
      read: 2890,
      lastSent: "Há 3 horas",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent/10 text-accent";
      case "paused":
        return "bg-muted text-muted-foreground";
      case "scheduled":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa";
      case "paused":
        return "Pausada";
      case "scheduled":
        return "Agendada";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Campanhas</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie suas campanhas de mensagens
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Search and filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar campanhas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Todos</Button>
              <Button variant="outline">Ativos</Button>
              <Button variant="outline">Pausados</Button>
              <Button variant="outline">Agendados</Button>
            </div>
          </div>
        </Card>

        {/* Campaigns list */}
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Campaign info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Último envio: {campaign.lastSent}
                  </p>
                </div>

                {/* Campaign stats */}
                <div className="grid grid-cols-3 gap-6 lg:gap-8">
                  <div>
                    <p className="text-2xl font-bold">{campaign.sent}</p>
                    <p className="text-xs text-muted-foreground">Enviadas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{campaign.delivered}</p>
                    <p className="text-xs text-muted-foreground">Entregues</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{campaign.read}</p>
                    <p className="text-xs text-muted-foreground">Lidas</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {campaign.status === "active" && (
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {campaign.status === "paused" && (
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar agora
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver relatório
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;