import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProcessSectionProps {
  isLoggedIn: boolean;
}

export const ProcessSection = ({ isLoggedIn }: ProcessSectionProps) => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      color: "emerald",
      title: "Upload your product photo",
      description: "Shoot on a simple background, then drag & drop your flat lay image to start.",
    },
    {
      number: 2,
      color: "blue",
      title: "Choose model, pose & setting",
      description: "Pick body type, skin tone, location and camera style that match your brand guidelines.",
    },
    {
      number: 3,
      color: "purple",
      title: "Download campaign-ready images",
      description: "AI generates photo-realistic model photos in seconds. Edit, tweak, or batch-export.",
    },
  ];

  const getColorClasses = (color: string) => ({
    bg: color === "emerald" ? "bg-emerald-500" : color === "blue" ? "bg-blue-500" : "bg-purple-500",
    ring: color === "emerald" ? "ring-emerald-500/20" : color === "blue" ? "ring-blue-500/20" : "ring-purple-500/20",
    text: color === "emerald" ? "text-emerald-400" : color === "blue" ? "text-blue-400" : "text-purple-400",
    gradient: color === "emerald" ? "from-emerald-500 to-emerald-500/0" : color === "blue" ? "from-blue-500 to-blue-500/0" : "from-purple-500 to-purple-500/0",
  });

  return (
    <section className="py-24 md:py-28 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a1f 0%, #0f1b2e 100%)'
    }}>
      {/* Animated decorative dots */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-float" />
        <div className="absolute top-40 left-20 w-2 h-2 bg-blue-500/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-32 right-1/3 w-1 h-1 bg-emerald-400/40 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-400/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side: Content */}
            <div className="space-y-8">
              <div>
                <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider mb-4">How it works</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                  From product shot to campaign-ready in minutes.
                </h2>
              </div>
              
              <div className="space-y-0">
                {steps.map((step, index) => {
                  const colors = getColorClasses(step.color);
                  const isLast = index === steps.length - 1;
                  
                  return (
                    <div 
                      key={step.number} 
                      className="flex gap-4 group"
                    >
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ring-4 ${colors.ring} transition-all duration-300 group-hover:scale-110 group-hover:ring-8`}
                        >
                          {step.number}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-16 bg-gradient-to-b ${colors.gradient} mt-2`} />
                        )}
                      </div>
                      <div className={isLast ? "" : "pb-6"}>
                        <h3 className={`${colors.text} font-semibold text-lg mb-1 transition-all duration-300 group-hover:translate-x-1`}>
                          {step.title}
                        </h3>
                        <p className="text-foreground/60 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                size="lg" 
                variant="secondary" 
                className="group transition-all duration-300 hover:scale-105 hover:bg-secondary/80"
                onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
              >
                Try It Now
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            
            {/* Right Side: Product Photo with enhanced hover */}
            <div className="relative mt-8 md:mt-0 group">
              <div className="w-[300px] md:w-[420px] h-[400px] md:h-[560px] mx-auto rounded-lg overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group-hover:scale-[1.02]">
                <img 
                  alt="Product photography example" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="/lovable-uploads/c505d9bf-13b2-4dfd-af4a-b3db4f22f6e1.png" 
                  loading="lazy" 
                />
              </div>
              {/* Floating product thumbnail with animation */}
              <div 
                className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-8 w-[100px] h-[120px] bg-black rounded-lg shadow-xl overflow-hidden transition-all duration-500 hover:scale-110 animate-float"
                style={{
                  transform: 'rotate(8deg)',
                  animationDelay: "0.5s",
                }}
              >
                <img 
                  alt="Product thumbnail" 
                  className="w-full h-full object-cover" 
                  src="/lovable-uploads/2666c21d-84ba-4e59-a500-d7d2309e4406.jpg" 
                  loading="lazy" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};