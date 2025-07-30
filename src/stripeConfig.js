import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (you'll need to replace this with your actual key)
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise && stripePublishableKey && stripePublishableKey !== 'pk_test_your_publishable_key_here') {
    try {
      stripePromise = loadStripe(stripePublishableKey);
    } catch (error) {
      console.warn('Failed to initialize Stripe:', error);
      return null;
    }
  }
  return stripePromise;
};

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 prayers per day',
      'Basic voice synthesis',
      'Standard prayer categories'
    ],
    dailyLimit: 3
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    priceId: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    features: [
      'Unlimited prayers',
      'Premium voice synthesis (ElevenLabs)',
      'Custom prayer creation',
      'Prayer history & collections',
      'Priority support'
    ],
    dailyLimit: null
  }
};

export default getStripe;