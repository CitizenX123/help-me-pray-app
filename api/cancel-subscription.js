const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      res.status(400).json({ error: 'Subscription ID is required' });
      return;
    }

    // Cancel the subscription at the end of the current period
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.status(200).json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: subscription.current_period_end,
      },
    });
  } catch (err) {
    console.error('Error canceling subscription:', err);
    res.status(500).json({ 
      error: 'Error canceling subscription',
      message: err.message 
    });
  }
}