import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Empresa {
  id: number;
  nome: string;
  plano_id: number | null;
  plano_nome: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  total_usuarios: number;
  total_conversas: number;
  total_mensagens_mes: number;
}

interface GlobalMetrics {
  totalEmpresas: number;
  activeEmpresas: number;
  totalUsuarios: number;
  totalConversas: number;
  totalMensagens: number;
  estimatedRevenue: number;
  churnRate: number;
}

const MasterDashboard = () => {
  const { profile } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'master') {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar todas as empresas com seus planos
      const { data: empresasData, error: empresasError } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          plano_id,
          status,
          is_active,
          created_at,
          planos:nome
        `)
        .order('created_at', { ascending: false });

      if (empresasError) throw empresasError;

      // Para cada empresa, buscar métricas
      const empresasComMetricas = await Promise.all(
        (empresasData || []).map(async (emp) => {
          const [usersResult, conversationsResult, usageResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('empresa_id', emp.id),
            supabase
              .from('conversations')
              .select('*', { count: 'exact', head: true })
              .eq('empresa_id', emp.id),
            (async () => {
              const mesAtual = new Date();
              mesAtual.setDate(1);
              const { data } = await supabase
                .from('uso_recursos')
                .select('mensagens_enviadas')
                .eq('empresa_id', emp.id)
                .eq('mes_referencia', mesAtual.toISOString().split('T')[0])
                .single();
              return data?.mensagens_enviadas || 0;
            })(),
          ]);

          return {
            id: emp.id,
            nome: emp.nome,
            plano_id: emp.plano_id,
            plano_nome: (emp.planos as any)?.nome || 'Sem plano',
            status: emp.status,
            is_active: emp.is_active,
            created_at: emp.created_at,
            total_usuarios: usersResult.count || 0,
            total_conversas: conversationsResult.count || 0,
            total_mensagens_mes: usageResult || 0,
          };
        })
      );

      setEmpresas(empresasComMetricas);

      // Calcular métricas globais
      const activeEmpresas = empresasComMetricas.filter((e) => e.is_active).length;
      const totalUsuarios = empresasComMetricas.reduce((sum, e) => sum + e.total_usuarios, 0);
      const totalConversas = empresasComMetricas.reduce((sum, e) => sum + e.total_conversas, 0);
      const totalMensagens = empresasComMetricas.reduce((sum, e) => sum + e.total_mensagens_mes, 0);

      // Calcular receita estimada (soma dos preços dos planos)
      const { data: planosData } = await supabase
        .from('planos')
        .select('id, preco_mensal');

      const planosMap = new Map(
        (planosData || []).map((p) => [p.id, p.preco_mensal])
      );

      const estimatedRevenue = empresasComMetricas.reduce((sum, e) => {
        if (e.plano_id && e.is_active) {
          return sum + (planosMap.get(e.plano_id) || 0);
        }
        return sum;
      }, 0);

      // Calcular churn rate (empresas inativas / total)
      const churnRate =
        empresasComMetricas.length > 0
          ? ((empresasComMetricas.length - activeEmpresas) / empresasComMetricas.length) * 100
          : 0;

      setMetrics({
        totalEmpresas: empresasComMetricas.length,
        activeEmpresas,
        totalUsuarios,
        totalConversas,
        totalMensagens,
        estimatedRevenue,
        churnRate,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inativa</Badge>;
    }
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      active: { label: 'Ativa', variant: 'default' },
      trial: { label: 'Trial', variant: 'secondary' },
      suspended: { label: 'Suspensa', variant: 'outline' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (profile?.role !== 'master') {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Apenas administradores master podem acessar este dashboard.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

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
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Master</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral da plataforma Nuvia Customer Cloud
          </p>
        </div>

        {/* Métricas Globais */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalEmpresas)}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.activeEmpresas} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalUsuarios)}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários na plataforma
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.estimatedRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Mensal (MRR)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.churnRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Empresas inativas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Empresas */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas (Tenants)</CardTitle>
            <CardDescription>
              Lista de todas as empresas cadastradas na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {empresas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma empresa cadastrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Conversas</TableHead>
                    <TableHead>Mensagens (Mês)</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">{empresa.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{empresa.plano_nome}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(empresa.status, empresa.is_active)}</TableCell>
                      <TableCell>{formatNumber(empresa.total_usuarios)}</TableCell>
                      <TableCell>{formatNumber(empresa.total_conversas)}</TableCell>
                      <TableCell>{formatNumber(empresa.total_mensagens_mes)}</TableCell>
                      <TableCell>
                        {format(new Date(empresa.created_at), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Métricas Adicionais */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atividade da Plataforma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total de Conversas</span>
                    <span className="text-2xl font-bold">
                      {formatNumber(metrics.totalConversas)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mensagens este Mês</span>
                    <span className="text-2xl font-bold">
                      {formatNumber(metrics.totalMensagens)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saúde da Plataforma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taxa de Ativação</span>
                    <span className="text-2xl font-bold">
                      {metrics.totalEmpresas > 0
                        ? ((metrics.activeEmpresas / metrics.totalEmpresas) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Média de Usuários/Empresa</span>
                    <span className="text-2xl font-bold">
                      {metrics.totalEmpresas > 0
                        ? (metrics.totalUsuarios / metrics.totalEmpresas).toFixed(1)
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MasterDashboard;
