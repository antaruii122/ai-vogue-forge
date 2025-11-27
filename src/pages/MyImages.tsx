import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageFile {
  name: string;
  url: string;
  created_at: string;
  type: 'uploads' | 'generated';
}

const MyImages = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserImages();
  }, []);

  const loadUserImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // List files from user's folders
      const { data: uploadedFiles, error: uploadsError } = await supabase.storage
        .from('product-images')
        .list(`${user.id}/uploads`);

      const { data: generatedFiles, error: generatedError } = await supabase.storage
        .from('product-images')
        .list(`${user.id}/generated`);

      if (uploadsError || generatedError) {
        throw uploadsError || generatedError;
      }

      const allImages: ImageFile[] = [];

      // Process uploaded files
      if (uploadedFiles) {
        uploadedFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`${user.id}/uploads/${file.name}`);
          
          allImages.push({
            name: file.name,
            url: publicUrl,
            created_at: file.created_at,
            type: 'uploads'
          });
        });
      }

      // Process generated files
      if (generatedFiles) {
        generatedFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`${user.id}/generated/${file.name}`);
          
          allImages.push({
            name: file.name,
            url: publicUrl,
            created_at: file.created_at,
            type: 'generated'
          });
        });
      }

      // Sort by date, newest first
      allImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setImages(allImages);
    } catch (error) {
      toast({
        title: "Error loading images",
        description: error instanceof Error ? error.message : "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0a0118] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-white mb-2">My Images</h1>
            <p className="text-muted-foreground">View all your uploaded and generated images</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No images yet</CardTitle>
                <CardDescription>
                  Upload your first image to get started
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground capitalize">
                        {image.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyImages;
