import { Zap, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditIndicatorProps {
  credits: number | null;
  isLoading: boolean;
  onBuyCredits: () => void;
}

export const CreditIndicator = ({
  credits,
  isLoading,
  onBuyCredits,
}: CreditIndicatorProps) => {
  const getCreditColorClass = () => {
    if (credits === null || isLoading) return 'text-gray-400';
    if (credits > 10) return 'text-green-400';
    if (credits > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCreditBgClass = () => {
    if (credits === null || isLoading) return 'bg-gray-800/50';
    if (credits > 10) return 'bg-green-500/10 border-green-500/30';
    if (credits > 0) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onBuyCredits}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:scale-105 ${getCreditBgClass()} ${getCreditColorClass()}`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold">
              {isLoading ? '...' : `${credits ?? 0} Credits`}
            </span>
            {credits === 0 && (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to buy more credits</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
