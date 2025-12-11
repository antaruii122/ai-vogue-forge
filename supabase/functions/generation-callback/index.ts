import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const CallbackSchema = z.object({
  generation_id: z.string().uuid().optional(),
  generationId: z.string().uuid().optional(),
  image_url: z.string().url().max(2048).optional(),
  imageUrl: z.string().url().max(2048).optional(),
  success: z.boolean().optional(),
  error: z.string().max(500).optional(),
}).refine(data => data.generation_id || data.generationId, {
  message: "Either generation_id or generationId is required"
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const rawBody = await req.json();
    console.log('Callback received:', JSON.stringify(rawBody));

    // Validate input
    const parseResult = CallbackSchema.safeParse(rawBody);
    if (!parseResult.success) {
      console.error('Input validation failed:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = parseResult.data;
    const genId = body.generation_id || body.generationId;
    const imgUrl = body.image_url || body.imageUrl;
    const { success, error } = body;

    // SECURITY: Validate that the generation exists and is in 'processing' status
    // This prevents attackers from updating arbitrary records
    const { data: existingGeneration, error: fetchError } = await supabase
      .from('user_generations')
      .select('id, status')
      .eq('id', genId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching generation:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify generation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!existingGeneration) {
      console.error('Generation not found:', genId);
      return new Response(
        JSON.stringify({ error: 'Generation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingGeneration.status !== 'processing') {
      console.error('Generation not in processing status:', genId, existingGeneration.status);
      return new Response(
        JSON.stringify({ error: 'Generation is not in processing status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (success === false || error) {
      // Generation failed
      const { error: updateError } = await supabase
        .from('user_generations')
        .update({ status: 'failed' })
        .eq('id', genId)
        .eq('status', 'processing'); // Extra safety: only update if still processing

      if (updateError) {
        console.error('Failed to update record as failed:', updateError);
      }

      console.log('Generation marked as failed:', genId);
      return new Response(
        JSON.stringify({ success: true, message: 'Marked as failed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!imgUrl) {
      console.error('No image_url provided for successful generation');
      return new Response(
        JSON.stringify({ error: 'image_url is required for successful generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the generation record with the completed image
    // Extra safety: only update if still in processing status
    const { error: updateError } = await supabase
      .from('user_generations')
      .update({
        generated_images: [imgUrl],
        status: 'completed',
      })
      .eq('id', genId)
      .eq('status', 'processing');

    if (updateError) {
      console.error('Failed to update generation record:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update generation record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generation completed successfully:', genId, imgUrl);

    return new Response(
      JSON.stringify({ success: true, message: 'Generation updated' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
