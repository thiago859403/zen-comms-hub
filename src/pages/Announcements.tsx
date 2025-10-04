import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, TrendingUp, Plus, MoreVertical, Edit, Trash2, Play, Pause } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Announcements = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: 1, name: "Campanha de Verão 1", daysAgo: 1, status: "Ativa", views: 15200, conversions: "12.5%" },
    { id: 2, name: "Campanha de Verão 2", daysAgo: 2, status: "Ativa", views: 12800, conversions: "10.2%" },
    { id: 3, name: "Campanha de Verão 3", daysAgo: 3, status: "Pausada", views: 8500, conversions: "8.9%" },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    name: "",
    type: "banner",
    message: "",
    duration: "7",
  });

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.name || !newAnnouncement.message) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const announcement = {
      id: announcements.length + 1,
      name: newAnnouncement.name,
      daysAgo: 0,
      status: "Ativa",
      views: 0,
      conversions: "0%",
    };

    setAnnouncements([announcement, ...announcements]);
    setIsCreateDialogOpen(false);
    setNewAnnouncement({ name: "", type: "banner", message: "", duration: "7" });
    
    toast({
      title: "Anúncio criado!",
      description: `${newAnnouncement.name} foi criado com sucesso.`,
    });
  };

  const handleToggleStatus = (id: number) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id 
        ? { ...ann, status: ann.status === "Ativa" ? "Pausada" : "Ativa" }
        : ann
    ));
    
    toast({
      title: "Status atualizado",
      description: "O status do anúncio foi alterado.",
    });
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
    toast({
      title: "Anúncio excluído",
      description: "O anúncio foi removido com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Anúncios</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus anúncios e campanhas publicitárias
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Megaphone className="mr-2 h-4 w-4" />
                Criar Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Anúncio</DialogTitle>
                <DialogDescription>
                  Configure uma nova campanha publicitária
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Promoção Black Friday"
                    value={newAnnouncement.name}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Anúncio</Label>
                  <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="popup">Pop-up</SelectItem>
                      <SelectItem value="notification">Notificação</SelectItem>
                      <SelectItem value="email">E-mail Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite a mensagem do anúncio..."
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (dias)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newAnnouncement.duration}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, duration: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateAnnouncement} className="w-full">
                  Criar Anúncio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.filter(a => a.status === "Ativa").length}</div>
              <p className="text-xs text-muted-foreground">Campanhas em andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
              <p className="text-xs text-muted-foreground">+12% este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% vs semana passada</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas Recentes</CardTitle>
            <CardDescription>Suas últimas campanhas de anúncios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{ann.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Criada há {ann.daysAgo === 0 ? "agora" : `${ann.daysAgo} ${ann.daysAgo === 1 ? "dia" : "dias"}`}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        {ann.views.toLocaleString()} visualizações
                      </span>
                      <span className="text-muted-foreground">
                        {ann.conversions} conversão
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.status === "Ativa" ? "default" : "secondary"}>
                      {ann.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(ann.id)}>
                          {ann.status === "Ativa" ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
