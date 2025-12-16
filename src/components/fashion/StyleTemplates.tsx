import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, MapPin, Sparkles, Sun, Crown, Square, Layers, ZoomIn, Shirt } from "lucide-react";
import luxuryPremiumExample from "@/assets/luxury-premium-example.jpeg";
import studioCleanExample from "@/assets/studio-clean-example.jpeg";
import outdoorNaturalExample from "@/assets/outdoor-natural-example.jpeg";

const lifestyleTemplates = [
  { id: 1, name: "Urban Lifestyle", gradient: "from-blue-500 to-purple-500", icon: MapPin },
  { id: 2, name: "Studio Clean", gradient: "from-gray-400 to-gray-600", icon: Sparkles },
  { id: 3, name: "Outdoor Natural", gradient: "from-green-500 to-teal-500", icon: Sun },
  { id: 4, name: "Luxury Premium", gradient: "from-amber-500 to-orange-500", icon: Crown },
];

const ecommerceTemplates = [
  { id: 101, name: "White Background", gradient: "from-gray-100 to-white", icon: Square },
  { id: 102, name: "Gray Background", gradient: "from-gray-400 to-gray-500", icon: Square },
  { id: 103, name: "Ghost Mannequin", gradient: "from-cyan-500 to-teal-500", icon: Shirt },
];

interface StyleTemplatesProps {
  selectedTemplate: number | null;
  activeStyleTab: string;
  onStyleSelect: (templateId: number) => void;
  onTabChange: (tab: string) => void;
}

// Style thumbnail mapping
const getStyleThumbnail = (styleId: number) => {
  switch (styleId) {
    case 2: return studioCleanExample;
    case 3: return outdoorNaturalExample;
    case 4: return luxuryPremiumExample;
    default: return luxuryPremiumExample;
  }
};

export const StyleTemplates = ({
  selectedTemplate,
  activeStyleTab,
  onStyleSelect,
  onTabChange,
}: StyleTemplatesProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Choose a Style</h2>
      
      <Tabs value={activeStyleTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
          <TabsTrigger 
            value="lifestyle" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md py-2.5 text-sm font-medium transition-all"
          >
            📸 Lifestyle
          </TabsTrigger>
          <TabsTrigger 
            value="ecommerce" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md py-2.5 text-sm font-medium transition-all"
          >
            🛍️ E-commerce
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lifestyle" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lifestyleTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => onStyleSelect(template.id)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-out border-2 aspect-[9/16]
                    ${isSelected 
                      ? 'border-purple-500 scale-[1.02] shadow-2xl shadow-purple-500/40' 
                      : 'border-gray-700/50 opacity-80 hover:opacity-100 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/50'
                    }`}
                >
                  <img
                    src={getStyleThumbnail(template.id)}
                    alt={template.name}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold text-lg">{template.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ecommerceTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => onStyleSelect(template.id)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-out border-2 aspect-[9/16]
                    ${isSelected 
                      ? 'border-purple-500 scale-[1.02] shadow-2xl shadow-purple-500/40' 
                      : 'border-gray-700/50 opacity-80 hover:opacity-100 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/50'
                    }`}
                >
                  {/* Placeholder gradient background for e-commerce styles */}
                  <div className={`w-full h-full absolute inset-0 bg-gradient-to-br ${template.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold text-lg">{template.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Export templates for use in parent component
export const allTemplates = [...lifestyleTemplates, ...ecommerceTemplates];
