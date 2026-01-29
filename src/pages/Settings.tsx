import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Key, Webhook, Bell, User, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { SubscriptionManagement } from "@/components/subscription/SubscriptionManagement";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Configurações</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações da sua conta
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <Smartphone className="mr-2 h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="mr-2 h-4 w-4" />
              Assinatura
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="joao@empresa.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da empresa</Label>
                  <Input id="company" defaultValue="Minha Empresa Ltda" />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Salvar alterações</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Alterar senha</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* WhatsApp Settings */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Integração com WhatsApp</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                      <Smartphone className="h-6 w-6" />
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
              </div>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Chaves de API</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      defaultValue="sk_live_xxxxxxxxxxxxx"
                      readOnly
                    />
                    <Button variant="outline">Copiar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mantenha sua chave em segurança. Não compartilhe publicamente.
                  </p>
                </div>
                <Separator />
                <Button variant="outline">Gerar nova chave</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://seusite.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground">
                    Receba notificações em tempo real sobre eventos
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input id="webhook-secret" placeholder="Digite um secret" />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button>Salvar webhook</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preferências de Notificação</h3>
              <div className="space-y-6">
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
              </div>
            </Card>
          </TabsContent>

          {/* Subscription Settings */}
          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;