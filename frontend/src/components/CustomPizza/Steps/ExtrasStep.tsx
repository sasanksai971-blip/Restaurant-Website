import React from 'react';
import { PizzaExtra, SelectedExtra } from '../../../types/customPizza';
import { Plus, Minus, Sparkles } from 'lucide-react';

interface ExtrasStepProps {
  extras: PizzaExtra[];
  selectedExtras: SelectedExtra[];
  onUpdateExtraQuantity: (extra: PizzaExtra, quantity: number) => void;
}

export const ExtrasStep: React.FC<ExtrasStepProps> = ({
  extras,
  selectedExtras,
  onUpdateExtraQuantity,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 6: Complete with Dips, Breads & Drinks</h3>
        <p className="text-xs text-gray-500">
          Pair your handcrafted custom pizza with tasty gourmet sides.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {extras.map((ex) => {
          const selected = selectedExtras.find((se) => se.id === ex.id);
          const quantity = selected ? selected.quantity : 0;

          return (
            <div
              key={ex.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex items-center justify-between gap-3 ${
                quantity > 0
                  ? 'border-black bg-gray-50/90 shadow-sm ring-2 ring-black/5'
                  : 'border-gray-200 bg-white hover:border-gray-300 shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  {ex.category}
                </span>
                <h4 className="font-extrabold text-base text-gray-900">{ex.name}</h4>
                <span className="text-sm font-black text-[#E53935] block">₹{ex.price}</span>
              </div>

              {/* Quantity Controls */}
              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => onUpdateExtraQuantity(ex, 1)}
                  className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-sm transition-colors cursor-pointer"
                >
                  Add +
                </button>
              ) : (
                <div className="flex items-center bg-white border border-gray-300 rounded-xl p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onUpdateExtraQuantity(ex, quantity - 1)}
                    className="w-7 h-7 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-black text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateExtraQuantity(ex, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[#E53935] text-white hover:bg-red-700 flex items-center justify-center font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
