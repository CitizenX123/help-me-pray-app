-- Enhanced user_subscriptions table for multi-platform support
DROP TABLE IF EXISTS user_subscriptions CASCADE;

CREATE TABLE user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Platform identification
    platform TEXT NOT NULL CHECK (platform IN ('stripe', 'apple', 'google')),
    
    -- Stripe-specific fields
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Apple In-App Purchase fields
    apple_original_transaction_id TEXT,
    apple_transaction_id TEXT,
    apple_receipt_data TEXT,
    
    -- Google Play (future) fields
    google_purchase_token TEXT,
    google_order_id TEXT,
    
    -- Universal subscription fields
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
    plan_id TEXT NOT NULL DEFAULT 'free',
    product_id TEXT, -- Maps to Stripe price_id or Apple product identifier
    
    -- Subscription timing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    
    -- Pricing information
    amount INTEGER, -- In cents (USD)
    currency TEXT DEFAULT 'USD',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE (stripe_subscription_id),
    UNIQUE (apple_original_transaction_id),
    UNIQUE (google_purchase_token)
);

-- Indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_platform ON user_subscriptions(platform);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_user_subscriptions_apple_transaction_id ON user_subscriptions(apple_original_transaction_id) WHERE apple_original_transaction_id IS NOT NULL;

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's active subscription regardless of platform
CREATE OR REPLACE FUNCTION get_user_active_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    platform TEXT,
    status TEXT,
    plan_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        us.platform,
        us.status,
        us.plan_id,
        us.current_period_end,
        (us.status = 'active' AND us.current_period_end > NOW()) as is_active
    FROM user_subscriptions us
    WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
    AND (us.current_period_end IS NULL OR us.current_period_end > NOW())
    ORDER BY us.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;