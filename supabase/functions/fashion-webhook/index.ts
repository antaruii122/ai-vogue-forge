import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateClerkToken, corsHeaders } from "../_shared/clerk-auth.ts";

const WEBHOOK_URL = "https://n8n.quicklyandgood.com/webhook/662d6440-b0e1-4c5e-9c71-11e077a84e39";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role for database operations
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Validate Clerk token using shared module with proper verification
    const authHeader = req.headers.get('authorization');
    const validation = await validateClerkToken(authHeader);
    
    if (!validation.valid || !validation.userId) {
      console.error('Authentication failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error || 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = validation.userId;
    console.log('Request from user:', userId);

    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body));

    // PHASE 1: Insert record into user_generations with status 'processing'
    const { data: generationRecord, error: insertError } = await supabase
      .from('user_generations')
      .insert({
        user_id: userId,
        original_image_url: body.image_url,
        style: body.style,
        aspect_ratio: body.aspectRatio || '9:16',
        background: body.background || 'auto',
        lighting: body.lighting || 'auto',
        camera_angle: body.cameraAngle || 'auto',
        status: 'processing',
        credits_used: 1,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create generation record:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create generation record', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generationId = generationRecord.id;
    console.log('Created generation record:', generationId);

    // PHASE 2: Call N8N webhook and wait for response
    const webhookPayload = {
      body: {
        ...body,
        userId,
        generationId,
        timestamp: new Date().toISOString(),
      }
    };

    console.log('Calling N8N webhook...');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    const responseText = await response.text();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response:', responseText);

    // Parse the N8N response
    let n8nResponse;
    try {
      n8nResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse N8N response:', e);
      // Update record as failed
      await supabase
        .from('user_generations')
        .update({ status: 'failed' })
        .eq('id', generationId);
      
      return new Response(
        JSON.stringify({ error: 'Invalid response from generation service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PHASE 3: Handle N8N response
    if (n8nResponse.success && n8nResponse.image_url) {
      // Success - update record with generated image
      const { error: updateError } = await supabase
        .from('user_generations')
        .update({
          generated_images: [n8nResponse.image_url],
          status: 'completed',
        })
        .eq('id', generationId);

      if (updateError) {
        console.error('Failed to update generation record:', updateError);
      }

      console.log('Generation completed successfully:', n8nResponse.image_url);

      return new Response(
        JSON.stringify({
          success: true,
          generation_id: generationId,
          image_url: n8nResponse.image_url,
          status: 'completed',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // N8N returned an error or no image
      const errorMessage = n8nResponse.error || n8nResponse.message || 'Generation failed';
      console.error('N8N generation failed:', errorMessage);
      
      await supabase
        .from('user_generations')
        .update({ status: 'failed' })
        .eq('id', generationId);

      return new Response(
        JSON.stringify({
          success: false,
          generation_id: generationId,
          error: errorMessage,
          status: 'failed',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
