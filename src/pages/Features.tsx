import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Users, 
  Palette, 
  Video, 
  Grid3X3, 
  Layers, 
  Zap,
  Twitter,
  Instagram,
  Linkedin,
  Mail
} from "lucide-react";

const Features = () => {
  const features = [
    {
      label: "AI MODELS",
      heading: "Generate Diverse Fashion Models Instantly",
      description: "Create models in any ethnicity, pose, body type, or age. Perfect for inclusive campaigns without expensive photoshoots.",
      bullets: [
        "50+ body types and ethnicities",
        "Custom poses and expressions",
        "Consistent models across campaigns",
        "No model fees or contracts"
      ],
      icon: Users,
      imagePosition: "left"
    },
    {
      label: "BACKGROUNDS",
      heading: "Studio-Quality Environments in One Click",
      description: "Professional backdrops, lighting setups, and locations. From minimal white studios to exotic outdoor scenes.",
      bullets: [
        "200+ professional backgrounds",
        "Auto lighting adjustment",
        "Seasonal & trending themes",
        "Custom brand environments"
      ],
      icon: Palette,
      imagePosition: "right"
    },
    {
      label: "MOTION",
      heading: "Turn Photos into Scroll-Stopping Videos",
      description: "Transform any product photo into engaging vertical videos for Instagram Reels, TikTok, and Stories.",
      bullets: [
        "AI-powered motion effects",
        "Custom camera movements",
        "Optimized for social platforms",
        "Export in seconds"
      ],
      icon: Video,
      imagePosition: "left"
    },
    {
      label: "AUTOMATION",
      heading: "Process Hundreds of Products Simultaneously",
      description: "Upload your entire catalog and let AI create professional photos for every item. Scale your content production effortlessly.",
      bullets: [
        "Bulk upload & processing",
        "Consistent style across catalog",
        "Export to Shopify/WooCommerce",
        "Save hours of manual work"
      ],
      icon: Grid3X3,
      imagePosition: "right"
    },
    {
      label: "CONSISTENCY",
      heading: "Maintain Perfect Brand Identity",
      description: "Create and save style presets that match your brand guidelines. Apply them across all campaigns with one click.",
      bullets: [
        "Custom style templates",
        "Brand color matching",
        "Team collaboration tools",
        "Version control"
      ],
      icon: Layers,
      imagePosition: "left"
    },
    {
      label: "QUALITY",
      heading: "Export in Ultra-High Resolution",
      description: "Professional-grade outputs for print, billboards, and premium campaigns. From web-ready to print-perfect.",
      bullets: [
        "Up to 4K resolution",
        "Multiple export formats",
        "Color space options (RGB/CMYK)",
        "Lossless quality"
      ],
      icon: Zap,
      imagePosition: "right"
    }
  ];

  const stats = [
    { value: "10M+", label: "Images Generated" },
    { value: "50K+", label: "Brands Trust Us" },
    { value: "99.9%", label: "Uptime" }
  ];

  const footerLinks = {
    Product: ["Features", "Pricing", "API", "Integrations"],
    Resources: ["Documentation", "Tutorials", "Blog", "Support"],
    Company: ["About Us", "Careers", "Press", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">AI Fashion Studio</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-primary font-medium">Features</Link>
            <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Resources</span>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-[hsl(185,100%,50%)] to-[hsl(var(--primary))]">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1f] via-background to-[hsl(251,60%,20%)]" />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[hsl(var(--primary-purple))]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-[hsl(var(--primary-purple))]/30 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Powerful Features for Modern Fashion Brands
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Everything you need to create professional product photography and videos at scale
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(185,100%,50%)] to-[hsl(var(--primary))] text-lg px-8">
              Start Creating Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-24 md:space-y-32">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex flex-col ${feature.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-16`}
              >
                {/* Illustration/Icon Side */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-square max-w-md mx-auto">
                    {/* Glassmorphism card with icon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden">
                      {/* Abstract background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[hsl(var(--primary-purple))]/30 blur-2xl" />
                      </div>
                      
                      {/* Main icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
                          <div className="relative bg-gradient-to-br from-primary/20 to-[hsl(var(--primary-purple))]/20 p-8 rounded-3xl border border-border/50">
                            <feature.icon className="w-20 h-20 text-primary" strokeWidth={1.5} />
                          </div>
                          {/* Sparkle accents */}
                          <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-primary/60" />
                          <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-[hsl(var(--primary-purple))]/60" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 w-full">
                  <span className="inline-block text-xs font-semibold tracking-widest text-muted-foreground mb-3">
                    {feature.label}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {feature.heading}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground/90">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-purple))] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a1f] to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Product Photography?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(185,100%,50%)] to-[hsl(var(--primary))] px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/#pricing">
              <Button variant="outline" size="lg" className="px-8">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Newsletter */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">AI Fashion Studio</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Professional AI photography for modern brands.
              </p>
            </div>
            
            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-foreground mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Newsletter */}
          <div className="border-t border-border pt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Subscribe to our newsletter</h4>
                <p className="text-sm text-muted-foreground">Get the latest updates and tips.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button>
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Fashion Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
