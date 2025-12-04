import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download, Camera, Video, Package, Sparkles, X, Star, Check, User, LogOut } from "lucide-react";
import { uploadVideoToStorage } from "@/utils/uploadVideoToStorage";
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
import { VideoComparisonCard } from "@/components/VideoComparisonCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Index = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [user, setUser] = useState<any>(null);
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
    // Check auth state
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    // Listen for auth state changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged out",
        description: "You've been successfully logged out"
      });
      setUser(null);
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
              {user ? <>
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
                </> : <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </>}
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
            <div className="flex justify-center items-center gap-4 md:gap-6 max-w-6xl mx-auto">
              {/* Photo 1 */}
              <div className="relative rounded-sm shadow-2xl transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-pointer z-10" style={{
              transform: 'rotate(-5deg)'
            }}>
                <div className="w-[180px] md:w-[260px] h-[230px] md:h-[340px] rounded-sm overflow-hidden">
                  <img src={heroPhoto1} alt="Fashion photo 1" className="w-full h-full object-cover" />
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
                      <h3 className="text-purple-400 font-semibold text-lg mb-1">Generate, review & export</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Create entire campaigns in a few clicks, then export ready-to-ship images for your store and ads.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <h3 className="text-foreground font-semibold">Replace weeks of shoots with one upload.</h3>
                  <p className="text-muted-foreground text-sm">
                    No model bookings, no studio fees. Just on-brand, production-ready imagery that scales with your catalog.
                  </p>
                  <Button size="lg" className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
                    See it in action
                  </Button>
                </div>
              </div>
              
              {/* Right Side: Product Photo with Floating Thumbnail */}
              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  {/* Main Photo */}
                  <div className="w-[320px] h-[420px] bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg overflow-hidden shadow-2xl">
                    <img alt="Fashion model" className="w-full h-full object-cover" src="/lovable-uploads/04190a85-64ac-4f4c-b621-55747c404a91.png" />
                  </div>
                  
                  {/* Floating Product Thumbnail */}
                  <div className="absolute -top-4 -right-4 w-[100px] h-[120px] bg-black rounded-lg shadow-2xl p-2 transition-transform hover:scale-105" style={{
                  transform: 'rotate(8deg)'
                }}>
                    <img alt="Product thumbnail" className="w-full h-full object-contain rounded" src="/lovable-uploads/213a398e-4463-42ed-833e-1bd09f0cc715.jpg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn Product Photos into Fashion Videos */}
      <section className="py-20" style={{
      background: 'linear-gradient(135deg, #0a0a12 0%, #0d1117 100%)'
    }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Social Media Mockup */}
              <div className="flex justify-center md:justify-start">
                <div className="w-[380px] bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                  {/* Top Header */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">FashionAI</span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <span>9:41</span>
                      <div className="w-6 h-3 bg-gray-600 rounded-sm ml-1" />
                    </div>
                  </div>
                  
                  {/* Stories Row */}
                  <div className="px-4 py-3 flex gap-4 border-b border-gray-800">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-cyan-400 text-xs font-bold">
                          FA
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">You</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 overflow-hidden">
                        <img src={heroPhoto1} alt="Story" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-gray-400 text-xs">Luma</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 overflow-hidden">
                        <img src={heroPhoto3} alt="Story" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-gray-400 text-xs">Radius</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-teal-500 p-0.5 overflow-hidden">
                        <img src={heroPhoto4} alt="Story" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-gray-400 text-xs">Halo</span>
                    </div>
                  </div>
                  
                  {/* Post Header */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        FA
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">FashionAI Studio</p>
                        <p className="text-gray-500 text-xs">Sponsored • Fashion</p>
                      </div>
                    </div>
                    <div className="text-gray-500">•••</div>
                  </div>
                  
                  {/* Main Video */}
                  <div className="aspect-[9/16] bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden relative">
                    <video src="/videos/social-mockup.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    {/* Play indicator overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="px-4 py-3">
                    <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-between px-4 transition-colors">
                      <span>Launch your visual campaign</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Stats */}
                  <div className="px-4 py-3 flex items-center justify-between text-sm border-t border-gray-800">
                    <span className="text-gray-400">312 likes • 8 comments</span>
                    <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">View insights</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Content */}
              <div className="space-y-8">
                <div>
                  <p className="text-gray-500 text-sm tracking-widest uppercase mb-4">Motion from stills</p>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6">
                    Turn Product Photos into Scroll-Stopping Fashion Videos.
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Feed any still into our motion engine, describe the mood in a sentence, and generate vertical-ready videos that feel like full productions – without reshoots.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Pick your hero still</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Start from any shot you love – a lookbook pose, e-commerce angle, or campaign hero image.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Type a motion prompt</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Describe the movement you want – e.g. "slow pan down, soft camera shake, studio lights pulsing to the beat".
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Export ready-to-post clips</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Download vertical videos in the right aspect ratios for Reels, TikTok, and Stories – no extra editing needed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800" onClick={() => navigate(user ? "/video-generation" : "/signup")}>
                    Generate a sample video
                  </Button>
                  <span className="text-gray-500 text-sm">Built for AI models, optimized for social feeds.</span>
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
            {[...Array(3)].map((_, loop) => [carousel1, carousel6, carousel3, carousel8, carousel5, carousel7, carousel2].map((img, i) => <div key={`top-${loop}-${i}`} className="flex-shrink-0 w-[200px] h-[356px] rounded-xl border border-border overflow-hidden">
                <img src={img} alt={`Fashion photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>))}
          </div>
        </div>
        
        {/* Bottom Row - Scroll Right */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-right">
            {/* Duplicate images for seamless loop */}
            {[...Array(3)].map((_, loop) => [carousel9, carousel4, carousel7, carousel2, carousel8, carousel3, carousel6, carousel1].map((img, i) => <div key={`bottom-${loop}-${i}`} className="flex-shrink-0 w-[200px] h-[356px] rounded-xl border border-border overflow-hidden">
                <img src={img} alt={`Fashion photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>))}
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
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800" videoSrc="/videos/BOLD.mp4" templateName="360° Spin" />
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" videoSrc="/videos/BOLD.mp4" templateName="Zoom In" />
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800" videoSrc="/videos/BOLD.mp4" templateName="Model Reveal" />
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800" videoSrc="/videos/BOLD.mp4" templateName="Lifestyle Scene" />
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800" videoSrc="/videos/BOLD.mp4" templateName="Product Focus" />
            <VideoComparisonCard imageSrc="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" videoSrc="/videos/BOLD.mp4" templateName="Dynamic Motion" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-heading font-bold">Pricing</h2>
            <p className="text-2xl text-muted-foreground">Replace $100,000 shoots with one-time credit packs.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {pricingPlans.map((plan, i) => <div key={i} className={`relative rounded-2xl p-6 ${plan.popular ? "bg-gradient-to-br from-[#0c1a2e] to-[#0f2847] border border-cyan-500/30" : "bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-gray-700/50"}`}>
                {/* Top row: Number, dots, Popular badge / Get started */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm font-medium">{plan.number}</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    </div>
                  </div>
                  {plan.popular ? <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Popular
                    </span> : <button className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Get started
                    </button>}
                </div>

                {/* Plan name and subtitle */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-2">{plan.priceLabel}</span>
                  {plan.saveBadge && <span className="ml-3 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-medium">
                      {plan.saveBadge}
                    </span>}
                </div>

                {/* Refill text */}
                <p className="text-gray-500 text-sm mb-6">Refill as needed</p>

                {/* CTA Button */}
                <Button className={`w-full mb-8 ${plan.popular ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"}`}>
                  Get Started
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>

                {/* What's included */}
                <div>
                  <p className={`text-xs font-semibold tracking-wider mb-4 ${plan.popular ? "text-cyan-400" : "text-gray-400"}`}>
                    WHAT'S INCLUDED
                  </p>
                  <div className="space-y-3">
                    {plan.features.map((feature, j) => <div key={j} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-cyan-500/20" : "bg-cyan-500/10"}`}>
                          <Check className="h-3 w-3 text-cyan-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>)}
                  </div>
                </div>
              </div>)}
          </div>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Need custom volume? Contact us for tailored solutions.</p>
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