import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

interface CartBarProps {
  onOpenCart?: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({ onOpenCart }) => {
  const navigate = useNavigate();
  const { items, getItemCount, getTotal } = useCartStore();

  const count = getItemCount();
  const total = getTotal();

  if (count === 0) return null;

  const handleClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/cart');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="fixed bottom-14 md:bottom-5 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none"
      >
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {/* Specification: Red bar at the bottom with View Cart */}
          <div
            onClick={handleClick}
            className="w-full bg-[#E53935] hover:bg-red-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01] active:scale-99 border border-red-400/40"
          >
            {/* Left: Item count info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm text-white shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block uppercase tracking-wider text-red-100">
                  {count} {count === 1 ? 'ITEM' : 'ITEMS'} ADDED
                </span>
                <span className="text-base sm:text-lg font-black leading-none">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Center / Right: View Cart Call to action */}
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-wide uppercase">
                View Cart
              </span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
