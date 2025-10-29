import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIFashionPhotography from "./pages/AIFashionPhotography";
import FashionPhotographyTool from "./pages/FashionPhotographyTool";
import VideoGeneration from "./pages/VideoGeneration";
import ProductPhotography from "./pages/ProductPhotography";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-fashion-photography" element={<AIFashionPhotography />} />
          <Route path="/tools/fashion-photography" element={<FashionPhotographyTool />} />
          <Route path="/tools/video-generation" element={<VideoGeneration />} />
          <Route path="/tools/product-photography" element={<ProductPhotography />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
