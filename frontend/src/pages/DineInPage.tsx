import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Calendar, Clock, Users, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import api from '../lib/api';
import { Store } from '../types';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const DineInPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOrderingMode, setSelectedStore } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOrderingMode('dine-in');
    api.get('/stores').then((res) => {
      if (res.data.success && res.data.data.length > 0) {
        setStores(res.data.data);
        setSelectedStoreId(res.data.data[0].id);
      }
    });
  }, [setOrderingMode]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        storeId: selectedStoreId,
        date,
        time,
        guests,
      });

      if (res.data.success) {
        setIsBooked(true);
        const st = stores.find((s) => s.id === selectedStoreId);
        if (st) setSelectedStore(st);
      }
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Dine-In & Pre-Order Experience
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg">
            Reserve your table in advance and pre-order your favorite pizzas. Hot food arrives immediately as you take your seat!
          </p>
        </div>

        {isBooked ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Table Booked Successfully!</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Reserved for <strong>{guests} Guests</strong> on <strong>{date} at {time}</strong>.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-lg transition-colors text-sm uppercase flex items-center gap-2 mx-auto"
              >
                <span>Select Pizzas to Pre-Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs max-w-xl mx-auto">
            <form onSubmit={handleBooking} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  1. Choose Restaurant Outlet *
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-red-400"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.address}, {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    2. Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    3. Time Slot *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-red-400"
                  >
                    <option value="12:30">12:30 PM</option>
                    <option value="13:30">01:30 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="19:30">07:30 PM</option>
                    <option value="20:00">08:00 PM</option>
                    <option value="20:30">08:30 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  4. Number of Guests *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6, 8, 10, 12, 16].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuests(count)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        guests === count
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {count} {count === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-xl transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-4"
              >
                <span>{isSubmitting ? 'Reserving...' : 'Reserve Table & Open Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
