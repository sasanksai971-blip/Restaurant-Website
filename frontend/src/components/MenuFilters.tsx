import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';

export type VegFilterType = 'all' | 'veg' | 'non-veg';
export type SortType = 'default' | 'price_asc' | 'price_desc';

interface MenuFiltersProps {
  vegFilter: VegFilterType;
  sortFilter: SortType;
  onVegFilterChange: (filter: VegFilterType) => void;
  onSortChange: (sort: SortType) => void;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  vegFilter,
  sortFilter,
  onVegFilterChange,
  onSortChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleVegClick = () => {
    if (vegFilter === 'veg') {
      onVegFilterChange('all');
    } else {
      onVegFilterChange('veg');
    }
  };

  const handleNonVegClick = () => {
    if (vegFilter === 'non-veg') {
      onVegFilterChange('all');
    } else {
      onVegFilterChange('non-veg');
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap py-3">
      {/* 1. Veg Only Filter (Spec Section 25) */}
      <button
        onClick={handleVegClick}
        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer ${
          vegFilter === 'veg'
            ? 'bg-green-700 text-white border-green-700 shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
            vegFilter === 'veg' ? 'border-white' : 'border-green-600'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              vegFilter === 'veg' ? 'bg-white' : 'bg-green-600'
            }`}
          />
        </div>
        <span>Veg Only</span>
      </button>

      {/* 2. Non-Veg Only Filter (Spec Section 25) */}
      <button
        onClick={handleNonVegClick}
        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer ${
          vegFilter === 'non-veg'
            ? 'bg-red-700 text-white border-red-700 shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
            vegFilter === 'non-veg' ? 'border-white' : 'border-red-600'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              vegFilter === 'non-veg' ? 'bg-white' : 'bg-red-600'
            }`}
          />
        </div>
        <span>Non Veg Only</span>
      </button>

      {/* 3. Sort Dropdown (Spec Section 26: Price: High to Low, Price: Low to High) */}
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
            sortFilter !== 'default'
              ? 'bg-black text-white border-black shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {sortFilter === 'price_asc'
              ? 'Price: Low to High'
              : sortFilter === 'price_desc'
              ? 'Price: High to Low'
              : 'Sort'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
        </button>

        {isSortOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsSortOpen(false)}
            />
            <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 py-2 divide-y divide-gray-50 overflow-hidden">
              <button
                onClick={() => {
                  onSortChange('default');
                  setIsSortOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-semibold flex items-center justify-between hover:bg-gray-50 ${
                  sortFilter === 'default' ? 'text-[#E53935]' : 'text-gray-700'
                }`}
              >
                <span>Recommended</span>
                {sortFilter === 'default' && <Check className="w-4 h-4 text-[#E53935]" />}
              </button>

              <button
                onClick={() => {
                  onSortChange('price_asc');
                  setIsSortOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-semibold flex items-center justify-between hover:bg-gray-50 ${
                  sortFilter === 'price_asc' ? 'text-[#E53935]' : 'text-gray-700'
                }`}
              >
                <span>Price: Low to High</span>
                {sortFilter === 'price_asc' && <Check className="w-4 h-4 text-[#E53935]" />}
              </button>

              <button
                onClick={() => {
                  onSortChange('price_desc');
                  setIsSortOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-semibold flex items-center justify-between hover:bg-gray-50 ${
                  sortFilter === 'price_desc' ? 'text-[#E53935]' : 'text-gray-700'
                }`}
              >
                <span>Price: High to Low</span>
                {sortFilter === 'price_desc' && <Check className="w-4 h-4 text-[#E53935]" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
