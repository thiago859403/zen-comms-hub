import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GitBranch, Plus, Play, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Flow {
  id: string;
  name: string;
  nodes: number;
  connections: number;
  chatbot: string;
  status: "active" | "draft";
  description?: string;
}

const FlowMap = () => {
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([
    { id: "1", name: "Fluxo de Vendas", nodes: 24, connections: 38, chatbot: "Atendimento Comercial", status: "active" },
    { id: "2", name: "Suporte Nível 1", nodes: 18, connections: 26, chatbot: "Suporte Técnico", status: "active" },
    { id: "3", name: "FAQ Padrão", nodes: 32, connections: 45, chatbot: "FAQ Automático", status: "active" },
    { id: "4", name: "Agendamento de Serviços", nodes: 15, connections: 22, chatbot: "Agendamento", status: "draft" },
  ]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    chatbot: "",
    description: "",
    status: "draft" as "active" | "draft",
  });

  const activeFlows = flows.filter(f => f.status === "active").length;
  const draftFlows = flows.filter(f => f.status === "draft").length;
  const totalNodes = flows.reduce((sum, f) => sum + f.nodes, 0);

  const handleCreateFlow = () => {
    if (!formData.name || !formData.chatbot) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newFlow: Flow = {
      id: Date.now().toString(),
      name: formData.name,
      chatbot: formData.chatbot,
      description: formData.description,
      status: formData.status,
      nodes: 0,
      connections: 0,
    };

    setFlows([...flows, newFlow]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", chatbot: "", description: "", status: "draft" });
    
    toast({
      title: "Fluxo criado!",
      description: `O fluxo "${newFlow.name}" foi criado com sucesso.`,
    });
  };

  const handleEditFlow = () => {
    if (!selectedFlow || !formData.name || !formData.chatbot) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setFlows(flows.map(f => 
      f.id === selectedFlow.id 
        ? { ...f, name: formData.name, chatbot: formData.chatbot, description: formData.description, status: formData.status }
        : f
    ));
    
    setIsEditDialogOpen(false);
    setSelectedFlow(null);
    setFormData({ name: "", chatbot: "", description: "", status: "draft" });
    
    toast({
      title: "Fluxo atualizado!",
      description: `O fluxo foi atualizado com sucesso.`,
    });
  };

  const handleDeleteFlow = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    setFlows(flows.filter(f => f.id !== flowId));
    
    toast({
      title: "Fluxo excluído",
      description: `O fluxo "${flow?.name}" foi excluído.`,
    });
  };

  const openEditDialog = (flow: Flow) => {
    setSelectedFlow(flow);
    setFormData({
      name: flow.name,
      chatbot: flow.chatbot,
      description: flow.description || "",
      status: flow.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleViewFlow = (flow: Flow) => {
    toast({
      title: "Visualizando fluxo",
      description: `Abrindo editor visual para "${flow.name}"`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mapa de fluxos</h1>
            <p className="text-muted-foreground mt-2">
              Crie e visualize os fluxos de conversação dos chatbots
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Fluxo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Fluxo</DialogTitle>
                <DialogDescription>
                  Defina as informações básicas do novo fluxo de conversação
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Fluxo *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Fluxo de Vendas"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="chatbot">Chatbot Associado *</Label>
                  <Select value={formData.chatbot} onValueChange={(value) => setFormData({ ...formData, chatbot: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um chatbot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atendimento Comercial">Atendimento Comercial</SelectItem>
                      <SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem>
                      <SelectItem value="FAQ Automático">FAQ Automático</SelectItem>
                      <SelectItem value="Agendamento">Agendamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "draft") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo deste fluxo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateFlow}>Criar Fluxo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fluxos Ativos</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeFlows}</div>
              <p className="text-xs text-muted-foreground">Em produção</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <Play className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftFlows}</div>
              <p className="text-xs text-muted-foreground">Rascunhos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Nós</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNodes}</div>
              <p className="text-xs text-muted-foreground">Em todos os fluxos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {flows.map((flow) => (
            <Card key={flow.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GitBranch className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{flow.name}</CardTitle>
                        {flow.status === "draft" && (
                          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-xs rounded-full">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs">{flow.chatbot}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewFlow(flow)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(flow)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteFlow(flow.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nós: </span>
                    <span className="font-semibold">{flow.nodes}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conexões: </span>
                    <span className="font-semibold">{flow.connections}</span>
                  </div>
                </div>
                {flow.description && (
                  <p className="text-xs text-muted-foreground mt-3">{flow.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Fluxo</DialogTitle>
              <DialogDescription>
                Atualize as informações do fluxo de conversação
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome do Fluxo *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-chatbot">Chatbot Associado *</Label>
                <Select value={formData.chatbot} onValueChange={(value) => setFormData({ ...formData, chatbot: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atendimento Comercial">Atendimento Comercial</SelectItem>
                    <SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem>
                    <SelectItem value="FAQ Automático">FAQ Automático</SelectItem>
                    <SelectItem value="Agendamento">Agendamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "draft") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição (opcional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditFlow}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FlowMap;
