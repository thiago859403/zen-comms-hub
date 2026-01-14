import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, UserPlus, Search, Mail, Loader2, Trash2, MessageSquare, Plug, Key, FileText, Webhook, TestTube, DollarSign, FileCheck, Copy, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle, Bell, Smartphone, User, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  status: string;
  role: string;
  created_at: string;
}

const OrganizationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteRole, setNewInviteRole] = useState<"admin" | "operator" | "viewer" | "agent">("agent");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Estados para o perfil do usuário
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileFormData, setProfileFormData] = useState({
    full_name: "",
    email: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Mapear perfis para incluir role (usar coluna role de profiles, com fallback para user_roles)
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          // Priorizar coluna role diretamente de profiles (novo modelo)
          let userRole = profile.role || "user";
          
          // Se não houver role em profiles, tentar buscar em user_roles (compatibilidade)
          if (!profile.role) {
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", profile.id)
              .maybeSingle(); // usar maybeSingle ao invés de single para não falhar

            userRole = roleData?.role || "user";
          }

          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            status: profile.status || "active",
            role: userRole,
            created_at: profile.created_at
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!newInviteEmail) {
      toast({
        title: "E-mail obrigatório",
        description: "Digite o e-mail do usuário a ser convidado.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Convite preparado",
        description: `Funcionalidade de convite em desenvolvimento. E-mail: ${newInviteEmail}`,
      });

      setNewInviteEmail("");
      setNewInviteRole("agent");
      setIsInviteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      // Deletar role atual
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      // Inserir nova role - cast explícito para o tipo correto
      const { error } = await supabase
        .from("user_roles")
        .insert([{
          user_id: userId,
          role: newRole as "admin" | "user"
        }]);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "O perfil do usuário foi atualizado com sucesso."
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Usuário ${newStatus === "active" ? "ativado" : "desativado"} com sucesso.`
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        const avatarUrl = data.avatar_url || null;
        setUserProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          avatar_url: avatarUrl,
        });
        setProfileFormData({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
        });
        setAvatarPreview(avatarUrl);
      }
    } catch (error: any) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      let avatarUrl = userProfile?.avatar_url || null;

      // Se houver arquivo de avatar, fazer upload
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload para Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Obter URL pública
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = urlData.publicUrl;

        // Limpar estado do arquivo
        setAvatarFile(null);
      }

      // Atualizar perfil
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileFormData.full_name,
          email: profileFormData.email,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      await loadUserProfile();
      
      // Pequeno delay para garantir que o banco foi atualizado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Forçar atualização do dashboard para refletir mudanças no header
      console.log('Disparando evento profile-updated');
      window.dispatchEvent(new CustomEvent('profile-updated'));
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Configurações da Nuvia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie canais, integrações, usuários e configurações da organização
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="h-auto items-center gap-1">
              <TabsTrigger value="account" className="gap-2 px-3 py-2 whitespace-nowrap">
                <User className="h-4 w-4" />
                <span>Minha Conta</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2 px-3 py-2 whitespace-nowrap">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="channels" className="gap-2 px-3 py-2 whitespace-nowrap">
                <MessageSquare className="h-4 w-4" />
                <span>Canais</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2 px-3 py-2 whitespace-nowrap">
                <Plug className="h-4 w-4" />
                <span>Integrações</span>
              </TabsTrigger>
              <TabsTrigger value="tokens" className="gap-2 px-3 py-2 whitespace-nowrap">
                <Key className="h-4 w-4" />
                <span>Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2 px-3 py-2 whitespace-nowrap">
                <FileText className="h-4 w-4" />
                <span>Modelos</span>
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="gap-2 px-3 py-2 whitespace-nowrap">
                <Webhook className="h-4 w-4" />
                <span>Webhooks</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 px-3 py-2 whitespace-nowrap">
                <Bell className="h-4 w-4" />
                <span>Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="gap-2 px-3 py-2 whitespace-nowrap">
                <TestTube className="h-4 w-4" />
                <span>Sandbox</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="gap-2 px-3 py-2 whitespace-nowrap">
                <DollarSign className="h-4 w-4" />
                <span>Financeiro</span>
              </TabsTrigger>
              <TabsTrigger value="plans" className="gap-2 px-3 py-2 whitespace-nowrap">
                <FileCheck className="h-4 w-4" />
                <span>Planos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Minha Conta - Configurações Pessoais */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto de Perfil */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarPreview || userProfile?.avatar_url || undefined} alt="Foto de perfil" />
                      <AvatarFallback className="text-2xl">
                        {profileFormData.full_name
                          ? profileFormData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : user?.email?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Foto de Perfil</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Clique no ícone da câmera para alterar sua foto. Formatos aceitos: JPG, PNG (máx. 5MB)
                    </p>
                    {avatarFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(userProfile?.avatar_url || null);
                        }}
                      >
                        Cancelar alteração
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {profileLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={profileFormData.full_name}
                          onChange={(e) => setProfileFormData({ ...profileFormData, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={profileFormData.email}
                          onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar alterações"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso à plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input id="current-password" type="password" placeholder="Digite sua senha atual" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input id="new-password" type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirme sua nova senha" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Alterar senha</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integração WhatsApp Pessoal</CardTitle>
                <CardDescription>
                  Configure sua conexão pessoal com WhatsApp Business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp Business</p>
                      <p className="text-sm text-muted-foreground">+55 11 99999-1234</p>
                    </div>
                  </div>
                  <Button variant="outline">Desconectar</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="phone-id">Phone Number ID</Label>
                  <Input id="phone-id" placeholder="Digite seu Phone Number ID" />
                  <p className="text-xs text-muted-foreground">
                    Encontre este ID no console do Meta Business
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-id">WhatsApp Business Account ID</Label>
                  <Input id="business-id" placeholder="Digite seu Business Account ID" />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Salvar configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários desta organização</CardTitle>
                    <CardDescription>
                      Gerencie os usuários e suas permissões
                    </CardDescription>
                  </div>
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Adicionar novo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Convidar novo usuário</DialogTitle>
                        <DialogDescription>
                          Envie um convite por e-mail para adicionar um novo membro à organização
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="invite-email">E-mail</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            placeholder="usuario@exemplo.com"
                            value={newInviteEmail}
                            onChange={(e) => setNewInviteEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="invite-role">Perfil</Label>
                          <Select value={newInviteRole} onValueChange={(value: any) => setNewInviteRole(value)}>
                            <SelectTrigger id="invite-role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="operator">Operador</SelectItem>
                              <SelectItem value="viewer">Visualizador</SelectItem>
                              <SelectItem value="agent">Agente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleInviteUser} className="w-full gap-2">
                          <Mail className="h-4 w-4" />
                          Enviar convite
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar usuários por nome"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Perfil do usuário</TableHead>
                          <TableHead>Último acesso</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.full_name || "Sem nome"}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="operator">Operador</SelectItem>
                                  <SelectItem value="viewer">Visualizador</SelectItem>
                                  <SelectItem value="agent">Agente</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {user.status === "active" ? "Ativo" : "Inativo"}
                                </span>
                                <Switch
                                  checked={user.status === "active"}
                                  onCheckedChange={() => handleToggleUserStatus(user.id, user.status)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Canais de comunicação</CardTitle>
                    <CardDescription>
                      Conecte e gerencie canais como WhatsApp, Instagram e E-mail
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plug className="h-4 w-4" />
                    Adicionar canal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">WhatsApp Business</h3>
                          <p className="text-sm text-muted-foreground">+55 11 99999-9999</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Conectado
                        </Badge>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">Configurar</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Última sincronização</p>
                        <p className="font-medium">Há 5 minutos</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mensagens hoje</p>
                        <p className="font-medium">147</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status da API</p>
                        <p className="font-medium text-green-500">Operacional</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 opacity-60">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">E-mail</h3>
                          <p className="text-sm text-muted-foreground">Não configurado</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Conectar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Integrações externas</CardTitle>
                    <CardDescription>
                      Conecte CRM, ERP e outras plataformas via API
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plug className="h-4 w-4" />
                    Nova integração
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma integração configurada. Adicione sua primeira integração para conectar sistemas externos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tokens de API</CardTitle>
                    <CardDescription>
                      Gere e gerencie tokens para acesso à API
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Key className="h-4 w-4" />
                    Gerar novo token
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Permissões</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">API Principal</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">nvsk_••••••••••••••••</code>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Completo</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">Sem expiração</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Modelos de mensagens</CardTitle>
                    <CardDescription>
                      Biblioteca de templates para WhatsApp e outros canais
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Criar modelo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Boas-vindas</h3>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Aprovado
                        </Badge>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      Olá {"{"}{"{"}{"}"}nome{"}"}{"}"}{"}"}! Bem-vindo(a) à Nuvia Cloud. Como posso ajudar você hoje?
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Variáveis: nome</p>
                  </div>

                  <div className="rounded-lg border p-4 opacity-60">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Confirmação de Pedido</h3>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pendente
                        </Badge>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      Pedido #{"{"}{"{"}{"}"}pedido{"}"}{"}"}{"}"}  confirmado! Total: R$ {"{"}{"{"}{"}"}valor{"}"}{"}"}{"}"}. Previsão de entrega: {"{"}{"{"}{"}"}data{"}"}{"}"}{"}"}.
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Variáveis: pedido, valor, data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>
                      Configure webhooks para receber eventos em tempo real
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Webhook className="h-4 w-4" />
                    Novo webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Mensagens Recebidas</h3>
                        <code className="text-xs text-muted-foreground">https://api.seusite.com/webhooks/messages</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ativo
                        </Badge>
                        <Button variant="outline" size="sm">Testar</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Eventos</p>
                        <p className="font-medium">message.received, message.sent</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Último disparo</p>
                        <p className="font-medium">Há 2 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sandbox" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ambiente Sandbox</CardTitle>
                <CardDescription>
                  Teste fluxos e integrações sem afetar o ambiente de produção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-500">Modo Teste</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mensagens enviadas neste ambiente não serão entregues a clientes reais.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-phone">Número de teste</Label>
                    <Input 
                      id="test-phone"
                      placeholder="+55 11 99999-9999"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-message">Mensagem de teste</Label>
                    <Textarea
                      id="test-message"
                      placeholder="Digite sua mensagem aqui..."
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <Button className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Enviar teste
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-3">Logs de teste</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Mensagem de boas-vindas</p>
                        <p className="text-muted-foreground text-xs">+55 11 99999-9999</p>
                      </div>
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Sucesso
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Plano atual</CardDescription>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">R$ 297,00/mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Próximo vencimento</CardDescription>
                  <CardTitle className="text-2xl">15 Jan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default">Em dia</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Consumo este mês</CardDescription>
                  <CardTitle className="text-2xl">R$ 147,00</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">2.450 mensagens</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de pagamentos</CardTitle>
                <CardDescription>Visualize faturas e gere segunda via</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>15/12/2024</TableCell>
                        <TableCell>Plano Professional - Dezembro</TableCell>
                        <TableCell>R$ 297,00</TableCell>
                        <TableCell>
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Pago
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Ver fatura</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>15/11/2024</TableCell>
                        <TableCell>Plano Professional - Novembro</TableCell>
                        <TableCell>R$ 297,00</TableCell>
                        <TableCell>
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Pago
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Ver fatura</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por e-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações sobre suas campanhas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios semanais</Label>
                    <p className="text-sm text-muted-foreground">
                      Resumo semanal de suas métricas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de falhas</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado imediatamente sobre problemas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novas funcionalidades</Label>
                    <p className="text-sm text-muted-foreground">
                      Fique por dentro das atualizações da plataforma
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano e contrato</CardTitle>
                <CardDescription>
                  Informações sobre seu plano atual e contratos assinados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Detalhes do plano</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plano:</span>
                          <span className="font-medium">Professional</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ativado em:</span>
                          <span className="font-medium">15/10/2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Renovação:</span>
                          <span className="font-medium">Mensal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Próximo vencimento:</span>
                          <span className="font-medium">15/01/2025</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Recursos inclusos</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          10.000 mensagens/mês
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          5 usuários
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Chatbot com IA
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Suporte prioritário
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Ver contratos</Button>
                  <Button>Fazer upgrade</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OrganizationSettings;
