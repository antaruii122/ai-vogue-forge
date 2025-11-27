import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FashionPhotographyTool from "./pages/FashionPhotographyTool";
import FashionPhotography from "./pages/FashionPhotography";
import VideoGeneration from "./pages/VideoGeneration";
import ProductPhotography from "./pages/ProductPhotography";
import AdminVideos from "./pages/AdminVideos";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyImages from "./pages/MyImages";
import Profile from "./pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/generator" element={<ProtectedRoute><FashionPhotography /></ProtectedRoute>} />
          <Route path="/my-images" element={<ProtectedRoute><MyImages /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Legacy Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools/fashion-photography-old" element={<FashionPhotographyTool />} />
          <Route path="/tools/fashion-photography" element={<ProtectedRoute><FashionPhotography /></ProtectedRoute>} />
          <Route path="/tools/video-generation" element={<VideoGeneration />} />
          <Route path="/tools/product-photography" element={<ProductPhotography />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
