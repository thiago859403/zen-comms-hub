import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const templates = [
    {
      id: 1,
      name: "Boas-vindas",
      category: "Marketing",
      message:
        "Olá {{nome}}! Bem-vindo à nossa plataforma. Estamos muito felizes em ter você conosco! 🎉",
      variables: ["nome"],
      uses: 234,
    },
    {
      id: 2,
      name: "Confirmação de Pedido",
      category: "Transacional",
      message:
        "Seu pedido #{{pedido}} foi confirmado com sucesso! Previsão de entrega: {{data}}.",
      variables: ["pedido", "data"],
      uses: 1890,
    },
    {
      id: 3,
      name: "Lembrete de Pagamento",
      category: "Cobrança",
      message:
        "Oi {{nome}}, seu pagamento de {{valor}} vence em {{dias}} dias. Não esqueça! 💰",
      variables: ["nome", "valor", "dias"],
      uses: 567,
    },
    {
      id: 4,
      name: "Promoção Especial",
      category: "Marketing",
      message:
        "{{nome}}, temos uma oferta especial para você! {{desconto}}% de desconto até {{data}}. Não perca! 🔥",
      variables: ["nome", "desconto", "data"],
      uses: 892,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Templates</h2>
            <p className="text-muted-foreground mt-1">
              Gerencie seus modelos de mensagens
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total de Templates</p>
            <p className="text-2xl font-bold mt-1">24</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Mais Usado</p>
            <p className="text-2xl font-bold mt-1">Confirmação de Pedido</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Usos este mês</p>
            <p className="text-2xl font-bold mt-1">3,583</p>
          </Card>
        </div>

        {/* Search and filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Todos</Button>
              <Button variant="outline">Marketing</Button>
              <Button variant="outline">Transacional</Button>
              <Button variant="outline">Cobrança</Button>
            </div>
          </div>
        </Card>

        {/* Templates grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Usado {template.uses} vezes
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <p className="text-sm">{template.message}</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Variáveis:</p>
                {template.variables.map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 rounded bg-muted text-xs font-mono"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;