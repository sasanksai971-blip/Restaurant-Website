import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Clock, ArrowRight, Store as StoreIcon, Check } from 'lucide-react';
import api from '../lib/api';
import { Store } from '../types';
import { useOrderStore } from '../store/orderStore';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const TakeawayPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedStore, setSelectedStore, setOrderingMode } = useOrderStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrderingMode('takeaway');
    api.get('/stores')
      .then((res) => {
        if (res.data.success) {
          setStores(res.data.data);
          if (!selectedStore && res.data.data.length > 0) {
            setSelectedStore(res.data.data[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [selectedStore, setOrderingMode, setSelectedStore]);

  const handleSelectAndProceed = (store: Store) => {
    setSelectedStore(store);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Takeaway & Self-Pickup
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-lg">
            Select your nearest outlet. Your hot pizzas will be fresh out of the stone oven and ready for pickup with zero queue wait!
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900">
            Select Pickup Store in Bangalore
          </h2>

          <div className="space-y-3">
            {stores.map((s, idx) => {
              const isSelected = selectedStore?.id === s.id;
              const distances = ['0.8 km', '1.4 km', '2.2 km', '3.5 km', '4.1 km'];
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStore(s)}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-black shadow-md ring-2 ring-black/10'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-gray-900">{s.name}</h3>
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-black rounded-full uppercase">
                        Open Now
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{s.address}, {s.city}</span>
                    </p>
                    <p className="text-xs text-blue-700 font-bold">
                      {distances[idx % distances.length]} away • {s.openingTime} to {s.closingTime}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndProceed(s);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-[#E53935] hover:bg-red-700 text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Proceed to Menu' : 'Select Store'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
