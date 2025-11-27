import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { ClerkProvider } from '@clerk/clerk-react';

// Eager load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Lazy load other pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FashionPhotographyTool = lazy(() => import("./pages/FashionPhotographyTool"));
const FashionPhotography = lazy(() => import("./pages/FashionPhotography"));
const VideoGeneration = lazy(() => import("./pages/VideoGeneration"));
const ProductPhotography = lazy(() => import("./pages/ProductPhotography"));
const AdminVideos = lazy(() => import("./pages/AdminVideos"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MyImages = lazy(() => import("./pages/MyImages"));
const Profile = lazy(() => import("./pages/Profile"));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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
              
              {/* Tool Routes - All Protected */}
              <Route path="/tools/fashion-photography" element={<ProtectedRoute><FashionPhotography /></ProtectedRoute>} />
              <Route path="/tools/video-generation" element={<ProtectedRoute><VideoGeneration /></ProtectedRoute>} />
              <Route path="/tools/product-photography" element={<ProtectedRoute><ProductPhotography /></ProtectedRoute>} />
              
              {/* Legacy Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tools/fashion-photography-old" element={<FashionPhotographyTool />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ClerkProvider>
  </ErrorBoundary>
);

export default App;
