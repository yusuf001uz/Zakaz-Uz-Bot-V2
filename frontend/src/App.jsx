import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import Header from './components/Header';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import History from './pages/History';
import PricingModal from './components/PricingModal';

function AppContent() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [canCreateOrder, setCanCreateOrder] = useState(true);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Sync theme
    document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#1a1a1a');
    document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-hint-color', WebApp.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color || '#3390ec');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', WebApp.themeParams.secondary_bg_color || '#2a2a2a');

    // Avtomatik ro'yxatdan o'tkazish va ma'lumotlarni yuklash
    autoRegisterAndInit();
  }, []);

  const autoRegisterAndInit = async () => {
    try {
      const initData = WebApp.initData || '';

      // 1-bosqich: Avtomatik registration / login
      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Telegram-Init-Data': initData
        }
      });

      if (regResponse.ok) {
        const userData = await regResponse.json();
        setUser(userData);
      }

      // 2-bosqich: Check / status yuklash
      const checkResponse = await fetch('/api/auth/check', {
        headers: {
          'Telegram-Init-Data': initData
        }
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        setOrdersCount(checkData.orders_count || 0);
      }

      // 3-bosqich: Profil va subscription ma'lumotlarini yuklash
      await fetchUserData();
    } catch (error) {
      console.error('Auto register/init failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const initData = WebApp.initData || '';
      const response = await fetch('/api/me', {
        headers: {
          'Telegram-Init-Data': initData
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) setUser(data.user);
        setSubscription(data.subscription || null);
        setCanCreateOrder(data.can_create_order ?? true);

        if (data.can_create_order === false && !data.subscription) {
          setIsPricingModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleSubscribe = async (tier, duration) => {
    try {
      const initData = WebApp.initData || '';
      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Telegram-Init-Data': initData
        },
        body: JSON.stringify({ tier, duration_days: duration })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        setCanCreateOrder(true);
        setIsPricingModalOpen(false);
        WebApp.showAlert('Subscription activated successfully!');
        fetchUserData();
      } else {
        WebApp.showAlert('Failed to activate subscription');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      WebApp.showAlert('Failed to activate subscription');
    }
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      const initData = WebApp.initData || '';
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Telegram-Init-Data': initData
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        WebApp.showAlert('Order submitted successfully!');
        setOrdersCount(prev => prev + 1);
        fetchUserData();
      } else if (response.status === 403) {
        setIsPricingModalOpen(true);
      } else {
        WebApp.showAlert('Failed to submit order');
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      WebApp.showAlert('Failed to submit order');
    }
  };

  // Yuklanish jarayonidagi ekran
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Header
        freeOrdersLeft={user?.free_orders_left ?? 10}
        subscription={subscription}
      />

      <nav className="bg-[#1a1a1a] border-b border-[#333] px-2 py-3 sticky top-0 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center px-4 py-2 rounded-xl transition-all hover:bg-[#2a2a2a] group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-white transition-colors">Home</span>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="flex flex-col items-center px-4 py-2 rounded-xl transition-all hover:bg-[#2a2a2a] group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">💎</span>
            <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-white transition-colors">Pricing</span>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex flex-col items-center px-4 py-2 rounded-xl transition-all hover:bg-[#2a2a2a] group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
            <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-white transition-colors">History</span>
          </button>
          <button
            onClick={() => WebApp.openTelegramLink('https://t.me/yusuf_coder_uz')}
            className="flex flex-col items-center px-4 py-2 rounded-xl transition-all hover:bg-[#2a2a2a] group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
            <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-white transition-colors">Support</span>
          </button>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Home onSubmitOrder={handleSubmitOrder} canCreateOrder={canCreateOrder} ordersCount={ordersCount} />}
        />
        <Route
          path="/pricing"
          element={<Pricing onSubscribe={handleSubscribe} />}
        />
        <Route
          path="/history"
          element={<History />}
        />
      </Routes>

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;