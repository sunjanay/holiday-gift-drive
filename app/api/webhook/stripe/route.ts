import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { supabaseAdmin, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const giftId = session.metadata?.gift_id;
    const donorEmail = session.metadata?.donor_email;
    const feeCovered = session.metadata?.fee_covered === 'true';
    const amountPaid = session.amount_total;

    if (!giftId) {
      console.error('No gift_id in session metadata');
      return NextResponse.json(
        { error: 'Missing gift_id in metadata' },
        { status: 400 }
      );
    }

    console.log('Payment completed:', {
      giftId,
      donorEmail: donorEmail || 'anonymous',
      feeCovered,
      amountPaid,
      sessionId: session.id,
    });

    // Update Supabase to mark gift as purchased
    if (isSupabaseServerConfigured && supabaseAdmin) {
      const { error: updateError } = await supabaseAdmin
        .from('gift_recipients')
        .update({
          purchased: true,
          purchased_at: new Date().toISOString(),
          stripe_session_id: session.id,
          donor_email: donorEmail || null,
          amount_paid: amountPaid,
          fee_covered: feeCovered,
        })
        .eq('id', giftId);

      if (updateError) {
        console.error('Failed to update gift in Supabase:', updateError);
        // Don't return error - payment was successful, just logging failed
      } else {
        console.log(`Gift ${giftId} marked as purchased in Supabase`);
      }
    } else {
      console.warn('Supabase not configured - gift purchase not tracked in database');
    }
  }

  return NextResponse.json({ received: true });
}
