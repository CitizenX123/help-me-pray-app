const { createClient } = require('@supabase/supabase-js');

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
    const { userId, purchaserInfo } = req.body;

    if (!userId || !purchaserInfo) {
      res.status(400).json({ error: 'Missing userId or purchaserInfo' });
      return;
    }

    // Extract subscription info from RevenueCat purchaserInfo
    const activeSubscriptions = purchaserInfo.activeSubscriptions || [];
    const entitlements = purchaserInfo.entitlements || {};
    
    // Check if user has premium entitlement
    const hasPremium = entitlements.premium && entitlements.premium.isActive;
    
    if (hasPremium && activeSubscriptions.length > 0) {
      // Find the premium subscription
      const premiumSubscription = activeSubscriptions.find(sub => 
        sub.productIdentifier === 'premium_monthly' // Your Apple product ID
      );

      if (premiumSubscription) {
        await upsertAppleSubscription({
          userId,
          originalTransactionId: premiumSubscription.originalTransactionId,
          transactionId: premiumSubscription.transactionId,
          productId: premiumSubscription.productIdentifier,
          status: 'active',
          currentPeriodStart: new Date(premiumSubscription.originalPurchaseDate),
          currentPeriodEnd: new Date(premiumSubscription.expirationDate),
          platform: 'apple'
        });

        res.status(200).json({ 
          success: true, 
          message: 'Apple subscription synced successfully',
          isPremium: true
        });
      } else {
        res.status(200).json({ 
          success: true, 
          message: 'No premium subscription found',
          isPremium: false
        });
      }
    } else {
      // User doesn't have active premium subscription
      await deactivateAppleSubscription(userId);
      
      res.status(200).json({ 
        success: true, 
        message: 'No active premium subscription',
        isPremium: false
      });
    }
  } catch (error) {
    console.error('Error syncing Apple subscription:', error);
    res.status(500).json({ 
      error: 'Error syncing subscription',
      message: error.message 
    });
  }
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
      plan_id: 'premium',
      current_period_start: subscriptionData.currentPeriodStart.toISOString(),
      current_period_end: subscriptionData.currentPeriodEnd.toISOString(),
      amount: 499, // $4.99 in cents
      currency: 'USD',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    });

  if (error) {
    console.error('Error upserting Apple subscription:', error);
    throw error;
  }
}

async function deactivateAppleSubscription(userId) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'inactive',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('platform', 'apple');

  if (error) {
    console.error('Error deactivating Apple subscription:', error);
    throw error;
  }
}