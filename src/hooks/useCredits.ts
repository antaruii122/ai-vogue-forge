import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface UseCreditsReturn {
  credits: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCredits(): UseCreditsReturn {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!isLoaded || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching credits:', fetchError);
        setError(fetchError.message);
        setCredits(3); // Default credits for new users
      } else if (data) {
        setCredits(data.credits);
      } else {
        // No profile exists yet - user will get 3 credits on first generation
        setCredits(3);
      }
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      setError('Failed to fetch credits');
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoaded]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Listen for custom events to refetch credits
  useEffect(() => {
    const handleCreditsUpdate = () => {
      fetchCredits();
    };

    window.addEventListener('credits-updated', handleCreditsUpdate);
    return () => {
      window.removeEventListener('credits-updated', handleCreditsUpdate);
    };
  }, [fetchCredits]);

  // Refetch when window gains focus (user returns from another page/tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchCredits();
    };

    window.addEventListener('focus', handleFocus);
    // Also refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCredits();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCredits]);

  return {
    credits,
    isLoading,
    error,
    refetch: fetchCredits,
  };
}

// Helper to trigger credit refetch from anywhere in the app
export function triggerCreditsRefetch() {
  window.dispatchEvent(new CustomEvent('credits-updated'));
}
