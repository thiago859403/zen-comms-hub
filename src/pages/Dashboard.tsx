import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Users,
  Send,
  Code,
  FileText,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Info,
  X,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentConversation {
  id: string;
  contact_name: string;
  contact_phone: string;
  status: string;
  last_message_at: string;
}

const RecentConversations = ({ userId }: { userId?: string }) => {
  const { empresaId } = useAuth();
  const [conversations, setConversations] = useState<RecentConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && empresaId) {
      loadConversations();
    }
  }, [userId, empresaId]);

  const loadConversations = async () => {
    if (!userId || !empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('id, contact_name, contact_phone, status, last_message_at')
        .eq('empresa_id', empresaId)
        .eq('assigned_agent_id', userId)
        .order('last_message_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setConversations((data as RecentConversation[]) || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Card className="p-6">
          <Skeleton className="h-20 w-full" />
        </Card>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center">
          Nenhuma conversa recente
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contato</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Mensagem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conv) => (
            <TableRow key={conv.id}>
              <TableCell className="font-medium">{conv.contact_name}</TableCell>
              <TableCell>{conv.contact_phone}</TableCell>
              <TableCell>
                <Badge variant={conv.status === 'closed' ? 'outline' : 'default'}>
                  {conv.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(conv.last_message_at), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, planInfo, profile } = useDashboardData();

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  const currentPeriod = `${planInfo.startDate} - ${planInfo.endDate}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold">
            Olá, {profile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Com o Nuvia Customer Cloud você pode atrair e fidelizar clientes, aumentar conversões, criar chatbots inteligentes e acompanhar seus resultados.
          </p>
        </div>

        {/* Top cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Comece por aqui */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comece por aqui</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Fechar card de início">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">Adicionar equipe</p>
                    <Badge variant="secondary" className="text-xs">Contratar</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prepare-se para atender seus clientes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Importar base de contatos</p>
                  <p className="text-sm text-muted-foreground">
                    Conecte dados e conheça melhor seu público
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Disparar mensagem</p>
                  <p className="text-sm text-muted-foreground">
                    Atraia mais clientes com mensagens multicanais
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Plano ativo */}
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Plano ativo</h3>
                <Badge>{planInfo.name}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Período: {currentPeriod}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Canais</span>
                    <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="text-sm">{planInfo.channelsUsed}/{planInfo.channelsLimit}</span>
                </div>
                <Progress 
                  value={(planInfo.channelsUsed / planInfo.channelsLimit) * 100} 
                  className="h-2" 
                  aria-label={`Uso de canais: ${planInfo.channelsUsed} de ${planInfo.channelsLimit}`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Interações</span>
                    <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="text-sm">{planInfo.interactionsUsed}/{planInfo.interactionsLimit}</span>
                </div>
                <Progress 
                  value={(planInfo.interactionsUsed / planInfo.interactionsLimit) * 100} 
                  className="h-2"
                  aria-label={`Uso de interações: ${planInfo.interactionsUsed} de ${planInfo.interactionsLimit}`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Usuários</span>
                    <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="text-sm">{planInfo.usersCount}/{planInfo.usersLimit}</span>
                </div>
                <Progress 
                  value={(planInfo.usersCount / planInfo.usersLimit) * 100} 
                  className="h-2"
                  aria-label={`Uso de usuários: ${planInfo.usersCount} de ${planInfo.usersLimit}`}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Atualizado em: {planInfo.lastUpdated}
              </p>
            </div>
            <Button variant="link" className="mt-4 p-0 h-auto" onClick={() => navigate("/dashboard/usage")}>
              Relatório de consumo
            </Button>
          </Card>

          {/* Dicas da Zoe */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Dicas da Zoe</h3>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Usuários</h4>
              <p className="text-sm text-muted-foreground">
                É a equipe que você adicionou, ou seja, a quantidade de pessoas que podem acessar e usar o Nuvia Customer Cloud.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="link" className="p-0 h-auto text-primary">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Ver outra dica
              </Button>
            </div>
          </Card>
        </div>

        {/* Ações rápidas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => navigate("/dashboard/message-sending")}
              aria-label="Ir para disparar mensagens"
            >
              <Send className="h-6 w-6" aria-hidden="true" />
              <span>Disparar mensagens</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => navigate("/dashboard/contacts")}
              aria-label="Ir para gerir contatos"
            >
              <Users className="h-6 w-6" aria-hidden="true" />
              <span>Gerir contatos</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => navigate("/dashboard/chat-inbox")}
              aria-label="Ir para atender clientes"
            >
              <MessageSquare className="h-6 w-6" aria-hidden="true" />
              <span>Atender clientes</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => navigate("/dashboard/settings")}
              aria-label="Ir para habilitar canal"
            >
              <Code className="h-6 w-6" aria-hidden="true" />
              <span>Habilitar canal</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => navigate("/dashboard/billing")}
              aria-label="Ir para ver faturas"
            >
              <FileText className="h-6 w-6" aria-hidden="true" />
              <span>Ver faturas</span>
            </Button>
          </div>
        </div>

        {/* Painel de contatos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Painel de contatos</h2>
              <p className="text-sm text-muted-foreground">
                Conheça seus clientes: acompanhe o alcance dos seus disparos e a conversão dos atendimentos da sua equipe.
              </p>
            </div>
            <Button variant="link" className="gap-2">
              Acessar painel de contatos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Base de contatos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Total de contatos adicionados
              </p>
              {stats.isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-bold mb-2">{stats.totalContacts}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Período: Desde o início
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Contatos alcançados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contatos que receberam mensagem
              </p>
              {stats.isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <p className="text-4xl font-bold mb-2">{stats.contactsReached}</p>
                  {stats.contactsReached > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  )}
                </>
              )}
              <p className="text-xs text-muted-foreground">
                Período: Últimos 30 dias
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Contatos atendidos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contatos que receberam algum atendimento
              </p>
              {stats.isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <p className="text-4xl font-bold mb-2">{stats.contactsAttended}</p>
                  {stats.contactsAttended > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  )}
                </>
              )}
              <p className="text-xs text-muted-foreground">
                Período: Últimos 30 dias
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-1">Taxa de atendimentos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Percentual de contatos atendidos após receberem mensagem
              </p>
              {stats.isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-bold mb-2">{stats.conversionRate}%</p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Período: Últimos 30 dias
              </p>
            </Card>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Volume de disparos e atendimentos comerciais
            </h3>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg" role="img" aria-label="Gráfico de volume de disparos e atendimentos">
              <p className="text-muted-foreground">Gráfico de linha e barras</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Período: Últimos 30 dias
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição geográfica</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Distribuição dos contatos por disparo e atendimento
            </p>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg" role="img" aria-label="Mapa de distribuição geográfica dos contatos">
              <p className="text-muted-foreground">Mapa do Brasil</p>
            </div>
          </Card>
        </div>

        {/* Footer slogan */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Conecte, atraia, atenda e converta mais!</h2>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
