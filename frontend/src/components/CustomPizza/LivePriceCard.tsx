import React, { useState } from 'react';
import { CustomPizzaBreakdown } from '../../types/customPizza';
import { ChevronDown, ChevronUp, ShieldCheck, Sparkles } from 'lucide-react';

interface LivePriceCardProps {
  breakdown: CustomPizzaBreakdown | null;
  loading?: boolean;
}

export const LivePriceCard: React.FC<LivePriceCardProps> = ({ breakdown, loading }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!breakdown) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-md" />
          <div className="h-4 bg-gray-100 rounded-md" />
          <div className="h-8 bg-gray-200 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header with Collapsible Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group select-none"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]" />
          <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">
            Live Price Breakdown
          </h4>
        </div>

        <button
          type="button"
          className="text-gray-400 group-hover:text-gray-600 p-1"
          aria-label="Toggle price breakdown"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Itemized Table (Spec Section 13) */}
      {isOpen && (
        <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <div className="flex justify-between">
            <span>Base Pizza ({breakdown.basePizza.name})</span>
            <span className="font-bold text-gray-900">₹{breakdown.basePizza.price}</span>
          </div>

          {breakdown.crust.price > 0 && (
            <div className="flex justify-between">
              <span>Crust ({breakdown.crust.name})</span>
              <span className="font-bold text-gray-900">+₹{breakdown.crust.price}</span>
            </div>
          )}

          {breakdown.sauce.price > 0 && (
            <div className="flex justify-between">
              <span>Sauce ({breakdown.sauce.name})</span>
              <span className="font-bold text-gray-900">+₹{breakdown.sauce.price}</span>
            </div>
          )}

          {breakdown.cheese.price > 0 && (
            <div className="flex justify-between">
              <span>Cheese ({breakdown.cheese.name})</span>
              <span className="font-bold text-gray-900">+₹{breakdown.cheese.price}</span>
            </div>
          )}

          {breakdown.toppingsTotal > 0 && (
            <div className="flex justify-between">
              <span>Toppings ({breakdown.toppings.length})</span>
              <span className="font-bold text-gray-900">+₹{breakdown.toppingsTotal}</span>
            </div>
          )}

          {breakdown.extrasTotal > 0 && (
            <div className="flex justify-between">
              <span>Extras & Dips</span>
              <span className="font-bold text-gray-900">+₹{breakdown.extrasTotal}</span>
            </div>
          )}

          <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between font-semibold text-gray-700">
            <span>Subtotal</span>
            <span>₹{breakdown.subtotal}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>GST (5%)</span>
            <span>₹{breakdown.tax}</span>
          </div>
        </div>
      )}

      {/* Grand Total Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Amount</span>
          <span className="text-xl font-black text-[#E53935]">
            {loading ? '...' : `₹${breakdown.total}`}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Server Verified</span>
        </span>
      </div>
    </div>
  );
};
