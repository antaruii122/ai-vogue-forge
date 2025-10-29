import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const AIFashionPhotography = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-heading font-bold">AI Fashion Studio</span>
            </button>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Log In</Button>
              <Button size="sm">Try Now</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-heading font-bold">
              <span className="bg-gradient-to-r from-primary to-primary-purple bg-clip-text text-transparent">
                AI Fashion Photoshoots
              </span>
              {" "}for Ecommerce Brands
            </h1>
            
            <p className="text-lg text-foreground max-w-3xl mx-auto">
              Visualize your designs on diverse and realistic AI models, with every detail of your clothing item (intricate patterns and logos) perfectly captured.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/#pricing")}>
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Photo Carousel */}
      <section className="py-12 overflow-hidden bg-background-lighter">
        <div className="relative">
          <div className="flex gap-6 animate-scroll-left whitespace-nowrap">
            {/* First set of images */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`set1-${i}`}
                className="inline-block w-72 h-96 bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border flex-shrink-0"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">Model {i}</span>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`set2-${i}`}
                className="inline-block w-72 h-96 bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border flex-shrink-0"
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">Model {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              How <span className="bg-gradient-to-r from-primary to-primary-purple bg-clip-text text-transparent">AI Fashion Photos</span> Work:
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Personalize the shopping experience for all your customer demographics by allowing them to see your clothing in relevant lifestyle settings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-bold italic">1.</span>
                  <h3 className="text-2xl font-heading font-bold italic">Upload photo</h3>
                </div>
                <p className="text-muted-foreground">
                  ImagineCreate just needs <span className="font-bold text-foreground">ONE</span> apparel photo to start!
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-bold italic">2.</span>
                  <h3 className="text-2xl font-heading font-bold italic">Describe Image</h3>
                </div>
                <p className="text-muted-foreground">
                  Describe the model and setting <span className="font-bold text-foreground">OR</span> pick one of our templates.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-bold italic">3.</span>
                  <h3 className="text-2xl font-heading font-bold italic">Instant Results</h3>
                </div>
                <p className="text-muted-foreground">
                  Get stunning AI photos in &lt;1 minute. No licensing fees, they're <span className="font-bold text-foreground">100% yours.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sharper Quality Section */}
      <section className="py-20 bg-background-lighter">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                Sharper Video Quality
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                <span className="bg-gradient-to-r from-primary to-primary-purple bg-clip-text text-transparent font-bold">Any</span> Clothing on <span className="bg-gradient-to-r from-primary to-primary-purple bg-clip-text text-transparent font-bold">Any</span> AI Fashion Model
              </p>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Whether you sell dresses, shirts, or pants, ImagineCreate's Virtual Try-On generates professional fashion photos with AI models wearing your exact designs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column with staggered images */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Fashion Photo 1</span>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Fashion Photo 2</span>
                  </div>
                </div>
              </div>

              {/* Right column with staggered images */}
              <div className="space-y-4 md:mt-12">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-purple/10 rounded-lg border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Fashion Photo 3</span>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-primary-purple/10 to-primary/10 rounded-lg border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Fashion Photo 4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Ready to transform your product photography?
            </h2>
            <Button size="lg" className="text-lg">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIFashionPhotography;
