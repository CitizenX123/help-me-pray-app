import getStripe, { SUBSCRIPTION_PLANS } from './stripeConfig';
import { supabase } from './supabaseClient';

// Platform detection
const getPlatform = () => {
  try {
    if (typeof window !== 'undefined') {
      // Check if running in Capacitor (iOS/Android app)
      if (window.Capacitor && window.Capacitor.getPlatform) {
        return window.Capacitor.getPlatform(); // returns 'ios', 'android', or 'web'
      }
      // Check user agent for iOS Safari
      if (navigator && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        return 'ios-web'; // iOS Safari (not app)
      }
    }
  } catch (error) {
    console.warn('Platform detection error:', error);
  }
  return 'web';
};

class UnifiedSubscriptionService {
  constructor() {
    this.stripe = null;
    this.platform = getPlatform();
    this.initStripe();
  }

  async initStripe() {
    try {
      if (this.platform === 'web' || this.platform === 'ios-web') {
        this.stripe = await getStripe();
      }
    } catch (error) {
      console.warn('Failed to initialize Stripe:', error);
      this.stripe = null;
    }
  }

  // Determine which payment method to use
  getPaymentMethod() {
    switch (this.platform) {
      case 'ios':
        return 'apple';
      case 'android':
        return 'google'; // Future Google Play Billing
      case 'web':
      case 'ios-web':
      default:
        return 'stripe';
    }
  }

  // Universal subscription upgrade method
  async upgradeToPremiun(userId, userEmail) {
    const paymentMethod = this.getPaymentMethod();
    
    switch (paymentMethod) {
      case 'stripe':
        return this.upgradeWithStripe(userId, userEmail);
      case 'apple':
        return this.upgradeWithApple(userId);
      case 'google':
        return this.upgradeWithGoogle(userId);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  // Stripe integration (existing)
  async upgradeWithStripe(userId, userEmail) {
    try {
      const session = await this.createStripeCheckoutSession(userId, userEmail);
      if (session.sessionId) {
        await this.redirectToStripeCheckout(session.sessionId);
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe upgrade failed:', error);
      throw error;
    }
  }

  // Apple In-App Purchase integration
  async upgradeWithApple(userId) {
    try {
      // Check if we're in a Capacitor environment before importing
      if (!window.Capacitor) {
        throw new Error('Apple In-App Purchase only available in mobile app');
      }
      
      // Import Capacitor Purchase plugin dynamically
      const { CapacitorPurchases } = await import('@revenuecat/purchases-capacitor');
      
      // Initialize RevenueCat (recommended for Apple IAP)
      await CapacitorPurchases.configure({
        apiKey: process.env.REACT_APP_REVENUECAT_API_KEY,
        appUserID: userId,
      });

      // Get available products
      const { products } = await CapacitorPurchases.getProducts({
        productIdentifiers: ['premium_monthly'], // Your Apple product ID
        type: 'SUBSCRIPTION'
      });

      if (products.length === 0) {
        throw new Error('No subscription products available');
      }

      // Purchase the subscription
      const { purchaserInfo } = await CapacitorPurchases.purchaseProduct({
        product: products[0]
      });

      // Sync with backend
      await this.syncAppleSubscription(userId, purchaserInfo);
      
      return { success: true, platform: 'apple' };
    } catch (error) {
      console.error('Apple IAP upgrade failed:', error);
      throw error;
    }
  }

  // Google Play Billing (future implementation)
  async upgradeWithGoogle(userId) {
    // TODO: Implement Google Play Billing
    throw new Error('Google Play Billing not yet implemented');
  }

  // Stripe methods (existing, updated)
  async createStripeCheckoutSession(userId, userEmail) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: SUBSCRIPTION_PLANS.PREMIUM.priceId,
          userId,
          userEmail,
          successUrl: `${window.location.origin}/subscription-success`,
          cancelUrl: `${window.location.origin}/subscription-canceled`,
        }),
      });

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async redirectToStripeCheckout(sessionId) {
    if (!this.stripe) {
      await this.initStripe();
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  // Apple subscription sync
  async syncAppleSubscription(userId, purchaserInfo) {
    try {
      const response = await fetch('/api/sync-apple-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          purchaserInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync Apple subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing Apple subscription:', error);
      throw error;
    }
  }

  // Universal subscription status check
  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_active_subscription', { user_uuid: userId });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Universal premium status check
  async isUserPremium(userId) {
    const subscription = await this.getUserSubscription(userId);
    return subscription?.is_active || false;
  }

  // Universal subscription cancellation
  async cancelSubscription(userId) {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    switch (subscription.platform) {
      case 'stripe':
        return this.cancelStripeSubscription(subscription.stripe_subscription_id);
      case 'apple':
        return this.cancelAppleSubscription(userId);
      case 'google':
        return this.cancelGoogleSubscription(userId);
      default:
        throw new Error('Unsupported subscription platform');
    }
  }

  async cancelStripeSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error canceling Stripe subscription:', error);
      throw error;
    }
  }

  async cancelAppleSubscription(userId) {
    // Apple subscriptions are canceled through the App Store
    // We can only provide instructions to the user
    return {
      success: true,
      message: 'To cancel your Apple subscription, go to Settings > Apple ID > Subscriptions on your iPhone.',
      platform: 'apple'
    };
  }

  // Platform detection helpers
  isAppleDevice() {
    return this.platform === 'ios';
  }

  isWebPlatform() {
    return this.platform === 'web' || this.platform === 'ios-web';
  }

  shouldShowStripeUpgrade() {
    return this.isWebPlatform();
  }

  shouldShowAppleUpgrade() {
    return this.isAppleDevice();
  }

  // Get subscription plans
  getSubscriptionPlans() {
    return SUBSCRIPTION_PLANS;
  }
}

const unifiedSubscriptionService = new UnifiedSubscriptionService();
export default unifiedSubscriptionService;