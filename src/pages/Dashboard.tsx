import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  const featureCards = [
    {
      title: "Fashion Photography",
      description: "Create AI photoshoots from one clothing item. Applies to dresses, pants, and more.",
      image: "bg-gradient-to-br from-primary/20 to-primary-purple/20",
      route: "/tools/fashion-photography",
    },
    {
      title: "Video Generation",
      description: "Create instant video clips with AI. Bring any generated image to life by animating it into dynamic, thumb-stopping video clips.",
      image: "bg-gradient-to-br from-primary-purple/20 to-accent/20",
      route: "/tools/video-generation",
    },
    {
      title: "Product Photography",
      description: "Create customizable AI scenes. Combine text prompts with drag-and-drop props to create beautiful, realistic product photos.",
      image: "bg-gradient-to-br from-accent/20 to-primary/20",
      route: "/tools/product-photography",
    },
  ];

  return (
    <AppLayout>
      {/* Dashboard Header Section */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-[36px] font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-lg md:text-[18px] text-muted-foreground">
          Create an AI-generated photoshoot and video for your product
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.route)}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50 text-left w-full"
              aria-label={`Navigate to ${card.title} tool`}
            >
              {/* Image Section */}
              <div 
                className={`w-full h-[220px] ${card.image} bg-cover bg-center flex items-center justify-center transition-all duration-300 group-hover:brightness-105`}
              >
                <div className="text-muted-foreground opacity-50">
                  {card.title === "Video Generation" && (
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  {card.title === "Fashion Photography" && (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
                      <path d="M21 15l-5-5L5 21" strokeWidth="2" />
                    </svg>
                  )}
                  {card.title === "Product Photography" && (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Text Section */}
              <div className="p-5 min-h-[120px] flex flex-col justify-between relative">
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-foreground">{card.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-[1.5]">
                    {card.description}
                  </p>
                </div>
                
                {/* Arrow Icon */}
                <div className="flex justify-end mt-3">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
