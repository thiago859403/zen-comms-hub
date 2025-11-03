import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
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
import {
  UserPlus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Search,
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  plan: string;
  status: string;
  created_at: string;
  last_login: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function Admin() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    company: "",
    plan: "free",
    status: "active",
  });

  useEffect(() => {
    checkAdminAccess();
    loadProfiles();
  }, []);

  const checkAdminAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar autenticado",
        variant: "destructive",
      });
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = roles?.some((r) => r.role === "admin");

    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  };

  const loadProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const rolesMap: Record<string, string[]> = {};
      rolesData?.forEach((role: UserRole) => {
        if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = [];
        }
        rolesMap[role.user_id].push(role.role);
      });

      setProfiles(profilesData || []);
      setUserRoles(rolesMap);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            company: formData.company,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            plan: formData.plan,
            status: formData.status,
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Usuário criado",
        description: "Conta criada com sucesso",
      });

      setIsDialogOpen(false);
      resetForm();
      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          company: formData.company,
          plan: formData.plan,
          status: formData.status,
        })
        .eq("id", editingProfile.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Alterações salvas com sucesso",
      });

      setIsDialogOpen(false);
      resetForm();
      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "Conta removida com sucesso",
      });

      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
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

      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleAdminRole = async (userId: string) => {
    const isCurrentlyAdmin = userRoles[userId]?.includes("admin");

    try {
      if (isCurrentlyAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });

        if (error) throw error;
      }

      toast({
        title: "Permissões atualizadas",
        description: isCurrentlyAdmin
          ? "Permissões de admin removidas"
          : "Permissões de admin concedidas",
      });

      loadProfiles();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingProfile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      email: profile.email,
      password: "",
      full_name: profile.full_name || "",
      company: profile.company || "",
      plan: profile.plan,
      status: profile.status,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      company: "",
      plan: "free",
      status: "active",
    });
    setEditingProfile(null);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      active: "default",
      blocked: "destructive",
      pending: "secondary",
    };

    const labels: Record<string, string> = {
      active: "Ativo",
      blocked: "Bloqueado",
      pending: "Pendente",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel do Administrador</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as contas de clientes da Nuvia
            </p>
          </div>
          <Button onClick={openCreateDialog} size="lg">
            <UserPlus className="mr-2 h-5 w-5" />
            Novo Cliente
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Último login</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.full_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {profile.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{profile.company || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{profile.plan}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(profile.status)}</TableCell>
                    <TableCell>
                      {userRoles[profile.id]?.includes("admin") && (
                        <Badge className="bg-primary">
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {profile.last_login
                        ? new Date(profile.last_login).toLocaleDateString("pt-BR")
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(profile)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleToggleStatus(profile.id, profile.status)
                          }
                        >
                          {profile.status === "active" ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleAdminRole(profile.id)}
                        >
                          <Shield
                            className={`h-4 w-4 ${
                              userRoles[profile.id]?.includes("admin")
                                ? "text-primary"
                                : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(profile.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {editingProfile
                ? "Atualize as informações do cliente"
                : "Preencha os dados para criar uma nova conta"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!!editingProfile}
                required
              />
            </div>
            {!editingProfile && (
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan">Plano</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) =>
                  setFormData({ ...formData, plan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingProfile ? handleUpdateProfile : handleCreateUser}
              disabled={isCreating}
            >
              {editingProfile ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
