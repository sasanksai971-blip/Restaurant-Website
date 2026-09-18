import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';

export const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { detectLocation } = useLocationStore();

  const phone = (location.state as any)?.phone || '9876543210';
  const devOtp = (location.state as any)?.dev_otp;

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input box on load
    inputRefs.current[0]?.focus();

    // Autofill dev OTP if provided for effortless development experience
    if (devOtp && typeof devOtp === 'string' && devOtp.length === 6) {
      setOtp(devOtp.split(''));
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [devOtp]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle paste of whole OTP
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(5, pasted.length - 1)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await api.post('/verify-otp', { phone, otp: otpCode });
      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;
        setAuth(user, token);

        // Spec Section 6: After OTP verification, detect user's location & show main page
        detectLocation();

        // Redirect to Home or previously intended page
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const res = await api.post('/send-otp', { phone });
      if (res.data.success) {
        setTimer(60);
        setResendStatus('New OTP sent successfully!');
        setTimeout(() => setResendStatus(''), 3000);
        if (res.data.dev_otp) {
          setOtp(res.data.dev_otp.split(''));
        }
      }
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Number</span>
          </Link>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Verify OTP
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter the 6-digit code sent to <strong className="text-gray-800">+91 {phone}</strong>
            </p>
          </div>

          {/* Dev Helper Notification */}
          {devOtp && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200 flex items-center justify-between">
              <span>Development Demo OTP: <strong className="font-mono text-sm">{devOtp}</strong></span>
              <button
                type="button"
                onClick={() => setOtp(devOtp.split(''))}
                className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 font-bold rounded-md"
              >
                Autofill
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200 text-center">
              {error}
            </div>
          )}

          {resendStatus && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold border border-green-200 text-center">
              {resendStatus}
            </div>
          )}

          {/* 6 Digit Input Boxes */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#E53935] focus:ring-4 focus:ring-red-100 transition-all text-gray-900"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.join('').length < 6}
              className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isVerifying ? 'Verifying OTP...' : 'Verify & Continue'}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center text-xs text-gray-500">
            {timer > 0 ? (
              <p>
                Resend OTP in <strong className="text-gray-800">{timer}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-[#E53935] hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend OTP Now</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
