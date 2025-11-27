import { SignIn } from "@clerk/clerk-react";
import { Sparkles } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-heading font-bold">AI Fashion Studio</span>
        </div>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "border-border/50 bg-card/50 backdrop-blur-sm shadow-xl",
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/generator"
        />
      </div>
    </div>
  );
};

export default Login;
