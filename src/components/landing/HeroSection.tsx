import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroPhoto1 from "@/assets/hero-photo-1.png";
import heroPhoto2 from "@/assets/hero-photo-2.png";
import heroPhoto3 from "@/assets/hero-photo-3.png";
import heroPhoto4 from "@/assets/hero-photo-4.png";
import heroThumbnail1 from "@/assets/hero-thumbnail-1.png";
import heroThumbnail2 from "@/assets/hero-thumbnail-2.png";
import heroThumbnail3 from "@/assets/hero-thumbnail-3.png";
import heroThumbnail4 from "@/assets/hero-thumbnail-4.png";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
              Fashion Photography Made Easy
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Transform your products into stunning professional photography with AI-powered precision and style
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}>
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
  );
};
