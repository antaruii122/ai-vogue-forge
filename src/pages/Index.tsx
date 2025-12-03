import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download, Camera, Video, Package, Sparkles, X, Star, Check, User, LogOut } from "lucide-react";
import { uploadVideoToStorage } from "@/utils/uploadVideoToStorage";
import tetesImage from "@/assets/tetes.png";
import heroPhoto1 from "@/assets/hero-photo-1.png";
import heroThumbnail1 from "@/assets/hero-thumbnail-1.png";
import { VideoComparisonCard } from "@/components/VideoComparisonCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState<string>('/videos/BOLD.mp4');
  const [heroVideos, setHeroVideos] = useState({
    left1: '',
    left2: '',
    left3: '',
    right1: '',
    right2: '',
    right3: ''
  });

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Function to load videos from localStorage
    const loadVideos = () => {
      setHeroVideos({
        left1: localStorage.getItem('video_hero-left-1') || '',
        left2: localStorage.getItem('video_hero-left-2') || '',
        left3: localStorage.getItem('video_hero-left-3') || '',
        right1: localStorage.getItem('video_hero-right-1') || '',
        right2: localStorage.getItem('video_hero-right-2') || '',
        right3: localStorage.getItem('video_hero-right-3') || ''
      });
    };

    // Load initially
    loadVideos();

    // Reload when window gains focus (user comes back from admin page)
    const handleFocus = () => {
      loadVideos();
    };
    window.addEventListener('focus', handleFocus);

    // Listen for storage events (when localStorage changes in another tab/window)
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('video_')) {
        loadVideos();
      }
    };
    window.addEventListener('storage', handleStorage);
    
    // Legacy support for old video upload
    const savedHeroVideo = localStorage.getItem('video_hero');
    if (savedHeroVideo) {
      setVideoUrl(savedHeroVideo);
    } else {
      const initVideo = async () => {
        try {
          const url = await uploadVideoToStorage();
          setVideoUrl(url);
        } catch (error) {
          // Silently handle video upload error
        }
      };
      initVideo();
    }

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });

      setUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const categories = ["dresses", "pants", "tops", "graphic t-shirts", "outerwear", "baby & kids clothing", "men's clothing", "women's clothing", "jewellery", "handbags", "sunglasses", "hats", "skincare", "makeup", "beverage", "health & wellness", "pet products", "electronics"];
  const pricingPlans = [{
    name: "Essentials",
    price: "$9",
    credits: "10 credits",
    popular: false,
    features: ["Up to 5 images", "Or up to 2 videos", "Unlimited fashion model customization from ethnicity, poses, and sizes", "Catalogue of templates, props, and avatars to choose from"]
  }, {
    name: "Starter",
    price: "$30",
    credits: "30 credits",
    popular: false,
    features: ["Up to 15 images", "Or up to 7 videos", "Unlimited fashion model customization from ethnicity, poses, and sizes", "Catalogue of templates, props, and avatars to choose from", "Unlimited access to CreativeAgent"]
  }, {
    name: "Advanced",
    price: "$100",
    credits: "200 credits",
    popular: true,
    features: ["Up to 100 images", "Or up to 50 videos", "Unlimited fashion model customization from ethnicity, poses, and sizes", "Catalogue of templates, props, and avatars to choose from", "Unlimited access to CreativeAgent"]
  }, {
    name: "Pro",
    price: "$199",
    credits: "400 credits",
    popular: false,
    features: ["Up to 200 images", "Or up to 100 videos", "Unlimited fashion model customization from ethnicity, poses, and sizes", "Catalogue of templates, props, and avatars to choose from", "Unlimited access to CreativeAgent"]
  }];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-heading font-bold">AI Fashion Studio</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/my-images")}
                    className="hidden md:flex"
                  >
                    My Images
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/generator")}
                    className="hidden md:flex"
                  >
                    Generator
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {user.email?.split('@')[0]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => navigate("/my-images")}>
                        <Camera className="mr-2 h-4 w-4" />
                        My Images
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/generator")}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generator
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      {showAnnouncement}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
                Fashion Photography Made Easy
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Transform your products into stunning professional photography with AI-powered precision and style
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
                Get Started
              </Button>
            </div>

            {/* Horizontal Grid of 4 Polaroid-Style Photos */}
            <div className="flex justify-center items-center gap-2 md:gap-4 max-w-5xl mx-auto -space-x-8 md:-space-x-12">
              {/* Photo 1 */}
              <div 
                className="relative bg-white p-3 md:p-4 rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-10"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <div className="w-[140px] md:w-[200px] h-[180px] md:h-[260px] bg-gradient-to-br from-primary/30 to-primary-purple/30 rounded-sm overflow-hidden">
                  <img src={heroPhoto1} alt="Fashion photo 1" className="w-full h-full object-cover" />
                </div>
                {/* Thumbnail Slot */}
                <div 
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg"
                  style={{ transform: 'rotate(8deg)' }}
                >
                  <img src={heroThumbnail1} alt="Product thumbnail 1" className="w-full h-full object-cover rounded-sm" />
                </div>
              </div>
              
              {/* Photo 2 */}
              <div 
                className="relative bg-white p-3 md:p-4 rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-20"
                style={{ transform: 'rotate(3deg)' }}
              >
                <div className="w-[140px] md:w-[200px] h-[180px] md:h-[260px] bg-gradient-to-br from-primary-purple/30 to-accent/30 rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50" />
                </div>
                {/* Thumbnail Slot */}
                <div 
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted rounded-sm" />
                </div>
              </div>
              
              {/* Photo 3 */}
              <div 
                className="relative bg-white p-3 md:p-4 rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-30"
                style={{ transform: 'rotate(-4deg)' }}
              >
                <div className="w-[140px] md:w-[200px] h-[180px] md:h-[260px] bg-gradient-to-br from-accent/30 to-primary/30 rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50" />
                </div>
                {/* Thumbnail Slot */}
                <div 
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg"
                  style={{ transform: 'rotate(10deg)' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted rounded-sm" />
                </div>
              </div>
              
              {/* Photo 4 */}
              <div 
                className="relative bg-white p-3 md:p-4 rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-40"
                style={{ transform: 'rotate(6deg)' }}
              >
                <div className="w-[140px] md:w-[200px] h-[180px] md:h-[260px] bg-gradient-to-br from-primary/30 to-accent/30 rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50" />
                </div>
                {/* Thumbnail Slot */}
                <div 
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg"
                  style={{ transform: 'rotate(-5deg)' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Product Shot to Campaign-Ready */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Content */}
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-heading font-bold">
                  From Product Shot to Campaign-Ready in Minutes
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Upload your product photo—no studio setup required
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      AI transforms it into professional fashion photography
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Choose from multiple styles, backgrounds, and lighting
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Download and share—ready for Instagram, ads, and more
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
                    Try It Now
                  </Button>
                </div>
              </div>
              
              {/* Right Side: Product Photo Placeholder */}
              <div className="flex justify-center md:justify-end">
                <div className="w-[300px] h-[420px] bg-gradient-to-br from-primary-purple/20 to-accent/20 rounded-lg border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Camera className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn Product Photos into Fashion Videos */}
      <section className="py-20 bg-background-lighter">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Phone Mockup */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-[12px] border-gray-800 shadow-2xl overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl z-10" />
                    
                    {/* Screen Content - Video Placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary-purple/30 flex items-center justify-center">
                      <Video className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-heading font-bold">
                  Turn Product Photos into Scroll-Stopping Fashion Videos
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Choose from 360° spins, zoom effects, and dynamic transitions
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Perfect for Instagram Reels, TikTok, and video ads
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Generate professional videos in seconds, no editing needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Carousel */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center">
            See How Fashion Styles Look
          </h2>
        </div>
        
        {/* Top Row - Scroll Left */}
        <div className="relative mb-6">
          <div className="flex gap-6 animate-scroll-left">
            {/* Duplicate images for seamless loop */}
            {[...Array(14)].map((_, i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-[300px] h-[420px] bg-gradient-to-br from-primary/20 to-primary-purple/20 rounded-xl border border-border overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Camera className="h-12 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Row - Scroll Right */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-right">
            {/* Duplicate images for seamless loop */}
            {[...Array(14)].map((_, i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-[300px] h-[420px] bg-gradient-to-br from-primary-purple/20 to-accent/20 rounded-xl border border-border overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Camera className="h-12 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background-lighter">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to professional visuals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: Upload,
            title: "Upload Product Image",
            description: "Simply upload your product photo or flat-lay image"
          }, {
            icon: Wand2,
            title: "Add AI Model + Scene Description",
            description: "Describe your desired model, pose, and setting with text"
          }, {
            icon: Download,
            title: "Download Professional Photo",
            description: "Get your high-quality, on-model lifestyle image instantly"
          }].map((step, i) => <div key={i} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">See What You Can Create</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[400px] sm:max-w-none mx-auto">
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="360° Spin"
            />
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="Zoom In"
            />
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="Model Reveal"
            />
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="Lifestyle Scene"
            />
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="Product Focus"
            />
            <VideoComparisonCard
              imageSrc="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
              videoSrc="/videos/BOLD.mp4"
              templateName="Dynamic Motion"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-heading font-bold">Pricing</h2>
            <p className="text-2xl text-muted-foreground">Replace $100,000 shoots for $9/month.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((plan, i) => <Card key={i} className={`relative overflow-hidden ${plan.popular ? "border-2 border-primary bg-gradient-to-b from-primary/5 via-primary-purple/5 to-transparent" : "border border-border"}`}>
                {plan.popular && <div className="absolute -top-3 right-4">
                    <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most popular
                    </span>
                  </div>}
                <CardHeader className="space-y-6 pb-8">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  
                  <Button className={`w-full ${plan.popular ? "" : "bg-secondary hover:bg-secondary/80"}`} variant={plan.popular ? "default" : "secondary"}>
                    Get Started
                  </Button>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-semibold">{plan.credits}</span>
                    </div>
                    
                    {plan.features.map((feature, j) => <div key={j} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                      </div>)}
                  </div>
                </CardHeader>
              </Card>)}
          </div>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Need more than 400 credits? Contact us to learn about our enterprise plans.</p>
            <Button variant="default" size="lg">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,92,231,0.1),transparent)]" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Ready to save time and money? It's time to supercharge your content production.
            </h2>
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </div>
          <div className="absolute top-0 left-1/4 animate-pulse">
            <Star className="h-8 w-8 text-primary/30" />
          </div>
          <div className="absolute bottom-0 right-1/4 animate-pulse delay-75">
            <Star className="h-6 w-6 text-primary-purple/30" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background-lighter">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-heading font-bold">AI Fashion Studio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional Product Visuals. Powered by AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fashion</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Dresses</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tops</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pants</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Accessories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Jewellery</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Handbags</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sunglasses</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Beauty</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Wellness</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Electronics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AI Fashion Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;