import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json();
    console.log('Callback received:', JSON.stringify(body));

    // Extract data from n8n callback
    // n8n should send: { generation_id: "...", image_url: "...", success: true/false }
    const { generation_id, generationId, image_url, imageUrl, success, error } = body;
    
    const genId = generation_id || generationId;
    const imgUrl = image_url || imageUrl;

    if (!genId) {
      console.error('No generation_id provided');
      return new Response(
        JSON.stringify({ error: 'generation_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (success === false || error) {
      // Generation failed
      const { error: updateError } = await supabase
        .from('user_generations')
        .update({ status: 'failed' })
        .eq('id', genId);

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
    const { error: updateError } = await supabase
      .from('user_generations')
      .update({
        generated_images: [imgUrl],
        status: 'completed',
      })
      .eq('id', genId);

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
