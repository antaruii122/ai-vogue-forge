import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { UploadCloud } from "lucide-react";

const VideoGeneration = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      </div>
    </AppLayout>
  );
};

export default VideoGeneration;
