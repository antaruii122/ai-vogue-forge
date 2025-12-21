import { UploadCloud, X, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploaderProps {
  previewUrls: string[];
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  maxImages?: number;
}

export const ImageUploader = ({
  previewUrls,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemoveImage,
  onClearAll,
  fileInputRef,
  maxImages = 8,
}: ImageUploaderProps) => {
  const hasImages = previewUrls.length > 0;
  const canAddMore = previewUrls.length < maxImages;

  // Grid preview when images are uploaded
  if (hasImages) {
    return (
      <div className="space-y-4">
        {/* Grid Preview - responsive: 2 cols on mobile, 3 on sm, 4 on md+ */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(index);
                }}
                className="absolute top-1 right-1 p-1.5 bg-black/70 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </button>
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                {index + 1}
              </div>
            </div>
          ))}
          
          {/* Add more button */}
          {canAddMore && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-400 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-900/50 min-h-[80px]"
            >
              <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 mb-1" />
              <span className="text-xs text-gray-500">Add More</span>
              <span className="text-[10px] sm:text-xs text-gray-600">({previewUrls.length}/{maxImages})</span>
            </div>
          )}
        </div>

        {/* Speed Warning Alert */}
        {previewUrls.length >= 2 && (
          <Alert className="bg-yellow-500/10 border-yellow-500/50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200 text-sm">
              <strong>⚠️ High Quality Mode:</strong> You are using multiple reference images. 
              The AI will take significantly longer to generate (up to 3 minutes) to process these extra details.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {previewUrls.length} of {maxImages} images uploaded
          </span>
          <button
            onClick={onClearAll}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear All
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileSelect}
          className="hidden"
          multiple
        />
      </div>
    );
  }

  // Empty upload area
  return (
    <div className="space-y-3">
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
          multiple
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl text-foreground font-medium mb-1 text-center">
            Upload Reference Images (Max {maxImages})
          </p>
          <p className="text-sm text-gray-400 text-center">
            Drag & drop your photos or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports: JPG, PNG, WebP • Max 10MB each
          </p>
        </div>
      </div>
    </div>
  );
};
