import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Search, Plus, MoreVertical, Edit, Trash2, Play, Pause } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const ChatbotList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [bots, setBots] = useState([
    { id: 1, name: "Atendimento Comercial", type: "Vendas", status: "Ativo", messages: "2.5k" },
    { id: 2, name: "Suporte Técnico", type: "Suporte", status: "Ativo", messages: "1.8k" },
    { id: 3, name: "FAQ Automático", type: "FAQ", status: "Pausado", messages: "892" },
    { id: 4, name: "Agendamento", type: "Serviços", status: "Ativo", messages: "1.2k" },
    { id: 5, name: "Pós-venda", type: "Relacionamento", status: "Ativo", messages: "654" },
    { id: 6, name: "Onboarding", type: "Educacional", status: "Ativo", messages: "423" },
  ]);

  const [newBot, setNewBot] = useState({
    name: "",
    type: "Vendas",
    description: "",
  });

  const filteredBots = bots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || bot.type === filterType;
    const matchesStatus = filterStatus === "all" || bot.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateBot = () => {
    if (!newBot.name) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para o chatbot",
        variant: "destructive",
      });
      return;
    }

    const bot = {
      id: bots.length + 1,
      name: newBot.name,
      type: newBot.type,
      status: "Ativo",
      messages: "0",
    };

    setBots([...bots, bot]);
    setIsCreateDialogOpen(false);
    setNewBot({ name: "", type: "Vendas", description: "" });
    
    toast({
      title: "Chatbot criado!",
      description: `${newBot.name} foi criado com sucesso.`,
    });
  };

  const handleToggleStatus = (id: number) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === "Ativo" ? "Pausado" : "Ativo" }
        : bot
    ));
    
    toast({
      title: "Status atualizado",
      description: "O status do chatbot foi alterado.",
    });
  };

  const handleDeleteBot = (id: number) => {
    setBots(bots.filter(bot => bot.id !== id));
    toast({
      title: "Chatbot excluído",
      description: "O chatbot foi removido com sucesso.",
    });
  };

  const types = ["Vendas", "Suporte", "FAQ", "Serviços", "Relacionamento", "Educacional"];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lista de chatbots</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os seus chatbots em um só lugar
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Chatbot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Chatbot</DialogTitle>
                <DialogDescription>
                  Configure um novo chatbot para automatizar seu atendimento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Chatbot</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Atendimento Comercial"
                    value={newBot.name}
                    onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newBot.type} onValueChange={(value) => setNewBot({ ...newBot, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva a função deste chatbot..."
                    value={newBot.description}
                    onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateBot} className="w-full">
                  Criar Chatbot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar chatbots por nome ou tipo..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <CardDescription className="text-xs">{bot.type}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={bot.status === "Ativo" ? "default" : "secondary"}>
                      {bot.status}
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
                        <DropdownMenuItem onClick={() => handleToggleStatus(bot.id)}>
                          {bot.status === "Ativo" ? (
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
                          onClick={() => handleDeleteBot(bot.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mensagens processadas</span>
                  <span className="font-semibold">{bot.messages}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBots.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chatbot encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Ajuste seus filtros ou crie um novo chatbot
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Chatbot
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChatbotList;
