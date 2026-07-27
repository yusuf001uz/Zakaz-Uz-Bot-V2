import React, { useState, useEffect } from 'react';

const PricingModal = ({ isOpen, onClose, onSubscribe, loadingTier }) => {
  const [duration, setDuration] = useState(31);
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    fetch('/api/subscriptions/pricing')
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error('Failed to fetch pricing:', err));
  }, []);

  if (!isOpen || !pricing) return null;

  const tiers = [
    {
      id: 'oddiy',
      name: 'Oddiy',
      description: 'Standard limits',
      features: ['30 orders/month', 'Basic support'],
      price: pricing.oddiy[365],
      availableDurations: [365],
      gradient: 'from-gray-500 to-gray-600',
      icon: '📦'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals',
      features: ['100 orders/month', 'Priority support', 'Fast delivery'],
      price: pricing.pro[duration],
      availableDurations: [31, 365],
      gradient: 'from-blue-500 to-blue-600',
      icon: '⚡'
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'For growing teams',
      features: ['300 orders/month', '24/7 support', 'Custom features'],
      price: pricing.plus[duration],
      availableDurations: [31, 365],
      gradient: 'from-purple-500 to-purple-600',
      icon: '🚀'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Unlimited everything',
      features: ['Unlimited orders', 'VIP support', 'Custom development'],
      price: pricing.premium[duration],
      availableDurations: [31, 365],
      gradient: 'from-amber-400 to-amber-600',
      icon: '⭐'
    }
  ];

  const handleSubscribe = (tier) => {
    onSubscribe(tier, duration);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#2a2a2a] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                💎 Choose Your Plan
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Unlock more features with our subscription plans
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white hover:bg-[#333] transition-all flex items-center justify-center text-xl"
            >
              ×
            </button>
          </div>

          {/* Duration Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#1a1a1a] rounded-2xl p-1.5 flex shadow-lg">
              <button
                onClick={() => setDuration(31)}
                disabled={loadingTier !== null}
                className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                  duration === 31
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                31 Days
              </button>
              <button
                onClick={() => setDuration(365)}
                disabled={loadingTier !== null}
                className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                  duration === 365
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                1 Year
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiers.map((tier) => {
              if (!tier.availableDurations.includes(duration)) return null;
              
              const isPremium = tier.id === 'premium';
              const isLoading = loadingTier === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`relative border-2 rounded-2xl p-5 transition-all hover:scale-105 ${
                    isPremium 
                      ? 'border-amber-400 bg-gradient-to-br from-amber-900/20 to-amber-800/20' 
                      : 'border-[#333] bg-[#1a1a1a] hover:border-blue-500'
                  }`}
                >
                  {isPremium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        ⭐ POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {tier.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                      {tier.price.toLocaleString()} UZS
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      /{duration === 31 ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  <ul className="space-y-2 mb-5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-white flex items-center">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isLoading || loadingTier !== null}
                    className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
