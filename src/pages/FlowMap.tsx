import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Plus, Play } from "lucide-react";

const FlowMap = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mapa de fluxos</h1>
            <p className="text-muted-foreground mt-2">
              Crie e visualize os fluxos de conversação dos chatbots
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Fluxo
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fluxos Ativos</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Em produção</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <Play className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Rascunhos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Nós</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Em todos os fluxos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Fluxo de Vendas", nodes: 24, connections: 38, chatbot: "Atendimento Comercial" },
            { name: "Suporte Nível 1", nodes: 18, connections: 26, chatbot: "Suporte Técnico" },
            { name: "FAQ Padrão", nodes: 32, connections: 45, chatbot: "FAQ Automático" },
            { name: "Agendamento de Serviços", nodes: 15, connections: 22, chatbot: "Agendamento" },
          ].map((flow, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GitBranch className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription className="text-xs">{flow.chatbot}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nós: </span>
                    <span className="font-semibold">{flow.nodes}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conexões: </span>
                    <span className="font-semibold">{flow.connections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FlowMap;
