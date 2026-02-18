import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Brain, Zap, TrendingUp, Bot, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: number;
  nome: string;
  instrucoes: string | null;
  status: string;
  created_at: string;
}

interface PlanLimits {
  maxAgentes: number;
  currentCount: number;
}

const SpecialistAgents = () => {
  const { empresaId, empresa } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentInstructions, setAgentInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Buscar agentes e limites do plano
  const fetchAgentsAndLimits = useCallback(async () => {
    if (!empresaId) return;

    try {
      // Buscar agentes da empresa
      const { data: agentsData, error: agentsError, count } = await supabase
        .from("agentes_ia")
        .select("*", { count: "exact" })
        .eq("empresa_id", empresaId);

      if (agentsError) {
        console.error("Erro ao buscar agentes:", agentsError);
      } else {
        setAgents(agentsData || []);
      }

      // Buscar limites do plano
      if (empresa?.plano_id) {
        const { data: planoData, error: planoError } = await supabase
          .from("planos")
          .select("max_agentes")
          .eq("id", empresa.plano_id)
          .single();

        if (planoError) {
          console.error("Erro ao buscar plano:", planoError);
        } else if (planoData) {
          const currentCount = count || 0;
          setPlanLimits({
            maxAgentes: planoData.max_agentes,
            currentCount,
          });
          setLimitExceeded(currentCount >= planoData.max_agentes);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, [empresaId, empresa?.plano_id]);

  useEffect(() => {
    fetchAgentsAndLimits();
  }, [fetchAgentsAndLimits]);

  const handleCreateAgent = async () => {
    if (!agentName.trim() || !empresaId) return;

    setIsLoading(true);

    try {
      // Re-verificar limite em tempo real antes de criar (importante para concorrência)
      const { count: currentCount, error: countError } = await supabase
        .from("agentes_ia")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", empresaId);

      if (countError) {
        console.error("Erro ao contar agentes:", countError);
      }

      // Buscar limite do plano novamente
      let maxAgentes = planLimits?.maxAgentes || 1;
      if (empresa?.plano_id) {
        const { data: planoData } = await supabase
          .from("planos")
          .select("max_agentes")
          .eq("id", empresa.plano_id)
          .single();
        if (planoData) {
          maxAgentes = planoData.max_agentes;
        }
      }

      const count = currentCount || 0;

      // Verificar limite antes de criar
      if (count >= maxAgentes) {
        setLimitExceeded(true);
        setPlanLimits({ maxAgentes, currentCount: count });
        setIsDialogOpen(false);
        toast({
          title: "Limite excedido",
          description: `Seu plano permite no máximo ${maxAgentes} agente(s). Faça upgrade para criar mais.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("agentes_ia")
        .insert({
          nome: agentName.trim(),
          instrucoes: agentInstructions.trim() || null,
          empresa_id: empresaId,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar agente:", error);
        toast({
          title: "Erro ao criar agente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAgents((prev) => [...prev, data]);
      setAgentName("");
      setAgentInstructions("");
      setIsDialogOpen(false);

      // Atualizar contagem
      const newCount = count + 1;
      setPlanLimits({
        maxAgentes,
        currentCount: newCount,
      });
      setLimitExceeded(newCount >= maxAgentes);

      toast({
        title: "Agente criado",
        description: `O agente "${data.nome}" foi criado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro ao criar agente:", error);
      toast({
        title: "Erro ao criar agente",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    // Sempre abrir o dialog - a verificação de limite é feita ao criar
    setIsDialogOpen(true);
  };

  const defaultAgents = [
    {
      name: "Especialista em Vendas",
      description: "IA treinada em técnicas de vendas e persuasão",
      specialty: "Vendas Consultivas",
      interactions: "524",
      icon: Sparkles,
    },
    {
      name: "Especialista Técnico",
      description: "Suporte avançado para questões técnicas complexas",
      specialty: "Suporte Técnico",
      interactions: "312",
      icon: Brain,
    },
    {
      name: "Especialista em Produtos",
      description: "Conhecimento profundo do catálogo de produtos",
      specialty: "Product Expert",
      interactions: "287",
      icon: Zap,
    },
    {
      name: "Especialista Financeiro",
      description: "Consultoria sobre planos, valores e condições",
      specialty: "Financeiro",
      interactions: "419",
      icon: TrendingUp,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Agentes especialistas</h1>
              <Badge className="bg-purple-500 hover:bg-purple-600">Beta</Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              IA avançada com conhecimento especializado para cada área do seu negócio
            </p>
          </div>
          <Button
            data-testid="create-agent"
            aria-label="Criar agente"
            onClick={handleOpenDialog}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Criar Agente
          </Button>
        </div>

        {/* Alerta de limite excedido */}
        {limitExceeded && (
          <Alert variant="destructive" data-testid="limit-exceeded-alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Limite excedido</AlertTitle>
            <AlertDescription>
              Você atingiu o limite de {planLimits?.maxAgentes || 1} agente(s) do seu plano.
              Faça upgrade para criar mais agentes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.length}</div>
              <p className="text-xs text-muted-foreground">
                {planLimits ? `${agents.length}/${planLimits.maxAgentes} do plano` : "Carregando..."}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interações</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Sem dados ainda</p>
            </CardContent>
          </Card>
        </div>

        {/* Agentes criados pelo usuário */}
        {agents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Seus Agentes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-md transition-shadow border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                          <Bot className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.nome}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {agent.instrucoes || "Sem instruções definidas"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {agent.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">0 interações</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Configurar Agente
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Agentes padrão (templates) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Templates de Agentes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {defaultAgents.map((agent, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <agent.icon className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {agent.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {agent.specialty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Template</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" disabled>
                    Em breve
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog para criar agente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="agent-dialog">
          <DialogHeader>
            <DialogTitle>Criar Novo Agente</DialogTitle>
            <DialogDescription>
              Configure um novo agente especialista para sua equipe.
              {planLimits && (
                <span className="block mt-1 text-xs">
                  Uso: {planLimits.currentCount}/{planLimits.maxAgentes} agentes
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Nome do Agente</Label>
              <Input
                id="agent-name"
                placeholder="Ex: Agente de Suporte"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-instructions">Instruções</Label>
              <Textarea
                id="agent-instructions"
                placeholder="Descreva como o agente deve se comportar e quais conhecimentos deve ter..."
                value={agentInstructions}
                onChange={(e) => setAgentInstructions(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAgent}
              disabled={!agentName.trim() || isLoading}
            >
              {isLoading ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SpecialistAgents;
