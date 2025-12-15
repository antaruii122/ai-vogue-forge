import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploaderProps {
  previewUrl: string | null;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePhoto: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageUploader = ({
  previewUrl,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onChangePhoto,
  fileInputRef,
}: ImageUploaderProps) => {
  if (previewUrl) {
    return (
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
            onClick={onChangePhoto}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Change Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-[250px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer backdrop-blur-sm
        ${isDragging 
          ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/30' 
          : 'border-gray-500 bg-gray-900/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20'
        }`}
      style={{
        background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(31,41,55,0.8) 100%)'
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileSelect}
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
  );
};
