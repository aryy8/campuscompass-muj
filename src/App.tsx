import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campus from "./pages/Campus";
import Directions from "./pages/Directions";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import CrowdHeatMaps from "./pages/CrowdHeatMaps";
import LostAndFound from "./pages/LostAndFound";
import VolunteerSupport from "./pages/VolunteerSupport";
import EmergencyServices from "./pages/EmergencyServices";
import ChatbotPage from "./pages/Chatbot";
import ChatbotFab from "./components/ChatbotFab";
import Contacts from "./pages/Contacts";
import UniWayAPI from "./pages/UniWayAPI";
import ContactsEmergency from "./pages/ContactsEmergency";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatbotFab />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/directions" element={<Directions />} />
            {/* New Feature Routes */}
            <Route path="/crowd" element={<CrowdHeatMaps />} />
            <Route path="/lost-found" element={<LostAndFound />} />
            <Route path="/volunteer" element={<VolunteerSupport />} />
            <Route path="/emergency" element={<EmergencyServices />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts-emergency" element={<ContactsEmergency />} />
            <Route path="/uniway-api" element={<UniWayAPI />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
