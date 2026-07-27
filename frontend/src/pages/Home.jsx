import React from 'react';
import OrderForm from '../components/OrderForm';

const Home = ({ onSubmitOrder, canCreateOrder, ordersCount }) => {
  const showEmptyState = ordersCount === 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-2xl mx-auto p-5">
        {showEmptyState && (
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-6 mb-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl">📭</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Hali buyurtmalar yo'q
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sizda 10 ta tekin buyurtma limiti mavjud. Birinchi buyurtmangizni berish uchun pastdagi formadan foydalaning.
            </p>
          </div>
        )}
        
        <OrderForm onSubmit={onSubmitOrder} canCreateOrder={canCreateOrder} />
      </div>
    </div>
  );
};

export default Home;
