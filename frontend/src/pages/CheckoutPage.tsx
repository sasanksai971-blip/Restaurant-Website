import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Banknote,
  Building,
  Clock,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { Address, Order } from '../types';
import api from '../lib/api';

import { Header } from '../components/Header';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { Footer } from '../components/Footer';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    appliedCoupon,
    couponDiscount,
    clearCart,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  const { user, addresses, addAddress } = useAuthStore();
  const { orderingMode, selectedStore, scheduledDate, scheduledTime } = useOrderStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // New address form state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Bangalore');
  const [newPostal, setNewPostal] = useState('560034');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  useEffect(() => {
    if (items.length === 0 && !confirmedOrder) {
      navigate('/cart');
    }

    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [items, addresses, confirmedOrder, navigate, selectedAddressId]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim()) return;

    try {
      const res = await api.post('/addresses', {
        addressLine: newAddressLine.trim(),
        city: newCity,
        state: 'Karnataka',
        postalCode: newPostal,
        isDefault: addresses.length === 0,
      });

      if (res.data.success && res.data.data) {
        addAddress(res.data.data);
        setSelectedAddressId(res.data.data.id);
        setShowNewAddress(false);
        setNewAddressLine('');
      }
    } catch (err: any) {
      setErrorMessage('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        orderType: orderingMode,
        storeId: selectedStore?.id || undefined,
        addressId: orderingMode === 'delivery' || orderingMode === 'scheduled' ? selectedAddressId || undefined : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          customization: i.customization || undefined,
        })),
        discount: couponDiscount,
        deliveryFee,
        scheduledDate: scheduledDate || undefined,
        scheduledTime: scheduledTime || undefined,
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success && res.data.data) {
        setConfirmedOrder(res.data.data);
        clearCart();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Step Indicator (Spec Section 34: Step 1: Address -> Step 2: Payment -> Step 3: Review -> Step 4: Place Order) */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                  step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <span className="text-xs font-bold mt-1.5 text-gray-800">
                {orderingMode === 'takeaway' ? 'Store Pickup' : 'Delivery Address'}
              </span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                  step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span className="text-xs font-bold mt-1.5 text-gray-800">Payment</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                  step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
              <span className="text-xs font-bold mt-1.5 text-gray-800">Review & Place</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-2xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Wizard Step Container */}
          <div className="md:col-span-2 space-y-6">
            {/* STEP 1: Address Selection / Store Selection */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#E53935]" />
                    <span>
                      {orderingMode === 'takeaway'
                        ? 'Confirm Pickup Outlet'
                        : 'Select Delivery Address'}
                    </span>
                  </h3>
                  {orderingMode !== 'takeaway' && !showNewAddress && (
                    <button
                      onClick={() => setShowNewAddress(true)}
                      className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New</span>
                    </button>
                  )}
                </div>

                {orderingMode === 'takeaway' ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <h4 className="font-bold text-blue-900 text-sm">
                      {selectedStore ? selectedStore.name : 'Downtown Central Outlet'}
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      {selectedStore
                        ? `${selectedStore.address}, ${selectedStore.city}`
                        : '12 MG Road, Bangalore'}
                    </p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-2">
                      Ready for pickup in ~20 minutes from order placement
                    </p>
                  </div>
                ) : (
                  <>
                    {/* List of saved addresses */}
                    {addresses.length > 0 && !showNewAddress && (
                      <div className="space-y-3">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <label
                              key={addr.id}
                              className={`p-4 rounded-2xl border cursor-pointer flex items-start justify-between transition-all ${
                                isSelected
                                  ? 'border-black bg-gray-50 shadow-xs ring-2 ring-black/10'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="address"
                                  checked={isSelected}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="mt-1 w-4 h-4 text-[#E53935] focus:ring-[#E53935]"
                                />
                                <div>
                                  <span className="font-bold text-sm text-gray-900 block">
                                    {addr.addressLine}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {addr.city}, {addr.state} - {addr.postalCode}
                                  </span>
                                </div>
                              </div>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-md">
                                  Default
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* New Address Form */}
                    {(showNewAddress || addresses.length === 0) && (
                      <form
                        onSubmit={handleCreateAddress}
                        className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3"
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          Enter Delivery Address Details
                        </h4>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">House / Flat / Street *</label>
                          <input
                            type="text"
                            required
                            value={newAddressLine}
                            onChange={(e) => setNewAddressLine(e.target.value)}
                            placeholder="Flat 402, Sunshine Apartments, 12th Cross..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-red-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">City</label>
                            <input
                              type="text"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Postal Code</label>
                            <input
                              type="text"
                              value={newPostal}
                              onChange={(e) => setNewPostal(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
                          >
                            Save & Use Address
                          </button>
                          {addresses.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowNewAddress(false)}
                              className="px-3 py-2 bg-white text-gray-700 rounded-xl text-xs font-bold border border-gray-200"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </>
                )}

                {/* Continue button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-lg transition-colors text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Payment Selection (Spec Section 35: 1. UPI, 2. Cards, 3. Pay on Delivery) */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#E53935]" />
                    <span>Choose Payment Option</span>
                  </h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* 1. UPI (GPay, PhonePe, Paytm) */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-black bg-gray-50 shadow-xs ring-2 ring-black/10'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 text-[#E53935] focus:ring-[#E53935]"
                      />
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">
                          1. Instant UPI / QR Payment
                        </span>
                        <span className="text-xs text-gray-500">
                          Google Pay, PhonePe, Paytm, BHIM
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                      Fastest
                    </span>
                  </label>

                  {/* 2. Cards (Credit / Debit) */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === 'card'
                        ? 'border-black bg-gray-50 shadow-xs ring-2 ring-black/10'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-[#E53935] focus:ring-[#E53935]"
                      />
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">
                          2. Credit / Debit Cards
                        </span>
                        <span className="text-xs text-gray-500">
                          Visa, MasterCard, RuPay, Amex
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* 3. Pay on Delivery */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-gray-50 shadow-xs ring-2 ring-black/10'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#E53935] focus:ring-[#E53935]"
                      />
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">
                          3. Pay on Delivery (Cash / POS)
                        </span>
                        <span className="text-xs text-gray-500">
                          Pay by cash or card upon doorstep arrival
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-lg transition-colors text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 3: Review & Place Order (Spec Section 34 Step 3 & 4) */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Review & Place Order</span>
                  </h3>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {/* Items preview list */}
                <div className="divide-y divide-gray-100">
                  {items.map((i) => (
                    <div key={i.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{i.quantity}x</span>
                        <span className="text-gray-800">{i.product.name}</span>
                        {i.customization && (
                          <span className="text-[10px] text-gray-400">({i.customization})</span>
                        )}
                      </div>
                      <span className="font-black text-gray-950">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#E53935] hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-2xl transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    'Processing Order in Kitchen...'
                  ) : (
                    <>
                      <span>Place Order • ₹{total}</span>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 h-fit">
            <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
              Order Total
            </h4>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items ({items.length})</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-bold text-gray-900">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-black text-gray-950">
              <span>Grand Total</span>
              <span className="text-[#E53935]">₹{total}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Slide-in Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={!!confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  );
};
