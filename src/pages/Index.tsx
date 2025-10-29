import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Wand2, Download, Camera, Video, Package, Sparkles, X, Star, Check } from "lucide-react";
import { uploadVideoToStorage } from "@/utils/uploadVideoToStorage";

const Index = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const navigate = useNavigate();
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
    // Load all hero video slots from localStorage
    setHeroVideos({
      left1: localStorage.getItem('video_hero-left-1') || '',
      left2: localStorage.getItem('video_hero-left-2') || '',
      left3: localStorage.getItem('video_hero-left-3') || '',
      right1: localStorage.getItem('video_hero-right-1') || '',
      right2: localStorage.getItem('video_hero-right-2') || '',
      right3: localStorage.getItem('video_hero-right-3') || ''
    });
    
    // Check for video selection from admin panel (legacy)
    const savedHeroVideo = localStorage.getItem('video_hero');
    if (savedHeroVideo) {
      setVideoUrl(savedHeroVideo);
      return;
    }
    
    const initVideo = async () => {
      try {
        const url = await uploadVideoToStorage();
        setVideoUrl(url);
      } catch (error) {
        console.error('Failed to upload video:', error);
      }
    };
    initVideo();
  }, []);
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
              <Button variant="outline" size="sm">Log In</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/videos")}>
                Manage Videos
              </Button>
              <Button size="sm" onClick={() => navigate("/tools/fashion-photography")}>Try Now</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      {showAnnouncement}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(29,209,161,0.1),transparent)]" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
                  AI Photoshoots and Videos for Ecommerce
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Create Stunning Product and Fashion Photography with AI.
                </p>
                <p className="text-base text-muted-foreground">
                  Brand visuals that convert while saving costs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg" onClick={() => navigate("/tools/fashion-photography")}>
                  Try Now
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
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.left1} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 2 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.left2 ? (
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.left2} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 3 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.left3 ? (
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.left3} type="video/mp4" />
                    </video>
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
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.right1} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 2 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.right2 ? (
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.right2} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {/* Slot 3 */}
                <div className="aspect-square bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {heroVideos.right3 ? (
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={heroVideos.right3} type="video/mp4" />
                    </video>
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

      {/* Feature Cards */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {/* AI Fashion Photography */}
            <Card className="overflow-hidden border-2">
              <div className="grid lg:grid-cols-2 gap-8">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl">AI Fashion Photography</CardTitle>
                  <CardDescription className="text-base">
                    Create fashion photos with AI-generated models wearing your products
                  </CardDescription>
                  <ul className="space-y-2">
                    {["Generate hyper-personalized ad creatives for different customer segments", "Showcase apparel on diverse AI models in various settings worldwide", "Seamless automatic background removal from flat-lay", "Turn simple flat-lays into professional on-model lifestyle photography", "Ideal for: dresses, shirts, pants, and more"].map((item, i) => <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>)}
                  </ul>
                  <Button variant="outline" className="w-fit" onClick={() => navigate("/ai-fashion-photography")}>
                    Explore AI Fashion Photography
                  </Button>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center bg-muted/30">
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary-purple/20 rounded-lg border border-border flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* AI Video Generation */}
            <Card className="overflow-hidden border-2">
              <div className="grid lg:grid-cols-2 gap-8">
                <CardContent className="p-6 flex items-center justify-center bg-muted/30 order-2 lg:order-1">
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary-purple/20 rounded-lg border border-border flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardHeader className="space-y-4 order-1 lg:order-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl">AI Video Generation</CardTitle>
                  <CardDescription className="text-base">
                    Create instant video clips with AI from your product images
                  </CardDescription>
                  <ul className="space-y-2">
                    {["Instant video generation from images", "Perfect for ads, social media, and product display pages", "Animated, engaging content in seconds", "Multiple video styles: Zoom, Rotate, Pan, Fade"].map((item, i) => <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>)}
                  </ul>
                  <Button variant="outline" className="w-fit">
                    Explore AI Video Generation
                  </Button>
                </CardHeader>
              </div>
            </Card>

            {/* AI Product Photography */}
            <Card className="overflow-hidden border-2">
              <div className="grid lg:grid-cols-2 gap-8">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl">AI Product Photography</CardTitle>
                  <CardDescription className="text-base">
                    Create customizable AI scenes for stunning product photos
                  </CardDescription>
                  <ul className="space-y-2">
                    {["Generate product shots with contextually relevant scenes", "Personalized for each customer segment", "Seamless automatic background removal", "Creatively edit by adding props and adjusting layers", "Ideal for: beauty, wellness, electronics, and more"].map((item, i) => <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>)}
                  </ul>
                  <Button variant="outline" className="w-fit">
                    Explore AI Product Photography
                  </Button>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center bg-muted/30">
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary-purple/20 rounded-lg border border-border flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
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