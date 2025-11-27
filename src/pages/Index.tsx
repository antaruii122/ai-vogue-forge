import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download, Camera, Video, Package, Sparkles, X, Star, Check, User, LogOut } from "lucide-react";
import { uploadVideoToStorage } from "@/utils/uploadVideoToStorage";
import tetesImage from "@/assets/tetes.png";
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
          console.error('Failed to upload video:', error);
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
                  Turn Product Photos Into Scroll-Stopping Video Ads
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Choose a style template. Upload your product. Get professional videos in minutes—no AI prompts needed.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg" onClick={() => navigate(user ? "/generator" : "/signup")}>
                  {user ? "Go to Generator" : "Get Started"}
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Available on Shopify App Store</span>
                </div>
              </div>
            </div>

            {/* Staggered Photo Gallery */}
            <div className="relative h-[600px] flex gap-4">
              {/* Left Column - Moves Up */}
              <div className="flex-1 flex flex-col gap-4 animate-scroll-up">
                {/* Slot 1 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.left1 ? (
                    heroVideos.left1.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.left1} className="w-full h-full object-cover" alt="Hero Left 1" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.left1} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 2 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.left2 ? (
                    heroVideos.left2.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.left2} className="w-full h-full object-cover" alt="Hero Left 2" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.left2} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 3 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.left3 ? (
                    heroVideos.left3.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.left3} className="w-full h-full object-cover" alt="Hero Left 3" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.left3} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Moves Down */}
              <div className="flex-1 flex flex-col gap-4 animate-scroll-down pt-12">
                {/* Slot 1 */}
                <div className="aspect-square bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.right1 ? (
                    heroVideos.right1.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.right1} className="w-full h-full object-cover" alt="Hero Right 1" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.right1} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 2 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.right2 ? (
                    heroVideos.right2.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.right2} className="w-full h-full object-cover" alt="Hero Right 2" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.right2} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 3 */}
                <div className="aspect-square bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.right3 ? (
                    heroVideos.right3.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={heroVideos.right3} className="w-full h-full object-cover" alt="Hero Right 3" />
                    ) : (
                      <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src={heroVideos.right3} type="video/mp4" />
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </div>
            </div>
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

      {/* One Tool Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">One Tool. Endless Possibilities.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether it's fashion, products, or lifestyle—create stunning videos for any use case
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fashion */}
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Fashion</CardTitle>
                  <CardDescription>
                    Stunning fashion videos with AI-powered effects and lighting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Professional lighting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Multiple style templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">High-resolution output</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Products */}
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Products</CardTitle>
                  <CardDescription>
                    Professional product videos perfect for e-commerce
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Studio-quality lighting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Background effects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">E-commerce ready</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Lifestyle */}
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Lifestyle</CardTitle>
                  <CardDescription>
                    Engaging lifestyle videos for social media and marketing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Social media optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Multiple video styles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Instant preview</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Categories */}
      <section className="py-20 bg-background-lighter">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-heading font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">AI Photography</span> for Any Fashion, Accessories or Product Brand
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you sell summer dresses, baby clothing, or makeup, AI Fashion Studio can generate professional lifestyle images at scale.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, i) => <Button key={i} variant="pill" size="sm">
                {category}
              </Button>)}
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

      {/* Quality Comparison */}
      <section className="py-20 bg-background-lighter">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Our AI captures details competitors miss.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="aspect-square bg-muted/50 rounded-lg border border-border flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Product Photo</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">Original</p>
              </div>
              <div className="space-y-2">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary-purple/20 rounded-lg border-2 border-primary flex items-center justify-center relative">
                  <span className="text-sm">AI Fashion Studio</span>
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs">
                    ✓ High Quality
                  </div>
                </div>
                <p className="text-center text-sm font-semibold">AI Fashion Studio</p>
              </div>
              <div className="space-y-2">
                <div className="aspect-square bg-muted/50 rounded-lg border border-destructive flex items-center justify-center relative">
                  <span className="text-sm text-muted-foreground">Competitor</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-destructive" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Competitor Result</p>
              </div>
            </div>
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