import React, { useState } from 'react';

const OrderForm = ({ onSubmit, canCreateOrder }) => {
  const [title, setTitle] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [orderType, setOrderType] = useState('bot');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreateOrder) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        logo_url: logoUrl,
        order_type: orderType,
        budget,
        deadline,
        description
      });
      // Muvaffaqiyatli yuborilgach, formani tozalash
      setTitle('');
      setLogoUrl('');
      setBudget('');
      setDeadline('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--tg-theme-bg-color)] p-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--tg-theme-text-color)] mb-1">
          🚀 Create New Order
        </h2>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Fill in the details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Title Input */}
        <div>
          <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-2">
            📌 Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. E-Commerce Telegram Bot"
            className="w-full p-4 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] placeholder-[var(--tg-theme-hint-color)] border-2 border-transparent focus:border-[var(--tg-theme-button-color)] focus:outline-none transition-all shadow-inner"
            required
            disabled={!canCreateOrder}
          />
        </div>

        {/* Project Logo URL Input */}
        <div>
          <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-2">
            🖼 Project Logo URL (Optional)
          </label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full p-4 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] placeholder-[var(--tg-theme-hint-color)] border-2 border-transparent focus:border-[var(--tg-theme-button-color)] focus:outline-none transition-all shadow-inner"
            disabled={!canCreateOrder}
          />
        </div>

        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-3">
            What do you need?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderType('bot')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                orderType === 'bot'
                  ? 'border-[var(--tg-theme-button-color)] bg-gradient-to-br from-[var(--tg-theme-button-color)]/10 to-blue-600/10 shadow-lg scale-105'
                  : 'border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-secondary-bg-color)] hover:border-[var(--tg-theme-hint-color)]'
              }`}
            >
              <div className="text-4xl mb-2">🤖</div>
              <div className="font-semibold text-[var(--tg-theme-text-color)]">Telegram Bot</div>
              <div className="text-xs text-[var(--tg-theme-hint-color)] mt-1">AI-powered automation</div>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('website')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                orderType === 'website'
                  ? 'border-[var(--tg-theme-button-color)] bg-gradient-to-br from-[var(--tg-theme-button-color)]/10 to-blue-600/10 shadow-lg scale-105'
                  : 'border-[var(--tg-theme-secondary-bg-color)] bg-[var(--tg-theme-secondary-bg-color)] hover:border-[var(--tg-theme-hint-color)]'
              }`}
            >
              <div className="text-4xl mb-2">🌐</div>
              <div className="font-semibold text-[var(--tg-theme-text-color)]">Website</div>
              <div className="text-xs text-[var(--tg-theme-hint-color)] mt-1">Modern web development</div>
            </button>
          </div>
        </div>

        {/* Budget & Deadline Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-2">
              💰 Budget
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $200 or Negotiable"
              className="w-full p-4 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] placeholder-[var(--tg-theme-hint-color)] border-2 border-transparent focus:border-[var(--tg-theme-button-color)] focus:outline-none transition-all shadow-inner"
              disabled={!canCreateOrder}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-2">
              ⏰ Deadline
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 5 days"
              className="w-full p-4 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] placeholder-[var(--tg-theme-hint-color)] border-2 border-transparent focus:border-[var(--tg-theme-button-color)] focus:outline-none transition-all shadow-inner"
              disabled={!canCreateOrder}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[var(--tg-theme-text-color)] mb-3">
            Project Details (ТЗ)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project requirements, features, and any specific needs..."
            className="w-full p-4 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] placeholder-[var(--tg-theme-hint-color)] border-2 border-transparent focus:border-[var(--tg-theme-button-color)] focus:outline-none resize-none h-36 transition-all shadow-inner"
            required
            disabled={!canCreateOrder}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canCreateOrder || isSubmitting}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
            canCreateOrder && !isSubmitting
              ? 'bg-gradient-to-r from-[var(--tg-theme-button-color)] to-blue-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-hint-color)] cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            '🚀 Submit Order'
          )}
        </button>

        {!canCreateOrder && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Order Limit Reached
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  You've reached your order limit. Upgrade your subscription to continue.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderForm;