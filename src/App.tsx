import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Contacts from "./pages/Contacts";
import Chats from "./pages/Chats";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import MessageSending from "./pages/MessageSending";
import Announcements from "./pages/Announcements";
import CommercialSupport from "./pages/CommercialSupport";
import CustomerSupport from "./pages/CustomerSupport";
import ChatbotList from "./pages/ChatbotList";
import KnowledgeBases from "./pages/KnowledgeBases";
import Conversations from "./pages/Conversations";
import FlowMap from "./pages/FlowMap";
import SpecialistAgents from "./pages/SpecialistAgents";
import Analytics from "./pages/Analytics";
import Suggestions from "./pages/Suggestions";

import ChatInbox from "./pages/ChatInbox";
import BotConfig from "./pages/BotConfig";
import OrganizationSettings from "./pages/OrganizationSettings";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import UsageDashboard from "./pages/UsageDashboard";
import ApiKeys from "./pages/ApiKeys";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/dashboard/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          <Route path="/dashboard/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
          <Route path="/dashboard/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/message-sending" element={<ProtectedRoute><MessageSending /></ProtectedRoute>} />
          <Route path="/dashboard/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/dashboard/commercial-support" element={<ProtectedRoute><CommercialSupport /></ProtectedRoute>} />
          <Route path="/dashboard/customer-support" element={<ProtectedRoute><CustomerSupport /></ProtectedRoute>} />
          <Route path="/dashboard/chatbots" element={<ProtectedRoute><ChatbotList /></ProtectedRoute>} />
          <Route path="/dashboard/knowledge-bases" element={<ProtectedRoute><KnowledgeBases /></ProtectedRoute>} />
          <Route path="/dashboard/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
          <Route path="/dashboard/flow-map" element={<ProtectedRoute><FlowMap /></ProtectedRoute>} />
          <Route path="/dashboard/specialist-agents" element={<ProtectedRoute><SpecialistAgents /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/suggestions" element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />
          <Route path="/dashboard/chat-inbox" element={<ProtectedRoute><ChatInbox /></ProtectedRoute>} />
          <Route path="/dashboard/bot-config" element={<ProtectedRoute><BotConfig /></ProtectedRoute>} />
          <Route path="/dashboard/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/dashboard/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/dashboard/usage" element={<ProtectedRoute><UsageDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/api-keys" element={<ProtectedRoute><ApiKeys /></ProtectedRoute>} />
          
          {/* Admin Only Routes */}
          <Route path="/dashboard/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
          <Route path="/dashboard/organization-settings" element={<ProtectedRoute requireAdmin><OrganizationSettings /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
