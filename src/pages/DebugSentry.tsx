import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  captureException,
  captureMessage,
  addBreadcrumb,
  isMonitoringEnabled,
} from "@/lib/monitoring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, MessageSquare, ShieldCheck, ShieldOff } from "lucide-react";

const DEBUG_ACCESS_KEY = "NUVIA_TEST";

const DebugSentry = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [eventsSent, setEventsSent] = useState({ exceptions: 0, messages: 0 });

  const sentryActive = isMonitoringEnabled();
  const environment = import.meta.env.VITE_APP_ENV || "development";

  // Guard: verificar query param key
  useEffect(() => {
    const key = searchParams.get("key");
    if (key !== DEBUG_ACCESS_KEY) {
      navigate("/", { replace: true });
    } else {
      setAuthorized(true);
    }
  }, [searchParams, navigate]);

  const handleSendError = () => {
    addBreadcrumb("Debug: envio manual de erro de teste", "debug", {
      source: "debug-page",
      type: "exception",
    });

    captureException(new Error("Teste Sentry Nuvia (manual)"), {
      source: "debug-page",
      type: "exception",
    });

    setEventsSent((prev) => ({ ...prev, exceptions: prev.exceptions + 1 }));

    toast({
      title: "Erro de teste enviado",
      description: sentryActive
        ? "Evento enviado. Verifique o Sentry → Issues."
        : "Sentry em modo no-op (sem DSN). Evento não foi enviado ao Sentry.",
    });
  };

  const handleSendMessage = () => {
    addBreadcrumb("Debug: envio manual de mensagem de teste", "debug", {
      source: "debug-page",
      type: "message",
    });

    captureMessage("Teste Sentry Nuvia (message)", "info");

    setEventsSent((prev) => ({ ...prev, messages: prev.messages + 1 }));

    toast({
      title: "Mensagem de teste enviada",
      description: sentryActive
        ? "Evento enviado. Verifique o Sentry → Issues."
        : "Sentry em modo no-op (sem DSN). Evento não foi enviado ao Sentry.",
    });
  };

  // Não renderizar nada até confirmar autorização
  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bug className="h-6 w-6 text-orange-500" />
              <div>
                <CardTitle className="text-xl">Teste Sentry (Debug)</CardTitle>
                <CardDescription>
                  Página de teste interna para validar monitoramento do Sentry. Não usar em produção por usuários.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Status do Sentry */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status do Sentry:</span>
              {sentryActive ? (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                  <ShieldCheck className="h-3 w-3" />
                  Ativo
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ShieldOff className="h-3 w-3" />
                  No-op (sem DSN)
                </Badge>
              )}
            </div>

            {/* Environment */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Environment:</span>
              <Badge variant="outline">{environment}</Badge>
            </div>

            {/* Contadores */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Eventos enviados nesta sessão:</span>
              <span className="text-sm tabular-nums">
                {eventsSent.exceptions} erros, {eventsSent.messages} mensagens
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Aviso no-op */}
        {!sentryActive && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Sentry não está configurado</p>
              <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                A variável <code className="bg-yellow-200/50 dark:bg-yellow-800/50 px-1 rounded">VITE_SENTRY_DSN</code> não está definida.
                Os botões abaixo irão funcionar, mas os eventos <strong>não serão enviados</strong> ao Sentry.
              </p>
            </div>
          </div>
        )}

        {/* Botões de teste */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações de Teste</CardTitle>
            <CardDescription>
              Clique nos botões abaixo para enviar eventos de teste ao Sentry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSendError}
              variant="destructive"
              className="w-full justify-start gap-2"
            >
              <Bug className="h-4 w-4" />
              Enviar ERRO de teste
            </Button>

            <Button
              onClick={handleSendMessage}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Enviar MENSAGEM de teste
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          Acesso restrito via <code>?key=***</code>. Altere a key antes de liberar para clientes.
        </p>
      </div>
    </div>
  );
};

export default DebugSentry;
