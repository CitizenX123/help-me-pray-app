# 🚀 Unified Subscription System Setup Guide

This guide will help you set up a unified subscription system that supports both Stripe (web) and Apple In-App Purchases (iOS app).

## 🏗️ Architecture Overview

Your app now automatically detects the platform and uses the appropriate payment method:

- **Web/PWA**: Stripe (3% fees) - Better for you!
- **iOS App**: Apple In-App Purchase (30% fees) - Required by Apple
- **Future**: Google Play Billing support ready

## 📋 Setup Checklist

### 1. Database Migration
Run this SQL in your Supabase dashboard:

```sql
-- Copy and paste the contents of unified_subscription_migration.sql
-- This creates the enhanced subscription table with multi-platform support
```

### 2. Stripe Setup (Web Payments)

1. **Create Stripe Account**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)

2. **Create Premium Product**:
   - Go to Products → Add Product
   - Name: "Help Me Pray Premium"
   - Price: $4.99/month recurring
   - Save and copy the Price ID

3. **Get API Keys**:
   - Go to Developers → API Keys
   - Copy Publishable Key and Secret Key

4. **Set up Webhooks**:
   - Go to Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.vercel.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 3. Apple In-App Purchase Setup

1. **Apple Developer Account**: You need a paid Apple Developer membership

2. **App Store Connect Setup**:
   - Create your app in App Store Connect
   - Go to Features → In-App Purchases
   - Create a subscription product:
     - Product ID: `premium_monthly`
     - Type: Auto-Renewable Subscription
     - Price: $4.99/month

3. **RevenueCat Setup** (Recommended):
   - Sign up at [https://www.revenuecat.com](https://www.revenuecat.com)
   - Create a project and add your iOS app
   - Configure Apple App Store integration
   - Copy your RevenueCat API key

### 4. Environment Variables

Update your `.env` file with all the keys:

```env
# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Apple IAP
REACT_APP_REVENUECAT_API_KEY=your_revenuecat_key

# Supabase (existing)
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 5. iOS App Configuration

Add to your `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.helpmepraying.app',
  appName: 'Help Me Pray',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
```

## 🔄 How It Works

### Platform Detection
The app automatically detects where it's running:
- **iOS App**: Uses Apple In-App Purchase
- **Web/PWA**: Uses Stripe checkout
- **Android** (future): Will use Google Play Billing

### Subscription Sync
All subscriptions are stored in the same Supabase table with a `platform` field:
- Stripe webhooks update subscription status
- Apple server-to-server notifications sync IAP status
- Frontend shows unified premium status regardless of platform

### Revenue Optimization
- Web users pay lower fees (3% vs 30%)
- iOS users see a tip to subscribe on web for savings
- You maximize revenue while staying App Store compliant

## 🧪 Testing

### Stripe Testing
Use test card: `4242 4242 4242 4242`

### Apple IAP Testing
1. Create sandbox test users in App Store Connect
2. Use sandbox accounts on device for testing
3. Test subscription flow in TestFlight

## 🚀 Deployment

1. **Deploy to Vercel** with environment variables
2. **Update webhook URLs** in Stripe and Apple
3. **Submit iOS app** to App Store for review

## 💡 Revenue Strategy

This setup gives you the best of both worlds:
- **Lower fees for web users** (encourage web signups)
- **App Store compliance** for iOS distribution
- **Unified user experience** across platforms
- **Maximum revenue optimization**

## 🆘 Support

If you need help with any step:
1. Check the console for error messages
2. Verify all environment variables are set
3. Test webhooks using Stripe CLI or Apple's validator
4. Check Supabase logs for database issues

## 🎯 Next Steps

Once this is working:
1. Add annual subscription tiers for better retention
2. Implement Google Play Billing for Android
3. Add subscription management UI
4. Set up analytics to track conversion rates by platform

---

**Ready to maximize your revenue while keeping users happy!** 🎉