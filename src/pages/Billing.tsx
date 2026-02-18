import { useState, useEffect } from "react";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Download, ExternalLink, CreditCard, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  number: string | null;
}

const Billing = () => {
  const { empresa } = useEmpresa();
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (empresa?.stripe_customer_id) {
      loadInvoices();
    } else {
      setLoading(false);
    }
  }, [empresa]);

  const loadInvoices = async () => {
    if (!empresa?.stripe_customer_id) return;

    try {
      setLoading(true);

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Buscar invoices via Edge Function
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/stripe-list-invoices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        // Se a função não existir ainda, retornar array vazio
        if (response.status === 404) {
          setInvoices([]);
          return;
        }
        throw new Error('Erro ao carregar invoices');
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error: any) {
      console.error('Erro ao carregar invoices:', error);
      // Não mostrar erro se a função não existir ainda
      if (!error.message.includes('404')) {
        toast({
          title: "Erro ao carregar faturas",
          description: error.message,
          variant: "destructive",
        });
      }
      setInvoices([]);
    } finally {
      setLoading(false);
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

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/stripe-create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            return_url: `${window.location.origin}/dashboard/billing`,
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

  const formatCurrency = (amount: number, currency: string = 'brl') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase() === 'BRL' ? 'BRL' : 'USD',
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      paid: { label: 'Pago', variant: 'default' },
      open: { label: 'Aberto', variant: 'secondary' },
      void: { label: 'Cancelado', variant: 'outline' },
      uncollectible: { label: 'Não cobrado', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Faturamento</h2>
            <p className="text-muted-foreground mt-1">
              Histórico de pagamentos e faturas
            </p>
          </div>
          {empresa?.stripe_customer_id && (
            <Button
              onClick={handleManageBilling}
              disabled={loadingPortal}
              variant="outline"
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

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Plano Atual</CardDescription>
              <CardTitle className="text-2xl">
                {empresa?.plano?.nome || 'Nenhum'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {empresa?.plano && (
                <p className="text-sm text-muted-foreground">
                  R$ {empresa.plano.preco_mensal.toFixed(2)}/mês
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl capitalize">
                {empresa?.status === 'active' ? 'Ativo' : empresa?.status || 'N/A'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  empresa?.status === 'active'
                    ? 'default'
                    : empresa?.status === 'suspended'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {empresa?.status === 'active'
                  ? 'Em dia'
                  : empresa?.status === 'suspended'
                  ? 'Suspenso'
                  : 'Pendente'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Faturas</CardDescription>
              <CardTitle className="text-2xl">{invoices.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {invoices.filter((inv) => inv.status === 'paid').length} pagas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Faturas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturas</CardTitle>
            <CardDescription>
              Todas as suas faturas e recibos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma fatura encontrada</p>
                {!empresa?.stripe_customer_id && (
                  <p className="text-sm mt-2">
                    Faça uma assinatura para ver suas faturas aqui
                  </p>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(invoice.created * 1000), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoice.number || `#${invoice.id.slice(-8)}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.hosted_invoice_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(invoice.hosted_invoice_url!, '_blank')
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver
                            </Button>
                          )}
                          {invoice.invoice_pdf && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(invoice.invoice_pdf!, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!empresa?.stripe_customer_id && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não possui uma assinatura ativa
              </p>
              <Button onClick={() => (window.location.href = '/dashboard/pricing')}>
                Ver Planos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Billing;
