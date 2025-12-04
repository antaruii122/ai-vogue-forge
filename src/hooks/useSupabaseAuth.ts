import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Hook that creates an authenticated Supabase client using Clerk's JWT token.
 * This bridges Clerk authentication with Supabase, making Supabase recognize
 * Clerk users and enabling proper RLS policy enforcement.
 * 
 * Usage:
 * const { supabase, isLoaded } = useSupabaseAuth();
 * 
 * The returned client automatically includes the Clerk JWT in the Authorization header,
 * allowing Supabase RLS policies to use auth.jwt() ->> 'sub' to identify users.
 */
export function useSupabaseAuth() {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const supabase = useMemo(() => {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (url: RequestInfo | URL, options: RequestInit = {}) => {
          // Get Clerk JWT token for each request
          const token = await getToken({ template: 'supabase' });
          
          const headers = new Headers(options.headers as HeadersInit);
          
          // If we have a Clerk token, use it for authorization
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    });
  }, [getToken]);

  return {
    supabase,
    isLoaded,
    isSignedIn,
    userId,
  };
}

/**
 * Creates a one-time authenticated Supabase client with the provided Clerk token.
 * Use this for operations outside of React components.
 */
export function createAuthenticatedClient(clerkToken: string | null): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: clerkToken ? {
        Authorization: `Bearer ${clerkToken}`,
      } : {},
    },
  });
}
