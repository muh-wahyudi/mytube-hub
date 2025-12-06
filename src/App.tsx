import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import MyVideos from "./pages/MyVideos";
import EditVideo from "./pages/EditVideo";
import LikedVideos from "./pages/LikedVideos";
import Subscriptions from "./pages/Subscriptions";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/my-videos" element={<MyVideos />} />
            <Route path="/edit-video/:id" element={<EditVideo />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/history" element={<History />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
