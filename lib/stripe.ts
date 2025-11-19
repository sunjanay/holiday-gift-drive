import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors when env vars are not set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export for backward compatibility - will throw at runtime if env var missing
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

export const PROCESSING_FEE_RATE = 0.03; // 3% Stripe fee

export function calculateProcessingFee(priceInDollars: number): number {
  return Math.round(priceInDollars * PROCESSING_FEE_RATE * 100) / 100;
}
