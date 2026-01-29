import { useState, useEffect } from "react";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  Users,
  Bot,
  MessageSquare,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UsageStats {
  usuarios_atuais: number;
  agentes_atuais: number;
  mensagens_este_mes: number;
}

export const SubscriptionManagement = () => {
  const { empresa, isLoading: empresaLoading, refetch: refetchEmpresa } = useEmpresa();
  const { user } = useAuth();
  const { toast } = useToast();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (empresa) {
      loadUsageStats();
    }
  }, [empresa]);

  const loadUsageStats = async () => {
    if (!empresa) return;

    try {
      setLoadingUsage(true);

      // Contar usuários da empresa
      const { count: usuariosCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresa.id);

      // Contar agentes de IA da empresa
      const { count: agentesCount } = await supabase
        .from('agentes_ia')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresa.id)
        .eq('status', 'active');

      // Buscar uso do mês atual
      const mesAtual = new Date();
      mesAtual.setDate(1);
      const { data: usoData } = await supabase
        .from('uso_recursos')
        .select('mensagens_enviadas')
        .eq('empresa_id', empresa.id)
        .eq('mes_referencia', mesAtual.toISOString().split('T')[0])
        .single();

      setUsageStats({
        usuarios_atuais: usuariosCount || 0,
        agentes_atuais: agentesCount || 0,
        mensagens_este_mes: usoData?.mensagens_enviadas || 0,
      });
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleManageBilling = async () => {
    if (!empresa?.stripe_customer_id) {
      toast({
        title: "Erro",
        description: "Cliente Stripe não encontrado",
        variant: "destructive",
      });
      return;
    }

    setLoadingPortal(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Criar sessão do portal do cliente Stripe
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/stripe-create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            return_url: `${window.location.origin}/dashboard/settings`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão do portal');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL do portal não retornada');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao abrir portal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingPortal(false);
    }
  };

  if (empresaLoading || loadingUsage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!empresa) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>Empresa não encontrada</AlertDescription>
      </Alert>
    );
  }

  const plano = empresa.plano;
  const hasLimits = plano !== null;

  // Calcular percentuais de uso
  const usuariosPercent = hasLimits
    ? Math.min((usageStats?.usuarios_atuais || 0 / plano.max_usuarios) * 100, 100)
    : 0;
  const agentesPercent = hasLimits
    ? Math.min((usageStats?.agentes_atuais || 0 / plano.max_agentes) * 100, 100)
    : 0;
  const mensagensPercent = hasLimits
    ? Math.min((usageStats?.mensagens_este_mes || 0 / plano.limite_mensagens_mes) * 100, 100)
    : 0;

  // Verificar se está próximo do limite
  const isNearLimit = (percent: number) => percent >= 80 && percent < 100;
  const isOverLimit = (percent: number) => percent >= 100;

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                {plano ? plano.nome : 'Nenhum plano ativo'}
              </CardDescription>
            </div>
            {plano && (
              <Badge variant="outline" className="text-lg px-3 py-1">
                R$ {plano.preco_mensal.toFixed(2)}/mês
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plano ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Renovação automática mensal</span>
              </div>
              <Separator />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/pricing'}
                >
                  Alterar Plano
                </Button>
                {empresa.stripe_customer_id && (
                  <Button
                    variant="outline"
                    onClick={handleManageBilling}
                    disabled={loadingPortal}
                  >
                    {loadingPortal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Gerenciar Pagamento
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Button onClick={() => window.location.href = '/dashboard/pricing'}>
              Escolher Plano
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Limites e Uso */}
      {hasLimits && (
        <Card>
          <CardHeader>
            <CardTitle>Uso do Plano</CardTitle>
            <CardDescription>
              Acompanhe seu consumo mensal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Usuários */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Usuários</span>
                </div>
                <span className="font-medium">
                  {usageStats?.usuarios_atuais || 0} / {plano.max_usuarios}
                </span>
              </div>
              <Progress
                value={usuariosPercent}
                className={
                  isOverLimit(usuariosPercent)
                    ? 'bg-red-500'
                    : isNearLimit(usuariosPercent)
                    ? 'bg-yellow-500'
                    : ''
                }
              />
              {isOverLimit(usuariosPercent) && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Limite excedido</AlertTitle>
                  <AlertDescription>
                    Você excedeu o limite de usuários. Faça upgrade para adicionar mais usuários.
                  </AlertDescription>
                </Alert>
              )}
              {isNearLimit(usuariosPercent) && !isOverLimit(usuariosPercent) && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Você está próximo do limite de usuários ({Math.round(usuariosPercent)}%).
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Agentes de IA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>Agentes de IA</span>
                </div>
                <span className="font-medium">
                  {usageStats?.agentes_atuais || 0} / {plano.max_agentes}
                </span>
              </div>
              <Progress
                value={agentesPercent}
                className={
                  isOverLimit(agentesPercent)
                    ? 'bg-red-500'
                    : isNearLimit(agentesPercent)
                    ? 'bg-yellow-500'
                    : ''
                }
              />
              {isOverLimit(agentesPercent) && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Limite excedido</AlertTitle>
                  <AlertDescription>
                    Você excedeu o limite de agentes. Faça upgrade para criar mais agentes.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Mensagens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Mensagens este mês</span>
                </div>
                <span className="font-medium">
                  {usageStats?.mensagens_este_mes.toLocaleString('pt-BR') || 0} /{' '}
                  {plano.limite_mensagens_mes.toLocaleString('pt-BR')}
                </span>
              </div>
              <Progress
                value={mensagensPercent}
                className={
                  isOverLimit(mensagensPercent)
                    ? 'bg-red-500'
                    : isNearLimit(mensagensPercent)
                    ? 'bg-yellow-500'
                    : ''
                }
              />
              {isOverLimit(mensagensPercent) && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Limite excedido</AlertTitle>
                  <AlertDescription>
                    Você excedeu o limite de mensagens. Faça upgrade para enviar mais mensagens.
                  </AlertDescription>
                </Alert>
              )}
              {isNearLimit(mensagensPercent) && !isOverLimit(mensagensPercent) && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Você está próximo do limite de mensagens ({Math.round(mensagensPercent)}%).
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  empresa.status === 'active'
                    ? 'bg-green-500'
                    : empresa.status === 'suspended'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              />
              <span className="capitalize">
                {empresa.status === 'active'
                  ? 'Ativo'
                  : empresa.status === 'suspended'
                  ? 'Suspenso'
                  : 'Pendente'}
              </span>
            </div>
            {empresa.status === 'suspended' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageBilling}
                disabled={loadingPortal}
              >
                Reativar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
