import { Upload, Wand2, Download } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
            How It Works
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your product photos in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">1. Upload</h3>
            <p className="text-foreground/60 leading-relaxed">
              Upload your product photo with a clean background
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">2. Generate</h3>
            <p className="text-foreground/60 leading-relaxed">
              AI creates professional fashion photography
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">3. Download</h3>
            <p className="text-foreground/60 leading-relaxed">
              Get high-resolution images ready for your store
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
