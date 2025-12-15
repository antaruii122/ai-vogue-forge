import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold">AI Fashion Studio</span>
          </div>
          
          <p className="text-muted-foreground text-sm">
            © 2024 AI Fashion Studio. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
