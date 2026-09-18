import React, { useState } from 'react';
import { Tag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Offer, Coupon } from '../types';
import { useCartStore } from '../store/cartStore';

interface OfferCardProps {
  offer: Offer;
  onApply?: (couponCode: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onApply }) => {
  const [copied, setCopied] = useState(false);
  const { applyCoupon, getSubtotal } = useCartStore();

  const isOrange = offer.color === 'orange';

  // Extract coupon code or determine code
  let couponCode = 'FIRST50';
  if (offer.title.toLowerCase().includes('dine in') || offer.description.toLowerCase().includes('dine in')) {
    couponCode = 'DINEIN249';
  } else if (offer.title.toLowerCase().includes('take away') || offer.description.toLowerCase().includes('take away')) {
    couponCode = 'TAKEAWAY499';
  }

  const handleClaim = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const couponMock: Coupon = {
      id: couponCode,
      code: couponCode,
      description: offer.title,
      discountType: couponCode === 'FIRST50' ? 'percentage' : 'fixed',
      discountValue: couponCode === 'FIRST50' ? 50 : couponCode === 'DINEIN249' ? 249 : 499,
      minimumOrder: couponCode === 'FIRST50' ? 199 : couponCode === 'DINEIN249' ? 599 : 999,
      isActive: true,
    };

    const sub = getSubtotal();
    const disc = couponMock.discountType === 'percentage'
      ? (sub * couponMock.discountValue) / 100
      : couponMock.discountValue;

    applyCoupon(couponMock, disc);

    if (onApply) {
      onApply(couponCode);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col justify-between min-w-[280px] sm:min-w-[340px] max-w-[380px] flex-shrink-0 transition-transform hover:-translate-y-1 ${
        isOrange
          ? 'bg-gradient-to-br from-[#E65100] via-[#F57C00] to-[#FF9800]'
          : 'bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#2196F3]'
      }`}
    >
      {/* Decorative Ribbon Icon */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xs pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-[11px] font-black uppercase tracking-wider text-white">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>{offer.discount}</span>
          </span>
          <span className="text-xs font-mono font-bold bg-black/20 px-2.5 py-1 rounded-md text-white/90">
            {couponCode}
          </span>
        </div>

        <h4 className="text-lg sm:text-xl font-black leading-tight text-white mb-1.5 drop-shadow-xs">
          {offer.title}
        </h4>
        <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed font-normal">
          {offer.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
        <span className="text-[11px] text-white/70 font-medium">Click to apply & copy</span>
        <button
          onClick={handleClaim}
          className="px-3.5 py-1.5 bg-white text-gray-950 hover:bg-gray-100 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span>Applied!</span>
            </>
          ) : (
            <>
              <Tag className="w-3.5 h-3.5 text-gray-800" />
              <span>Apply Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
