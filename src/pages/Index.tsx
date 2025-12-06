import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download, Camera, Video, Sparkles, Star, Check, User, LogOut, ChevronDown, ArrowRight } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import tetesImage from "@/assets/tetes.png";
import heroPhoto1 from "@/assets/hero-photo-1.png";
import heroPhoto2 from "@/assets/hero-photo-2.png";
import heroPhoto3 from "@/assets/hero-photo-3.png";
import heroPhoto4 from "@/assets/hero-photo-4.png";
import heroThumbnail1 from "@/assets/hero-thumbnail-1.png";
import heroThumbnail2 from "@/assets/hero-thumbnail-2.png";
import heroThumbnail3 from "@/assets/hero-thumbnail-3.png";
import heroThumbnail4 from "@/assets/hero-thumbnail-4.png";
import carousel1 from "@/assets/carousel-1.png";
import carousel2 from "@/assets/carousel-2.png";
import carousel3 from "@/assets/carousel-3.png";
import carousel4 from "@/assets/carousel-4.png";
import carousel5 from "@/assets/carousel-5.png";
import carousel6 from "@/assets/carousel-6.png";
import carousel7 from "@/assets/carousel-7.png";
import carousel8 from "@/assets/carousel-8.png";
import carousel9 from "@/assets/carousel-9.png";
import carousel10 from "@/assets/carousel-10.png";
import carousel11 from "@/assets/carousel-11.png";
import carousel12 from "@/assets/carousel-12.png";
import carousel13 from "@/assets/carousel-13.png";
import { VideoComparisonCard } from "@/components/VideoComparisonCard";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Index = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const {
    user,
    isLoaded
  } = useUser();
  const {
    signOut
  } = useClerk();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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

    // Load saved hero video from localStorage
    const savedHeroVideo = localStorage.getItem('video_hero');
    if (savedHeroVideo) {
      setVideoUrl(savedHeroVideo);
    }
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
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
  const categories = ["dresses", "pants", "tops", "graphic t-shirts", "outerwear", "baby & kids clothing", "men's clothing", "women's clothing", "jewellery", "handbags", "sunglasses", "hats", "skincare", "makeup", "beverage", "health & wellness", "pet products", "electronics"];
  const pricingPlans = [{
    number: "01",
    name: "Trial",
    subtitle: "Try risk-free",
    price: "$6",
    priceLabel: "One time payment",
    saveBadge: null,
    popular: false,
    features: ["20 credits = 20 images", "1K resolution"]
  }, {
    number: "02",
    name: "Basic",
    subtitle: "The essentials to get started",
    price: "$35",
    priceLabel: "One time payment",
    saveBadge: "Save 7.4%",
    popular: false,
    features: ["140 credits = 140 images", "1K resolution", "Image editing with prompts"]
  }, {
    number: "03",
    name: "Professional",
    subtitle: "For growing businesses",
    price: "$99",
    priceLabel: "One time payment",
    saveBadge: "Save 18.5%",
    popular: true,
    features: ["450 credits = 450 images", "1K resolution", "Video generation", "Image editing with prompts"]
  }, {
    number: "04",
    name: "Enterprise",
    subtitle: "For large businesses",
    price: "$450",
    priceLabel: "One time payment",
    saveBadge: "Save 27.5%",
    popular: false,
    features: ["2300 credits = 2300 images", "2K resolution", "Video generation", "Image editing with prompts"]
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
              <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Resources</a>
            </nav>

            <div className="flex items-center gap-4">
              {isLoaded && user ? <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/my-images")} className="hidden md:flex">
                    My Images
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/generator")} className="hidden md:flex">
                    Generator
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
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
                </> : isLoaded ? <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </> : null}
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Bar - currently hidden */}

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
            <div className="flex justify-center items-center gap-4 md:gap-6 max-w-6xl mx-auto">
              {/* Photo 1 */}
              <div className="relative rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-10" style={{
              transform: 'rotate(-5deg)'
            }}>
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img src={heroPhoto1} alt="Fashion photo 1" className="w-full h-full object-cover" fetchPriority="high" />
                </div>
                {/* Thumbnail Slot */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg" style={{
                transform: 'rotate(8deg)'
              }}>
                  <img src={heroThumbnail1} alt="Product thumbnail 1" className="w-full h-full object-cover rounded-sm" />
                </div>
              </div>
              
              {/* Photo 2 */}
              <div className="relative rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-20" style={{
              transform: 'rotate(3deg)'
            }}>
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img src={heroPhoto2} alt="Fashion photo 2" className="w-full h-full object-cover" />
                </div>
                {/* Thumbnail Slot */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg" style={{
                transform: 'rotate(-6deg)'
              }}>
                  <img src={heroThumbnail2} alt="Product thumbnail 2" className="w-full h-full object-cover rounded-sm" />
                </div>
              </div>
              
              {/* Photo 3 */}
              <div className="relative rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-30" style={{
              transform: 'rotate(-4deg)'
            }}>
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img src={heroPhoto3} alt="Fashion photo 3" className="w-full h-full object-cover" />
                </div>
                {/* Thumbnail Slot */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg" style={{
                transform: 'rotate(10deg)'
              }}>
                  <img src={heroThumbnail3} alt="Product thumbnail 3" className="w-full h-full object-cover rounded-sm" />
                </div>
              </div>
              
              {/* Photo 4 */}
              <div className="relative rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-40" style={{
              transform: 'rotate(6deg)'
            }}>
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img src={heroPhoto4} alt="Fashion photo 4" className="w-full h-full object-cover" />
                </div>
                {/* Thumbnail Slot */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-white p-1 md:p-1.5 rounded-sm shadow-lg" style={{
                transform: 'rotate(-5deg)'
              }}>
                  <img src={heroThumbnail4} alt="Product thumbnail 4" className="w-full h-full object-cover rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Product Shot to Campaign-Ready */}
      <section className="py-20 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a1f 0%, #0f1b2e 100%)'
    }}>
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-1 h-1 bg-emerald-500 rounded-full" />
          <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-blue-500 rounded-full" />
          <div className="absolute bottom-40 left-16 w-1 h-1 bg-purple-500 rounded-full" />
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-emerald-400 rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Side: Content */}
              <div className="space-y-8">
                <div>
                  <p className="text-muted-foreground text-sm mb-4">How it works</p>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                    From product shot to campaign-ready in minutes.
                  </h2>
                </div>
                
                <div className="space-y-0">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ring-4 ring-emerald-500/20">
                        1
                      </div>
                      <div className="w-0.5 h-16 bg-gradient-to-b from-emerald-500 to-emerald-500/0 mt-2" />
                    </div>
                    <div className="pb-6">
                      <h3 className="text-emerald-400 font-semibold text-lg mb-1">Upload your product photo</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Shoot on a simple background, then drag & drop your flat lay image to start.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ring-4 ring-blue-500/20">
                        2
                      </div>
                      <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500 to-blue-500/0 mt-2" />
                    </div>
                    <div className="pb-6">
                      <h3 className="text-blue-400 font-semibold text-lg mb-1">Choose model, pose & setting</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Pick body type, skin tone, location and camera style that match your brand guidelines.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ring-4 ring-purple-500/20">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-purple-400 font-semibold text-lg mb-1">Download campaign-ready images</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        AI generates photo-realistic model photos in seconds. Edit, tweak, or batch-export.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" variant="secondary" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
                  Try It Now
                </Button>
              </div>
              
              {/* Right Side: Product Photo Placeholder */}
              <div className="relative mt-8 md:mt-0">
              <div className="w-[300px] md:w-[420px] h-[400px] md:h-[560px] mx-auto rounded-lg overflow-hidden shadow-2xl">
                  <img alt="Product photography example" className="w-full h-full object-cover" src="/lovable-uploads/c505d9bf-13b2-4dfd-af4a-b3db4f22f6e1.png" loading="lazy" />
                </div>
                {/* Floating product thumbnail */}
                <div className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-8 w-[100px] h-[120px] bg-black rounded-lg shadow-xl overflow-hidden" style={{
                transform: 'rotate(8deg)'
              }}>
                  <img alt="Product thumbnail" className="w-full h-full object-cover" src="/lovable-uploads/2666c21d-84ba-4e59-a500-d7d2309e4406.jpg" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center">
            See How Fashion Styles Look
          </h2>
        </div>
        
        {/* Top Row - Scrolls Left */}
        <div className="relative mb-6">
          <div className="flex gap-6 animate-scroll-left">
            {/* First set of images */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel2} alt="Fashion style 2" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel3} alt="Fashion style 3" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel4} alt="Fashion style 4" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel5} alt="Fashion style 5" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel6} alt="Fashion style 6" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel7} alt="Fashion style 7" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel2} alt="Fashion style 2" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel3} alt="Fashion style 3" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel4} alt="Fashion style 4" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel5} alt="Fashion style 5" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel6} alt="Fashion style 6" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel7} alt="Fashion style 7" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Row - Scrolls Right */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-right">
            {/* First set of images */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel8} alt="Fashion style 8" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel9} alt="Fashion style 9" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel10} alt="Fashion style 10" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel11} alt="Fashion style 11" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel12} alt="Fashion style 12" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel13} alt="Fashion style 13" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel8} alt="Fashion style 8" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel9} alt="Fashion style 9" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel10} alt="Fashion style 10" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel11} alt="Fashion style 11" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel12} alt="Fashion style 12" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel13} alt="Fashion style 13" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="w-[300px] h-[420px] rounded-xl overflow-hidden">
                <img src={carousel1} alt="Fashion style 1" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Mockup Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Side: Instagram Stories-style Mockup */}
              <div className="relative">
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden max-w-[380px] mx-auto shadow-2xl border border-gray-800">
                  {/* App Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-semibold">Provamoda</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>9:41</span>
                      <div className="w-6 h-3 border border-white rounded-sm relative">
                        <div className="absolute inset-0.5 bg-white rounded-sm" style={{
                        width: '70%'
                      }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Stories Row */}
                  <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        PM
                      </div>
                      <span className="text-gray-400 text-xs">You</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                        <img src={heroThumbnail1} alt="Luma" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="text-gray-400 text-xs">Luma</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                        <img src={heroThumbnail2} alt="Radius" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="text-gray-400 text-xs">Radius</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden">
                        <img src={heroThumbnail3} alt="Halo" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="text-gray-400 text-xs">Halo</span>
                    </div>
                  </div>
                  
                  {/* Post Header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Provamoda Studio</p>
                        <p className="text-gray-500 text-xs">Sponsored • Fashion</p>
                      </div>
                    </div>
                    <span className="text-gray-500">•••</span>
                  </div>
                  
                  {/* Video Content */}
                  <div className="aspect-[4/5] bg-black overflow-hidden">
                    <video src="/videos/social-mockup.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  </div>
                  
                  {/* CTA Button */}
                  <div className="px-4 py-3">
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2">
                      Launch your visual campaign
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between px-4 pb-4 text-gray-400 text-sm">
                    <span>312 likes • 8 comments</span>
                    <span className="text-gray-500">View insights</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Content */}
              <div className="space-y-8">
                <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Motion from Stills</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
                  Turn Provamoda photos into scrolling-stopping fashion videos.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Feed any Provamoda still into our motion engine, describe the mood in a sentence, and generate vertical-ready videos that feel like full productions – without reshoots.
                </p>
                
                <div className="space-y-6 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Pick your hero still</h4>
                      <p className="text-muted-foreground text-sm">Start from any Provamoda shot you love – a lookbook pose, e-commerce angle, or campaign hero image.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Type a motion prompt</h4>
                      <p className="text-muted-foreground text-sm">Describe the movement you want – e.g. "slow pan down, soft camera shake, studio lights pulsing to the beat".</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 text-cyan-400 font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Export ready-to-post clips</h4>
                      <p className="text-muted-foreground text-sm">Download vertical videos in the right aspect ratios for Reels, TikTok, and Stories – no extra editing needed.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800" onClick={() => navigate(user ? "/video-generation" : "/signup")}>
                    Generate a sample video
                  </Button>
                  <span className="text-muted-foreground text-sm">Built for AI models, optimized for social feeds.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section with Video Comparison Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              See What You Can Create
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click to see the before & after transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <VideoComparisonCard imageSrc={heroPhoto1} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 1" />
            <VideoComparisonCard imageSrc={heroPhoto2} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 2" />
            <VideoComparisonCard imageSrc={heroPhoto3} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 3" />
            <VideoComparisonCard imageSrc={heroPhoto4} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 4" />
            <VideoComparisonCard imageSrc={heroThumbnail1} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 5" />
            <VideoComparisonCard imageSrc={heroThumbnail2} videoSrc="/videos/social-mockup.mp4" templateName="Fashion Style 6" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transform your product photos in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">1. Upload</h3>
              <p className="text-muted-foreground">
                Upload your product photo with a clean background
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">2. Generate</h3>
              <p className="text-muted-foreground">
                AI creates professional fashion photography
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold">3. Download</h3>
              <p className="text-muted-foreground">
                Get high-resolution images ready for your store
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              One-time payments. No subscriptions. Refill as needed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
            {pricingPlans.map(plan => <Card key={plan.name} className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 flex flex-col h-full ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-gray-500 text-sm font-mono">{plan.number}</span>
                    <span className="text-gray-500 text-sm">•••</span>
                  </div>
                  
                  {plan.saveBadge && <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded mb-2 w-fit">
                      {plan.saveBadge}
                    </span>}
                  
                  {plan.popular && <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded mb-2 w-fit">
                      Popular
                    </span>}
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.subtitle}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow space-y-6">
                  <div>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-2">{plan.priceLabel}</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>)}
                  </ul>
                  
                  <div className="mt-auto pt-4">
                    <Button className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`} variant={plan.popular ? 'default' : 'outline'} onClick={() => navigate("/signup")}>
                      Get started
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-heading font-semibold">AI Fashion Studio</span>
            </div>
            
            <p className="text-muted-foreground text-sm">
              © 2024 AI Fashion Studio. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;