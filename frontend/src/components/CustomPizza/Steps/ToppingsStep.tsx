import React, { useState } from 'react';
import { PizzaTopping, SelectedTopping } from '../../../types/customPizza';
import { Check, Plus, Minus, Sparkles, Filter } from 'lucide-react';

interface ToppingsStepProps {
  toppings: PizzaTopping[];
  selectedToppings: SelectedTopping[];
  onToggleTopping: (topping: PizzaTopping) => void;
  onSetToppingQuantity: (toppingId: string, quantity: 'normal' | 'extra') => void;
}

export const ToppingsStep: React.FC<ToppingsStepProps> = ({
  toppings,
  selectedToppings,
  onToggleTopping,
  onSetToppingQuantity,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'Vegetables' | 'Non-Veg' | 'Premium'>('all');
  const [vegOnly, setVegOnly] = useState(false);

  // Filter toppings
  const filteredToppings = toppings.filter((t) => {
    const matchesCategory = activeTab === 'all' || t.category === activeTab;
    const matchesVeg = vegOnly ? t.vegetarian : true;
    return matchesCategory && matchesVeg;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900">Step 5: Load Your Fresh Toppings</h3>
          <p className="text-xs text-gray-500">
            Pick your favorites & choose Normal or Extra portions.
          </p>
        </div>

        {/* Veg Only Filter Toggle (Spec Section 21) */}
        <button
          type="button"
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
            vegOnly
              ? 'bg-green-700 text-white border-green-700 shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
              vegOnly ? 'border-white' : 'border-green-600'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                vegOnly ? 'bg-white' : 'bg-green-600'
              }`}
            />
          </div>
          <span>Veg Only</span>
        </button>
      </div>

      {/* Category Tabs (Spec Section 7: Vegetables, Non-Veg, Premium) */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {[
          { id: 'all', label: 'All Toppings' },
          { id: 'Vegetables', label: '🥦 Vegetables' },
          { id: 'Non-Veg', label: '🍗 Non-Veg' },
          { id: 'Premium', label: '⭐ Premium Gourmet' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toppings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredToppings.map((t) => {
          const selected = selectedToppings.find((st) => st.id === t.id);
          const isSelected = !!selected;
          const currentQty = selected ? selected.quantity : 'normal';

          return (
            <div
              key={t.id}
              onClick={() => onToggleTopping(t)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-black bg-gray-50/90 shadow-sm ring-2 ring-black/5'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Veg / Non Veg Dot Indicator (Spec Section 7 & 21) */}
                  <div
                    className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center flex-shrink-0 ${
                      t.vegetarian ? 'border-green-600' : 'border-red-600'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.vegetarian ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Selection Check Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected ? 'bg-black text-white' : 'border border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Topping Quantity Control: Normal | Extra (Spec Section 8) */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                {isSelected ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs w-full justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => onSetToppingQuantity(t.id, 'normal')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        currentQty === 'normal'
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Normal (+₹{t.price})
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetToppingQuantity(t.id, 'extra')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                        currentQty === 'extra'
                          ? 'bg-[#E53935] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>Extra (+₹{t.extraPrice})</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-[#E53935]">+₹{t.price}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">Click to add</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
