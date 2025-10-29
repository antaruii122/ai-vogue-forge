import { useState } from "react";
import { Upload, X, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Mock data for models
const models = [
  { id: 1, name: "Emma Stone", bodyType: "Athletic", skinTone: "Fair", image: "/placeholder.svg" },
  { id: 2, name: "Zara Chen", bodyType: "Slim", skinTone: "Medium", image: "/placeholder.svg" },
  { id: 3, name: "Maya Johnson", bodyType: "Curvy", skinTone: "Dark", image: "/placeholder.svg" },
  { id: 4, name: "Sofia Rodriguez", bodyType: "Athletic", skinTone: "Olive", image: "/placeholder.svg" },
  { id: 5, name: "Aisha Williams", bodyType: "Plus Size", skinTone: "Deep", image: "/placeholder.svg" },
  { id: 6, name: "Luna Park", bodyType: "Petite", skinTone: "Light", image: "/placeholder.svg" },
];

// Mock data for templates
const templates = [
  { id: 1, name: "Urban Spring", prompt: "Put the item on a brunette girl located in New York during the spring with buildings and trees in the background.", image: "/placeholder.svg" },
  { id: 2, name: "Beach Sunset", prompt: "Put the item on a blonde model located at a beach during sunset with ocean waves in the background.", image: "/placeholder.svg" },
  { id: 3, name: "City Night", prompt: "Put the item on an elegant model located in downtown at night with city lights and skyscrapers in the background.", image: "/placeholder.svg" },
  { id: 4, name: "Garden Party", prompt: "Put the item on a cheerful model located in a botanical garden with colorful flowers and greenery in the background.", image: "/placeholder.svg" },
];

const FashionPhotographyTool = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedTemplate(template.id);
    setPrompt(template.prompt);
  };

  const handleGenerate = async (type: "image" | "video") => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate generation
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Add mock result
      const mockResult = "/placeholder.svg";
      setGeneratedResults([...generatedResults, mockResult]);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        toast.success(`${type === "image" ? "Image" : "Video"} generated successfully!`);
      }, 500);
    }, 5000);
  };

  const removeResult = (index: number) => {
    setGeneratedResults(generatedResults.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-[#0f0f0f] text-foreground p-6 flex flex-col gap-8 overflow-y-auto">
        {/* Upload Section */}
        <div className="flex flex-col gap-3">
          <label htmlFor="product-upload">
            <div className="w-full h-11 bg-white text-black border border-black rounded-md flex items-center justify-center gap-2 cursor-pointer hover:bg-white/90 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Image</span>
            </div>
            <input
              id="product-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <p className="text-sm text-muted-foreground text-center">Upload product image</p>
        </div>

        {/* Models Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-[#666666] uppercase tracking-wider">Models</h2>
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-3 pr-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative rounded-md overflow-hidden cursor-pointer transition-all ${
                    selectedModel === model.id ? "ring-[3px] ring-white" : "hover:opacity-80"
                  }`}
                >
                  <div className="w-full h-[100px] bg-gradient-to-br from-primary/10 to-primary-purple/10 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{model.name}</span>
                  </div>
                  {selectedModel === model.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                  <div className="p-2 bg-background-lighter">
                    <p className="text-xs font-bold text-white">{model.name}</p>
                    <p className="text-[10px] text-[#666666]">{model.bodyType} • {model.skinTone}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Templates Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-[#666666] uppercase tracking-wider">Templates</h2>
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col gap-3 pr-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`relative rounded-md overflow-hidden cursor-pointer transition-all ${
                    selectedTemplate === template.id ? "ring-[3px] ring-white" : "hover:opacity-80"
                  }`}
                >
                  <div className="w-full h-[100px] bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{template.name}</span>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                  <div className="p-2 bg-background-lighter">
                    <p className="text-xs font-bold text-white">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 bg-[#f9f9f9] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Uploaded Images Section */}
          <div>
            <h2 className="text-sm font-bold text-black mb-4">Uploaded Images</h2>
            {uploadedImages.length === 0 ? (
              <p className="text-sm text-[#666666] text-center py-8">
                No uploaded images yet. Upload your first item below!
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-[120px] object-cover rounded-md bg-white border border-[#e0e0e0]"
                    />
                    <button
                      onClick={() => removeUploadedImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generation Area */}
          <div className="bg-white rounded-lg p-12 space-y-6 border border-[#e0e0e0]">
            <div className="text-center space-y-3">
              <h1 className="text-[28px] font-bold text-black font-heading">
                Generate your AI photoshoot
              </h1>
              <p className="text-base text-[#666666] max-w-2xl mx-auto">
                Enter a prompt describing the model and scene or choose from templates. 
                Create on-model images in minutes.
              </p>
            </div>

            <div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Put the item on [a brunette girl] located in [New York during the spring] with [buildings and trees in the background]."
                className="min-h-[80px] max-h-[120px] bg-[#f5f5f5] border-[#e0e0e0] text-sm font-mono resize-none focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleGenerate("image")}
                className="h-11 bg-black text-white hover:bg-black/90"
                disabled={isProcessing}
              >
                Generate Image
              </Button>
              <Button
                onClick={() => handleGenerate("video")}
                variant="outline"
                className="h-11 border-[#666666] text-black hover:bg-black/5"
                disabled={isProcessing}
              >
                Generate Video
              </Button>
            </div>
          </div>

          {/* Output Results */}
          <div>
            <h2 className="text-sm font-bold text-black mb-4">Generated Results</h2>
            {generatedResults.length === 0 ? (
              <div className="bg-white rounded-lg p-12 border border-[#e0e0e0]">
                <p className="text-sm text-[#666666] text-center">
                  Your generated images will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedResults.map((result, index) => (
                  <div key={index} className="relative group bg-white rounded-lg overflow-hidden border border-[#e0e0e0] hover:shadow-lg transition-shadow">
                    <div className="w-full h-[200px] bg-gradient-to-br from-primary/20 to-primary-purple/20 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Generated Image {index + 1}</span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="w-8 h-8 bg-white hover:bg-white/90 rounded-full flex items-center justify-center shadow-md">
                        <Download className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => removeResult(index)}
                        className="w-8 h-8 bg-white hover:bg-white/90 rounded-full flex items-center justify-center shadow-md"
                      >
                        <X className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-base font-medium text-black">Generating image... Please wait</p>
              <div className="w-full bg-[#e0e0e0] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[#666666]">{progress}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionPhotographyTool;
