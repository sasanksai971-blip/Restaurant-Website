import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationStore } from '../store/locationStore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularLocations = [
  { address: '100 Feet Road, Indiranagar', city: 'Bangalore', lat: 12.9784, lng: 77.6408 },
  { address: '5th Block, Koramangala', city: 'Bangalore', lat: 12.9352, lng: 77.6245 },
  { address: 'ITPL Main Road, Whitefield', city: 'Bangalore', lat: 12.9698, lng: 77.7499 },
  { address: '24th Main, JP Nagar Phase 2', city: 'Bangalore', lat: 12.9102, lng: 77.593 },
  { address: 'Church Street, MG Road', city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { address: 'HSR Layout Sector 1', city: 'Bangalore', lat: 12.9121, lng: 77.6446 },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { currentAddress, setLocation, detectLocation } = useLocationStore();
  const [query, setQuery] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleSelect = (loc: typeof popularLocations[0]) => {
    setLocation(loc.address, loc.city, loc.lat, loc.lng);
    onClose();
  };

  const handleGPS = async () => {
    setDetecting(true);
    await detectLocation();
    setDetecting(false);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(query.trim(), 'Bangalore');
      onClose();
    }
  };

  const filtered = popularLocations.filter((l) =>
    l.address.toLowerCase().includes(query.toLowerCase()) ||
    l.city.toLowerCase().includes(query.toLowerCase())
  );

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
            {/* Header (Specification: Dark Blue Location Bar header) */}
            <div className="bg-[#1a237e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Select Your Location</h3>
                  <p className="text-xs text-blue-200">For accurate kitchen delivery estimates</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* GPS Auto detect button */}
              <button
                onClick={handleGPS}
                disabled={detecting}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-[#E53935] font-extrabold rounded-2xl border border-red-200 flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
                <span>{detecting ? 'Detecting via GPS...' : 'Use Current Device GPS Location'}</span>
              </button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink mx-4 text-xs uppercase font-bold text-gray-400">or search area</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* Search input */}
              <form onSubmit={handleManualSubmit} className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter street, locality, or apartment..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-400"
                />
              </form>

              {/* Popular Localities */}
              <div>
                <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Popular Delivery Zones
                </h5>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {filtered.map((loc, idx) => {
                    const isSelected = currentAddress === loc.address;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(loc)}
                        className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm flex items-center justify-between border transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                            : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <div>
                            <span className="block leading-snug">{loc.address}</span>
                            <span className="text-[10px] text-gray-400">{loc.city}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
