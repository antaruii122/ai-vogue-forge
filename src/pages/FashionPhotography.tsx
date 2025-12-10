import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud, MapPin, Sparkles, Sun, Crown, Check, Loader2, Download, Save, Plus, CheckCircle, Expand, Share2, ChevronDown, ChevronUp, Settings, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadImageToStorage } from "@/utils/uploadToStorage";
import { useUser, useAuth } from "@clerk/clerk-react";
import luxuryPremiumExample from "@/assets/luxury-premium-example.jpeg";
import studioCleanExample from "@/assets/studio-clean-example.jpeg";
import outdoorNaturalExample from "@/assets/outdoor-natural-example.jpeg";
import aiModel1 from "@/assets/ai-model-1.png";
import aiModel2 from "@/assets/ai-model-2.png";
import aiModel3 from "@/assets/ai-model-3.png";
import aiModel4 from "@/assets/ai-model-4.png";
import aiModel5 from "@/assets/ai-model-5.png";
import aiModel6 from "@/assets/ai-model-6.png";
import aiModel7 from "@/assets/ai-model-7.png";
import aiModel8 from "@/assets/ai-model-8.png";
import aiModel9 from "@/assets/ai-model-9.png";
import aiModel10 from "@/assets/ai-model-10.png";

// AI Models with real images
const aiModels = [
  { id: 1, name: "Model 1", image: aiModel1 },
  { id: 2, name: "Model 2", image: aiModel2 },
  { id: 3, name: "Model 3", image: aiModel3 },
  { id: 4, name: "Model 4", image: aiModel4 },
  { id: 5, name: "Model 5", image: aiModel5 },
  { id: 6, name: "Model 6", image: aiModel6 },
  { id: 7, name: "Model 7", image: aiModel7 },
  { id: 8, name: "Model 8", image: aiModel8 },
  { id: 9, name: "Model 9", image: aiModel9 },
  { id: 10, name: "Model 10", image: aiModel10 },
];

const templates = [
  { id: 1, name: "Urban Lifestyle", gradient: "from-blue-500 to-purple-500", icon: MapPin },
  { id: 2, name: "Studio Clean", gradient: "from-gray-400 to-gray-600", icon: Sparkles },
  { id: 3, name: "Outdoor Natural", gradient: "from-green-500 to-teal-500", icon: Sun },
  { id: 4, name: "Luxury Premium", gradient: "from-amber-500 to-orange-500", icon: Crown },
];

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

const FashionPhotography = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPhotos, setGeneratedPhotos] = useState<string[] | null>(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("9:16");
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [background, setBackground] = useState<string>("auto");
  const [customBackground, setCustomBackground] = useState<string>("");
  const [lighting, setLighting] = useState<string>("auto");
  const [customLighting, setCustomLighting] = useState<string>("");
  const [cameraAngle, setCameraAngle] = useState<string>("auto");
  const [customCameraAngle, setCustomCameraAngle] = useState<string>("");
  const [styleChangeWarning, setStyleChangeWarning] = useState<string | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Edge function URL for webhook proxy
  const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fashion-webhook`;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, PNG, or WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!user?.id) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload images",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your photo",
      });
      
      // Get Clerk token for authenticated upload via edge function
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }
      
      // Upload via edge function
      const publicUrl = await uploadImageToStorage(file, user.id, 'uploads', clerkToken);
      
      setSelectedFile(file);
      setUploadedImageUrl(publicUrl);
      
      // Create preview URL for display
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      toast({
        title: "Upload successful!",
        description: "Your image has been uploaded to storage",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleChangePhoto = () => {
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setPreviewUrl(null);
    setSelectedTemplate(null);
    setGeneratedPhotos(null);
    setSelectedAiModel(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectAiModel = (modelId: number) => {
    setSelectedAiModel(modelId);
    setIsModelModalOpen(false);
    toast({
      title: "AI Model selected",
      description: `Model ${modelId} has been selected for your photo generation.`,
    });
  };

  const getSelectedModelInfo = () => {
    return aiModels.find(m => m.id === selectedAiModel);
  };

  const handleGenerate = async () => {
    if (!uploadedImageUrl || !selectedTemplate) {
      toast({
        title: "Missing information",
        description: "Please upload an image and select a style",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get Clerk token for authenticated webhook call
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      // Send POST request to webhook via edge function
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({
          image_url: uploadedImageUrl,
          style: getTemplateName(),
          styleId: selectedTemplate,
          aspectRatio,
          background: background === "custom" ? customBackground : background,
          lighting: lighting === "custom" ? customLighting : lighting,
          cameraAngle: cameraAngle === "custom" ? customCameraAngle : cameraAngle,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      toast({
        title: "Request sent!",
        description: "Your request has been sent for processing",
      });

      // Simulate generation time for demo purposes
      setTimeout(() => {
        // Mock generated images (in production, these would come from your webhook/AI service)
        const mockImages = [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
        ];
        
        setGeneratedPhotos(mockImages);
        setIsGenerating(false);
        
        toast({
          title: "Photos generated!",
          description: "Your 4 fashion photos are ready.",
        });
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to send generation request",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAnother = () => {
    setGeneratedPhotos(null);
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setPreviewUrl(null);
    setSelectedTemplate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your photos are being downloaded as ZIP.",
    });
  };

  const handleDownloadSingle = (index: number) => {
    toast({
      title: "Download started",
      description: `Downloading photo ${index + 1}.`,
    });
  };

  const handleShare = (index: number) => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Photo link copied to clipboard.",
    });
  };

  const getTemplateName = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return template?.name || "Unknown";
  };

  // Show results view if photos are generated
  if (generatedPhotos) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
          
          <div className="relative z-10 p-6">
            <div className="max-w-6xl mx-auto mt-12 px-6">
              {/* Success Header */}
              <div className="text-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Your Photos Are Ready!
                </h1>
                <p className="text-muted-foreground text-sm">
                  4 high-quality images generated
                </p>
              </div>

              {/* Photo Grid - 2x2 layout, more compact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8 max-w-[800px] mx-auto">
                {generatedPhotos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="relative group aspect-square max-w-[350px] mx-auto"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <img
                      src={photo}
                      alt={`Generated photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl border border-gray-700 shadow-2xl shadow-purple-500/20 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-purple-500/40"
                    />
                    
                    {/* Hover overlay with actions */}
                    {hoveredImageIndex === index && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center gap-3 transition-all duration-300">
                        <button
                          onClick={() => handleDownloadSingle(index)}
                          className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          title="Download this image"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => toast({ title: "Full size view", description: "Coming soon!" })}
                          className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          title="View full size"
                        >
                          <Expand className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleShare(index)}
                          className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          title="Share this image"
                        >
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons - more compact */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-[600px] mx-auto">
                <Button
                  onClick={handleDownload}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All (ZIP)
                </Button>
                
                <Button
                  variant="outline"
                  className="px-5 py-2.5 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save to Portfolio
                </Button>
              </div>

              <div className="flex justify-center mt-4 mb-6">
                <button
                  onClick={handleGenerateAnother}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Generate More Photos
                </button>
              </div>

              {/* Photo Info Card - more compact */}
              <div className="max-w-[600px] mx-auto backdrop-blur-xl bg-white/5 rounded-lg py-4 px-5 border border-white/10 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Style</p>
                    <p className="text-foreground text-base font-medium">{getTemplateName()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Images</p>
                    <p className="text-foreground text-base font-medium">4 photos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Resolution</p>
                    <p className="text-foreground text-base font-medium">2048x2048</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Cost</p>
                    <p className="text-foreground text-base font-medium">1 credit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show loading view while generating
  if (isGenerating) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Generating your fashion photos...
            </h2>
            <p className="text-muted-foreground mb-8">
              This usually takes about 30 seconds
            </p>
            <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
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

  // Handle style selection with warning
  const handleStyleSelect = (templateId: number) => {
    const previousTemplate = selectedTemplate;
    setSelectedTemplate(templateId);
    
    // Show warning if background was set and style changed
    if (previousTemplate !== null && previousTemplate !== templateId) {
      if (background === "custom") {
        setStyleChangeWarning("Style changed - Custom background preserved");
      } else if (background !== "auto") {
        setBackground("auto");
        setStyleChangeWarning("Style changed - Background reset to Auto");
      }
      
      // Auto-dismiss warning after 3 seconds
      if (styleChangeWarning === null) {
        setTimeout(() => setStyleChangeWarning(null), 3000);
      }
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 mt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                AI Fashion Photography
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Transform your product photos into stunning fashion imagery with AI
              </p>
            </div>

            {/* Main content - 2 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
              {/* Left Column - Upload & AI Model */}
              <div className="space-y-6">
                {!previewUrl ? (
                  <div
                    className={`relative h-[250px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer backdrop-blur-sm
                      ${isDragging 
                        ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/30' 
                        : 'border-gray-500 bg-gray-900/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(31,41,55,0.8) 100%)'
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-xl text-foreground font-medium mb-1 text-center">
                        Drag & drop your product photo or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports: JPG, PNG, WebP • Max 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="max-w-[300px] mx-auto">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full rounded-lg shadow-lg border border-gray-700"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="text-center">
                      <button
                        onClick={handleChangePhoto}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Model Button */}
                <Button
                  onClick={() => setIsModelModalOpen(true)}
                  variant="outline"
                  className="w-full py-4 border-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 text-purple-300 hover:text-purple-200 transition-all duration-300"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Don't have a model? Choose from our AI Models
                </Button>

                {/* Selected AI Model Display */}
                {selectedAiModel && (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-4">
                      <img
                        src={getSelectedModelInfo()?.image}
                        alt={getSelectedModelInfo()?.name}
                        className="w-16 h-24 object-cover rounded-lg border border-purple-500/50"
                      />
                      <div className="flex-1">
                        <p className="text-foreground font-medium">
                          {getSelectedModelInfo()?.name} selected
                        </p>
                        <button
                          onClick={() => setIsModelModalOpen(true)}
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-1"
                        >
                          Change model
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Model Selection Modal */}
              <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <Users className="h-6 w-6 text-purple-400" />
                      Choose Your AI Model
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {aiModels.map((model) => (
                      <div
                        key={model.id}
                        className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 aspect-[9/16]
                          ${selectedAiModel === model.id 
                            ? 'border-purple-500 scale-[1.02] shadow-xl shadow-purple-500/40' 
                            : 'border-gray-700 hover:border-purple-400/50 hover:scale-[1.01]'
                          }`}
                        onClick={() => handleSelectAiModel(model.id)}
                      >
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-medium text-center">{model.name}</p>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAiModel(model.id);
                            }}
                          >
                            Select This Model
                          </Button>
                        </div>
                        {selectedAiModel === model.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Right Column - Templates & Options */}
              <div className="space-y-8">
                {/* Style Templates */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Choose a Style</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {templates.map((template) => {
                      const Icon = template.icon;
                      const isSelected = selectedTemplate === template.id;
                      
                      return (
                        <div
                          key={template.id}
                          onClick={() => handleStyleSelect(template.id)}
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
                </div>

                {/* Output Format */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Output Format</h2>
                  <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="9:16" id="r1" />
                      <Label htmlFor="r1" className="cursor-pointer">
                        <div>
                          <span className="font-medium">9:16 - Stories/Reels</span>
                          <p className="text-xs text-muted-foreground">Instagram • TikTok • YouTube Shorts</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3:4" id="r2" />
                      <Label htmlFor="r2" className="cursor-pointer">
                        <div>
                          <span className="font-medium">3:4 - Feed Posts</span>
                          <p className="text-xs text-muted-foreground">Instagram Feed</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1:1" id="r3" />
                      <Label htmlFor="r3" className="cursor-pointer">
                        <div>
                          <span className="font-medium">1:1 - Square</span>
                          <p className="text-xs text-muted-foreground">Instagram • Facebook • Twitter/X</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Advanced Options */}
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
                    onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Advanced Options</span>
                    {advancedOptionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {advancedOptionsOpen && (
                    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 animate-fadeIn">
                      {/* Background */}
                      <div>
                        <Label className="text-sm mb-2 block">Background</Label>
                        <Select value={background} onValueChange={setBackground}>
                          <SelectTrigger className="bg-gray-900 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getBackgroundOptions(selectedTemplate).map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {background === "custom" && (
                          <Input
                            placeholder="Describe your custom background..."
                            value={customBackground}
                            onChange={(e) => setCustomBackground(e.target.value)}
                            className="mt-2 bg-gray-900 border-gray-700"
                          />
                        )}
                      </div>
                      
                      {/* Lighting */}
                      <div>
                        <Label className="text-sm mb-2 block">Lighting</Label>
                        <Select value={lighting} onValueChange={setLighting}>
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
                            onChange={(e) => setCustomLighting(e.target.value)}
                            className="mt-2 bg-gray-900 border-gray-700"
                          />
                        )}
                      </div>
                      
                      {/* Camera Angle */}
                      <div>
                        <Label className="text-sm mb-2 block">Camera Angle</Label>
                        <Select value={cameraAngle} onValueChange={setCameraAngle}>
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
                            onChange={(e) => setCustomCameraAngle(e.target.value)}
                            className="mt-2 bg-gray-900 border-gray-700"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                {uploadedImageUrl && selectedTemplate && (
                  <div className="pt-4">
                    <Button
                      onClick={handleGenerate}
                      className="w-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] transition-all duration-200 shadow-lg rounded-lg"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Photos (1 Credit)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FashionPhotography;
