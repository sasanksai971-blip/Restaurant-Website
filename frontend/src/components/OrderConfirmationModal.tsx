import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Clock, MapPin, ShoppingBag, UtensilsCrossed, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E53935', '#2E7D32', '#FFD700', '#1565C0'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!order) return null;

  const estimatedTime =
    order.orderType === 'dine-in'
      ? '15 - 20 Mins (Table Ready)'
      : order.orderType === 'takeaway'
      ? '20 - 25 Mins (Pickup)'
      : '30 - 40 Mins (Delivery)';

  const modeIcon =
    order.orderType === 'dine-in' ? (
      <UtensilsCrossed className="w-5 h-5 text-amber-500" />
    ) : order.orderType === 'takeaway' ? (
      <ShoppingBag className="w-5 h-5 text-blue-500" />
    ) : (
      <Bike className="w-5 h-5 text-[#E53935]" />
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Specification: Sliding motion animation */}
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
          >
            {/* Top Green Banner with Animated Green Check */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-6 text-center relative overflow-hidden">
              {/* Background celebration circles */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xs" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-xs" />

              {/* Animated Green Check Mark (Specification Requirement) */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 180, delay: 0.1 }}
                className="w-20 h-20 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-green-100"
              >
                <Check className="w-10 h-10 stroke-[3]" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
                Order Placed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-green-100 font-medium">
                Delicious oven-baked pizzas are being prepped right now.
              </p>
            </div>

            {/* Order Details Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Key metadata grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Order ID
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-black text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Estimated Time
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#2E7D32] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{estimatedTime}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Ordering Mode
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1 uppercase">
                    {modeIcon}
                    <span>{order.orderType}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-sm font-black text-gray-950">
                    ₹{order.total}
                  </span>
                </div>
              </div>

              {/* Items Ordered List */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Order Summary
                </h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.quantity}x</span>
                          <span className="text-gray-800">{item.product?.name || 'Pizza Special'}</span>
                        </div>
                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 py-1">Items recorded in kitchen order queue</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/track/${order.id}`);
                }}
                className="flex-1 py-3.5 px-4 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-lg transition-colors text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2"
              >
                <span>Track Order Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/menu');
                }}
                className="px-4 py-3.5 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-2xl border border-gray-200 text-xs sm:text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
