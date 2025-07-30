import getStripe, { SUBSCRIPTION_PLANS } from './stripeConfig';
import { supabase } from './supabaseClient';

class SubscriptionService {
  constructor() {
    this.stripe = null;
    this.initStripe();
  }

  async initStripe() {
    this.stripe = await getStripe();
  }

  // Create checkout session for premium subscription
  async createCheckoutSession(userId, userEmail) {
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
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
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

  // Get user's subscription status from Supabase
  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Update user subscription status
  async updateUserSubscription(userId, subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: subscriptionData.customerId,
          stripe_subscription_id: subscriptionData.subscriptionId,
          status: subscriptionData.status,
          plan_id: subscriptionData.planId,
          current_period_start: subscriptionData.currentPeriodStart,
          current_period_end: subscriptionData.currentPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  }

  // Check if user has active premium subscription
  async isUserPremium(userId) {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) return false;
    
    // Check if subscription is active and not expired
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    
    return subscription.status === 'active' && periodEnd > now;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
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
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get subscription plans
  getSubscriptionPlans() {
    return SUBSCRIPTION_PLANS;
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;