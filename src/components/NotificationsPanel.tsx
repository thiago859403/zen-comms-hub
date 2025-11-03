import { Bell, Megaphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Notification {
  id: number;
  date: string;
  sender: string;
  message: string;
  type: "info" | "contact" | "commercial";
}

const notifications: Notification[] = [
  {
    id: 1,
    date: "20/08/2024",
    sender: "Fernando Lima",
    message: "Oi",
    type: "info",
  },
  {
    id: 2,
    date: "20/08/2024",
    sender: "Fernando Lima",
    message: "Aguardando novo contato!",
    type: "contact",
  },
  {
    id: 3,
    date: "20/08/2024",
    sender: "Sistema",
    message: "1 novo contato em Atendimento comercial!",
    type: "commercial",
  },
  {
    id: 4,
    date: "20/08/2024",
    sender: "Sistema",
    message: "1 novo contato em Atendimento comercial!",
    type: "commercial",
  },
];

const NotificationsPanel = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            title="Notificações"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {notifications.length}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] bg-card z-[100] p-0">
        <DropdownMenuLabel className="px-4 py-3 border-b">
          Notificações
        </DropdownMenuLabel>
        
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem className="cursor-pointer p-3 flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-muted">
                      <Megaphone className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {notification.date}
                    </div>
                    <div className="font-medium text-sm">{notification.sender}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 mt-1 text-primary text-xs"
                    >
                      Acessar
                    </Button>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <Button variant="link" className="w-full text-primary">
            Ver todas →
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsPanel;
