import { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { AlertTriangle, Bug, Lock, MessageSquare, ShieldCheck, ShieldOff } from "lucide-react";

const DebugSentry = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [eventsSent, setEventsSent] = useState({ exceptions: 0, messages: 0 });

  const sentryActive = isMonitoringEnabled();
  const environment = import.meta.env.VITE_APP_ENV || "development";

  // Extrair keys para comparação
  const urlKey = new URLSearchParams(location.search).get("key") ?? "";
  const envKey = import.meta.env.VITE_SENTRY_DEBUG_KEY ?? "";

  // Determinar autorização (depende exclusivamente da ENV VAR)
  const autorizado =
    urlKey &&
    envKey &&
    urlKey === envKey;
  const authorized = !!autorizado;

  // Determinar motivo do bloqueio
  const getBlockReason = (): string | null => {
    if (authorized) return null;
    if (!urlKey) return "Não veio key na URL";
    if (!envKey) return "ENV VITE_SENTRY_DEBUG_KEY vazia no build";
    if (urlKey !== envKey) return "Keys diferentes";
    return "Motivo desconhecido";
  };

  const blockReason = getBlockReason();

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

  // ─── Tela de diagnóstico (não autorizado) ────────────────────
  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-red-500" />
                <div>
                  <CardTitle className="text-xl">Acesso Bloqueado</CardTitle>
                  <CardDescription>
                    A página de debug do Sentry não pôde ser acessada. Veja o diagnóstico abaixo.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Motivo do bloqueio */}
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium">Motivo: {blockReason}</p>
                </div>
              </div>

              {/* Diagnóstico detalhado */}
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3 font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">urlKey:</span>
                  <span className="text-foreground">
                    {urlKey ? `"${urlKey}"` : <span className="text-red-500 italic">(vazio)</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">urlKey.length:</span>
                  <span className="text-foreground">{urlKey.length}</span>
                </div>

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">envKey:</span>
                  <span className="text-foreground">
                    {envKey ? `"${envKey}"` : <span className="text-red-500 italic">(vazio)</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">envKey.length:</span>
                  <span className="text-foreground">{envKey.length}</span>
                </div>

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Match:</span>
                  <Badge variant={urlKey === envKey && urlKey.length > 0 ? "default" : "destructive"}>
                    {urlKey === envKey ? (urlKey.length > 0 ? "true" : "ambas vazias") : "false"}
                  </Badge>
                </div>
              </div>

              {/* Dica */}
              <p className="text-xs text-muted-foreground">
                Para acessar, defina <code className="bg-muted px-1 rounded">VITE_SENTRY_DEBUG_KEY</code> no
                arquivo <code className="bg-muted px-1 rounded">.env</code> e passe{" "}
                <code className="bg-muted px-1 rounded">?key=VALOR</code> na URL com o mesmo valor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Conteúdo normal (autorizado) ────────────────────────────
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
