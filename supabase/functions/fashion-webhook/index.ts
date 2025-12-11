import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateClerkToken, corsHeaders } from "../_shared/clerk-auth.ts";

const WEBHOOK_URL = "https://n8n.quicklyandgood.com/webhook/662d6440-b0e1-4c5e-9c71-11e077a84e39";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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
    console.log('Forwarding to webhook for user:', userId, 'body:', JSON.stringify(body));

    // Wrap payload in "body" object for n8n
    const webhookPayload = {
      body: {
        ...body,
        userId,
        timestamp: new Date().toISOString(),
      }
    };

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

    return new Response(responseText, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to call webhook' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
