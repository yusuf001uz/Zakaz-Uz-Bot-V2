import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import PricingModal from '../components/PricingModal';

const Pricing = ({ onSubscribe }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [loadingTier, setLoadingTier] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/subscriptions/pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error('Failed to fetch pricing:', err));
  }, []);

  const handleSubscribe = async (tier, duration) => {
    setLoadingTier(tier);
    setError(null);
    
    try {
      const initData = WebApp.initData;
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Telegram-Init-Data': initData
        },
        body: JSON.stringify({ tier, duration_days: duration })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          WebApp.showAlert('Subscription activated successfully!');
          onSubscribe(tier, duration);
          setIsModalOpen(false);
        } else {
          setError(data.message || 'Payment failed');
          WebApp.showAlert(data.message || 'Payment failed');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Payment failed');
        WebApp.showAlert(errorData.detail || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Network error. Please try again.');
      WebApp.showAlert('Network error. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers = [
    {
      id: 'oddiy',
      name: 'Oddiy',
      description: 'Standard limits',
      features: ['30 orders/month', 'Basic support'],
      monthlyPrice: null,
      yearlyPrice: 25000,
      gradient: 'from-gray-500 to-gray-600',
      icon: '📦'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals',
      features: ['100 orders/month', 'Priority support', 'Fast delivery'],
      monthlyPrice: 15000,
      yearlyPrice: 30000,
      gradient: 'from-blue-500 to-blue-600',
      icon: '⚡'
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'For growing teams',
      features: ['300 orders/month', '24/7 support', 'Custom features'],
      monthlyPrice: 25000,
      yearlyPrice: 50000,
      gradient: 'from-purple-500 to-purple-600',
      icon: '🚀'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Unlimited everything',
      features: ['Unlimited orders', 'VIP support', 'Custom development'],
      monthlyPrice: 50000,
      yearlyPrice: 100000,
      gradient: 'from-amber-400 to-amber-600',
      icon: '⭐',
      isPopular: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            💎 Pricing Plans
          </h1>
          <p className="text-gray-400">
            Choose the perfect plan for your needs
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative border-2 rounded-3xl p-6 transition-all hover:scale-105 ${
                tier.isPopular 
                  ? 'border-amber-400 bg-gradient-to-br from-amber-900/20 to-amber-800/20 shadow-2xl' 
                  : 'border-[#333] bg-[#2a2a2a] hover:border-[var(--tg-theme-button-color)] shadow-lg'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-3xl shadow-xl`}>
                  {tier.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {tier.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {tier.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-5">
                {tier.monthlyPrice && (
                  <div className="mb-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                      {tier.monthlyPrice.toLocaleString()} UZS
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      /month
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    {tier.yearlyPrice.toLocaleString()} UZS
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    /year
                  </span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-white flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs mr-3 flex-shrink-0">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {tier.id === 'oddiy' ? (
                <button
                  onClick={() => handleSubscribe('oddiy', 365)}
                  disabled={loadingTier === 'oddiy'}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingTier === 'oddiy' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={loadingTier !== null}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Choose Plan
                </button>
              )}
            </div>
          ))}
        </div>

        <PricingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubscribe={handleSubscribe}
          loadingTier={loadingTier}
        />
      </div>
    </div>
  );
};

export default Pricing;
