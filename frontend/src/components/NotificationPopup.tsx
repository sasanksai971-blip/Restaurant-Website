import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('pizza-notification-prompted');
    if (!hasPrompted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    sessionStorage.setItem('pizza-notification-prompted', 'true');
    setIsVisible(false);
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.log('Notification permission error', e);
      }
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pizza-notification-prompted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                We would like to send you notifications
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Get real-time updates on your hot pizza orders, exclusive deals & flash offers!
              </p>
              <div className="flex items-center gap-2.5 mt-3.5">
                <button
                  onClick={handleAllow}
                  className="px-5 py-2 bg-[#E53935] hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Allow
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold rounded-lg border border-gray-200 transition-colors"
                >
                  Don't Allow
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close notification prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
