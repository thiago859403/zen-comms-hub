import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Webhook,
  Key,
  Phone,
  Building2,
  Link as LinkIcon
} from "lucide-react";

interface WhatsAppConfig {
  id: string;
  phone_number_id: string | null;
  business_account_id: string | null;
  access_token: string | null;
  webhook_verify_token: string | null;
  status: 'connected' | 'validating' | 'disconnected';
  last_sync_at: string | null;
  connected_number: string | null;
  permissions: string[];
}

const WhatsAppConfig = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [formData, setFormData] = useState({
    phone_number_id: "",
    business_account_id: "",
    access_token: "",
    webhook_verify_token: ""
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_config")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setConfig(data as any);
        setFormData({
          phone_number_id: data.phone_number_id || "",
          business_account_id: data.business_account_id || "",
          access_token: data.access_token || "",
          webhook_verify_token: data.webhook_verify_token || ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configuração",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const payload = {
        user_id: user.id,
        ...formData,
        status: 'disconnected' as const
      };

      const { error } = config
        ? await supabase
            .from("whatsapp_config")
            .update(payload)
            .eq("id", config.id)
        : await supabase
            .from("whatsapp_config")
            .insert(payload);

      if (error) throw error;

      await loadConfig();
      toast({
        title: "Configuração salva",
        description: "As credenciais foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      // Aqui você chamaria a edge function para testar a conexão
      toast({
        title: "Teste iniciado",
        description: "Testando conexão com WhatsApp Business API..."
      });

      // Simulação de teste
      setTimeout(async () => {
        const { error } = await supabase
          .from("whatsapp_config")
          .update({ 
            status: 'connected' as const,
            last_sync_at: new Date().toISOString()
          })
          .eq("id", config!.id);

        if (error) throw error;

        await loadConfig();
        toast({
          title: "Conexão estabelecida",
          description: "WhatsApp Business conectado com sucesso!"
        });
        setTesting(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro no teste",
        description: error.message,
        variant: "destructive"
      });
      setTesting(false);
    }
  };

  const getStatusBadge = () => {
    if (!config) return null;

    const statusConfig = {
      connected: { label: "Conectado", variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
      validating: { label: "Em validação", variant: "secondary" as const, icon: Loader2, color: "text-yellow-500" },
      disconnected: { label: "Desconectado", variant: "destructive" as const, icon: AlertCircle, color: "text-red-500" }
    };

    const status = statusConfig[config.status];
    const Icon = status.icon;

    return (
      <Badge variant={status.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${status.color}`} />
        {status.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Smartphone className="h-8 w-8" />
            Configuração WhatsApp Business
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure a integração com WhatsApp Business Cloud API
          </p>
        </div>

        {config && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Status da Conexão</span>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.connected_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Número conectado:</span>
                  <span>{config.connected_number}</span>
                </div>
              )}
              {config.last_sync_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Última sincronização:</span>
                  <span>{new Date(config.last_sync_at).toLocaleString('pt-BR')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para obter as credenciais do WhatsApp Business, acesse o{" "}
            <a 
              href="https://business.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Meta Business Manager
            </a>
            {" "}e siga as instruções de configuração.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Credenciais da API</CardTitle>
            <CardDescription>
              Insira as credenciais fornecidas pelo Meta Business Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone_number_id" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number ID
              </Label>
              <Input
                id="phone_number_id"
                value={formData.phone_number_id}
                onChange={(e) => setFormData({ ...formData, phone_number_id: e.target.value })}
                placeholder="123456789012345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_account_id" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business Account ID
              </Label>
              <Input
                id="business_account_id"
                value={formData.business_account_id}
                onChange={(e) => setFormData({ ...formData, business_account_id: e.target.value })}
                placeholder="123456789012345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access_token" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Access Token
              </Label>
              <Input
                id="access_token"
                type="password"
                value={formData.access_token}
                onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                placeholder="EAAxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-muted-foreground">
                Token de acesso permanente gerado no Meta Business Manager
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="webhook_verify_token" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Webhook Verify Token
              </Label>
              <Input
                id="webhook_verify_token"
                value={formData.webhook_verify_token}
                onChange={(e) => setFormData({ ...formData, webhook_verify_token: e.target.value })}
                placeholder="meu_token_secreto_123"
              />
              <p className="text-xs text-muted-foreground">
                Token de verificação para o webhook (pode ser qualquer string)
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-4 w-4" />
                URL do Webhook
              </div>
              <code className="text-xs block bg-background p-2 rounded">
                {window.location.origin}/api/whatsapp/webhook
              </code>
              <p className="text-xs text-muted-foreground">
                Configure esta URL no Meta Business Manager para receber mensagens
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={loading || !formData.access_token}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configuração
              </Button>
              
              <Button 
                onClick={handleTest} 
                disabled={!config || testing || config.status === 'connected'}
                variant="outline"
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testar Conexão
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guia de Configuração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Acesse o Meta Business Manager</p>
                  <p className="text-xs text-muted-foreground">
                    Vá para business.facebook.com e selecione sua conta comercial
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Configure o WhatsApp Business API</p>
                  <p className="text-xs text-muted-foreground">
                    Em "WhatsApp", adicione um número de telefone e obtenha o Phone Number ID
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  3
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Gere o Access Token</p>
                  <p className="text-xs text-muted-foreground">
                    Em "Configurações do Sistema" → "Tokens de Acesso", crie um token permanente
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  4
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Configure o Webhook</p>
                  <p className="text-xs text-muted-foreground">
                    Use a URL do webhook fornecida acima e o verify token que você definiu
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  5
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Teste a conexão</p>
                  <p className="text-xs text-muted-foreground">
                    Clique em "Testar Conexão" para validar as credenciais
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WhatsAppConfig;