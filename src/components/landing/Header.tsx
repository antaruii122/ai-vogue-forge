import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Camera, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GoogleTranslate from "@/components/GoogleTranslate";

interface HeaderProps {
  user: any;
  isLoaded: boolean;
  onLogout: () => void;
}

export const Header = ({ user, isLoaded, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">AI Fashion Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Google Translate Widget */}
            <GoogleTranslate variant="dark" />
            
            {isLoaded && user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-images")} className="hidden md:flex">
                  My Images
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/generator")} className="hidden md:flex">
                  Generator
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate("/my-images")}>
                      <Camera className="mr-2 h-4 w-4" />
                      My Images
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/generator")}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generator
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : isLoaded ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
