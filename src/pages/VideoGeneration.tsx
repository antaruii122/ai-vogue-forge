import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud, Sparkles, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { id: 1, name: "360° Spin", gradient: "from-purple-500 to-pink-500" },
  { id: 2, name: "Zoom In/Out", gradient: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Model Movement", gradient: "from-green-500 to-emerald-500" },
  { id: 4, name: "Floating Product", gradient: "from-orange-500 to-red-500" },
  { id: 5, name: "Background Change", gradient: "from-violet-500 to-purple-500" },
  { id: 6, name: "Cinematic Reveal", gradient: "from-indigo-500 to-blue-500" },
  { id: 7, name: "Detail Showcase", gradient: "from-pink-500 to-rose-500" },
  { id: 8, name: "Urban Lifestyle", gradient: "from-gray-500 to-slate-600" },
  { id: 9, name: "Minimal Studio", gradient: "from-teal-500 to-cyan-500" },
  { id: 10, name: "Color Splash", gradient: "from-yellow-500 to-orange-500" },
];

const VideoGeneration = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate video generation (replace with actual API call)
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Video generated!",
        description: "Your video is ready to download.",
      });
    }, 3000);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mt-20 mb-12">
          <h1 className="text-4xl font-bold text-white text-center">
            Create Video Ads
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Upload your product → Pick a style → Get your video
          </p>
        </div>

        {/* Upload Section - Only show if no image uploaded */}
        {!selectedFile && (
          <div className="max-w-[600px] mx-auto">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              h-80 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-12
              border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center
              transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-purple-400 shadow-lg shadow-purple-500/30 scale-[1.01]' 
                : 'border-gray-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.01]'
              }
            `}
          >
            <UploadCloud className="w-16 h-16 text-gray-400" />
            <p className="text-xl text-white mt-4">
              Drag & drop your product photo
            </p>
            <p className="text-sm text-gray-400 mt-2">
              or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-4">
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

        {/* Image Preview - Show after upload */}
        {selectedFile && previewUrl && (
          <div className="max-w-[400px] mx-auto mb-8">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Uploaded product"
                className="w-full max-h-[400px] object-contain rounded-lg shadow-lg border border-gray-700"
              />
            </div>
            <button
              onClick={handleChangePhoto}
              className="w-full mt-4 text-sm text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
            >
              Change Photo
            </button>
          </div>
        )}

        {/* Template Gallery - Always visible */}
        <div className="max-w-[1200px] mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Choose Your Video Style
            </h2>
            <p className="text-gray-400 text-sm">
              Select a template to generate your video (1 credit)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`
                  h-[280px] cursor-pointer rounded-lg p-3
                  bg-gradient-to-br from-gray-800 to-gray-900
                  transition-all duration-300 ease-in-out
                  relative flex flex-col
                  ${selectedTemplate === template.id
                    ? 'border-2 border-primary-purple bg-purple-900/20 scale-[1.03]'
                    : 'border border-gray-600 hover:border-primary-purple hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/20'
                  }
                `}
              >
                {/* Gradient Thumbnail Placeholder */}
                <div className={`
                  flex-1 rounded-md bg-gradient-to-br ${template.gradient} opacity-20
                  flex items-center justify-center relative overflow-hidden
                `}>
                  <Sparkles className="w-8 h-8 text-white/50" />
                  
                  {/* Selected Checkmark */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-primary-purple rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Template Name */}
                <p className="text-sm text-white font-medium mt-2 text-center">
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
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    </AppLayout>
  );
};

export default VideoGeneration;
