import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, Clock, MapPin, RefreshCw, ShoppingBag, Eye } from 'lucide-react';
import api from '../lib/api';
import { Order } from '../types';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { Footer } from '../components/Footer';

export const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleReorder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        if (item.product) {
          addItem(item.product, item.quantity, item.customization || undefined);
        }
      });
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#E65100] flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Order History
            </h1>
            <p className="text-xs text-gray-500">
              Track past orders, receipts & quick re-orders
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty state (Spec Section 46) */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-8 space-y-4">
            <div className="text-4xl">🧾</div>
            <h3 className="text-xl font-black text-gray-900">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500">
              Once you place an order, you can track delivery and repeat orders from here.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E53935] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase"
            >
              <span>Order First Pizza</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-mono font-black text-gray-900">
                      ORDER #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        order.status === 'delivered' || order.status === 'served'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      • {order.orderType}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1.5">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs sm:text-sm text-gray-700">
                      <span>
                        <strong className="text-gray-900">{item.quantity}x</strong>{' '}
                        {item.product?.name || 'Pizza item'}
                        {item.customization && (
                          <span className="text-[11px] text-gray-400 ml-1">({item.customization})</span>
                        )}
                      </span>
                      <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total & Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Paid</span>
                    <span className="text-base sm:text-lg font-black text-gray-950">₹{order.total}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/track/${order.id}`)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
      <Footer />
    </div>
  );
};
