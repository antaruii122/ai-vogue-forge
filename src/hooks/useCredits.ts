import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface UseCreditsReturn {
  credits: number | null;
  totalPurchased: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Auto-refresh interval in milliseconds (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useCredits(): UseCreditsReturn {
  const { getToken, isLoaded, userId } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [totalPurchased, setTotalPurchased] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!isLoaded || !userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      // Get the Clerk session token (not the supabase template)
      const token = await getToken();
      
      if (!token) {
        console.error('No auth token available');
        setError('Not authenticated');
        setCredits(3); // Default for unauthenticated
        setTotalPurchased(0);
        setIsLoading(false);
        return;
      }

      // Call the edge function to get credits
      const response = await fetch(`${SUPABASE_URL}/functions/v1/get-credits`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching credits:', response.status, errorData);
        setError(errorData.error || 'Failed to fetch credits');
        setCredits(0);
        setTotalPurchased(0);
      } else {
        const data = await response.json();
        setCredits(data.credits);
        setTotalPurchased(data.total_credits_purchased);
      }
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setError('Failed to fetch credits');
      setCredits(0);
      setTotalPurchased(0);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, userId, isLoaded]);

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
