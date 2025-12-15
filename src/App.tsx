import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Eager load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Lazy load other pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FashionPhotographyTool = lazy(() => import("./pages/FashionPhotographyTool"));
const FashionPhotography = lazy(() => import("./pages/FashionPhotography"));
const FashionResults = lazy(() => import("./pages/FashionResults"));
const VideoGeneration = lazy(() => import("./pages/VideoGeneration"));
const ProductPhotography = lazy(() => import("./pages/ProductPhotography"));
const AdminVideos = lazy(() => import("./pages/AdminVideos"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MyImages = lazy(() => import("./pages/MyImages"));
const Profile = lazy(() => import("./pages/Profile"));
const Billing = lazy(() => import("./pages/Billing"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Features = lazy(() => import("./pages/Features"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute"));
const AdminRoute = lazy(() => import("@/components/AdminRoute"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const paypalInitialOptions = {
  clientId: "AS-M0yaOgF3urSHC0WTcBvhvfgRZst30NhR2m5WSFhf1g79k2zA6aoXcbYgz1HAHS9IB5zFPWJrJurQE",
  currency: "USD",
  intent: "capture",
};

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// App routes component
const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path="/generator" element={<ProtectedRoute><FashionPhotography /></ProtectedRoute>} />
        <Route path="/my-images" element={<ProtectedRoute><MyImages /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        
        {/* Tool Routes - All Protected */}
        <Route path="/tools/fashion-photography" element={<ProtectedRoute><FashionPhotography /></ProtectedRoute>} />
        <Route path="/tools/fashion-results" element={<ProtectedRoute><FashionResults /></ProtectedRoute>} />
        <Route path="/tools/video-generation" element={<ProtectedRoute><VideoGeneration /></ProtectedRoute>} />
        <Route path="/tools/product-photography" element={<ProtectedRoute><ProductPhotography /></ProtectedRoute>} />
        
        {/* Legacy Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tools/fashion-photography-old" element={<ProtectedRoute><FashionPhotographyTool /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<AdminRoute><AdminVideos /></AdminRoute>} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const App = () => {
  // Check if Clerk key is available
  if (!clerkPubKey) {
    console.error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Configuration Error</h1>
          <p className="text-muted-foreground">Clerk publishable key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={clerkPubKey}
        afterSignOutUrl="/"
      >
        <PayPalScriptProvider options={paypalInitialOptions}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ClerkLoading>
                <PageLoader />
              </ClerkLoading>
              <ClerkLoaded>
                <AppRoutes />
              </ClerkLoaded>
            </TooltipProvider>
          </QueryClientProvider>
        </PayPalScriptProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
