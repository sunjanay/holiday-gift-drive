import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculateProcessingFee } from '@/lib/stripe';
import { giftRecipients } from '@/app/gift-drive/data/giftRecipients';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, coverFee, donorEmail } = body;

    // Validate request
    if (!giftId) {
      return NextResponse.json(
        { error: 'Gift ID is required' },
        { status: 400 }
      );
    }

    // Find the gift
    const gift = giftRecipients.find(g => g.id === giftId);
    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    // Check if already purchased
    if (gift.purchased) {
      return NextResponse.json(
        { error: 'This gift has already been purchased' },
        { status: 400 }
      );
    }

    // Calculate total
    const basePrice = gift.giftPrice;
    const fee = coverFee ? calculateProcessingFee(basePrice) : 0;
    const totalInCents = Math.round((basePrice + fee) * 100);

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${baseUrl}/gift-drive/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gift-drive`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: totalInCents,
            product_data: {
              name: `Gift for ${gift.name} - ${gift.giftTitle}`,
              description: gift.giftDescription,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        gift_id: giftId,
        donor_email: donorEmail || '',
        fee_covered: coverFee ? 'true' : 'false',
        base_price: basePrice.toString(),
      },
      customer_email: donorEmail || undefined,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
