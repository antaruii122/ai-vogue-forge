import { SignUp } from "@clerk/clerk-react";
import { Sparkles } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0728] to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-heading font-bold">AI Fashion Studio</span>
        </div>

        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "border-gray-700/50 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-purple-500/10",
              headerTitle: "text-2xl font-bold text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 text-white transition-all duration-200 hover:border-primary/50",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20",
              formButtonPrimary: "bg-gradient-to-r from-primary to-primary-purple hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20",
              footerActionLink: "text-primary hover:text-primary-purple transition-colors",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-primary hover:text-primary-purple",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-primary",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-500",
              otpCodeFieldInput: "bg-gray-800/50 border-gray-700 text-white",
            }
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/generator"
        />
      </div>
    </div>
  );
};

export default Signup;
