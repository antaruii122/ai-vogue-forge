import { useState } from 'react';
import { X, Zap, Check, Flame, Star, Loader2 } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { triggerCreditsRefetch } from '@/hooks/useCredits';

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIERS = [
  {
    id: 'trial',
    name: 'TRIAL',
    price: 9,
    credits: 20,
    perCredit: 0.45,
    tagline: 'Try risk-free',
    savings: '61%',
    icon: null,
    popular: false,
  },
  {
    id: 'basic',
    name: 'BASIC',
    price: 35,
    credits: 200,
    perCredit: 0.175,
    tagline: 'Best for beginners',
    savings: '61%',
    icon: Star,
    popular: false,
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    price: 99,
    credits: 600,
    perCredit: 0.165,
    tagline: 'Most popular choice',
    savings: '63%',
    icon: Flame,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 450,
    credits: 3000,
    perCredit: 0.15,
    tagline: 'For power users',
    savings: '67%',
    icon: null,
    popular: false,
  },
];

export function PayPalCheckoutModal({ isOpen, onClose }: PayPalCheckoutModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const selectedTierData = TIERS.find(t => t.id === selectedTier);

  const createOrder = (_data: any, actions: any) => {
    if (!selectedTierData) return Promise.reject('No tier selected');
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: selectedTierData.price.toString(),
            currency_code: 'USD',
          },
          description: `${selectedTierData.credits} Credits - ${selectedTierData.name} Plan`,
        },
      ],
    });
  };

  const onApprove = async (_data: any, actions: any) => {
    if (!selectedTierData) return;
    
    setIsProcessing(true);
    
    try {
      // Capture the order
      const details = await actions.order.capture();
      const orderId = details.id;
      
      // Get Clerk token
      const clerkToken = await getToken();
      if (!clerkToken) {
        throw new Error('Authentication required');
      }

      // Call our Edge Function to verify and add credits
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-complete-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clerkToken}`,
          },
          body: JSON.stringify({
            paypal_order_id: orderId,
            tier: selectedTierData.id,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: '✅ Payment Successful!',
          description: `${result.credits_added} credits added! New balance: ${result.new_balance}`,
        });
        
        triggerCreditsRefetch();
        onClose();
        navigate('/tools/fashion-photography');
      } else {
        throw new Error(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Payment failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    toast({
      title: 'Payment Error',
      description: 'Something went wrong with PayPal. Please try again.',
      variant: 'destructive',
    });
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Buy Credits
            </h2>
            <p className="text-gray-400 text-sm mt-1">Choose a plan that works for you</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`
                  relative rounded-xl p-5 cursor-pointer transition-all duration-200
                  ${tier.popular 
                    ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  }
                  ${selectedTier === tier.id ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900' : ''}
                  ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                `}
                onClick={() => handleTierSelect(tier.id)}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> POPULAR
                    </span>
                  </div>
                )}

                {/* Tier name */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm font-medium">{tier.name}</span>
                  {tier.icon && <tier.icon className="w-4 h-4 text-yellow-400" />}
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-3xl font-bold text-white">${tier.price}</span>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{tier.credits} credits</span>
                </div>

                {/* Per credit cost */}
                <p className="text-gray-400 text-xs mb-3">
                  ${tier.perCredit.toFixed(3)}/credit
                </p>

                {/* Savings badge */}
                <div className="mb-3">
                  <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded">
                    Save {tier.savings}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-gray-500 text-xs mb-4">{tier.tagline}</p>

                {/* Select button or PayPal */}
                {selectedTier === tier.id ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-purple-500/20 rounded-lg">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">Selected</span>
                  </div>
                ) : (
                  <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">
                    Select Plan
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* PayPal Buttons */}
          {selectedTier && (
            <div className="mt-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="mb-4 text-center">
                <p className="text-gray-300">
                  Complete your purchase of <span className="text-white font-semibold">{selectedTierData?.credits} credits</span> for{' '}
                  <span className="text-green-400 font-semibold">${selectedTierData?.price}</span>
                </p>
              </div>
              
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <span className="ml-3 text-gray-300">Processing payment...</span>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              💡 1 credit = 1 photo generation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
