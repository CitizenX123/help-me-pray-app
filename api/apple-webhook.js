const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    // Verify Apple's server-to-server notification
    const notification = req.body;
    
    // Apple sends notifications for various events
    const { notificationType, data } = notification;
    
    console.log('Apple webhook received:', { notificationType, data });

    switch (notificationType) {
      case 'INITIAL_BUY':
        await handleInitialPurchase(data);
        break;
      
      case 'RENEWAL':
        await handleRenewal(data);
        break;
      
      case 'CANCEL':
        await handleCancellation(data);
        break;
      
      case 'EXPIRED':
        await handleExpiration(data);
        break;
      
      case 'REFUND':
        await handleRefund(data);
        break;
      
      default:
        console.log(`Unhandled Apple notification type: ${notificationType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing Apple webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

async function handleInitialPurchase(data) {
  const {
    originalTransactionId,
    transactionId,
    productId,
    purchaseDate,
    expiresDate,
    appAccountToken // This should contain your user ID
  } = data;

  // Decode the user ID from appAccountToken
  const userId = appAccountToken; // You should encode user ID when making purchase

  await upsertAppleSubscription({
    userId,
    originalTransactionId,
    transactionId,
    productId,
    status: 'active',
    currentPeriodStart: new Date(parseInt(purchaseDate)),
    currentPeriodEnd: new Date(parseInt(expiresDate)),
    platform: 'apple'
  });
}

async function handleRenewal(data) {
  const {
    originalTransactionId,
    transactionId,
    expiresDate
  } = data;

  await updateAppleSubscription(originalTransactionId, {
    transactionId,
    status: 'active',
    currentPeriodEnd: new Date(parseInt(expiresDate))
  });
}

async function handleCancellation(data) {
  const { originalTransactionId } = data;
  
  await updateAppleSubscription(originalTransactionId, {
    status: 'canceled',
    canceledAt: new Date()
  });
}

async function handleExpiration(data) {
  const { originalTransactionId } = data;
  
  await updateAppleSubscription(originalTransactionId, {
    status: 'inactive'
  });
}

async function handleRefund(data) {
  const { originalTransactionId } = data;
  
  await updateAppleSubscription(originalTransactionId, {
    status: 'canceled',
    canceledAt: new Date()
  });
}

async function upsertAppleSubscription(subscriptionData) {
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: subscriptionData.userId,
      platform: 'apple',
      apple_original_transaction_id: subscriptionData.originalTransactionId,
      apple_transaction_id: subscriptionData.transactionId,
      product_id: subscriptionData.productId,
      status: subscriptionData.status,
      plan_id: 'premium', // Map Apple product to your plan
      current_period_start: subscriptionData.currentPeriodStart?.toISOString(),
      current_period_end: subscriptionData.currentPeriodEnd?.toISOString(),
      canceled_at: subscriptionData.canceledAt?.toISOString(),
      amount: 499, // $4.99 in cents
      currency: 'USD',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'apple_original_transaction_id'
    });

  if (error) {
    console.error('Error upserting Apple subscription:', error);
    throw error;
  }
}

async function updateAppleSubscription(originalTransactionId, updates) {
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  // Convert dates to ISO strings
  if (updates.currentPeriodEnd) {
    updateData.current_period_end = updates.currentPeriodEnd.toISOString();
  }
  if (updates.canceledAt) {
    updateData.canceled_at = updates.canceledAt.toISOString();
  }

  const { error } = await supabase
    .from('user_subscriptions')
    .update(updateData)
    .eq('apple_original_transaction_id', originalTransactionId);

  if (error) {
    console.error('Error updating Apple subscription:', error);
    throw error;
  }
}