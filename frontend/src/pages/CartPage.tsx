import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Footer } from '../components/Footer';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleApplyCouponCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await api.post('/coupons/apply', {
        code: couponInput.trim().toUpperCase(),
        subtotal,
      });

      if (res.data.success) {
        applyCoupon(
          {
            id: couponInput,
            code: couponInput.trim().toUpperCase(),
            description: 'Promo Discount',
            discountType: 'fixed',
            discountValue: res.data.data.discount,
            minimumOrder: 0,
            isActive: true,
          },
          res.data.data.discount
        );
        setCouponInput('');
      }
    } catch (err: any) {
      setCouponError(err?.message || 'Invalid coupon code or minimum order not met.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceed = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E53935] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Your Order Cart
              </h1>
              <p className="text-xs text-gray-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} ready for the oven
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state (Spec Section 46) */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-50 text-4xl flex items-center justify-center mx-auto">
              🍕
            </div>
            <h3 className="text-xl font-black text-gray-900">Your cart is empty</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Good food is always just a few taps away. Explore our chef-crafted pizzas and hot appetizers!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm uppercase tracking-wide cursor-pointer"
            >
              <span>Explore Pizza Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Col: Cart Items List (Spec Section 33) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={item.product.image || 'https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=200&q=80'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Veg/Non-veg dot */}
                        <div
                          className={`w-3 h-3 border-2 rounded-xs flex items-center justify-center ${
                            item.product.isVeg ? 'border-green-600' : 'border-red-600'
                          }`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full ${
                              item.product.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`}
                          />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {item.product.name}
                        </h4>
                      </div>

                      {/* Customizations */}
                      {item.customization && (
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                          {item.customization}
                        </p>
                      )}

                      <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">
                        ₹{item.price} each
                      </div>
                    </div>

                    {/* Quantity Controls & Total */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg text-gray-600 hover:bg-white hover:text-red-600 flex items-center justify-center transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-[#E53935] text-white hover:bg-red-700 flex items-center justify-center transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-black text-gray-950">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more items prompt */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">Want to add drinks or extra sides?</span>
                <Link
                  to="/menu"
                  className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
                >
                  <span>+ Add More Items</span>
                </Link>
              </div>
            </div>

            {/* Right Col: Price Summary & Coupon (Spec Section 33) */}
            <div className="space-y-4">
              {/* Coupon Box */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#E53935]" />
                  <span>Promo Code & Coupons</span>
                </h4>

                {appliedCoupon ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-green-800">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-green-700 font-semibold">
                        Discount of ₹{couponDiscount} applied!
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCouponCode} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. FIRST50, SAVE100"
                        className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold uppercase focus:bg-white focus:outline-none focus:border-red-400"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}
                  </form>
                )}

                <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>First order? Use <strong>FIRST50</strong></span>
                  <Link to="/deals" className="text-[#E53935] font-bold hover:underline">
                    View All &gt;
                  </Link>
                </div>
              </div>

              {/* Price Summary Breakdown (Spec Section 33) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  Bill Details
                </h4>

                <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-700 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Taxes (GST 5%)</span>
                    <span className="font-bold text-gray-900">₹{tax}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-green-700 uppercase font-black text-xs">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-base sm:text-lg font-black text-gray-950">
                  <span>To Pay</span>
                  <span className="text-[#E53935]">₹{total}</span>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  className="w-full py-4 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-xl transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>100% Safe & Contactless Delivery</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
      <Footer />
    </div>
  );
};
