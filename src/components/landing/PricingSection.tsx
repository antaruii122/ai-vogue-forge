import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Flame, Zap, Users } from "lucide-react";

interface PricingPlan {
  number: string;
  name: string;
  tierId: string;
  subtitle: string;
  price: string;
  priceLabel: string;
  credits: number;
  pricePerCredit: string;
  saveBadge: string;
  popular: boolean;
  bestValue: boolean;
  features: string[];
  creditInfo: string;
}

interface PricingSectionProps {
  onOpenPayPal: () => void;
}

const pricingPlans: PricingPlan[] = [
  {
    number: "01",
    name: "Trial",
    tierId: "trial",
    subtitle: "Try risk-free",
    price: "$9",
    priceLabel: "One time payment",
    credits: 20,
    pricePerCredit: "$0.45/credit",
    saveBadge: "Save 61%",
    popular: false,
    bestValue: false,
    features: ["20 credits", "20 AI photos OR", "2 AI videos OR", "Mix of both (your choice)", "1K resolution"],
    creditInfo: "1 credit = 1 photo • 10 credits = 1 video"
  },
  {
    number: "02",
    name: "Basic",
    tierId: "basic",
    subtitle: "Best for beginners",
    price: "$35",
    priceLabel: "One time payment",
    credits: 200,
    pricePerCredit: "$0.175/credit",
    saveBadge: "Save 61%",
    popular: false,
    bestValue: false,
    features: ["200 credits", "200 AI photos OR", "20 AI videos OR", "Mix of both (your choice)", "1K resolution", "Image editing"],
    creditInfo: "1 credit = 1 photo • 10 credits = 1 video"
  },
  {
    number: "03",
    name: "Professional",
    tierId: "professional",
    subtitle: "Most popular choice",
    price: "$99",
    priceLabel: "One time payment",
    credits: 600,
    pricePerCredit: "$0.165/credit",
    saveBadge: "Save 63%",
    popular: true,
    bestValue: true,
    features: ["600 credits", "600 AI photos OR", "60 AI videos OR", "Mix of both (your choice)", "1K resolution", "Video generation", "Priority support"],
    creditInfo: "1 credit = 1 photo • 10 credits = 1 video"
  },
  {
    number: "04",
    name: "Enterprise",
    tierId: "enterprise",
    subtitle: "For power users",
    price: "$450",
    priceLabel: "One time payment",
    credits: 3000,
    pricePerCredit: "$0.15/credit",
    saveBadge: "Save 67%",
    popular: false,
    bestValue: false,
    features: ["3,000 credits", "3,000 AI photos OR", "300 AI videos OR", "Mix of both (your choice)", "2K resolution", "Video generation", "Priority support"],
    creditInfo: "1 credit = 1 photo • 10 credits = 1 video"
  }
];

export const PricingSection = ({ onOpenPayPal }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pay only for what you use. 1 credit = 1 photo • 10 credits = 1 video
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
          {pricingPlans.map(plan => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-[1.02] ${
                plan.bestValue 
                  ? 'bg-gradient-to-br from-purple-900/80 to-pink-900/60 border-2 border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
              }`}
            >
              {/* Best Value Badge */}
              {plan.bestValue && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Flame className="w-3 h-3" /> BEST VALUE
                  </span>
                </div>
              )}
              
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-gray-500 text-sm font-mono">{plan.number}</span>
                  <span className="text-gray-500 text-sm">•••</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {plan.saveBadge && (
                    <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">
                      {plan.saveBadge}
                    </span>
                  )}
                  
                  {plan.popular && !plan.bestValue && (
                    <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                      Popular
                    </span>
                  )}
                </div>
                
                <CardTitle className="text-xl flex items-center gap-2">
                  {plan.name}
                  {plan.name === "Basic" && <Star className="w-4 h-4 text-yellow-400" />}
                </CardTitle>
                <CardDescription className="text-gray-400">{plan.subtitle}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col flex-1 pt-0">
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-2">{plan.priceLabel}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{plan.credits} credits</span>
                </div>
                
                <div className="text-primary text-sm font-medium mb-4">
                  {plan.pricePerCredit}
                </div>
                
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-3">
                  {plan.creditInfo}
                </div>
                
                <Button 
                  className={`w-full mt-4 ${
                    plan.bestValue 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0' 
                      : plan.popular 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : ''
                  }`} 
                  variant={plan.popular || plan.bestValue ? 'default' : 'outline'} 
                  onClick={onOpenPayPal}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <p className="text-sm">
              Join <span className="text-foreground font-semibold">10,000+</span> creators using our AI fashion photography
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
