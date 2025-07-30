import React, { useState } from 'react';
import { X, Check, Crown, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from './stripeConfig';
import { useSubscription } from './SubscriptionContext';

const PremiumUpgradeModal = ({ isOpen, onClose }) => {
  const { upgradeToPremiun } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await upgradeToPremiun();
    } catch (err) {
      setError(err.message || 'Failed to start upgrade process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '480px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            color: '#6b7280'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            marginBottom: '16px'
          }}>
            <Crown size={32} color="white" />
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Upgrade to Premium
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Unlock unlimited prayers and premium features
          </p>
        </div>

        {/* Pricing */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px', fontWeight: '700' }}>
            ${SUBSCRIPTION_PLANS.PREMIUM.price}
          </div>
          <div style={{ fontSize: '16px', opacity: 0.9 }}>
            per month
          </div>
        </div>

        {/* Features comparison */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Free column */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                Free
              </h3>
              {SUBSCRIPTION_PLANS.FREE.features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <Check size={16} style={{ marginRight: '8px', color: '#9ca3af' }} />
                  {feature}
                </div>
              ))}
            </div>

            {/* Premium column */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#6366f1',
                marginBottom: '16px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Zap size={18} />
                Premium
              </h3>
              {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <Check size={16} style={{ marginRight: '8px', color: '#10b981' }} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexDirection: 'column'
        }}>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </>
            ) : (
              <>
                <Crown size={18} />
                Upgrade to Premium
              </>
            )}
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Cancel anytime. Secure payment processed by Stripe.
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PremiumUpgradeModal;