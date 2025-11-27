import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";

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

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

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
                
                {/* Clerk Auth Routes */}
                <Route path="/sign-in/*" element={
                  <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
                    <SignIn routing="path" path="/sign-in" />
                  </div>
                } />
                <Route path="/sign-up/*" element={
                  <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
                    <SignUp routing="path" path="/sign-up" />
                  </div>
                } />
                
                {/* Protected Routes */}
                <Route path="/generator" element={
                  <><SignedIn><FashionPhotography /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                <Route path="/my-images" element={
                  <><SignedIn><MyImages /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                <Route path="/profile" element={
                  <><SignedIn><Profile /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                
                {/* Tool Routes - All Protected */}
                <Route path="/tools/fashion-photography" element={
                  <><SignedIn><FashionPhotography /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                <Route path="/tools/video-generation" element={
                  <><SignedIn><VideoGeneration /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                <Route path="/tools/product-photography" element={
                  <><SignedIn><ProductPhotography /></SignedIn><SignedOut><RedirectToSignIn /></SignedOut></>
                } />
                
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
