import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Zap, Crown, Building2, Rocket } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Plano {
  id: number;
  nome: string;
  preco_mensal: number;
  max_usuarios: number;
  max_agentes: number;
  limite_mensagens_mes: number;
  features: Record<string, any>;
  is_active: boolean;
  cor: string;
}

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { empresa } = useEmpresa();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingCheckout, setCreatingCheckout] = useState<number | null>(null);

  useEffect(() => {
    loadPlanos();
  }, []);

  const loadPlanos = async () => {
    try {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('is_active', true)
        .order('preco_mensal', { ascending: true });

      if (error) throw error;
      setPlanos((data as Plano[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planoId: number) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para assinar um plano",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!empresa) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      });
      return;
    }

    setCreatingCheckout(planoId);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/stripe-create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            plano_id: planoId,
            success_url: `${window.location.origin}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/dashboard/pricing?canceled=true`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar checkout');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar checkout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreatingCheckout(null);
    }
  };

  const getPlanoIcon = (nome: string) => {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes('free')) return Zap;
    if (nomeLower.includes('pro')) return Rocket;
    if (nomeLower.includes('business')) return Building2;
    if (nomeLower.includes('enterprise')) return Crown;
    return Zap;
  };

  const planoAtualId = empresa?.plano?.id;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Planos e Preços</h2>
          <p className="text-muted-foreground mt-1">
            Escolha o plano ideal para sua empresa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {planos.map((plano) => {
            const Icon = getPlanoIcon(plano.nome);
            const isCurrentPlan = planoAtualId === plano.id;
            const features = plano.features || {};

            return (
              <Card
                key={plano.id}
                className={`relative ${isCurrentPlan ? 'border-primary border-2' : ''}`}
                style={{ borderColor: isCurrentPlan ? plano.cor : undefined }}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Plano Atual</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${plano.cor}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: plano.cor }} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plano.nome}</CardTitle>
                      <CardDescription>
                        {plano.max_usuarios} usuário{plano.max_usuarios > 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      R$ {plano.preco_mensal.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{plano.max_usuarios} usuários</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{plano.max_agentes} agentes de IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>
                        {plano.limite_mensagens_mes.toLocaleString('pt-BR')} mensagens/mês
                      </span>
                    </div>
                    {features.whatsapp && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>WhatsApp Business</span>
                      </div>
                    )}
                    {features.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Instagram</span>
                      </div>
                    )}
                    {features.ia_avancada && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>IA Avançada</span>
                      </div>
                    )}
                    {features.api_access && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Acesso à API</span>
                      </div>
                    )}
                    {features.white_label && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>White Label</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    disabled={isCurrentPlan || creatingCheckout === plano.id}
                    onClick={() => handleSubscribe(plano.id)}
                    style={
                      !isCurrentPlan
                        ? {
                            backgroundColor: plano.cor,
                            color: 'white',
                          }
                        : undefined
                    }
                  >
                    {creatingCheckout === plano.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : isCurrentPlan ? (
                      'Plano Atual'
                    ) : (
                      'Assinar'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Dúvidas sobre os planos?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Entre em contato com nossa equipe para entender qual plano é ideal para sua empresa.
          </p>
          <Button variant="outline">Falar com vendas</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
