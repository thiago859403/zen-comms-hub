import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { initMonitoring } from "@/lib/monitoring";
import { Loader2 } from "lucide-react";

// Inicializar monitoramento o mais cedo possível (antes do render)
initMonitoring();

// Páginas públicas (carregamento imediato)
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Página de debug (lazy loading, acesso restrito por query param)
const DebugSentry = lazy(() => import("./pages/DebugSentry"));

// Páginas protegidas (lazy loading)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Chats = lazy(() => import("./pages/Chats"));
const Templates = lazy(() => import("./pages/Templates"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
const MessageSending = lazy(() => import("./pages/MessageSending"));
const Announcements = lazy(() => import("./pages/Announcements"));
const CommercialSupport = lazy(() => import("./pages/CommercialSupport"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const ChatbotList = lazy(() => import("./pages/ChatbotList"));
const KnowledgeBases = lazy(() => import("./pages/KnowledgeBases"));
const Conversations = lazy(() => import("./pages/Conversations"));
const FlowMap = lazy(() => import("./pages/FlowMap"));
const SpecialistAgents = lazy(() => import("./pages/SpecialistAgents"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const ChatInbox = lazy(() => import("./pages/ChatInbox"));
const BotConfig = lazy(() => import("./pages/BotConfig"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Billing = lazy(() => import("./pages/Billing"));
const UsageDashboard = lazy(() => import("./pages/UsageDashboard"));
const ApiKeys = lazy(() => import("./pages/ApiKeys"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const AIAgents = lazy(() => import("./pages/AIAgents"));
const IAContext = lazy(() => import("./pages/IAContext"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MasterDashboard = lazy(() => import("./pages/MasterDashboard"));

// Fallback de loading para Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

// React Query config otimizado (EPIC 6.3.2)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tempo de cache (antigo cacheTime)
      retry: (failureCount, error: any) => {
        // Não retry em erros 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry até 2 vezes para erros de rede/5xx
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Evitar refetch desnecessário
      refetchOnMount: true, // Refetch ao montar componente (garante dados atualizados)
      refetchOnReconnect: true, // Refetch ao reconectar
    },
    mutations: {
      retry: 0, // Nunca retry mutations
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/campaigns"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Campaigns />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/contacts"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Contacts />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chats"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Chats />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/templates"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Templates />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/message-sending"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <MessageSending />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/announcements"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Announcements />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/commercial-support"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <CommercialSupport />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer-support"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <CustomerSupport />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chatbots"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ChatbotList />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/knowledge-bases"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <KnowledgeBases />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/conversations"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Conversations />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/flow-map"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <FlowMap />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página Beta/Marketing */}
          <Route
            path="/dashboard/specialist-agents"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <SpecialistAgents />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Analytics />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/suggestions"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Suggestions />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chat-inbox"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ChatInbox />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bot-config"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <BotConfig />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pricing"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Pricing />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/billing"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Billing />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/usage"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <UsageDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/api-keys"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ApiKeys />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/team"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <TeamManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página Oficial (usada nos testes) */}
          <Route
            path="/dashboard/ai-agents"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AIAgents />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/ia-context"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <IAContext />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin-dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<PageLoader />}>
                  <Admin />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/master"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <MasterDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/organization-settings"
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<PageLoader />}>
                  <OrganizationSettings />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Debug/Teste — acesso restrito por ?key=NUVIA_TEST */}
          <Route
            path="/debug/sentry"
            element={
              <Suspense fallback={<PageLoader />}>
                <DebugSentry />
              </Suspense>
            }
          />

          <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
