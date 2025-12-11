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
    console.log('Listing files for user:', userId);

    // Get query params
    const url = new URL(req.url);
    const bucket = url.searchParams.get('bucket') || 'product-images';
    const fileType = url.searchParams.get('type') || 'all'; // 'uploads', 'generated', or 'all'

    // Create admin client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const files: Array<{
      name: string;
      url: string;
      created_at: string;
      size: number;
      type: 'uploads' | 'generated';
    }> = [];

    // Fetch uploads if requested
    if (fileType === 'all' || fileType === 'uploads') {
      const { data: uploads, error: uploadsError } = await supabase.storage
        .from(bucket)
        .list(`${userId}/uploads`, {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (uploadsError) {
        console.error('Error listing uploads:', uploadsError);
      } else if (uploads) {
        for (const file of uploads) {
          if (file.name !== '.emptyFolderPlaceholder') {
            // Use signed URL since bucket is private
            const { data: signedData } = await supabase.storage
              .from(bucket)
              .createSignedUrl(`${userId}/uploads/${file.name}`, 3600); // 1 hour expiry
            
            files.push({
              name: file.name,
              url: signedData?.signedUrl || '',
              created_at: file.created_at || new Date().toISOString(),
              size: file.metadata?.size || 0,
              type: 'uploads'
            });
          }
        }
      }
    }

    // Fetch generated if requested
    if (fileType === 'all' || fileType === 'generated') {
      const { data: generated, error: generatedError } = await supabase.storage
        .from(bucket)
        .list(`${userId}/generated`, {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (generatedError) {
        console.error('Error listing generated:', generatedError);
      } else if (generated) {
        for (const file of generated) {
          if (file.name !== '.emptyFolderPlaceholder') {
            // Use signed URL since bucket is private
            const { data: signedData } = await supabase.storage
              .from(bucket)
              .createSignedUrl(`${userId}/generated/${file.name}`, 3600); // 1 hour expiry
            
            files.push({
              name: file.name,
              url: signedData?.signedUrl || '',
              created_at: file.created_at || new Date().toISOString(),
              size: file.metadata?.size || 0,
              type: 'generated'
            });
          }
        }
      }
    }

    // Sort by created_at descending
    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log(`Found ${files.length} files for user ${userId}`);

    return new Response(
      JSON.stringify({ files }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Storage list error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to list files' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
