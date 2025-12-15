import { Button } from "@/components/ui/button";
import { Sparkles, Zap, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GenerateButtonProps {
  isVisible: boolean;
  credits: number | null;
  isCreditsLoading: boolean;
  hasEnoughCredits: boolean;
  onGenerate: () => void;
  onBuyCredits: () => void;
}

export const GenerateButton = ({
  isVisible,
  credits,
  isCreditsLoading,
  hasEnoughCredits,
  onGenerate,
  onBuyCredits,
}: GenerateButtonProps) => {
  const getCreditColorClass = () => {
    if (credits === null || isCreditsLoading) return 'text-gray-400';
    if (credits > 10) return 'text-green-400';
    if (credits > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!isVisible) return null;

  return (
    <div className="pt-4 space-y-3">
      {/* Credit balance near button */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-400">Balance:</span>
        <span className={`flex items-center gap-1 font-medium ${getCreditColorClass()}`}>
          <Zap className="w-4 h-4" />
          {isCreditsLoading ? '--' : credits ?? 0} credits
        </span>
      </div>
      
      {hasEnoughCredits ? (
        <Button
          onClick={onGenerate}
          className="w-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] transition-all duration-200 shadow-lg rounded-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Photos (1 Credit)
        </Button>
      ) : (
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled
                  className="w-full px-8 py-4 text-lg font-semibold bg-gray-700 text-gray-400 cursor-not-allowed rounded-lg"
                >
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Need Credits
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Buy credits to continue generating</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={onBuyCredits}
            className="w-full px-8 py-3 text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-[1.02] transition-all duration-200 shadow-lg rounded-lg text-black"
          >
            <Zap className="mr-2 h-5 w-5" />
            Buy Credits to Continue
          </Button>
        </div>
      )}
    </div>
  );
};
