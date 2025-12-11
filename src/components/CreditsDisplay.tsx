import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PayPalCheckoutModal } from '@/components/PayPalCheckoutModal';

export function CreditsDisplay() {
  const { credits, isLoading, error } = useCredits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  // Color coding based on credits
  const getColorClass = () => {
    if (credits === null || isLoading) return 'text-gray-400';
    if (credits > 10) return 'text-green-400';
    if (credits > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIconColor = () => {
    if (credits === null || isLoading) return 'text-gray-400';
    if (credits > 10) return 'text-green-400';
    if (credits > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBgClass = () => {
    if (credits === null || isLoading) return 'bg-gray-800/50';
    if (credits > 10) return 'bg-gray-800/50 hover:bg-green-500/10';
    if (credits > 0) return 'bg-gray-800/50 hover:bg-yellow-500/10';
    return 'bg-red-500/10 hover:bg-red-500/20';
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer group ${getBgClass()} ${getColorClass()}`}
            >
              <Zap className={`w-4 h-4 ${getIconColor()} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">
                {isLoading ? '--' : error ? '!' : credits ?? 0} Credits
              </span>
              {credits !== null && credits === 0 && !isLoading && (
                <AlertCircle className="w-3 h-3 text-red-400" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{credits === 0 ? 'No credits! Click to buy' : 'Click to buy more credits'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PayPalCheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
