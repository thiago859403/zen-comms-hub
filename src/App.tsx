import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/admin" element={<Admin />} />
          <Route path="/dashboard/campaigns" element={<Campaigns />} />
          <Route path="/dashboard/contacts" element={<Contacts />} />
          <Route path="/dashboard/chats" element={<Chats />} />
          <Route path="/dashboard/templates" element={<Templates />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/message-sending" element={<MessageSending />} />
          <Route path="/dashboard/announcements" element={<Announcements />} />
          <Route path="/dashboard/commercial-support" element={<CommercialSupport />} />
          <Route path="/dashboard/customer-support" element={<CustomerSupport />} />
          <Route path="/dashboard/chatbots" element={<ChatbotList />} />
          <Route path="/dashboard/knowledge-bases" element={<KnowledgeBases />} />
          <Route path="/dashboard/conversations" element={<Conversations />} />
          <Route path="/dashboard/flow-map" element={<FlowMap />} />
          <Route path="/dashboard/specialist-agents" element={<SpecialistAgents />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/suggestions" element={<Suggestions />} />
          
          <Route path="/dashboard/chat-inbox" element={<ChatInbox />} />
          <Route path="/dashboard/bot-config" element={<BotConfig />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
