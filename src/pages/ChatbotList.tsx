import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Search, Plus } from "lucide-react";

const ChatbotList = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lista de chatbots</h1>
            <p className="text-muted-foreground mt-2">
              Aqui você encontra todos os chatbots criados, com a interface de busca e filtros
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Chatbot
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar chatbots por nome, tipo ou status e também..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">Todos os tipos</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Atendimento Comercial", type: "Vendas", status: "Ativo", messages: "2.5k" },
            { name: "Suporte Técnico", type: "Suporte", status: "Ativo", messages: "1.8k" },
            { name: "FAQ Automático", type: "FAQ", status: "Pausado", messages: "892" },
            { name: "Agendamento", type: "Serviços", status: "Ativo", messages: "1.2k" },
            { name: "Pós-venda", type: "Relacionamento", status: "Ativo", messages: "654" },
            { name: "Onboarding", type: "Educacional", status: "Ativo", messages: "423" },
          ].map((bot, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <CardDescription className="text-xs">{bot.type}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={bot.status === "Ativo" ? "default" : "secondary"}>
                    {bot.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mensagens processadas</span>
                  <span className="font-semibold">{bot.messages}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatbotList;
