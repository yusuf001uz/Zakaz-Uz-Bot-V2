// frontend/src/pages/Auth.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onAuthSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const initData = window.Telegram?.WebApp?.initData || "mock_init_data";

      // Backend Telegram-Init-Data header'ini kutmoqda
      const response = await axios.post('/api/auth/register', {}, {
        headers: {
          'Telegram-Init-Data': initData
        }
      });

      if (response.data) {
        if (onAuthSuccess) {
          onAuthSuccess(response.data);
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Ro'yxatdan o'tishda xatolik: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎁</div>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>Xush kelibsiz!</h2>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
        Tizimdan foydalanish uchun hisobingizni faollashtiring.<br />
        Sizga <b>10 ta tekin buyurtma</b> bonusi beriladi!
      </p>

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: '100%',
          maxWidth: '280px',
          padding: '14px 20px',
          backgroundColor: '#0088cc',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)',
          transition: 'all 0.2s ease'
        }}
      >
        {loading ? "Yuklanmoqda..." : "🚀 Hisobni faollashtirish"}
      </button>
    </div>
  );
}

export default Auth;