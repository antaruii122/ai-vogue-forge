import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud, Sparkles, Check, Loader2, Download, Save, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { id: 1, name: "360° Spin", gradient: "from-purple-500 to-pink-500" },
  { id: 2, name: "Zoom In", gradient: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Zoom Out", gradient: "from-cyan-500 to-blue-500" },
  { id: 4, name: "Dolly Push", gradient: "from-violet-500 to-purple-500" },
  { id: 5, name: "Pan Reveal", gradient: "from-indigo-500 to-blue-500" },
  { id: 6, name: "Model Showcase", gradient: "from-green-500 to-emerald-500" },
  { id: 7, name: "Minimal Studio", gradient: "from-teal-500 to-cyan-500" },
];

const VideoGeneration = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleFile = (file: File) => {
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

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleChangePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedTemplate(null);
    setGeneratedVideoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate video generation (replace with actual API call)
    setTimeout(() => {
      // Use placeholder video URL (replace with actual generated video)
      setGeneratedVideoUrl("/videos/BOLD.mp4");
      setIsGenerating(false);
      toast({
        title: "Video generated!",
        description: "Your video is ready to download.",
      });
    }, 3000);
  };

  const handleGenerateAnother = () => {
    setGeneratedVideoUrl(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedTemplate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = 'generated-video.mp4';
    link.click();
    toast({
      title: "Download started",
      description: "Your video is being downloaded.",
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getTemplateName = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return template?.name || "Unknown";
  };

  // Show results view if video is generated
  if (generatedVideoUrl) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
          
          <div className="relative z-10 p-6">
            <div className="max-w-[900px] mx-auto mt-20">
              {/* Success Header */}
              <div className="text-center mb-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Your Video is Ready!
                </h1>
                <p className="text-muted-foreground text-sm">
                  Generated in 45 seconds
                </p>
              </div>

              {/* Video Player */}
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-[400px]">
                   <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full aspect-[9/16] rounded-xl border border-border shadow-2xl shadow-primary-purple/50"
                    aria-label="Generated product video"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-[500px] mx-auto">
                <Button
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 bg-gradient-primary text-lg font-semibold"
                  aria-label="Download generated video"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Video
                </Button>
                
                <Button
                  variant="outline"
                  className="px-6 py-3 border-2 hover:bg-primary-purple/10"
                  aria-label="Save video to portfolio"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save to Portfolio
                </Button>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={handleGenerateAnother}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Generate Another
                </button>
              </div>

              {/* Video Info Card */}
              <div className="max-w-[600px] mx-auto backdrop-blur-xl bg-card/50 rounded-lg p-6 border border-border" role="region" aria-label="Video generation details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Template</p>
                    <p className="text-foreground font-medium">{getTemplateName()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Resolution</p>
                    <p className="text-foreground font-medium">1080x1920 (9:16)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Duration</p>
                    <p className="text-foreground font-medium">5 seconds</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Cost</p>
                    <p className="text-foreground font-medium">1 credit</p>
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
              Generating your video...
            </h2>
            <p className="text-muted-foreground mb-8">
              This usually takes 30-60 seconds
            </p>
            
            {/* Progress bar */}
            <div className="w-[300px] mx-auto h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-label="Video generation progress">
              <div className="h-full bg-gradient-primary animate-pulse" style={{ width: '70%' }} />
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
          <div className="mt-20 mb-8">
            <h1 className="text-3xl font-bold text-foreground text-center">
              Video Generation
            </h1>
          </div>

          {/* 2-column layout on desktop */}
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN - Upload & Preview (35% width) */}
              <div className="lg:col-span-4">
                {/* Subtitle */}
                <p className="text-muted-foreground text-sm mb-6">
                  Upload your product → Pick a style → Get your video
                </p>

                {/* Upload Section - Show if no image uploaded */}
                {!selectedFile && (
                  <div>
                    <div
                      onClick={handleClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        h-[250px] rounded-xl bg-gradient-to-br from-background to-background-lighter p-8
                        border-2 border-dashed cursor-pointer
                        flex flex-col items-center justify-center
                        transition-all duration-300 ease-in-out
                        ${isDragging 
                          ? 'border-primary-purple shadow-lg shadow-primary-purple/30 scale-[1.01]' 
                          : 'border-border hover:border-primary-purple hover:shadow-lg hover:shadow-primary-purple/30 hover:scale-[1.01]'
                        }
                      `}
                      role="button"
                      aria-label="Upload product photo"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
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
                    <div className="relative backdrop-blur-xl bg-card/50 rounded-lg p-4 border border-border shadow-xl shadow-primary-purple/10">
                      <img
                        src={previewUrl}
                        alt="Uploaded product photo preview"
                        className="w-full max-h-[300px] object-contain rounded-lg"
                      />
                    </div>
                    <button
                      onClick={handleChangePhoto}
                      className="w-full mt-4 text-sm text-primary-purple hover:text-primary cursor-pointer transition-colors"
                      aria-label="Change uploaded photo"
                    >
                      Change Photo
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Template Gallery (65% width) */}
              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Choose Your Video Style
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select a template to generate your video (1 credit)
                  </p>
                </div>

                {/* Template grid - 4-3 layout (4 top row, 3 bottom centered) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`
                        h-[280px] cursor-pointer rounded-lg p-3
                        bg-gradient-to-br from-background to-background-lighter
                        transition-all duration-300 ease-out
                        relative flex flex-col
                        ${selectedTemplate === template.id
                          ? 'border-[3px] border-primary-purple bg-primary-purple/20 scale-105 shadow-xl shadow-primary-purple/50'
                          : 'border border-border opacity-70 hover:border-2 hover:border-primary-purple hover:opacity-100 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary-purple/30'
                        }
                      `}
                      role="button"
                      aria-label={`Select ${template.name} template`}
                      aria-pressed={selectedTemplate === template.id}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedTemplate(template.id)}
                    >
                      {/* Gradient Thumbnail Placeholder */}
                      <div className={`
                        flex-1 rounded-md bg-gradient-to-br ${template.gradient} opacity-20
                        flex items-center justify-center relative overflow-hidden
                      `}>
                        {selectedTemplate === template.id ? (
                          // Large checkmark in center when selected
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-purple-500 rounded-full p-3">
                              <Check className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        ) : (
                          <Sparkles className="w-8 h-8 text-white/50" />
                        )}
                      </div>

                      {/* Template Name */}
                      <p className="text-sm text-foreground font-medium mt-2 text-center">
                        {template.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Generate Button - Show only when both image and template selected */}
                {selectedFile && selectedTemplate && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="px-8 py-4 text-lg font-semibold bg-gradient-primary rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      aria-label="Generate video from uploaded photo"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating your video...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Video (1 Credit)
                        </>
                      )}
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

export default VideoGeneration;
