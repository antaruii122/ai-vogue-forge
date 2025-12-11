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

    // ============================================
    // CREDIT VALIDATION AND DEDUCTION
    // ============================================
    
    // Step 1: Get or create user profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, credits')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: If profile doesn't exist, create one with 3 free credits (signup bonus)
    if (!profile) {
      console.log('First-time user, creating profile with 3 free credits');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          credits: 3,
          total_credits_purchased: 0,
        })
        .select('id, credits')
        .single();

      if (createError) {
        console.error('Failed to create profile:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      profile = newProfile;
      console.log('Created new profile with credits:', profile.credits);
    }

    console.log('User credit balance before generation:', profile.credits);

    // Step 3: Check if user has enough credits
    if (profile.credits < 1) {
      console.log('Insufficient credits for user:', userId, 'Balance:', profile.credits);
      return new Response(
        JSON.stringify({
          error: 'Insufficient credits',
          credits: profile.credits,
          message: 'You need 1 credit to generate a photo. Please purchase more credits.',
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Deduct 1 credit BEFORE calling N8N (optimistic deduction)
    const { data: updatedProfile, error: deductError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('user_id', userId)
      .select('credits')
      .single();

    if (deductError) {
      console.error('Failed to deduct credit:', deductError);
      return new Response(
        JSON.stringify({ error: 'Failed to process credit deduction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const remainingCredits = updatedProfile.credits;
    console.log('Credit deducted. Remaining balance:', remainingCredits);

    // ============================================
    // END CREDIT VALIDATION
    // ============================================

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
      // REFUND the credit since we couldn't create the record
      console.log('Refunding credit due to record creation failure');
      await supabase
        .from('profiles')
        .update({ credits: remainingCredits + 1 })
        .eq('user_id', userId);
      
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
    
    let response;
    try {
      response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });
    } catch (fetchError) {
      console.error('N8N webhook call failed:', fetchError);
      // REFUND the credit since N8N call failed
      console.log('Refunding credit due to N8N call failure');
      await supabase
        .from('profiles')
        .update({ credits: remainingCredits + 1 })
        .eq('user_id', userId);
      
      await supabase
        .from('user_generations')
        .update({ status: 'failed' })
        .eq('id', generationId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to connect to generation service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseText = await response.text();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response:', responseText);

    // Parse the N8N response
    let n8nResponse;
    try {
      n8nResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse N8N response:', e);
      // REFUND the credit since we got invalid response
      console.log('Refunding credit due to invalid N8N response');
      await supabase
        .from('profiles')
        .update({ credits: remainingCredits + 1 })
        .eq('user_id', userId);
      
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
    // Check for successful generation with image
    if (n8nResponse.success && n8nResponse.image_url) {
      // Clean the image URL - strip leading '=' if present (n8n expression artifact)
      let cleanImageUrl = n8nResponse.image_url;
      if (cleanImageUrl.startsWith('=')) {
        cleanImageUrl = cleanImageUrl.substring(1);
      }
      
      // Success - update record with generated image
      const { error: updateError } = await supabase
        .from('user_generations')
        .update({
          generated_images: [cleanImageUrl],
          status: 'completed',
        })
        .eq('id', generationId);

      if (updateError) {
        console.error('Failed to update generation record:', updateError);
      }

      console.log('Generation completed successfully:', cleanImageUrl);
      console.log('Final credit balance:', remainingCredits);

      return new Response(
        JSON.stringify({
          success: true,
          generation_id: generationId,
          image_url: cleanImageUrl,
          status: 'completed',
          remaining_credits: remainingCredits,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Handle async workflow response - N8N started but hasn't returned image yet
    else if (n8nResponse.message === 'Workflow was started') {
      console.log('N8N workflow started (async mode), generation_id:', generationId);
      console.log('Credit already deducted, balance:', remainingCredits);
      
      // Record stays in 'processing' status - N8N needs to call back with result
      return new Response(
        JSON.stringify({
          success: true,
          generation_id: generationId,
          status: 'processing',
          message: 'Generation started. N8N is processing your image.',
          remaining_credits: remainingCredits,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      // N8N returned an error or unexpected response - REFUND the credit
      const errorMessage = n8nResponse.error || n8nResponse.message || 'Generation failed';
      console.error('N8N generation failed:', errorMessage);
      console.log('Refunding credit due to N8N generation failure');
      
      await supabase
        .from('profiles')
        .update({ credits: remainingCredits + 1 })
        .eq('user_id', userId);
      
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
          remaining_credits: remainingCredits + 1, // Refunded
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
