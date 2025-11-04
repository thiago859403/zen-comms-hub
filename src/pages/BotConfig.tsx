import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot, Brain, GitBranch, Plus, Trash2, Loader2, Save } from "lucide-react";

interface BotConfig {
  id: string;
  bot_mode: 'keyword' | 'ai' | 'flow' | 'hybrid';
  fallback_to_human: boolean;
  auto_close_after_minutes: number;
  welcome_message: string;
  menu_message: string;
  transfer_message: string;
  offline_message: string;
  knowledge_base_enabled: boolean;
  ai_personality: string;
  ai_instructions: string;
}

interface Keyword {
  id: string;
  keyword: string;
  response: string;
  priority: number;
  active: boolean;
}

const BotConfig = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState({ keyword: '', response: '' });

  useEffect(() => {
    loadConfig();
    loadKeywords();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bot_config")
        .select("*")
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig(data as any);
      } else {
        // Create default config
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const { data: newConfig, error: createError } = await supabase
          .from("bot_config")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setConfig(newConfig as any);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configuração",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadKeywords = async () => {
    try {
      const { data: botConfigData } = await supabase
        .from("bot_config")
        .select("id")
        .single();

      if (!botConfigData) return;

      const { data, error } = await supabase
        .from("bot_keywords")
        .select("*")
        .eq("bot_config_id", botConfigData.id)
        .order("priority", { ascending: false });

      if (error) throw error;
      setKeywords((data as any) || []);
    } catch (error: any) {
      console.error("Error loading keywords:", error);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("bot_config")
        .update({
          bot_mode: config.bot_mode,
          fallback_to_human: config.fallback_to_human,
          auto_close_after_minutes: config.auto_close_after_minutes,
          welcome_message: config.welcome_message,
          menu_message: config.menu_message,
          transfer_message: config.transfer_message,
          offline_message: config.offline_message,
          knowledge_base_enabled: config.knowledge_base_enabled,
          ai_personality: config.ai_personality,
          ai_instructions: config.ai_instructions
        })
        .eq("id", config.id);

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "As configurações do bot foram atualizadas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddKeyword = async () => {
    if (!config || !newKeyword.keyword || !newKeyword.response) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a palavra-chave e a resposta.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("bot_keywords")
        .insert({
          bot_config_id: config.id,
          keyword: newKeyword.keyword,
          response: newKeyword.response,
          priority: 0,
          active: true
        });

      if (error) throw error;

      setNewKeyword({ keyword: '', response: '' });
      await loadKeywords();

      toast({
        title: "Palavra-chave adicionada",
        description: "Nova palavra-chave cadastrada com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bot_keywords")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await loadKeywords();

      toast({
        title: "Palavra-chave removida",
        description: "A palavra-chave foi removida com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading || !config) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="h-8 w-8" />
            Configuração do Chatbot
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure o comportamento do bot no WhatsApp
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
            <TabsTrigger value="flows">Fluxos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modo de Operação</CardTitle>
                <CardDescription>
                  Escolha como o bot deve processar as mensagens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Modo do Bot</Label>
                  <Select
                    value={config.bot_mode}
                    onValueChange={(value: any) => setConfig({ ...config, bot_mode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyword">
                        <div className="flex items-center gap-2">
                          <span>Palavras-chave</span>
                          <Badge variant="outline">Simples</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="ai">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span>Inteligência Artificial</span>
                          <Badge variant="default">Recomendado</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="flow">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          <span>Fluxos Visuais</span>
                          <Badge variant="secondary">Avançado</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="hybrid">
                        <div className="flex items-center gap-2">
                          <span>Híbrido (Todos)</span>
                          <Badge>Completo</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fallback para Humano</Label>
                    <p className="text-sm text-muted-foreground">
                      Transferir para atendente quando bot não souber responder
                    </p>
                  </div>
                  <Switch
                    checked={config.fallback_to_human}
                    onCheckedChange={(checked) => setConfig({ ...config, fallback_to_human: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auto-fechar Conversa (minutos)</Label>
                  <Input
                    type="number"
                    value={config.auto_close_after_minutes}
                    onChange={(e) => setConfig({ ...config, auto_close_after_minutes: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mensagens Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mensagem de Boas-vindas</Label>
                  <Textarea
                    value={config.welcome_message}
                    onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Menu Principal</Label>
                  <Textarea
                    value={config.menu_message}
                    onChange={(e) => setConfig({ ...config, menu_message: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem de Transferência</Label>
                  <Textarea
                    value={config.transfer_message}
                    onChange={(e) => setConfig({ ...config, transfer_message: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mensagem Offline</Label>
                  <Textarea
                    value={config.offline_message}
                    onChange={(e) => setConfig({ ...config, offline_message: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Respostas Automáticas por Palavra-chave</CardTitle>
                <CardDescription>
                  Configure respostas automáticas baseadas em palavras-chave
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Palavra-chave</Label>
                    <Input
                      placeholder="Ex: preço, horário, endereço"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resposta</Label>
                    <Input
                      placeholder="Resposta automática"
                      value={newKeyword.response}
                      onChange={(e) => setNewKeyword({ ...newKeyword, response: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddKeyword} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Palavra-chave
                </Button>

                <Separator />

                <div className="space-y-2">
                  {keywords.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma palavra-chave cadastrada
                    </p>
                  ) : (
                    keywords.map((kw) => (
                      <div key={kw.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{kw.keyword}</p>
                          <p className="text-sm text-muted-foreground">{kw.response}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteKeyword(kw.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Configuração da IA
                </CardTitle>
                <CardDescription>
                  Personalize o comportamento da inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Base de Conhecimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar informações da base de conhecimento nas respostas
                    </p>
                  </div>
                  <Switch
                    checked={config.knowledge_base_enabled}
                    onCheckedChange={(checked) => setConfig({ ...config, knowledge_base_enabled: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Personalidade do Bot</Label>
                  <Input
                    value={config.ai_personality}
                    onChange={(e) => setConfig({ ...config, ai_personality: e.target.value })}
                    placeholder="Ex: profissional e prestativo, descontraído e amigável"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instruções para a IA</Label>
                  <Textarea
                    value={config.ai_instructions}
                    onChange={(e) => setConfig({ ...config, ai_instructions: e.target.value })}
                    rows={6}
                    placeholder="Descreva como a IA deve se comportar, que informações deve priorizar, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Fluxos Visuais
                </CardTitle>
                <CardDescription>
                  Configure triggers para executar fluxos do FlowBuilder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure os fluxos no FlowMap e eles serão executados automaticamente
                  </p>
                  <Button onClick={() => window.location.href = '/dashboard/flow-map'}>
                    Ir para FlowMap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotConfig;