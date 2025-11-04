import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MessageSquare, Users, Send, Settings, Menu, Home, BarChart3, Megaphone, ChevronDown, ChevronRight, Bot, Sparkles, FileText, MessageCircle, GitBranch, Headphones, FileStack, Shield, Lightbulb, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import nuviaIcon from "@/assets/nuvia-icon-transparent.png";
import ChatAssistant from "./ChatAssistant";
import HelpDropdown from "./HelpDropdown";
import NotificationsPanel from "./NotificationsPanel";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
interface DashboardLayoutProps {
  children: ReactNode;
}
interface SubMenuItem {
  label: string;
  path: string;
}
interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  badge?: string;
  submenu?: SubMenuItem[];
}
const menuItems: MenuItem[] = [{
  icon: Home,
  label: "Início",
  path: "/dashboard"
}, {
  icon: Users,
  label: "Contatos",
  path: "/dashboard/contacts"
}, {
  icon: Send,
  label: "Envio de mensagens",
  path: "/dashboard/message-sending"
}, {
  icon: Megaphone,
  label: "Anúncios",
  path: "/dashboard/announcements"
}, {
  icon: MessageSquare,
  label: "Atendimento comercial",
  path: "/dashboard/commercial-support"
}, {
  icon: Headphones,
  label: "Atendimento de suporte",
  path: "/dashboard/customer-support"
}, {
  icon: Bot,
  label: "Chatbot",
  hasSubmenu: true,
  submenu: [{
    label: "Lista de chatbots",
    path: "/dashboard/chatbots"
  }, {
    label: "Bases de conhecimento",
    path: "/dashboard/knowledge-bases"
  }, {
    label: "Conversas",
    path: "/dashboard/conversations"
  }, {
    label: "Mapa de fluxos",
    path: "/dashboard/flow-map"
  }]
}, {
  icon: Smartphone,
  label: "WhatsApp",
  hasSubmenu: true,
  submenu: [{
    label: "Configuração",
    path: "/dashboard/whatsapp-config"
  }, {
    label: "Chat Inbox",
    path: "/dashboard/chat-inbox"
  }]
}, {
  icon: Sparkles,
  label: "Agentes especialistas",
  path: "/dashboard/specialist-agents",
  badge: "Beta"
}, {
  icon: BarChart3,
  label: "Análises",
  path: "/dashboard/analytics"
}, {
  icon: Shield,
  label: "Admin",
  path: "/dashboard/admin",
  badge: "Admin"
}];
const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState<{
    [key: string]: boolean;
  }>({
    "Chatbot": true // Default open
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFiles = () => {
    toast({
      title: "Arquivos",
      description: "Gerenciador de arquivos será aberto em breve.",
    });
  };

  const handleProfile = () => {
    navigate("/dashboard/settings");
    toast({
      title: "Perfil",
      description: "Navegando para as configurações de perfil.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Saindo...",
      description: "Você será desconectado em instantes.",
      variant: "destructive",
    });
    setTimeout(() => {
      navigate("/auth");
    }, 1500);
  };
  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };
  return <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed */}
      <aside className={cn("fixed left-0 top-0 h-screen bg-background flex flex-col transition-all duration-300 ease-in-out z-40", isExpanded ? "w-64" : "w-16")} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
        {/* Logo Area - Dark */}
        <div className="bg-[#1a1a1a] h-16 flex items-center px-4 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={nuviaIcon} alt="Nuvia Customer Cloud" className="h-12 w-12 shrink-0" />
            {isExpanded && <span className="text-white font-semibold tracking-wide whitespace-nowrap">Nuvia
          </span>}
          </Link>
        </div>

        {/* Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" />

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          const isOpen = openMenus[item.label];
          if (item.hasSubmenu && item.submenu && item.submenu.length > 0) {
            return <Collapsible key={item.label} open={isOpen} onOpenChange={() => toggleMenu(item.label)}>
                  <CollapsibleTrigger asChild>
                    <button className={cn("w-full flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group", isActive ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                      <Icon className="h-5 w-5 shrink-0" />
                      {isExpanded && <>
                          <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                          {item.badge && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>}
                          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                        </>}
                    </button>
                  </CollapsibleTrigger>
                  {isExpanded && <CollapsibleContent className="space-y-1">
                      {item.submenu.map(subItem => {
                  const isSubActive = location.pathname === subItem.path;
                  return <Link key={subItem.path} to={subItem.path} className={cn("flex items-center gap-3 rounded-md pl-12 pr-3 py-2 text-sm transition-all relative", isSubActive ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                            <span className="whitespace-nowrap">{subItem.label}</span>
                          </Link>;
                })}
                    </CollapsibleContent>}
                </Collapsible>;
          }
          if (item.hasSubmenu && (!item.submenu || item.submenu.length === 0)) {
            return <button key={item.label} className={cn("w-full flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group", isActive ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <Icon className="h-5 w-5 shrink-0" />
                  {isExpanded && <>
                      <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                      {item.badge && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>}
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </>}
                </button>;
          }
          return <Link key={item.path} to={item.path!} className={cn("flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group", isActive ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="h-5 w-5 shrink-0" />
                {isExpanded && <>
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                    {item.badge && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>}
                  </>}
              </Link>;
        })}
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-border">
          <Link to="/dashboard/settings" className={cn("flex items-center gap-3 px-3 py-4 text-sm transition-all", location.pathname === "/dashboard/settings" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}>
            <Settings className="h-5 w-5 shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Configurações</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex flex-col h-screen transition-all duration-300 ease-in-out", isExpanded ? "ml-64" : "ml-16")}>
        {/* Dark Header with Gradient - Fixed */}
        <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
          <div className="h-16 flex items-center justify-between px-6">
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Right side icons and user menu */}
            <div className="flex items-center gap-2 ml-auto">
              <TooltipProvider>
                {/* Chat Assistant Icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/10" 
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assistente virtual</p>
                  </TooltipContent>
                </Tooltip>

                {/* Help/Support Dropdown */}
                <HelpDropdown />
                
                {/* Notifications Panel */}
                <NotificationsPanel />
                
                {/* Suggestions Box Icon */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/10"
                      onClick={() => navigate("/dashboard/suggestions")}
                    >
                      <Lightbulb className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Caixa de sugestões</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Organization Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                    <div className="text-left">
                      <div className="text-sm font-medium">Nuvia Customer Cloud</div>
                      <div className="text-xs text-gray-400">Organização principal</div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card z-[100]">
                  <DropdownMenuLabel>Organizações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div>
                      <div className="font-medium">Nuvia Customer Cloud</div>
                      <div className="text-xs text-muted-foreground">Organização principal</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="text-primary">+ Adicionar organização</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        NU
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card z-[100]">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>;
};
export default DashboardLayout;