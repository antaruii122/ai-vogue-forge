import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Dynamic background options based on selected style
const getBackgroundOptions = (styleId: number | null) => {
  if (styleId === 1) {
    // Urban Lifestyle
    return [
      { value: "auto", label: "Auto (from style)" },
      { value: "rooftop", label: "Rooftop terrace" },
      { value: "city-street", label: "City street" },
      { value: "industrial-loft", label: "Industrial loft" },
      { value: "modern-apartment", label: "Modern apartment" },
      { value: "urban-cafe", label: "Urban café" },
      { value: "custom", label: "Custom" }
    ];
  } else if (styleId === 2) {
    // Studio Clean
    return [
      { value: "auto", label: "Auto (from style)" },
      { value: "white-seamless", label: "White seamless backdrop" },
      { value: "gray-backdrop", label: "Gray backdrop" },
      { value: "colored-paper", label: "Colored paper backdrop" },
      { value: "minimalist-setup", label: "Minimalist setup" },
      { value: "black-backdrop", label: "Black backdrop" },
      { value: "custom", label: "Custom" }
    ];
  } else if (styleId === 3) {
    // Outdoor Natural
    return [
      { value: "auto", label: "Auto (from style)" },
      { value: "beach-coastal", label: "Beach/coastal scene" },
      { value: "forest-woodland", label: "Forest/woodland" },
      { value: "park-garden", label: "Park/garden setting" },
      { value: "mountain-landscape", label: "Mountain landscape" },
      { value: "open-field", label: "Open field" },
      { value: "custom", label: "Custom" }
    ];
  } else if (styleId === 4) {
    // Luxury Premium
    return [
      { value: "auto", label: "Auto (from style)" },
      { value: "marble-showroom", label: "Marble showroom" },
      { value: "velvet-lounge", label: "Velvet lounge" },
      { value: "boutique-interior", label: "Boutique interior" },
      { value: "gold-accents", label: "Gold accents room" },
      { value: "elegant-study", label: "Elegant study" },
      { value: "custom", label: "Custom" }
    ];
  }
  
  // Default options (when no style selected)
  return [
    { value: "auto", label: "Auto (from style)" },
    { value: "custom", label: "Custom" }
  ];
};

interface AdvancedOptionsProps {
  selectedTemplate: number | null;
  isOpen: boolean;
  onToggle: () => void;
  background: string;
  customBackground: string;
  lighting: string;
  customLighting: string;
  cameraAngle: string;
  customCameraAngle: string;
  styleChangeWarning: string | null;
  onBackgroundChange: (value: string) => void;
  onCustomBackgroundChange: (value: string) => void;
  onLightingChange: (value: string) => void;
  onCustomLightingChange: (value: string) => void;
  onCameraAngleChange: (value: string) => void;
  onCustomCameraAngleChange: (value: string) => void;
}

export const AdvancedOptions = ({
  selectedTemplate,
  isOpen,
  onToggle,
  background,
  customBackground,
  lighting,
  customLighting,
  cameraAngle,
  customCameraAngle,
  styleChangeWarning,
  onBackgroundChange,
  onCustomBackgroundChange,
  onLightingChange,
  onCustomLightingChange,
  onCameraAngleChange,
  onCustomCameraAngleChange,
}: AdvancedOptionsProps) => {
  const backgroundOptions = getBackgroundOptions(selectedTemplate);

  return (
    <div className={`transition-opacity duration-300 ${selectedTemplate ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
      {!selectedTemplate && (
        <p className="text-sm text-muted-foreground mb-2">Select a style first</p>
      )}
      
      {/* Style change warning */}
      {styleChangeWarning && (
        <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-white animate-fadeIn">
          {styleChangeWarning}
        </div>
      )}
      
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">Advanced Options</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 animate-fadeIn">
          {/* Background */}
          <div>
            <Label className="text-sm mb-2 block">Background</Label>
            <Select value={background} onValueChange={onBackgroundChange}>
              <SelectTrigger className="bg-gray-900 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {background === "custom" && (
              <Input
                placeholder="Describe your custom background..."
                value={customBackground}
                onChange={(e) => onCustomBackgroundChange(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-700"
              />
            )}
          </div>
          
          {/* Lighting */}
          <div>
            <Label className="text-sm mb-2 block">Lighting</Label>
            <Select value={lighting} onValueChange={onLightingChange}>
              <SelectTrigger className="bg-gray-900 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (from style)</SelectItem>
                <SelectItem value="bright-airy">Bright & Airy</SelectItem>
                <SelectItem value="dramatic-moody">Dramatic & Moody</SelectItem>
                <SelectItem value="natural-daylight">Natural Daylight</SelectItem>
                <SelectItem value="warm-golden">Warm Golden Hour</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {lighting === "custom" && (
              <Input
                placeholder="Describe your custom lighting..."
                value={customLighting}
                onChange={(e) => onCustomLightingChange(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-700"
              />
            )}
          </div>
          
          {/* Camera Angle */}
          <div>
            <Label className="text-sm mb-2 block">Camera Angle</Label>
            <Select value={cameraAngle} onValueChange={onCameraAngleChange}>
              <SelectTrigger className="bg-gray-900 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (from style)</SelectItem>
                <SelectItem value="eye-level">Eye Level</SelectItem>
                <SelectItem value="high-angle">High Angle</SelectItem>
                <SelectItem value="low-angle">Low Angle</SelectItem>
                <SelectItem value="45-angle">45° Angle</SelectItem>
                <SelectItem value="close-up">Close-up Detail</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {cameraAngle === "custom" && (
              <Input
                placeholder="Describe your custom camera angle..."
                value={customCameraAngle}
                onChange={(e) => onCustomCameraAngleChange(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-700"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
