import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import unifiedSubscriptionService from './UnifiedSubscriptionService';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children, user }) => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const loadSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const userSubscription = await unifiedSubscriptionService.getUserSubscription(user.id);
      setSubscription(userSubscription);
      
      if (userSubscription) {
        const premium = await unifiedSubscriptionService.isUserPremium(user.id);
        setIsPremium(premium);
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !user.isGuest) {
      loadSubscription();
    } else {
      setSubscription(null);
      setIsPremium(false);
      setIsLoading(false);
    }
  }, [user, loadSubscription]);

  const upgradeToPremiun = async () => {
    try {
      if (!user || user.isGuest) {
        throw new Error('Must be logged in to upgrade');
      }

      await unifiedSubscriptionService.upgradeToPremiun(user.id, user.email);
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      await unifiedSubscriptionService.cancelSubscription(user.id);
      await loadSubscription(); // Reload subscription data
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const value = {
    subscription,
    isPremium,
    isLoading,
    upgradeToPremiun,
    cancelSubscription,
    refreshSubscription: loadSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};