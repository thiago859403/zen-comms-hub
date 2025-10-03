import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Send,
  Settings,
  Menu,
  Home,
  BarChart3,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import zenviaIcon from "@/assets/zenvia-icon.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  hasSubmenu?: boolean;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Users, label: "Contatos", path: "/dashboard/contacts" },
  { icon: Send, label: "Envio de mensagens", path: "/dashboard/campaigns" },
  { icon: Megaphone, label: "Anúncios", path: "/dashboard/templates" },
  { icon: MessageSquare, label: "Atendimento comercial", path: "/dashboard/chats" },
  { icon: BarChart3, label: "Análises", path: "/dashboard/analytics" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen bg-background flex flex-col transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Area - Dark */}
        <div className="bg-[#1a1a1a] h-16 flex items-center px-4 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={zenviaIcon} alt="Zenvia" className="h-8 w-8 shrink-0" />
            {isExpanded && (
              <span className="text-white font-semibold tracking-wide whitespace-nowrap">
                ZENVIA
              </span>
            )}
          </Link>
        </div>

        {/* Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" />

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-all relative group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-r"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isExpanded && (
                  <>
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
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
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-4 text-sm transition-all",
              location.pathname === "/dashboard/settings"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Configurações</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Dark Header with Gradient */}
        <header className="bg-[#1a1a1a] border-b border-gray-800">
          <div className="h-16 flex items-center px-6">
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {/* Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;