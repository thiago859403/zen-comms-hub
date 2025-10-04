import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Users, Clock, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const MessageSending = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState({
    recipients: "all",
    template: "",
    content: "",
    scheduleDate: "",
    scheduleTime: "",
  });

  const [scheduleNow, setScheduleNow] = useState(true);

  const handleSendMessage = () => {
    if (!message.content) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma mensagem",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensagem enviada!",
      description: scheduleNow 
        ? "Sua mensagem está sendo enviada agora."
        : "Sua mensagem foi agendada com sucesso.",
    });

    setMessage({
      recipients: "all",
      template: "",
      content: "",
      scheduleDate: "",
      scheduleTime: "",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Envio de mensagens</h1>
          <p className="text-muted-foreground mt-2">
            Envie mensagens em massa para seus contatos
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,845</div>
              <p className="text-xs text-muted-foreground">+20% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destinatários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,421</div>
              <p className="text-xs text-muted-foreground">Contatos alcançados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Mensagens programadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Campanha de Mensagens</CardTitle>
            <CardDescription>Configure e envie mensagens para seus contatos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipients">Destinatários</Label>
                <Select value={message.recipients} onValueChange={(value) => setMessage({ ...message, recipients: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os contatos</SelectItem>
                    <SelectItem value="clients">Apenas clientes</SelectItem>
                    <SelectItem value="leads">Apenas leads</SelectItem>
                    <SelectItem value="vip">Clientes VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template (opcional)</Label>
                <Select value={message.template} onValueChange={(value) => setMessage({ ...message, template: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Boas-vindas</SelectItem>
                    <SelectItem value="promo">Promoção</SelectItem>
                    <SelectItem value="reminder">Lembrete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Mensagem</Label>
              <Textarea
                id="content"
                placeholder="Digite sua mensagem aqui..."
                value={message.content}
                onChange={(e) => setMessage({ ...message, content: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Use variáveis: {"{{nome}}"}, {"{{empresa}}"}, {"{{produto}}"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="schedule-now" 
                  checked={scheduleNow}
                  onCheckedChange={(checked) => setScheduleNow(checked as boolean)}
                />
                <label
                  htmlFor="schedule-now"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enviar agora
                </label>
              </div>

              {!scheduleNow && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Data de envio
                    </Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={message.scheduleDate}
                      onChange={(e) => setMessage({ ...message, scheduleDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Horário de envio
                    </Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={message.scheduleTime}
                      onChange={(e) => setMessage({ ...message, scheduleTime: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSendMessage} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {scheduleNow ? "Enviar Agora" : "Agendar Envio"}
              </Button>
              <Button variant="outline" onClick={() => setMessage({
                recipients: "all",
                template: "",
                content: "",
                scheduleDate: "",
                scheduleTime: "",
              })}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessageSending;
