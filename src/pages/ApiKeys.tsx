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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key, Plus, Trash2, CheckCircle2, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { validateApiKey } from "@/lib/apiKeyValidation";

interface ApiKey {
  id: number;
  empresa_id: number;
  provider: string;
  key_name: string;
  key_hash: string; // Apenas os primeiros caracteres para exibição
  is_active: boolean;
  is_default: boolean;
  created_by: string | null;
  last_used_at: string | null;
  usage_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  claude: 'Claude (Anthropic)',
  anthropic: 'Anthropic',
  google: 'Google',
  other: 'Outro',
};

const ApiKeys = () => {
  const { user, empresaId } = useAuth();
  const { empresa } = useEmpresa();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState<number | null>(null);

  const [newKey, setNewKey] = useState({
    provider: '',
    key_name: '',
    key_value: '',
    is_default: false,
  });

  useEffect(() => {
    if (empresaId) {
      loadApiKeys();
    }
  }, [empresaId]);

  const loadApiKeys = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApiKeys((data as ApiKey[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chaves",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!empresaId || !user) {
      toast({
        title: "Erro",
        description: "Empresa ou usuário não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (!newKey.provider || !newKey.key_name || !newKey.key_value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Validar chave antes de salvar
      const validation = await validateApiKey(newKey.provider, newKey.key_value);
      
      if (!validation.valid) {
        toast({
          title: "Chave inválida",
          description: validation.error || "Não foi possível validar a chave",
          variant: "destructive",
        });
        return;
      }

      // Chamar Edge Function para inserir chave (criptografa automaticamente)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/api-keys-insert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            provider: newKey.provider,
            key_name: newKey.key_name,
            key_value: newKey.key_value,
            is_default: newKey.is_default,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar chave');
      }

      toast({
        title: "Chave adicionada",
        description: "Chave API adicionada com sucesso",
      });

      // Reset form
      setNewKey({
        provider: '',
        key_name: '',
        key_value: '',
        is_default: false,
      });
      setIsDialogOpen(false);
      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar chave",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeleteKey = async (keyId: number) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('empresa_id', empresaId);

      if (error) throw error;

      toast({
        title: "Chave removida",
        description: "Chave API removida com sucesso",
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao remover chave",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (keyId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId)
        .eq('empresa_id', empresaId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Chave desativada" : "Chave ativada",
        description: `Chave API ${currentStatus ? 'desativada' : 'ativada'} com sucesso`,
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar chave",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (keyId: number) => {
    try {
      // Primeiro, remover default de outras chaves do mesmo provider
      const key = apiKeys.find(k => k.id === keyId);
      if (!key) return;

      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ is_default: false })
        .eq('empresa_id', empresaId)
        .eq('provider', key.provider)
        .eq('is_default', true);

      if (updateError) throw updateError;

      // Definir esta chave como padrão
      const { error } = await supabase
        .from('api_keys')
        .update({ is_default: true })
        .eq('id', keyId)
        .eq('empresa_id', empresaId);

      if (error) throw error;

      toast({
        title: "Chave padrão definida",
        description: "Chave padrão atualizada com sucesso",
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao definir chave padrão",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const maskKeyHash = (hash: string) => {
    if (!hash || hash.length < 8) return '••••••••';
    return `${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Chaves de API</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie suas chaves API para integração com serviços de IA (BYOK)
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Chave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Chave API</DialogTitle>
                <DialogDescription>
                  Adicione uma chave API de um provedor de IA. A chave será criptografada e armazenada com segurança.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provedor</Label>
                  <Select
                    value={newKey.provider}
                    onValueChange={(value) => setNewKey({ ...newKey, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o provedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key_name">Nome da Chave</Label>
                  <Input
                    id="key_name"
                    placeholder="Ex: Chave OpenAI Produção"
                    value={newKey.key_name}
                    onChange={(e) => setNewKey({ ...newKey, key_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key_value">Chave API</Label>
                  <Input
                    id="key_value"
                    type="password"
                    placeholder="sk-..."
                    value={newKey.key_value}
                    onChange={(e) => setNewKey({ ...newKey, key_value: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    A chave será validada antes de ser salva
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={newKey.is_default}
                    onChange={(e) => setNewKey({ ...newKey, is_default: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_default" className="text-sm font-normal">
                    Definir como chave padrão para este provedor
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isValidating}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddKey} disabled={isValidating}>
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    'Adicionar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ) : apiKeys.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Nenhuma chave API cadastrada
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Chave
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Chaves Cadastradas</CardTitle>
              <CardDescription>
                Gerencie suas chaves API. Apenas metadados são exibidos por segurança.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Provedor</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Último Uso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.key_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {providerLabels[key.provider] || key.provider}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {showKey === key.id ? (
                          <span className="flex items-center gap-2">
                            {maskKeyHash(key.key_hash)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setShowKey(null)}
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            ••••••••
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setShowKey(key.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {key.is_default && (
                            <Badge variant="default" className="text-xs">Padrão</Badge>
                          )}
                          {key.is_active ? (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Ativa
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <XCircle className="mr-1 h-3 w-3" />
                              Inativa
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{key.usage_count.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        {key.last_used_at
                          ? format(new Date(key.last_used_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                          : 'Nunca'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!key.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(key.id)}
                            >
                              Definir padrão
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(key.id, key.is_active)}
                          >
                            {key.is_active ? 'Desativar' : 'Ativar'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover esta chave API? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteKey(key.id)}>
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
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApiKeys;
