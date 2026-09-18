import React, { useState, useEffect } from 'react';
import { X, UtensilsCrossed, CheckCircle, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '../types';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { setOrderingMode, setSelectedStore } = useOrderStore();

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [isChecking, setIsChecking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/stores')
        .then((res) => {
          if (res.data.success && res.data.data.length > 0) {
            setStores(res.data.data);
            setSelectedStoreId(res.data.data[0].id);
          }
        })
        .catch((err) => console.error('Error fetching stores', err));
    }
  }, [isOpen]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrorMessage('Please login to reserve a table.');
      return;
    }

    setIsChecking(true);
    setErrorMessage('');

    try {
      const res = await api.post('/bookings', {
        storeId: selectedStoreId,
        date,
        time,
        guests: parseInt(String(guests), 10) || 2,
      });

      if (res.data.success) {
        setIsBooked(true);
        setOrderingMode('dine-in');
        const st = stores.find((s) => s.id === selectedStoreId);
        if (st) setSelectedStore(st);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not complete table booking. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Dine-In Table Reservation</h3>
                  <p className="text-xs text-gray-300">Guaranteed seating & fast kitchen priority</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isBooked ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900">Table Reserved!</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Your table for <strong>{guests} guests</strong> is booked for <strong>{date} at {time}</strong>.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => {
                        setIsBooked(false);
                        onClose();
                        if (onSuccess) onSuccess();
                      }}
                      className="px-6 py-2.5 bg-[#E53935] hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors"
                    >
                      Pre-Order Food Menu
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  {/* Store Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Select Outlet / Store *</label>
                    <select
                      value={selectedStoreId}
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-400"
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
                      <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Time Slot *</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-400"
                      >
                        <option value="12:30">12:30 PM (Lunch)</option>
                        <option value="13:30">01:30 PM (Lunch)</option>
                        <option value="19:00">07:00 PM (Dinner)</option>
                        <option value="19:30">07:30 PM (Dinner)</option>
                        <option value="20:00">08:00 PM (Dinner)</option>
                        <option value="20:30">08:30 PM (Dinner)</option>
                        <option value="21:00">09:00 PM (Dinner)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Number of Guests *</label>
                    <div className="flex gap-2">
                      {[1, 2, 4, 6, 8, 12].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuests(count)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            guests === count
                              ? 'bg-black text-white border-black shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {count} {count === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Tables currently available for selected time slot!</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isChecking}
                    className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-xl shadow-lg transition-colors text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                  >
                    {isChecking ? 'Checking Availability...' : 'Confirm Table Reservation'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
