import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";
import { validateClerkToken, corsHeaders } from "../_shared/clerk-auth.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Clerk session with proper signature verification
    const authResult = await validateClerkToken(req.headers.get('authorization'));
    if (!authResult.valid || !authResult.userId) {
      console.error('Auth validation failed:', authResult.error);
      return new Response(
        JSON.stringify({ error: authResult.error || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authResult.userId;
    console.log('Delete request from user:', userId);

    // Get request body
    const body = await req.json();
    const { fileName, fileType, bucket = 'product-images' } = body;

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: 'fileName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!fileType || !['uploads', 'generated'].includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'fileType must be "uploads" or "generated"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Construct file path - only allow deleting from user's own folder
    const filePath = `${userId}/${fileType}/${fileName}`;
    
    console.log('Deleting file:', filePath, 'from bucket:', bucket);

    // Delete file using service role (bypasses RLS)
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Delete successful:', filePath);

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Storage delete error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Delete failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
