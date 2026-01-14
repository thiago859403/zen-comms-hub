import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Activity, TrendingUp, Shield, BarChart3, Clock, Edit, Trash2, Lock, Unlock, UserPlus, Search, Mail, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Empresa {
  id: number;
  nome: string;
  plano_id: number | null;
  plano_nome?: string;
  status: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  usuarios_count?: number;
}

interface Plano {
  id: number;
  nome: string;
  preco_mensal: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmpresaDialogOpen, setIsEmpresaDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [empresaUsers, setEmpresaUsers] = useState<UserProfile[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [empresaFormData, setEmpresaFormData] = useState({
    nome: "",
    plano_id: "",
    status: "active",
    is_active: true,
  });

  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user",
  });

  useEffect(() => {
    checkMasterAdminAccess();
    loadData();
  }, []);

  const checkMasterAdminAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar autenticado",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Verificar se é master admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "master") {
      toast({
        title: "Acesso negado",
        description: "Apenas o administrador master pode acessar esta página",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar empresas
      const { data: empresasData, error: empresasError } = await supabase
        .from("empresas")
        .select("*")
        .order("created_at", { ascending: false });

      if (empresasError) throw empresasError;

      // Carregar planos
      const { data: planosData, error: planosError } = await supabase
        .from("planos")
        .select("*")
        .eq("is_active", true)
        .order("preco_mensal");

      if (planosError) throw planosError;

      // Contar usuários por empresa
      const empresasWithCounts = await Promise.all(
        (empresasData || []).map(async (empresa: any) => {
          const { count } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("empresa_id", empresa.id);

          const planoNome = planosData?.find((p: Plano) => p.id === empresa.plano_id)?.nome || "Sem plano";

          return {
            ...empresa,
            usuarios_count: count || 0,
            plano_nome: planoNome,
          };
        })
      );

      setEmpresas(empresasWithCounts);
      setPlanos(planosData || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmpresaUsers = async (empresaId: number) => {
    try {
      const { data: usersData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEmpresaUsers(usersData || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmpresa = async () => {
    if (!editingEmpresa) return;

    try {
      const { error } = await supabase
        .from("empresas")
        .update({
          nome: empresaFormData.nome,
          plano_id: empresaFormData.plano_id ? parseInt(empresaFormData.plano_id) : null,
          status: empresaFormData.status,
          is_active: empresaFormData.is_active,
        })
        .eq("id", editingEmpresa.id);

      if (error) throw error;

      toast({
        title: "Empresa atualizada",
        description: "Alterações salvas com sucesso",
      });

      setIsEmpresaDialogOpen(false);
      resetEmpresaForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleEmpresaStatus = async (empresaId: number, currentStatus: boolean | null) => {
    const newStatus = !currentStatus;

    try {
      const { error } = await supabase
        .from("empresas")
        .update({ is_active: newStatus, status: newStatus ? "active" : "suspended" })
        .eq("id", empresaId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Empresa ${newStatus ? "ativada" : "suspensa"} com sucesso`,
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    if (!selectedEmpresaId) return;

    setIsCreatingUser(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userFormData.email,
        password: userFormData.password,
        options: {
          data: {
            full_name: userFormData.full_name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Atualizar perfil com empresa_id e role
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            empresa_id: selectedEmpresaId,
            role: userFormData.role,
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Usuário criado",
          description: "Usuário adicionado à empresa com sucesso",
        });

        resetUserForm();
        loadEmpresaUsers(selectedEmpresaId);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Permissões atualizadas",
        description: "Role do usuário atualizado com sucesso",
      });

      if (selectedEmpresaId) {
        loadEmpresaUsers(selectedEmpresaId);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Usuário ${newStatus === "active" ? "desbloqueado" : "bloqueado"} com sucesso`,
      });

      if (selectedEmpresaId) {
        loadEmpresaUsers(selectedEmpresaId);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditEmpresaDialog = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setEmpresaFormData({
      nome: empresa.nome,
      plano_id: empresa.plano_id?.toString() || "",
      status: empresa.status || "active",
      is_active: empresa.is_active ?? true,
    });
    setIsEmpresaDialogOpen(true);
  };

  const openUsersDialog = async (empresaId: number) => {
    setSelectedEmpresaId(empresaId);
    setIsUsersDialogOpen(true);
    await loadEmpresaUsers(empresaId);
  };

  const resetEmpresaForm = () => {
    setEmpresaFormData({
      nome: "",
      plano_id: "",
      status: "active",
      is_active: true,
    });
    setEditingEmpresa(null);
  };

  const resetUserForm = () => {
    setUserFormData({
      email: "",
      password: "",
      full_name: "",
      role: "user",
    });
  };

  const filteredEmpresas = empresas.filter((empresa) =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Painel Administrativo - Nuvia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os clientes da plataforma
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresas.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empresas.filter((e) => e.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empresas.reduce((sum, e) => sum + (e.usuarios_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {empresas.reduce((sum, e) => {
                  const plano = planos.find((p) => p.id === e.plano_id);
                  return sum + (plano?.preco_mensal || 0);
                }, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Empresas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clientes</CardTitle>
                <CardDescription>Lista de todas as empresas clientes</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma empresa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmpresas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">{empresa.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{empresa.plano_nome || "Sem plano"}</Badge>
                      </TableCell>
                      <TableCell>{empresa.usuarios_count || 0}</TableCell>
                      <TableCell>
                        <Badge variant={empresa.is_active ? "default" : "secondary"}>
                          {empresa.is_active ? "Ativo" : "Suspenso"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(empresa.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUsersDialog(empresa.id)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Usuários
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditEmpresaDialog(empresa)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleEmpresaStatus(empresa.id, empresa.is_active)}
                          >
                            {empresa.is_active ? (
                              <Lock className="h-4 w-4 text-destructive" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog: Editar Empresa */}
        <Dialog open={isEmpresaDialogOpen} onOpenChange={setIsEmpresaDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Empresa</DialogTitle>
              <DialogDescription>
                Altere os dados cadastrais e plano da empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={empresaFormData.nome}
                  onChange={(e) =>
                    setEmpresaFormData({ ...empresaFormData, nome: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plano_id">Plano</Label>
                <Select
                  value={empresaFormData.plano_id}
                  onValueChange={(value) =>
                    setEmpresaFormData({ ...empresaFormData, plano_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planos.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id.toString()}>
                        {plano.nome} - R$ {plano.preco_mensal.toFixed(2)}/mês
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={empresaFormData.status}
                  onValueChange={(value) =>
                    setEmpresaFormData({ ...empresaFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={empresaFormData.is_active}
                  onChange={(e) =>
                    setEmpresaFormData({ ...empresaFormData, is_active: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmpresaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateEmpresa}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Gerenciar Usuários */}
        <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Usuários</DialogTitle>
              <DialogDescription>
                Adicione novos usuários e gerencie permissões
              </DialogDescription>
            </DialogHeader>

            {/* Formulário para adicionar usuário */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Novo Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_email">E-mail</Label>
                    <Input
                      id="user_email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_password">Senha</Label>
                    <Input
                      id="user_password"
                      type="password"
                      value={userFormData.password}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">Nome Completo</Label>
                    <Input
                      id="user_name"
                      value={userFormData.full_name}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user_role">Permissão</Label>
                    <Select
                      value={userFormData.role}
                      onValueChange={(value) =>
                        setUserFormData({ ...userFormData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateUser} disabled={isCreatingUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isCreatingUser ? "Criando..." : "Adicionar Usuário"}
                </Button>
              </CardContent>
            </Card>

            {/* Lista de usuários */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Usuários da Empresa</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresaUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    empresaUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "-"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Ativo" : "Bloqueado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                          >
                            {user.status === "active" ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUsersDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
