import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-heading font-bold mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-invert max-w-none">
            {/* Content will be added here */}
            <p className="text-muted-foreground">Content coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
