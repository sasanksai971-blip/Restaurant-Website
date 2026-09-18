import React from 'react';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';

interface LocationBarProps {
  onOpenSelector?: () => void;
}

export const LocationBar: React.FC<LocationBarProps> = ({ onOpenSelector }) => {
  const { currentAddress, cityName, isDetected, detectLocation } = useLocationStore();

  const handleDetect = (e: React.MouseEvent) => {
    e.stopPropagation();
    detectLocation();
  };

  return (
    <div
      onClick={onOpenSelector}
      className="w-full bg-[#1a237e] text-white py-2.5 px-4 sm:px-6 cursor-pointer hover:bg-[#151c6b] transition-colors shadow-inner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 animate-bounce" />
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white flex-shrink-0">
              Give us your exact location:
            </span>
            <span className="text-xs sm:text-sm text-blue-100 font-normal truncate">
              {isDetected ? `${currentAddress} (${cityName})` : 'Select your area for fastest delivery'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDetect}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/20 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            <span>Detect GPS</span>
          </button>
          <ChevronRight className="w-4 h-4 text-blue-200" />
        </div>
      </div>
    </div>
  );
};
