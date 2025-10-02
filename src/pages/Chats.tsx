import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Ana Silva",
      lastMessage: "Obrigada pela informação!",
      time: "10:30",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Bruno Santos",
      lastMessage: "Qual o prazo de entrega?",
      time: "09:15",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Carla Oliveira",
      lastMessage: "Perfeito, vou aguardar",
      time: "Ontem",
      unread: 0,
      online: true,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "contact",
      content: "Olá! Gostaria de saber mais sobre os produtos",
      time: "10:25",
    },
    {
      id: 2,
      sender: "me",
      content: "Olá Ana! Claro, temos várias opções disponíveis. Sobre qual produto você gostaria de saber?",
      time: "10:26",
    },
    {
      id: 3,
      sender: "contact",
      content: "Estou interessada nos planos de automação",
      time: "10:28",
    },
    {
      id: 4,
      sender: "me",
      content: "Ótimo! Temos 3 planos principais: Básico, Profissional e Enterprise. Qual seria o volume de mensagens que você pretende enviar por mês?",
      time: "10:29",
    },
    {
      id: 5,
      sender: "contact",
      content: "Cerca de 5 mil mensagens",
      time: "10:30",
    },
    {
      id: 6,
      sender: "me",
      content: "Perfeito! O plano Profissional seria ideal para você. Vou te enviar mais detalhes.",
      time: "10:30",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement send message logic
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <DashboardLayout>
      <Card className="h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* Conversations list */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-9" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left hover:bg-muted transition-colors",
                    selectedChat === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {conv.name.charAt(0)}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {conv.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  A
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
              </div>
              <div>
                <p className="font-medium">Ana Silva</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Video className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        msg.sender === "me"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Chats;