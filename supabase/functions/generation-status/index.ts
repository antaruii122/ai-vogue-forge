import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateClerkToken, corsHeaders } from "../_shared/clerk-auth.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Validate Clerk token
    const authHeader = req.headers.get('authorization');
    const validation = await validateClerkToken(authHeader);
    
    if (!validation.valid || !validation.userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = validation.userId;
    const url = new URL(req.url);
    const generationId = url.searchParams.get('id');

    if (!generationId) {
      return new Response(
        JSON.stringify({ error: 'Generation ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the generation record
    const { data: generation, error } = await supabase
      .from('user_generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', userId)
      .single();

    if (error || !generation) {
      console.error('Error fetching generation:', error);
      return new Response(
        JSON.stringify({ error: 'Generation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the generation status
    return new Response(
      JSON.stringify({
        id: generation.id,
        status: generation.status,
        image_url: generation.generated_images?.[0] || null,
        style: generation.style,
        aspect_ratio: generation.aspect_ratio,
        created_at: generation.created_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
