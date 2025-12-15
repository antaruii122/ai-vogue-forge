import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProcessSectionProps {
  isLoggedIn: boolean;
}

export const ProcessSection = ({ isLoggedIn }: ProcessSectionProps) => {
  const navigate = useNavigate();

  return (
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
              
              <Button size="lg" variant="secondary" onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}>
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
  );
};
