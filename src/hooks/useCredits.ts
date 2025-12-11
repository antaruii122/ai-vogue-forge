import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface UseCreditsReturn {
  credits: number | null;
  totalPurchased: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Auto-refresh interval in milliseconds (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000;

export function useCredits(): UseCreditsReturn {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [totalPurchased, setTotalPurchased] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!isLoaded || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('credits, total_credits_purchased')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching credits:', fetchError);
        setError(fetchError.message);
        // Default values for error state
        setCredits(0);
        setTotalPurchased(0);
      } else if (data) {
        setCredits(data.credits);
        setTotalPurchased(data.total_credits_purchased);
      } else {
        // No profile exists yet - user will get 3 credits on first generation
        setCredits(3);
        setTotalPurchased(0);
      }
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setError('Failed to fetch credits');
      setCredits(0);
      setTotalPurchased(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    // Initial fetch
    fetchCredits();
    
    // Set up auto-refresh interval
    intervalRef.current = setInterval(() => {
      fetchCredits();
    }, AUTO_REFRESH_INTERVAL);
    
    // Listen for custom events to refetch credits
    const handleCreditsUpdate = () => {
      fetchCredits();
    };
    
    // Refetch when window gains focus or page becomes visible
    const handleFocus = () => {
      fetchCredits();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCredits();
      }
    };

    window.addEventListener('credits-updated', handleCreditsUpdate);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('credits-updated', handleCreditsUpdate);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCredits]);

  return {
    credits,
    totalPurchased,
    isLoading,
    error,
    refetch: fetchCredits,
  };
}

// Helper to trigger credit refetch from anywhere in the app
export function triggerCreditsRefetch() {
  window.dispatchEvent(new CustomEvent('credits-updated'));
}
