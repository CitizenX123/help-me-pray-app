const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (session.mode === 'subscription') {
    // Retrieve subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    await updateUserSubscription(userId, {
      customerId,
      subscriptionId,
      status: subscription.status,
      planId: 'premium',
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  await updateSubscriptionFromStripe(subscription);
}

async function handleInvoicePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  await updateSubscriptionFromStripe(subscription);
}

async function handleSubscriptionUpdated(subscription) {
  await updateSubscriptionFromStripe(subscription);
}

async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating canceled subscription:', error);
    throw error;
  }
}

async function updateSubscriptionFromStripe(subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

async function updateUserSubscription(userId, subscriptionData) {
  const { error } = await supabase
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
    });

  if (error) {
    console.error('Error upserting user subscription:', error);
    throw error;
  }
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}