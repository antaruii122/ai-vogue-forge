import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud, MapPin, Sparkles, Sun, Crown, Check, Loader2, Download, Save, Plus, CheckCircle, Expand, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { uploadImageToStorage } from "@/utils/uploadToStorage";
import luxuryPremiumExample from "@/assets/luxury-premium-example.jpeg";
import studioCleanExample from "@/assets/studio-clean-example.jpeg";
import outdoorNaturalExample from "@/assets/outdoor-natural-example.jpeg";
import luxuryPremiumExample2 from "@/assets/luxury-premium-example2.jpeg";

const templates = [
  { id: 1, name: "Urban Lifestyle", gradient: "from-blue-500 to-purple-500", icon: MapPin },
  { id: 2, name: "Studio Clean", gradient: "from-gray-400 to-gray-600", icon: Sparkles },
  { id: 3, name: "Outdoor Natural", gradient: "from-green-500 to-teal-500", icon: Sun },
  { id: 4, name: "Luxury Premium", gradient: "from-amber-500 to-orange-500", icon: Crown },
];

const FashionPhotography = () => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Hardcoded webhook URL
  const WEBHOOK_URL = "https://n8n.quicklyandgood.com/webhook/662d6440-b0e1-4c5e-9c71-11e077a84e39";

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
      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your photo",
      });
      
      // Upload to storage and get public URL
      const publicUrl = await uploadImageToStorage(file);
      
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
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    }
  };

  const handleChangePhoto = () => {
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setPreviewUrl(null);
    setSelectedTemplate(null);
    setGeneratedPhotos(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      // Send POST request to hardcoded webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
      console.error("Webhook error:", error);
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
              Creating 4 stunning images (30-45 seconds)
            </p>
            
            {/* Progress bar */}
            <div className="w-[300px] mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Premium dark gradient background with animated mesh */}
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        {/* Animated gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 p-6">
          {/* Main page title */}
          <div className="mt-[60px] mb-8">
            <h1 className="text-3xl font-bold text-foreground text-center">
              Fashion Photography
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              Transform your products into stunning lifestyle photos
            </p>
          </div>

          {/* 2-column layout on desktop */}
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN - Upload & Preview (35% width) */}
              <div className="lg:col-span-4">
                {/* Subtitle */}
                <p className="text-muted-foreground text-sm mb-6">
                  Upload your product → Pick a style → Get your photos
                </p>

                {/* Upload Section - Show if no image uploaded */}
                {!selectedFile && (
                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        h-[250px] rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8
                        border-2 border-dashed cursor-pointer
                        flex flex-col items-center justify-center
                        transition-all duration-300 ease-in-out
                        ${isDragging 
                          ? 'border-purple-400 shadow-lg shadow-purple-500/30 scale-[1.01]' 
                          : 'border-gray-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.01]'
                        }
                      `}
                    >
                      <UploadCloud className="w-12 h-12 text-muted-foreground" />
                      <p className="text-lg text-foreground mt-4 text-center">
                        Drag & drop your product photo
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Supports: JPG, PNG, WEBP • Max 10MB
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Image Preview - Show after upload with glassmorphism */}
                {selectedFile && previewUrl && (
                  <div className="max-w-[300px]">
                    <div className="relative backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10 shadow-xl shadow-purple-500/10">
                      <img
                        src={previewUrl}
                        alt="Uploaded product"
                        className="w-full max-h-[300px] object-contain rounded-lg"
                      />
                    </div>
                    <button
                      onClick={handleChangePhoto}
                      className="w-full mt-4 text-sm text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                    >
                      Change Photo
                    </button>
                    {uploadedImageUrl && (
                      <p className="text-xs text-green-400 mt-2 text-center">
                        ✓ Uploaded to storage
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Style Gallery (65% width) */}
              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Choose Your Style
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select a photography style (1 credit = 4 photos)
                  </p>
                </div>

                {/* Style grid - 2 columns with 9:16 aspect ratio - Smaller cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px]">
                  {templates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`
                          cursor-pointer rounded-lg p-3
                          bg-gradient-to-br from-gray-800 to-gray-900
                          transition-all duration-300 ease-out
                          relative flex flex-col
                          ${selectedTemplate === template.id
                            ? 'border-[3px] border-purple-500 bg-purple-500/20 scale-105 shadow-2xl shadow-purple-500/60 z-20'
                            : 'border border-gray-700 hover:border-[3px] hover:border-purple-400 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/50 hover:z-10'
                          }
                        `}
                      >
                        {/* 9:16 Portrait Aspect Ratio Container - 40% smaller */}
                        <div className="aspect-[9/16] rounded-md bg-gradient-to-br from-gray-700 to-gray-900 opacity-20 flex items-center justify-center relative overflow-hidden max-h-[240px]">
                          {/* Show example images for templates */}
                          {template.id === 1 && (
                            <img 
                              src={luxuryPremiumExample} 
                              alt="Urban Lifestyle example"
                              className="absolute inset-0 w-full h-full object-cover opacity-100"
                            />
                          )}
                          {template.id === 2 && (
                            <img 
                              src={studioCleanExample} 
                              alt="Studio Clean example"
                              className="absolute inset-0 w-full h-full object-cover opacity-100"
                            />
                          )}
                          {template.id === 3 && (
                            <img 
                              src={outdoorNaturalExample} 
                              alt="Outdoor Natural example"
                              className="absolute inset-0 w-full h-full object-cover opacity-100"
                            />
                          )}
                          {template.id === 4 && (
                            <img 
                              src={luxuryPremiumExample2} 
                              alt="Luxury Premium example"
                              className="absolute inset-0 w-full h-full object-cover opacity-100"
                            />
                          )}
                          
                          {selectedTemplate === template.id ? (
                            // Large checkmark in center when selected
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <div className="bg-purple-500 rounded-full p-3">
                                <Check className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (template.id < 1 || template.id > 4) && (
                            <IconComponent className="w-12 h-12 text-white/50" />
                          )}
                        </div>

                        {/* Template Name */}
                        <p className="text-sm text-foreground font-medium mt-2 text-center">
                          {template.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Output Format Section - Show only when template selected */}
                {selectedTemplate && (
                  <div className="mt-8 max-w-[700px]">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Output Format</h3>
                    <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`
                          flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${aspectRatio === "9:16" 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-gray-700 bg-gray-800/50 hover:border-purple-400"
                          }
                        `} onClick={() => setAspectRatio("9:16")}>
                          <div className="flex items-center">
                            <RadioGroupItem value="9:16" id="ratio-9-16" className="mr-3" />
                            <Label htmlFor="ratio-9-16" className="cursor-pointer flex-1">
                              <span className="text-foreground font-medium block">9:16 - Stories/Reels</span>
                              <span className="block text-[0.75rem] text-muted-foreground/70 mt-1.5 leading-relaxed">
                                Instagram • TikTok • YouTube Shorts • Snapchat • Pinterest
                              </span>
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`
                          flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${aspectRatio === "3:4" 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-gray-700 bg-gray-800/50 hover:border-purple-400"
                          }
                        `} onClick={() => setAspectRatio("3:4")}>
                          <div className="flex items-center">
                            <RadioGroupItem value="3:4" id="ratio-3-4" className="mr-3" />
                            <Label htmlFor="ratio-3-4" className="cursor-pointer flex-1">
                              <span className="text-foreground font-medium block">3:4 - Feed Posts</span>
                              <span className="block text-[0.75rem] text-muted-foreground/70 mt-1.5 leading-relaxed">
                                Instagram Feed • Pinterest • Facebook
                              </span>
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-1">
                        <div className={`
                          flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${aspectRatio === "1:1" 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-gray-700 bg-gray-800/50 hover:border-purple-400"
                          }
                        `} onClick={() => setAspectRatio("1:1")}>
                          <div className="flex items-center">
                            <RadioGroupItem value="1:1" id="ratio-1-1" className="mr-3" />
                            <Label htmlFor="ratio-1-1" className="cursor-pointer flex-1">
                              <span className="text-foreground font-medium block">1:1 - Square</span>
                              <span className="block text-[0.75rem] text-muted-foreground/70 mt-1.5 leading-relaxed">
                                Instagram • Facebook • LinkedIn • Twitter/X
                              </span>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Advanced Options Section - Collapsible */}
                {selectedTemplate && (
                  <div className="mt-6 max-w-[700px]">
                    <button
                      onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-400 transition-all"
                    >
                      <span className="text-foreground font-medium flex items-center gap-2">
                        <span>⚙️</span>
                        Advanced Options (optional)
                      </span>
                      {advancedOptionsOpen ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {advancedOptionsOpen && (
                      <div className="mt-4 p-6 rounded-lg bg-gray-800/30 border border-gray-700 space-y-6 animate-in slide-in-from-top-2 duration-300">
                        {/* Background Dropdown */}
                        <div>
                          <Label htmlFor="background" className="text-foreground mb-2 block">Background</Label>
                          <Select value={background} onValueChange={setBackground}>
                            <SelectTrigger id="background" className="bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select background" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto (from style)</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="urban-street">Urban Street</SelectItem>
                              <SelectItem value="beach">Beach</SelectItem>
                              <SelectItem value="forest">Forest</SelectItem>
                              <SelectItem value="modern-cafe">Modern Café</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          {background === "custom" && (
                            <Input
                              value={customBackground}
                              onChange={(e) => setCustomBackground(e.target.value)}
                              placeholder="e.g., cozy bookstore interior"
                              className="mt-2 bg-gray-900 border-gray-700"
                            />
                          )}
                        </div>

                        {/* Lighting Dropdown */}
                        <div>
                          <Label htmlFor="lighting" className="text-foreground mb-2 block">Lighting</Label>
                          <Select value={lighting} onValueChange={setLighting}>
                            <SelectTrigger id="lighting" className="bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select lighting" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto (from style)</SelectItem>
                              <SelectItem value="bright-airy">Bright & Airy</SelectItem>
                              <SelectItem value="dramatic-moody">Dramatic & Moody</SelectItem>
                              <SelectItem value="natural-daylight">Natural Daylight</SelectItem>
                              <SelectItem value="warm-golden-hour">Warm Golden Hour</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          {lighting === "custom" && (
                            <Input
                              value={customLighting}
                              onChange={(e) => setCustomLighting(e.target.value)}
                              placeholder="e.g., soft window light"
                              className="mt-2 bg-gray-900 border-gray-700"
                            />
                          )}
                        </div>

                        {/* Camera Angle Dropdown */}
                        <div>
                          <Label htmlFor="camera-angle" className="text-foreground mb-2 block">Camera Angle</Label>
                          <Select value={cameraAngle} onValueChange={setCameraAngle}>
                            <SelectTrigger id="camera-angle" className="bg-gray-900 border-gray-700">
                              <SelectValue placeholder="Select camera angle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto (from style)</SelectItem>
                              <SelectItem value="eye-level">Eye Level</SelectItem>
                              <SelectItem value="high-angle">High Angle</SelectItem>
                              <SelectItem value="low-angle">Low Angle</SelectItem>
                              <SelectItem value="45-angle">45° Angle</SelectItem>
                              <SelectItem value="closeup-detail">Close-up Detail</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          {cameraAngle === "custom" && (
                            <Input
                              value={customCameraAngle}
                              onChange={(e) => setCustomCameraAngle(e.target.value)}
                              placeholder="e.g., overhead flat lay"
                              className="mt-2 bg-gray-900 border-gray-700"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Generate Button - Show only when both image and template selected */}
                {selectedFile && selectedTemplate && (
                  <div className="flex flex-col items-center mt-8">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating your photos...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Photos (1 Credit)
                        </>
                      )}
                    </Button>
                    <p className="text-muted-foreground text-sm mt-2">
                      You'll receive 4 high-quality images
                    </p>
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
