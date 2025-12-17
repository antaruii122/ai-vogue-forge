// Fashion Photography Tool - AI-powered fashion imagery generation
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToStorage } from "@/utils/uploadToStorage";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useCredits } from "@/hooks/useCredits";
import { PayPalCheckoutModal } from "@/components/PayPalCheckoutModal";
import { Zap } from "lucide-react";
import {
  ImageUploader,
  AIModelSelector,
  aiModels,
  StyleTemplates,
  allTemplates,
  OutputFormatSelector,
  AdvancedOptions,
  GenerateButton,
  CreditIndicator,
} from "@/components/fashion";

const FashionPhotography = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { credits, isLoading: isCreditsLoading, refetch: refetchCredits } = useCredits();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [activeStyleTab, setActiveStyleTab] = useState<string>("lifestyle");

  // AI Model state
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState<number | null>(null);

  // Output format state
  const [aspectRatio, setAspectRatio] = useState<string>("9:16");

  // Advanced options state
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [background, setBackground] = useState<string>("auto");
  const [customBackground, setCustomBackground] = useState<string>("");
  const [lighting, setLighting] = useState<string>("auto");
  const [customLighting, setCustomLighting] = useState<string>("");
  const [cameraAngle, setCameraAngle] = useState<string>("auto");
  const [customCameraAngle, setCustomCameraAngle] = useState<string>("");
  const [styleChangeWarning, setStyleChangeWarning] = useState<string | null>(null);

  // PayPal modal state
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);

  // Computed values
  const hasEnoughCredits = credits !== null && credits >= 1;

  // Drag and drop handlers
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
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isValidMime = validMimeTypes.includes(file.type);
    const isValidExtension = validExtensions.includes(fileExtension);
    
    if (!isValidMime && !isValidExtension) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, JPEG, PNG, WebP, or GIF)",
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
      
      const clerkToken = await getToken();
      
      if (!clerkToken) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }
      
      const publicUrl = await uploadImageToStorage(file, user.id, 'uploads', clerkToken);
      
      setSelectedFile(file);
      setUploadedImageUrl(publicUrl);
      
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

  // Handle style selection with warning
  const handleStyleSelect = (templateId: number) => {
    const previousTemplate = selectedTemplate;
    setSelectedTemplate(templateId);
    
    if (previousTemplate !== null && previousTemplate !== templateId) {
      if (background === "custom") {
        setStyleChangeWarning("Style changed - Custom background preserved");
      } else if (background !== "auto") {
        setBackground("auto");
        setStyleChangeWarning("Style changed - Background reset to Auto");
      }
      
      if (styleChangeWarning === null) {
        setTimeout(() => setStyleChangeWarning(null), 3000);
      }
    }
  };

  const getTemplateName = () => {
    const template = allTemplates.find(t => t.id === selectedTemplate);
    return template?.name || "Unknown";
  };

  const handleGenerate = async () => {
    try {
      // 1. Validation: Ensure we have an image
      if (!uploadedImageUrl) {
        toast({
          title: "Missing image",
          description: "Please upload an image first",
          variant: "destructive",
        });
        return;
      }
      
      // 2. Validation: Ensure we have credits
      if (credits !== null && credits < 1) {
        toast({
          title: "⚠️ Insufficient Credits",
          description: "You need 1 credit to generate. You have 0 credits.",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsPayPalModalOpen(true)}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              <Zap className="w-3 h-3 mr-1" />
              Buy Credits
            </Button>
          ),
        });
        return;
      }

      console.log("🚀 Starting Generation...");

      // 3. Look up the selected AI model's image URL (if any)
      const selectedModelData = aiModels.find(m => m.id === selectedAiModel);
      const modelUrl = selectedModelData?.image;

      // 4. Prepare the Payload (UPDATED for Flux/Array support)
      // We now use 'image_urls' (plural) and always wrap the image in an array
      // If a model is selected, include both product image AND model image
      const imageUrls = modelUrl 
        ? [uploadedImageUrl, modelUrl]  // Product + Model
        : [uploadedImageUrl];            // Product only
      
      const payload = {
        image_urls: imageUrls,
        style: getTemplateName(),        // e.g. "Ghost Mannequin"
        aspectRatio: aspectRatio || "9:16",
        
        // Pass optional parameters if they exist, otherwise "auto"
        background: background === "custom" ? customBackground : (background || "auto"),
        lighting: lighting === "custom" ? customLighting : (lighting || "auto"),
        cameraAngle: cameraAngle === "custom" ? customCameraAngle : (cameraAngle || "auto"),
        
        // Pass custom text inputs if the user typed them
        backgroundCustom: background === "custom" ? customBackground : null,
        lightingCustom: lighting === "custom" ? customLighting : null,
        cameraAngleCustom: cameraAngle === "custom" ? customCameraAngle : null
      };

      console.log("📤 Sending Payload:", payload);

      // Navigate to results page with the payload
      navigate('/tools/fashion-results', {
        state: {
          image_urls: payload.image_urls,
          image_url: uploadedImageUrl, // Keep for backwards compatibility
          style: payload.style,
          styleId: selectedTemplate,
          aspectRatio: payload.aspectRatio,
          background: payload.background,
          lighting: payload.lighting,
          cameraAngle: payload.cameraAngle,
          backgroundCustom: payload.backgroundCustom,
          lightingCustom: payload.lightingCustom,
          cameraAngleCustom: payload.cameraAngleCustom,
        }
      });

    } catch (error) {
      console.error('❌ Generation Error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to start generation",
        variant: "destructive",
      });
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
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                Transform your product photos into stunning fashion imagery with AI
              </p>
              
              <CreditIndicator 
                credits={credits}
                isLoading={isCreditsLoading}
                onBuyCredits={() => setIsPayPalModalOpen(true)}
              />
            </div>

            {/* Main content - 2 column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
              {/* Left Column - Upload & AI Model */}
              <div className="space-y-6">
                <ImageUploader
                  previewUrl={previewUrl}
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileSelect={handleFileInput}
                  onChangePhoto={handleChangePhoto}
                  fileInputRef={fileInputRef}
                />

                <AIModelSelector
                  isModalOpen={isModelModalOpen}
                  selectedAiModel={selectedAiModel}
                  onOpenModal={() => setIsModelModalOpen(true)}
                  onCloseModal={() => setIsModelModalOpen(false)}
                  onSelectModel={handleSelectAiModel}
                />
              </div>

              {/* Right Column - Templates & Options */}
              <div className="space-y-8">
                <StyleTemplates
                  selectedTemplate={selectedTemplate}
                  activeStyleTab={activeStyleTab}
                  onStyleSelect={handleStyleSelect}
                  onTabChange={setActiveStyleTab}
                />

                <OutputFormatSelector
                  aspectRatio={aspectRatio}
                  onAspectRatioChange={setAspectRatio}
                />

                <AdvancedOptions
                  selectedTemplate={selectedTemplate}
                  isOpen={advancedOptionsOpen}
                  onToggle={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                  background={background}
                  customBackground={customBackground}
                  lighting={lighting}
                  customLighting={customLighting}
                  cameraAngle={cameraAngle}
                  customCameraAngle={customCameraAngle}
                  styleChangeWarning={styleChangeWarning}
                  onBackgroundChange={setBackground}
                  onCustomBackgroundChange={setCustomBackground}
                  onLightingChange={setLighting}
                  onCustomLightingChange={setCustomLighting}
                  onCameraAngleChange={setCameraAngle}
                  onCustomCameraAngleChange={setCustomCameraAngle}
                />

                <GenerateButton
                  isVisible={!!(uploadedImageUrl && selectedTemplate)}
                  credits={credits}
                  isCreditsLoading={isCreditsLoading}
                  hasEnoughCredits={hasEnoughCredits}
                  onGenerate={handleGenerate}
                  onBuyCredits={() => setIsPayPalModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <PayPalCheckoutModal 
          isOpen={isPayPalModalOpen} 
          onClose={() => {
            setIsPayPalModalOpen(false);
            refetchCredits();
          }} 
        />
      </div>
    </AppLayout>
  );
};

export default FashionPhotography;
