import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ freeOrdersLeft, subscription }) => {
  const getProgressPercentage = () => {
    if (subscription) {
      return 100;
    }
    return (freeOrdersLeft / 10) * 100;
  };

  const getProgressColor = () => {
    if (subscription) {
      return 'from-emerald-400 to-emerald-600';
    }
    const percentage = getProgressPercentage();
    if (percentage > 50) return 'from-emerald-400 to-emerald-600';
    if (percentage > 25) return 'from-amber-400 to-amber-600';
    return 'from-rose-400 to-rose-600';
  };

  const getTierBadge = () => {
    if (!subscription) return null;
    
    const tierColors = {
      'oddiy': 'from-gray-500 to-gray-600',
      'pro': 'from-blue-500 to-blue-600',
      'plus': 'from-purple-500 to-purple-600',
      'premium': 'from-amber-400 to-amber-600'
    };
    
    return (
      <div className={`bg-gradient-to-r ${tierColors[subscription.tier] || 'from-blue-500 to-blue-600'} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
        {subscription.tier.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] border-b border-[#333] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Zakaz Bot Logo" 
            className="w-12 h-12 rounded-xl object-contain shadow-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-white">
              ꗄ ズ丹Ｋ丹乙 乃口匕 ꗄ
            </h1>
            <p className="text-xs text-gray-400">Bot & Website Orders</p>
          </div>
        </div>
        {getTierBadge()}
      </div>
      
      <div className="bg-[#2a2a2a] rounded-2xl p-4 shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-white">
            {subscription 
              ? '♾️ Unlimited Orders' 
              : `${freeOrdersLeft}/10 Free Orders`
            }
          </span>
          {!subscription && (
            <span className="text-sm font-bold text-[var(--tg-theme-button-color)]">
              {Math.round(getProgressPercentage())}%
            </span>
          )}
        </div>
        {!subscription && (
          <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out shadow-lg`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
