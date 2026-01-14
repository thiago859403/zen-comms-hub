import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MessageSquare, Users, Send, Settings, Menu, Home, BarChart3, Megaphone, ChevronDown, ChevronRight, Bot, Sparkles, FileText, MessageCircle, GitBranch, Headphones, FileStack, Shield, Lightbulb, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import nuviaIcon from "@/assets/nuvia-icon-transparent.png";
import ChatAssistant from "./ChatAssistant";
import HelpDropdown from "./HelpDropdown";
import NotificationsPanel from "./NotificationsPanel";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";

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
  label: "Nuvia Blast",
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
  }, {
    label: "Config. do Bot",
    path: "/dashboard/bot-config"
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
  const { signOut } = useAuth();
  const { profile } = useDashboardData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenus, setOpenMenus] = useState<{
    [key: string]: boolean;
  }>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFiles = () => {
    toast({
      title: "Arquivos",
      description: "Gerenciador de arquivos será aberto em breve.",
    });
  };

  const handleProfile = () => {
    navigate("/dashboard/organization-settings");
  };

  const handleLogout = async () => {
    toast({
      title: "Saindo...",
      description: "Você será desconectado em instantes.",
      variant: "destructive",
    });
    await signOut();
  };

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-background flex flex-col transition-all duration-300 ease-in-out z-40",
          // Desktop behavior
          "hidden md:flex",
          isExpanded ? "md:w-64" : "md:w-16",
          // Mobile behavior
          isMobileMenuOpen && "flex w-64 md:hidden"
        )} 
        onMouseEnter={() => setIsExpanded(true)} 
        onMouseLeave={() => setIsExpanded(false)}
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Logo Area - Dark */}
        <div className="bg-[#1a1a1a] h-16 flex items-center px-4 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
              src={nuviaIcon} 
              alt="Nuvia Customer Cloud - Voltar para início" 
              className="h-16 w-16 shrink-0 object-contain" 
            />
            {(isExpanded || isMobileMenuOpen) && (
              <span className="text-white font-semibold tracking-wide whitespace-nowrap">
                Nuvia
              </span>
            )}
          </Link>
        </div>

        {/* Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" aria-hidden="true" />

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto" aria-label="Navegação do dashboard">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;
            const isOpen = openMenus[item.label];
            const showExpanded = isExpanded || isMobileMenuOpen;

            if (item.hasSubmenu && item.submenu && item.submenu.length > 0) {
              return (
                <Collapsible key={item.label} open={isOpen} onOpenChange={() => toggleMenu(item.label)}>
                  <CollapsibleTrigger asChild>
                    <button 
                      className={cn(
                        "w-full flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
                        isActive 
                          ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      aria-expanded={isOpen}
                      aria-controls={`submenu-${item.label}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {showExpanded && (
                        <>
                          <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                          {item.badge && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  {showExpanded && (
                    <CollapsibleContent className="space-y-1" id={`submenu-${item.label}`}>
                      {item.submenu.map(subItem => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <Link 
                            key={subItem.path} 
                            to={subItem.path} 
                            className={cn(
                              "flex items-center gap-3 rounded-md pl-12 pr-3 py-2 text-sm transition-all relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
                              isSubActive 
                                ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="whitespace-nowrap">{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            }

            if (item.hasSubmenu && (!item.submenu || item.submenu.length === 0)) {
              return (
                <button 
                  key={item.label} 
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
                    isActive 
                      ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {showExpanded && (
                    <>
                      <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </>
                  )}
                </button>
              );
            }

            return (
              <Link 
                key={item.path} 
                to={item.path!} 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
                  isActive 
                    ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {showExpanded && (
                  <>
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-border">
          <Link 
            to="/dashboard/organization-settings" 
            className={cn(
              "flex items-center gap-3 px-3 py-4 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
              location.pathname === "/dashboard/organization-settings" 
                ? "text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
            {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Configurações</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex flex-col h-screen transition-all duration-300 ease-in-out",
        "ml-0 md:ml-16",
        isExpanded && "md:ml-64"
      )}>
        {/* Dark Header with Gradient - Fixed */}
        <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
          <div className="h-16 flex items-center justify-between px-4 md:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
            >
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
                      className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]" 
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      aria-label="Abrir assistente virtual"
                    >
                      <MessageSquare className="h-5 w-5" aria-hidden="true" />
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
                      className="text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                      onClick={() => navigate("/dashboard/suggestions")}
                      aria-label="Abrir caixa de sugestões"
                    >
                      <Lightbulb className="h-5 w-5" aria-hidden="true" />
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
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 gap-2 hidden sm:flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                    aria-label="Selecionar organização"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium">{profile.organizationName}</div>
                      <div className="text-xs text-gray-400">Organização atual</div>
                    </div>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card z-[100]">
                  <DropdownMenuLabel>Organizações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div>
                      <div className="font-medium">{profile.organizationName}</div>
                      <div className="text-xs text-muted-foreground">Organização atual</div>
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
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                    aria-label="Menu do usuário"
                  >
                    <Avatar key={profile.avatarUrl || 'no-avatar'} className="h-10 w-10">
                      <AvatarImage src={profile.avatarUrl || undefined} alt={profile.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card z-[100]">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{profile.fullName}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Perfil</span>
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
          <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" aria-hidden="true" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
