import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuth } from "@clerk/clerk-react";
import { getAllUserImages, StorageFile } from "@/utils/storageHelpers";

const MyImages = () => {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    loadUserImages();
  }, [user?.id]);

  const loadUserImages = async () => {
    try {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      // Get Clerk token for authenticated storage access
      const clerkToken = await getToken({ template: 'supabase' });
      
      // Fetch all images using authenticated helper
      const allImages = await getAllUserImages(user.id, clerkToken || undefined);
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">My Images</h1>
            <p className="text-muted-foreground">View all your uploaded and generated images</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <Card className="bg-card border-border">
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
                <Card key={index} className="bg-card border-border overflow-hidden group">
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