import React, { useState } from 'react';
import { X, Clock, Calendar, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../store/orderStore';

interface ScheduleDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (date: string, time: string) => void;
}

export const ScheduleDeliveryModal: React.FC<ScheduleDeliveryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { setSchedule, setOrderingMode } = useOrderStore();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');

  const slots = [
    '12:00 PM - 12:45 PM',
    '01:00 PM - 01:45 PM',
    '02:00 PM - 02:45 PM',
    '06:00 PM - 06:45 PM',
    '07:00 PM - 07:45 PM',
    '08:00 PM - 08:45 PM',
    '09:00 PM - 09:45 PM',
    '10:00 PM - 10:45 PM',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedule(date, time);
    setOrderingMode('scheduled');
    if (onConfirm) {
      onConfirm(date, time);
    }
    onClose();
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
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Schedule Delivery</h3>
                  <p className="text-xs text-gray-300">Choose your preferred date and slot</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Preferred Time Slot *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-colors flex items-center justify-between ${
                        time === slot
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>{slot}</span>
                      {time === slot && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-xl shadow-lg transition-colors text-sm uppercase tracking-wide mt-2"
              >
                Confirm Schedule & Browse Menu
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
