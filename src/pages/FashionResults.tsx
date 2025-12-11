import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Loader2, CheckCircle, Download, Plus, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";

interface GenerationParams {
  image_url: string;
  style: string;
  styleId: number;
  aspectRatio: string;
  background: string;
  lighting: string;
  cameraAngle: string;
}

const FashionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false); // Prevent double calls

  const params = location.state as GenerationParams | null;
  const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fashion-webhook`;

  useEffect(() => {
    // Redirect if no params
    if (!params) {
      navigate('/tools/fashion-photography');
      return;
    }

    // CRITICAL: Only call once using ref to prevent React StrictMode double-mount
    if (hasStartedRef.current) {
      console.log('Generation already started, skipping duplicate call');
      return;
    }
    hasStartedRef.current = true;

    console.log('=== STARTING GENERATION (ONCE) ===');

    // Start elapsed time counter
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Call webhook ONCE and wait for response
    callWebhook();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const callWebhook = async () => {
    if (!params) return;

    console.log('>>> Calling fashion-webhook ONCE');

    try {
      const clerkToken = await getToken();
      if (!clerkToken) {
        setError("Authentication error. Please log in again.");
        setIsGenerating(false);
        return;
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clerkToken}`,
        },
        body: JSON.stringify({
          image_url: params.image_url,
          style: params.style,
          styleId: params.styleId,
          aspectRatio: params.aspectRatio,
          background: params.background,
          lighting: params.lighting,
          cameraAngle: params.cameraAngle,
        }),
      });

      const result = await response.json();
      console.log('<<< Webhook response received:', result);

      if (timerRef.current) clearInterval(timerRef.current);

      if (result.success && result.image_url) {
        // Success - we got the image directly
        setGeneratedImageUrl(result.image_url);
        setIsGenerating(false);
        toast({
          title: "Photo generated!",
          description: `Completed in ${elapsedSeconds} seconds`,
        });
      } else if (result.error) {
        setError(result.error);
        setIsGenerating(false);
      } else {
        // N8N returned but no image yet - this shouldn't happen with sync flow
        setError('Generation completed but no image was returned. Please try again.');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('Webhook error:', err);
      if (timerRef.current) clearInterval(timerRef.current);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;
    
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fashion-photo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your photo is being downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (generatedImageUrl) {
      navigator.clipboard.writeText(generatedImageUrl);
      toast({
        title: "Link copied",
        description: "Image URL copied to clipboard.",
      });
    }
  };

  const handleGenerateAnother = () => {
    navigate('/tools/fashion-photography');
  };

  // Loading state
  if (isGenerating) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-purple-500/10 animate-ping" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Generating Your Fashion Photo...
            </h1>
            <p className="text-muted-foreground mb-2">
              Please wait while our AI creates your image.
            </p>
            <p className="text-purple-400 text-lg font-mono mb-6">
              {elapsedSeconds}s elapsed
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Style:</span> {params?.style}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-medium text-gray-300">Format:</span> {params?.aspectRatio}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Typically takes 15-60 seconds. Do not close this page.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Generation Issue
            </h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleGenerateAnother} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Success state - show generated image
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto mt-12 px-6">
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Photo Is Ready!
              </h1>
              <p className="text-muted-foreground">
                {params?.style} • {params?.aspectRatio} • Generated in {elapsedSeconds}s
              </p>
            </div>

            {/* Generated Image */}
            <div className="flex justify-center mb-8">
              <div className="relative max-w-[500px] w-full">
                <img
                  src={generatedImageUrl!}
                  alt="Generated fashion photo"
                  className="w-full rounded-xl border border-gray-700 shadow-2xl shadow-purple-500/20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
              
              <Button 
                onClick={handleShare}
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              
              <Button 
                onClick={handleGenerateAnother}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Another
              </Button>
            </div>

            {/* Info Card */}
            <div className="mt-8 max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Style Used</p>
                  <p className="text-foreground font-medium">{params?.style}</p>
                </div>
                <div>
                  <p className="text-gray-500">Aspect Ratio</p>
                  <p className="text-foreground font-medium">{params?.aspectRatio}</p>
                </div>
                <div>
                  <p className="text-gray-500">Generation Time</p>
                  <p className="text-foreground font-medium">{elapsedSeconds} seconds</p>
                </div>
                <div>
                  <p className="text-gray-500">Credits Used</p>
                  <p className="text-foreground font-medium">1 credit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FashionResults;
