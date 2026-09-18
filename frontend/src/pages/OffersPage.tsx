import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Sparkles, Check, ArrowRight, Clock, ShieldCheck, Gift } from 'lucide-react';
import api from '../lib/api';
import { Offer, Coupon } from '../types';
import { useCartStore } from '../store/cartStore';

import { Header } from '../components/Header';
import { CartBar } from '../components/CartBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { Footer } from '../components/Footer';
import { OfferCard } from '../components/OfferCard';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const { applyCoupon, appliedCoupon, getSubtotal } = useCartStore();
  const [appliedMsg, setAppliedMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [offRes, coupRes] = await Promise.all([
          api.get('/offers'),
          api.get('/coupons'),
        ]);

        if (offRes.data.success) setOffers(offRes.data.data);
        if (coupRes.data.success) setCoupons(coupRes.data.data);
      } catch (err) {
        console.error('Error fetching offers data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyCoupon = (coupon: Coupon) => {
    const subtotal = getSubtotal();
    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = Math.min(200, (subtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    applyCoupon(coupon, discount);
    setAppliedMsg(`Coupon ${coupon.code} applied successfully!`);
    setTimeout(() => setAppliedMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider text-white">
              <Gift className="w-3.5 h-3.5 text-yellow-300" />
              <span>Mega Pizza Savings</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Exclusive Offers & Deals
            </h1>
            <p className="text-xs sm:text-sm text-green-100">
              Apply promotional coupons to get instant discounts on first orders, dine-in feasts & takeaways!
            </p>
          </div>
        </div>

        {appliedMsg && (
          <div className="p-4 bg-green-50 text-green-800 font-bold text-sm rounded-2xl border border-green-200 flex items-center justify-between animate-fade-in">
            <span>{appliedMsg}</span>
            <button
              onClick={() => navigate('/cart')}
              className="text-xs underline font-black"
            >
              View in Cart &rarr;
            </button>
          </div>
        )}

        {/* Featured Offer Cards (Spec Section 20) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#2E7D32] flex items-center gap-2">
            <span>🎉</span>
            <span>Offers for You</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>

        {/* Available Coupons List (Spec Section 10: Code, Description, Discount, Minimum order, Validity, Apply button) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#E53935]" />
            <span>Available Promo Coupons</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isApplied
                      ? 'border-green-500 bg-green-50/50 shadow-md ring-2 ring-green-100'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-50 text-[#E53935] font-mono font-black text-sm rounded-lg border border-red-200">
                          {coupon.code}
                        </span>
                        <span className="text-xs font-bold text-gray-600">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `Flat ₹${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 pt-1">
                        {coupon.description}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Minimum cart subtotal: <strong>₹{coupon.minimumOrder}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleApplyCoupon(coupon)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                        isApplied
                          ? 'bg-green-600 text-white'
                          : 'bg-[#E53935] hover:bg-red-700 text-white shadow-xs'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Apply</span>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Valid until end of month</span>
                    </span>
                    <span className="text-emerald-700 font-semibold">Instant discount at checkout</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <CartBar onOpenCart={() => navigate('/cart')} />
      <BottomNavigation />
      <Footer />
    </div>
  );
};
