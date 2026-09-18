import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/send-otp', { phone: cleanPhone });
      if (res.data.success) {
        // Navigate to OTP screen with phone and optional dev_otp in state
        navigate('/otp', {
          state: {
            phone: cleanPhone,
            dev_otp: res.data.dev_otp || '123456',
          },
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 group mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E53935] to-[#FF6B6B] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-2xl">🍕</span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-gray-950 flex items-center">
              PIZZA<span className="text-[#E53935]">RUSH</span>
            </span>
          </div>
        </Link>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Welcome to PizzaRush
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter your mobile number to get started with delicious offers!
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                'Sending OTP...'
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <span>Get <strong>Flat 50% OFF</strong> on your first order</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <span>Faster checkout with saved addresses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <span>Live order tracking directly on your phone</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Skip and browse menu as guest &rarr;
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
