import React, { useState } from 'react';
import WebApp from '@twa-dev/sdk';

const Registration = ({ onRegister }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await onRegister();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Xush kelibsiz!
          </h1>
          <p className="text-gray-400">
            Zakaz Bot UZ ga ro'yxatdan o'ting
          </p>
        </div>

        <div className="bg-[#2a2a2a] rounded-3xl p-6 shadow-2xl mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-white font-semibold">10 ta tekin buyurtma</p>
                <p className="text-gray-400 text-sm">Boshlang'ich bonus</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-white font-semibold">Tezkor buyurtma</p>
                <p className="text-gray-400 text-sm">Bot va veb-sayt yaratish</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl">
              <span className="text-2xl">💎</span>
              <div>
                <p className="text-white font-semibold">Premium tariflar</p>
                <p className="text-gray-400 text-sm">Cheksiz imkoniyatlar</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Ro'yxatdan o'tilmoqda...
            </span>
          ) : (
            '🚀 Ro\'yxatdan o\'tish'
          )}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Ro'yxatdan o'tish orqali foydalanish shartlariga rozilik bildirasiz
        </p>
      </div>
    </div>
  );
};

export default Registration;
