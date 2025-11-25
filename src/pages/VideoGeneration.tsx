import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud, Sparkles, Check } from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      alert('Please upload a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
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

        {/* Upload Section */}
        <div className="max-w-[600px] mx-auto">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              h-80 rounded-xl bg-gray-900/50 backdrop-blur-sm p-12
              border-2 border-dashed cursor-pointer
              flex flex-col items-center justify-center
              transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-purple-500 scale-[1.01]' 
                : 'border-gray-600 hover:border-purple-500 hover:scale-[1.01]'
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

        {/* Template Gallery - Only show after image upload */}
        {selectedFile && (
          <div className="max-w-[1200px] mx-auto mt-12">
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
                    aspect-[9/16] h-[280px] cursor-pointer rounded-lg p-3
                    bg-gray-800/50 backdrop-blur-sm
                    transition-all duration-300 ease-in-out
                    relative overflow-hidden
                    ${selectedTemplate === template.id
                      ? 'border-2 border-primary-purple bg-purple-900/20 scale-[1.03]'
                      : 'border border-gray-700 hover:border-primary-purple hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/20'
                    }
                  `}
                >
                  {/* Gradient Thumbnail Placeholder */}
                  <div className={`
                    w-full h-full rounded-md bg-gradient-to-br ${template.gradient}
                    flex items-center justify-center relative
                  `}>
                    <Sparkles className="w-8 h-8 text-white/30" />
                    
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
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default VideoGeneration;
