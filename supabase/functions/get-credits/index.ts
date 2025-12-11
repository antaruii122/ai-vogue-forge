import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify with Clerk
    const clerkSecretKey = Deno.env.get('CLERK_SECRET_KEY');
    if (!clerkSecretKey) {
      console.error('CLERK_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode the JWT to get the user ID (sub claim)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'No user ID in token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching credits for user:', userId);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's credits
    const { data, error } = await supabase
      .from('profiles')
      .select('credits, total_credits_purchased')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching credits:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no profile exists, return default values
    if (!data) {
      console.log('No profile found for user, returning defaults');
      return new Response(
        JSON.stringify({ credits: 3, total_credits_purchased: 0, profile_exists: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Credits fetched successfully:', data);
    return new Response(
      JSON.stringify({ 
        credits: data.credits, 
        total_credits_purchased: data.total_credits_purchased,
        profile_exists: true 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
