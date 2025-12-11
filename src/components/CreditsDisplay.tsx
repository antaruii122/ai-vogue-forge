import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PayPalCheckoutModal } from '@/components/PayPalCheckoutModal';

export function CreditsDisplay() {
  const { credits, isLoading } = useCredits();
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

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all cursor-pointer group ${getColorClass()}`}
            >
              <Zap className={`w-4 h-4 ${getIconColor()} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">
                {isLoading ? '--' : credits ?? 0} Credits
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to buy more credits</p>
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
