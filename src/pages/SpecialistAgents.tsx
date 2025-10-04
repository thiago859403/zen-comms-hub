import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, TrendingUp } from "lucide-react";

const SpecialistAgents = () => {
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
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Criar Agente
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Especializações diferentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interações</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,542</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Resoluções bem-sucedidas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
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
          ].map((agent, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
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
                  <span className="text-sm text-muted-foreground">
                    {agent.interactions} interações
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Configurar Agente
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SpecialistAgents;
