const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = req.body;

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            userId: userId,
          },
        });
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      throw error;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ 
      error: 'Error creating checkout session',
      message: err.message 
    });
  }
}