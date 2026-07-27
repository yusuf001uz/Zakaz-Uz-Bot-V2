import React, { useState, useEffect } from 'react';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const initData = window.Telegram.WebApp.initData;
      const response = await fetch('/api/orders', {
        headers: {
          'Telegram-Init-Data': initData
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          gradient: 'from-amber-400 to-amber-600',
          icon: '⏳',
          text: 'Pending'
        };
      case 'in_progress':
        return {
          gradient: 'from-blue-400 to-blue-600',
          icon: '🔄',
          text: 'In Progress'
        };
      case 'completed':
        return {
          gradient: 'from-emerald-400 to-emerald-600',
          icon: '✅',
          text: 'Completed'
        };
      default:
        return {
          gradient: 'from-gray-400 to-gray-600',
          icon: '📋',
          text: status
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[var(--tg-theme-button-color)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-[var(--tg-theme-text-color)]">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] p-5">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--tg-theme-text-color)] mb-1">
          📋 Order History
        </h1>
        <p className="text-sm text-[var(--tg-theme-hint-color)]">
          Track your project progress
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[var(--tg-theme-secondary-bg-color)] to-[var(--tg-theme-hint-color)] rounded-full flex items-center justify-center">
            <span className="text-5xl">📭</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--tg-theme-text-color)] mb-2">
            No Orders Yet
          </h3>
          <p className="text-[var(--tg-theme-hint-color)]">
            Start by creating your first order!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            
            return (
              <div
                key={order.id}
                className="bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      order.order_type === 'bot' 
                        ? 'from-blue-500 to-blue-600' 
                        : 'from-purple-500 to-purple-600'
                    } flex items-center justify-center text-2xl shadow-lg`}>
                      {order.order_type === 'bot' ? '🤖' : '🌐'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--tg-theme-text-color)]">
                        {order.order_type === 'bot' ? 'Telegram Bot' : 'Website'}
                      </h3>
                      <p className="text-xs text-[var(--tg-theme-hint-color)]">
                        Order #{order.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`bg-gradient-to-r ${statusConfig.gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}
                  >
                    {statusConfig.icon} {statusConfig.text}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--tg-theme-text-color)] mb-3 line-clamp-2">
                  {order.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-[var(--tg-theme-hint-color)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
