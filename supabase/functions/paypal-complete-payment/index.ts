import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateClerkToken, corsHeaders } from '../_shared/clerk-auth.ts';

const TIER_CONFIG = {
  trial: { credits: 20, price: 9.00 },
  basic: { credits: 200, price: 35.00 },
  professional: { credits: 600, price: 99.00 },
  enterprise: { credits: 3000, price: 450.00 },
} as const;

type Tier = keyof typeof TIER_CONFIG;

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal auth error:', error);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function verifyPayPalOrder(orderId: string, accessToken: string): Promise<any> {
  const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal order verification error:', error);
    throw new Error('Failed to verify PayPal order');
  }

  return response.json();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Clerk token
    const authHeader = req.headers.get('Authorization');
    const clerkResult = await validateClerkToken(authHeader);

    if (!clerkResult.valid || !clerkResult.userId) {
      console.error('Auth failed:', clerkResult.error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: clerkResult.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = clerkResult.userId;
    console.log('Authenticated user:', userId);

    // Parse request body
    const body = await req.json();
    const { paypal_order_id, tier } = body;

    if (!paypal_order_id || !tier) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: paypal_order_id, tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate tier
    if (!TIER_CONFIG[tier as Tier]) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier', valid_tiers: Object.keys(TIER_CONFIG) }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tierConfig = TIER_CONFIG[tier as Tier];
    console.log(`Processing ${tier} payment for order ${paypal_order_id}`);

    // Initialize Supabase with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this order was already processed (prevent double-crediting)
    const { data: existingTransaction } = await supabase
      .from('payment_transactions')
      .select('id, status')
      .eq('paypal_order_id', paypal_order_id)
      .maybeSingle();

    if (existingTransaction) {
      console.log('Order already processed:', existingTransaction);
      return new Response(
        JSON.stringify({ 
          error: 'Order already processed', 
          status: existingTransaction.status 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify with PayPal
    let paypalOrder;
    try {
      const accessToken = await getPayPalAccessToken();
      paypalOrder = await verifyPayPalOrder(paypal_order_id, accessToken);
      console.log('PayPal order status:', paypalOrder.status);
    } catch (paypalError) {
      console.error('PayPal verification failed:', paypalError);
      
      // Record failed transaction
      await supabase.from('payment_transactions').insert({
        user_id: userId,
        paypal_order_id,
        amount_usd: tierConfig.price,
        credits_purchased: tierConfig.credits,
        tier,
        status: 'failed',
      });

      return new Response(
        JSON.stringify({ success: false, error: 'Payment verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check order status
    if (paypalOrder.status !== 'COMPLETED') {
      console.log('Order not completed:', paypalOrder.status);
      
      await supabase.from('payment_transactions').insert({
        user_id: userId,
        paypal_order_id,
        amount_usd: tierConfig.price,
        credits_purchased: tierConfig.credits,
        tier,
        status: 'failed',
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment not completed', 
          paypal_status: paypalOrder.status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify amount matches tier
    const purchaseUnit = paypalOrder.purchase_units?.[0];
    const paidAmount = parseFloat(purchaseUnit?.amount?.value || '0');
    
    if (Math.abs(paidAmount - tierConfig.price) > 0.01) {
      console.error(`Amount mismatch: paid ${paidAmount}, expected ${tierConfig.price}`);
      
      await supabase.from('payment_transactions').insert({
        user_id: userId,
        paypal_order_id,
        amount_usd: paidAmount,
        credits_purchased: 0,
        tier,
        status: 'failed',
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment amount does not match tier price',
          paid: paidAmount,
          expected: tierConfig.price
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Payment verified! Record transaction
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        paypal_order_id,
        amount_usd: tierConfig.price,
        credits_purchased: tierConfig.credits,
        tier,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

    if (transactionError) {
      console.error('Failed to record transaction:', transactionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to record transaction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user's credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, total_credits_purchased')
      .eq('user_id', userId)
      .maybeSingle();

    let newBalance: number;

    if (!profile) {
      // Create new profile with purchased credits + signup bonus
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          credits: 3 + tierConfig.credits,
          total_credits_purchased: tierConfig.credits,
        })
        .select('credits')
        .single();

      if (createError) {
        console.error('Failed to create profile:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update credits' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      newBalance = newProfile.credits;
    } else {
      // Update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          credits: profile.credits + tierConfig.credits,
          total_credits_purchased: profile.total_credits_purchased + tierConfig.credits,
        })
        .eq('user_id', userId)
        .select('credits')
        .single();

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update credits' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      newBalance = updatedProfile.credits;
    }

    console.log(`Payment successful: ${tierConfig.credits} credits added, new balance: ${newBalance}`);

    return new Response(
      JSON.stringify({
        success: true,
        credits_added: tierConfig.credits,
        new_balance: newBalance,
        tier,
        order_id: paypal_order_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
