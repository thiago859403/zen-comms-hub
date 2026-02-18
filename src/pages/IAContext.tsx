import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Save, AlertTriangle, Info } from "lucide-react";

const IAContext = () => {
  const { empresaId } = useAuth();
  const { empresa, refetch } = useEmpresa();
  const { toast } = useToast();
  const [contexto, setContexto] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (empresa) {
      // Carregar contexto_ia da empresa
      const contextoData = empresa.contexto_ia || {};
      setContexto(JSON.stringify(contextoData, null, 2));
      setLoading(false);
    }
  }, [empresa]);

  const handleSave = async () => {
    if (!empresaId) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Validar JSON
      let contextoParsed: any;
      try {
        contextoParsed = contexto.trim() ? JSON.parse(contexto) : {};
      } catch (error) {
        toast({
          title: "JSON inválido",
          description: "O contexto deve ser um JSON válido",
          variant: "destructive",
        });
        return;
      }

      // Atualizar contexto_ia na empresa
      const { error } = await supabase
        .from("empresas")
        .update({ contexto_ia: contextoParsed })
        .eq("id", empresaId);

      if (error) throw error;

      toast({
        title: "Contexto salvo",
        description: "Contexto de IA atualizado com sucesso",
      });

      // Recarregar dados da empresa
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar contexto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
          <h2 className="text-3xl font-bold">Contexto de IA da Empresa</h2>
          <p className="text-muted-foreground mt-1">
            Defina o contexto global que será usado por todos os agentes de IA da empresa
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Como funciona</AlertTitle>
          <AlertDescription>
            O contexto de IA é um objeto JSON que será incluído automaticamente em todas as conversas com agentes de IA.
            Use este campo para definir informações sobre sua empresa, produtos, políticas, etc.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Contexto Global</CardTitle>
            <CardDescription>
              Informações que serão compartilhadas com todos os agentes de IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contexto">Contexto (JSON)</Label>
              <Textarea
                id="contexto"
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder={`{
  "empresa": {
    "nome": "Nome da Empresa",
    "setor": "Setor de atuação",
    "produtos": ["Produto 1", "Produto 2"],
    "valores": ["Valor 1", "Valor 2"]
  },
  "politicas": {
    "politica_devolucao": "Política de devolução...",
    "politica_garantia": "Política de garantia..."
  },
  "informacoes_contato": {
    "telefone": "+55 11 99999-9999",
    "email": "contato@empresa.com",
    "endereco": "Endereço completo"
  }
}`}
              />
              <p className="text-xs text-muted-foreground">
                Formato JSON. Este contexto será adicionado automaticamente ao system prompt de todos os agentes.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Alert variant="outline" className="flex-1">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  Certifique-se de que o JSON está válido antes de salvar
                </AlertDescription>
              </Alert>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Contexto
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exemplo de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Exemplo de contexto:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "empresa": {
    "nome": "Minha Empresa LTDA",
    "setor": "E-commerce",
    "produtos": [
      "Produto A - R$ 99,90",
      "Produto B - R$ 149,90",
      "Produto C - R$ 199,90"
    ],
    "valores": [
      "Atendimento humanizado",
      "Qualidade garantida",
      "Entrega rápida"
    ]
  },
  "politicas": {
    "politica_devolucao": "Devoluções aceitas em até 7 dias após a compra",
    "politica_garantia": "Garantia de 1 ano para todos os produtos",
    "politica_frete": "Frete grátis para compras acima de R$ 200"
  },
  "informacoes_contato": {
    "telefone": "+55 11 99999-9999",
    "whatsapp": "+55 11 99999-9999",
    "email": "contato@minhaempresa.com",
    "horario_atendimento": "Segunda a Sexta, 9h às 18h"
  }
}`}
                </pre>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Este contexto será automaticamente incluído nas instruções de todos os agentes de IA,
                  permitindo que eles tenham conhecimento sobre sua empresa, produtos e políticas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IAContext;
