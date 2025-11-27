import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

// Eager load critical pages
import Index from "./pages/Index";

// Lazy load other pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FashionPhotographyTool = lazy(() => import("./pages/FashionPhotographyTool"));
const FashionPhotography = lazy(() => import("./pages/FashionPhotography"));
const VideoGeneration = lazy(() => import("./pages/VideoGeneration"));
const ProductPhotography = lazy(() => import("./pages/ProductPhotography"));
const AdminVideos = lazy(() => import("./pages/AdminVideos"));
const MyImages = lazy(() => import("./pages/MyImages"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tools/fashion-photography-old" element={<FashionPhotographyTool />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              
              {/* Temporarily disable Clerk-protected routes */}
              <Route path="/sign-in/*" element={
                <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
                  <div className="max-w-md bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Setup In Progress</h2>
                    <p className="text-muted-foreground mb-4">
                      Clerk authentication is being configured. The app will work with basic access for now.
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                      Return Home
                    </Button>
                  </div>
                </div>
              } />
              <Route path="/sign-up/*" element={
                <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
                  <div className="max-w-md bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Setup In Progress</h2>
                    <p className="text-muted-foreground mb-4">
                      Clerk authentication is being configured. The app will work with basic access for now.
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                      Return Home
                    </Button>
                  </div>
                </div>
              } />
              
              {/* Open access to tool routes temporarily */}
              <Route path="/generator" element={<FashionPhotography />} />
              <Route path="/my-images" element={<MyImages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tools/fashion-photography" element={<FashionPhotography />} />
              <Route path="/tools/video-generation" element={<VideoGeneration />} />
              <Route path="/tools/product-photography" element={<ProductPhotography />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
