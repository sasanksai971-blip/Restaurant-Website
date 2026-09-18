import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import { Order } from '../types';
import { Header } from '../components/Header';
import { OrderTracker } from '../components/OrderTracker';
import { Footer } from '../components/Footer';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data.success && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (err: any) {
      setError('Could not load order tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // 15s live poll
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>

          <button
            onClick={fetchOrder}
            className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {loading && !order ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 w-1/3 mx-auto rounded-md" />
            <div className="h-4 bg-gray-100 w-1/2 mx-auto rounded-md" />
            <div className="h-64 bg-gray-100 rounded-2xl mt-4" />
          </div>
        ) : order ? (
          <OrderTracker order={order} />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
            <div className="text-4xl">📦</div>
            <h3 className="font-bold text-gray-900 text-lg">Order Not Found</h3>
            <p className="text-xs text-gray-500">{error || 'Please check your order ID'}</p>
            <Link
              to="/orders"
              className="inline-block px-5 py-2.5 bg-[#E53935] text-white rounded-xl text-xs font-bold"
            >
              View Order History
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
