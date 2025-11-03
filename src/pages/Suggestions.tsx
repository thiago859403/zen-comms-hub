import { useState } from "react";
import { Search, ArrowUp, MessageSquare, Lightbulb } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Suggestion {
  id: number;
  number: string;
  title: string;
  description: string;
  votes: number;
}

const suggestions: Suggestion[] = [
  {
    id: 1,
    number: "#43",
    title: "Integrar com google meus negócios (mensagens)",
    description: "Gostaria de sugerir uma integração com o Google Meus Negócios, de forma que possamos receber as mensagens enviadas para o chat da...",
    votes: 1,
  },
  {
    id: 2,
    number: "#42",
    title: "Visualizar etiquetas aplicadas ao contato na caixa de atendi...",
    description: "Atualmente, quando aplicamos uma etiqueta a um contato, na conversa, ela fica visível apenas quando eu abro a conversa com ele (1). Para ter...",
    votes: 1,
  },
  {
    id: 3,
    number: "#41",
    title: "Pausar o disparo",
    description: "Caso o disparo não agendado tenha sido feito errado, poderia ter a...",
    votes: 1,
  },
  {
    id: 4,
    number: "#40",
    title: "Espaço entre parágrafos na mesma mensagem",
    description: "Hoje não é possível utilizar Shift + Enter para dar espaço entre parágrafos numa mesma mensagem. Seria possível adicionar?",
    votes: 4,
  },
];

const Suggestions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Customer Cloud</h1>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Desejamos as boas-vindas à Caixa de Sugestões! 🎉
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Aqui você pode propor funcionalidades ou melhorias que gostaria de ver no Nuvia Customer Cloud e/ou
              votar em ideias trazidas por outros usuários. 🤝
            </CardDescription>
            <CardDescription className="text-base">
              Caso você queira falar sobre outros assuntos,{" "}
              <a href="#" className="underline font-medium text-foreground">
                entre em contato com nosso time de Suporte
              </a>
              .
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search and Action Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <ArrowUp className="h-4 w-4" />
                Trending
              </Button>
              
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button className="gap-2 whitespace-nowrap bg-primary hover:bg-primary/90">
                <MessageSquare className="h-4 w-4" />
                Dar uma ideia!
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions
            .filter((suggestion) =>
              searchQuery
                ? suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  suggestion.description.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            )
            .map((suggestion, index) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Vote Button */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{suggestion.votes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {suggestion.title}
                        </h3>
                        <Badge variant="secondary" className="shrink-0">
                          {suggestion.number}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
                {index < suggestions.length - 1 && <Separator />}
              </Card>
            ))}
        </div>

        {/* Empty State */}
        {searchQuery && 
          suggestions.filter((s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhuma sugestão encontrada para "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </DashboardLayout>
  );
};

export default Suggestions;
