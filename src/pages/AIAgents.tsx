import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { canAddAgente } from "@/lib/planLimits";

interface AgenteIA {
  id: number;
  empresa_id: number;
  nome: string;
  instrucoes: string;
  created_by: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const AIAgents = () => {
  const { user, empresaId } = useAuth();
  const { empresa } = useEmpresa();
  const { toast } = useToast();

  const [agentes, setAgentes] = useState<AgenteIA[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgente, setEditingAgente] = useState<AgenteIA | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    instrucoes: "",
    status: "active" as "active" | "inactive" | "draft",
  });

  useEffect(() => {
    if (empresaId) {
      loadAgentes();
    }
  }, [empresaId]);

  const loadAgentes = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("agentes_ia")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAgentes((data as AgenteIA[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar agentes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (agente?: AgenteIA) => {
    if (agente) {
      setEditingAgente(agente);
      setFormData({
        nome: agente.nome,
        instrucoes: agente.instrucoes,
        status: agente.status as "active" | "inactive" | "draft",
      });
    } else {
      setEditingAgente(null);
      setFormData({
        nome: "",
        instrucoes: "",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAgente(null);
  };

  const handleSave = async () => {
    if (!empresaId || !user) {
      toast({
        title: "Erro",
        description: "Empresa ou usuário não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nome.trim() || !formData.instrucoes.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e instruções são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validar limite se for criação
    if (!editingAgente) {
      try {
        const limitCheck = await canAddAgente(empresaId);
        if (!limitCheck.allowed) {
          toast({
            title: "Limite excedido",
            description: limitCheck.reason || "Não é possível criar mais agentes",
            variant: "destructive",
          });
          return;
        }
      } catch (error: any) {
        console.error("Erro ao verificar limite:", error);
        // segue mesmo se falhar a checagem
      }
    }

    setSaving(true);

    try {
      if (editingAgente) {
        const { error } = await supabase
          .from("agentes_ia")
          .update({
            nome: formData.nome,
            instrucoes: formData.instrucoes,
            status: formData.status,
          })
          .eq("id", editingAgente.id)
          .eq("empresa_id", empresaId);

        if (error) throw error;

        toast({
          title: "Agente atualizado",
          description: "Agente de IA atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("agentes_ia")
          .insert({
            empresa_id: empresaId,
            nome: formData.nome,
            instrucoes: formData.instrucoes,
            status: formData.status,
            created_by: user.id,
          });

        if (error) throw error;

        toast({
          title: "Agente criado",
          description: "Agente de IA criado com sucesso",
        });
      }

      handleCloseDialog();
      loadAgentes();
    } catch (error: any) {
      toast({
        title: editingAgente ? "Erro ao atualizar" : "Erro ao criar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (agenteId: number) => {
    try {
      const { error } = await supabase
        .from("agentes_ia")
        .delete()
        .eq("id", agenteId)
        .eq("empresa_id", empresaId);

      if (error) throw error;

      toast({
        title: "Agente removido",
        description: "Agente de IA removido com sucesso",
      });

      loadAgentes();
    } catch (error: any) {
      toast({
        title: "Erro ao remover agente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      active: { label: "Ativo", variant: "default" },
      inactive: { label: "Inativo", variant: "secondary" },
      draft: { label: "Rascunho", variant: "outline" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Agentes de IA</h2>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie agentes de IA personalizados para sua empresa
            </p>
          </div>

          {/* ✅ Botão fora do DialogTrigger (mais estável para testes) */}
          <Button
            data-testid="create-agent"
            aria-label="Criar agente"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Agente
          </Button>
        </div>

        {/* ✅ Dialog controlado */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            data-testid="agent-dialog"
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>
                {editingAgente ? "Editar Agente de IA" : "Criar Novo Agente de IA"}
              </DialogTitle>
              <DialogDescription>
                Configure o nome e as instruções (system prompt) do agente de IA
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Agente *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Atendente de Vendas"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Nome descritivo para identificar o agente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrucoes">Instruções (System Prompt) *</Label>
                <Textarea
                  id="instrucoes"
                  placeholder="Ex: Você é um atendente de vendas profissional e amigável..."
                  value={formData.instrucoes}
                  onChange={(e) =>
                    setFormData({ ...formData, instrucoes: e.target.value })
                  }
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Defina o comportamento, personalidade e contexto do agente. Este
                  será o system prompt usado nas conversas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as "active" | "inactive" | "draft",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
                Cancelar
              </Button>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : editingAgente ? (
                  "Atualizar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resumo */}
        {empresa?.plano && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Agentes Ativos</CardDescription>
                <CardTitle className="text-2xl">
                  {agentes.filter((a) => a.status === "active").length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  de {empresa.plano.max_agentes} permitidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total de Agentes</CardDescription>
                <CardTitle className="text-2xl">{agentes.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Agentes criados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rascunhos</CardDescription>
                <CardTitle className="text-2xl">
                  {agentes.filter((a) => a.status === "draft").length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Agentes */}
        <Card>
          <CardHeader>
            <CardTitle>Agentes de IA</CardTitle>
            <CardDescription>Gerencie seus agentes de IA personalizados</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : agentes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum agente de IA criado</p>

                <Button
                  data-testid="create-agent-empty"
                  aria-label="Criar primeiro agente"
                  className="mt-4"
                  variant="outline"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Agente
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Instruções</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {agentes.map((agente) => (
                    <TableRow key={agente.id}>
                      <TableCell className="font-medium">{agente.nome}</TableCell>

                      <TableCell>
                        <div className="max-w-md">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {agente.instrucoes}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(agente.status)}</TableCell>

                      <TableCell>
                        {format(new Date(agente.created_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(agente)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover o agente "{agente.nome}"?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(agente.id)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAgents;
