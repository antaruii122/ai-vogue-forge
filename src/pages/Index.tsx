import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { PayPalCheckoutModal } from "@/components/PayPalCheckoutModal";
import {
  Header,
  HeroSection,
  ProcessSection,
  CarouselSection,
  VideoMockupSection,
  ExamplesSection,
  HowItWorksSection,
  PricingSection,
  FAQSection,
  Footer,
} from "@/components/landing";

const Index = () => {
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();

  // Handle scroll to pricing from URL param
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'pricing') {
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const isLoggedIn = !!(isLoaded && user);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        isLoaded={isLoaded} 
        onLogout={handleLogout} 
      />

      <HeroSection isLoggedIn={isLoggedIn} />

      <ProcessSection isLoggedIn={isLoggedIn} />

      <CarouselSection />

      <VideoMockupSection isLoggedIn={isLoggedIn} />

      <ExamplesSection 
        currentlyPlayingVideoId={currentlyPlayingVideoId}
        onVideoPlay={setCurrentlyPlayingVideoId}
      />

      <HowItWorksSection />

      <PricingSection onOpenPayPal={() => setIsPayPalModalOpen(true)} />

      <PayPalCheckoutModal 
        isOpen={isPayPalModalOpen} 
        onClose={() => setIsPayPalModalOpen(false)} 
      />

      <FAQSection />

      <Footer />
    </div>
  );
};

export default Index;
