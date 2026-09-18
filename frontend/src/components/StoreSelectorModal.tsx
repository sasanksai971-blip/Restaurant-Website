import React, { useState, useEffect } from 'react';
import { X, Store as StoreIcon, MapPin, Clock, Check, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '../types';
import api from '../lib/api';
import { useOrderStore } from '../store/orderStore';

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStore?: (store: Store) => void;
}

export const StoreSelectorModal: React.FC<StoreSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectStore,
}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedStore, setSelectedStore, setOrderingMode } = useOrderStore();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/stores')
        .then((res) => {
          if (res.data.success) {
            setStores(res.data.data);
          }
        })
        .catch((err) => console.error('Error fetching stores', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handlePickStore = (store: Store) => {
    setSelectedStore(store);
    setOrderingMode('takeaway');
    if (onSelectStore) {
      onSelectStore(store);
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
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#1a237e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <StoreIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Select Pickup Outlet</h3>
                  <p className="text-xs text-blue-100">Order is pre-baked & ready as you arrive!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                stores.map((s, idx) => {
                  const isSelected = selectedStore?.id === s.id;
                  const mockDistances = ['0.8 km away', '1.4 km away', '2.2 km away', '3.5 km away', '4.1 km away'];
                  const distance = mockDistances[idx % mockDistances.length];

                  return (
                    <div
                      key={s.id}
                      onClick={() => handlePickStore(s)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-black bg-gray-50 shadow-md ring-2 ring-black/10'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base">{s.name}</h4>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">
                            Open
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{s.address}, {s.city}</span>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{s.openingTime} - {s.closingTime}</span>
                          </span>
                          <span className="text-blue-700 font-bold">{distance}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePickStore(s);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-[#E53935] hover:bg-red-700 text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
