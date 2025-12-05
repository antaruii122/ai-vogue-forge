import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Validate Clerk token and extract user ID
 */
function validateClerkToken(authHeader: string | null): { valid: boolean; userId?: string; error?: string } {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const payload = JSON.parse(atob(parts[1]));
    
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    const userId = payload.sub;
    if (!userId) {
      return { valid: false, error: 'No user ID in token' };
    }

    return { valid: true, userId };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, error: 'Invalid token' };
  }
}

/**
 * Check if user is admin
 */
async function isUserAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  
  return !!data;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Clerk session
    const authResult = validateClerkToken(req.headers.get('authorization'));
    if (!authResult.valid || !authResult.userId) {
      return new Response(
        JSON.stringify({ error: authResult.error || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authResult.userId;

    // Create admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Check if user is admin
    const isAdmin = await isUserAdmin(supabase, userId);
    if (!isAdmin) {
      console.error('Non-admin user attempted admin storage operation:', userId);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user authenticated:', userId);

    // Determine operation
    const url = new URL(req.url);
    const operation = url.searchParams.get('operation');
    const bucket = url.searchParams.get('bucket') || 'videos';

    if (operation === 'list') {
      // List all files in bucket
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get public URLs for all files
      const filesWithUrls = files?.map(f => {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name);
        return { ...f, publicUrl };
      }) || [];

      return new Response(
        JSON.stringify({ files: filesWithUrls }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (operation === 'upload' && req.method === 'POST') {
      // Handle file upload
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Detect content type
      let contentType = file.type;
      if (!contentType) {
        if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          contentType = 'image/' + file.name.split('.').pop()?.toLowerCase();
        } else if (file.name.match(/\.(mp4|webm|mov)$/i)) {
          contentType = 'video/' + file.name.split('.').pop()?.toLowerCase();
        }
      }

      const fileBuffer = await file.arrayBuffer();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(file.name, fileBuffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType || 'application/octet-stream',
        });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(file.name);

      return new Response(
        JSON.stringify({ success: true, url: publicUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (operation === 'delete' && req.method === 'POST') {
      // Handle file deletion
      const body = await req.json();
      const { fileName } = body;

      if (!fileName) {
        return new Response(
          JSON.stringify({ error: 'fileName is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase.storage.from(bucket).remove([fileName]);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid operation' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin storage error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Operation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
