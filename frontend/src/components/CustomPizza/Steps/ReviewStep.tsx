import React from 'react';
import { CustomPizzaConfig, CustomPizzaBreakdown } from '../../../types/customPizza';
import { Edit2, ShoppingBag, ShieldCheck, AlertCircle, Sparkles, Check } from 'lucide-react';

interface ReviewStepProps {
  config: CustomPizzaConfig;
  breakdown: CustomPizzaBreakdown | null;
  onEditStep: (stepNumber: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  config,
  breakdown,
  onEditStep,
  onAddToCart,
  isAddingToCart,
}) => {
  const { size, crust, sauce, cheese, toppings, extras } = config;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 7: Final Review & Confirmation</h3>
        <p className="text-xs text-gray-500">
          Verify your custom pizza configuration before adding it to your order.
        </p>
      </div>

      {/* Review Card */}
      <div className="bg-white rounded-3xl border-2 border-gray-200 p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E53935] block">
              Chef Recipe Summary
            </span>
            <h4 className="text-xl font-black text-gray-900 mt-0.5">
              {size?.name} {crust?.name.replace(' Hand Tossed', '')} Custom Pizza
            </h4>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
            Freshly Baked
          </span>
        </div>

        {/* Itemized Specification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* 1. Size & Crust */}
          <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">1. Pizza Size</span>
              <span className="font-extrabold text-gray-900">{size?.name} ({size?.servingSize})</span>
              <p className="text-[11px] text-gray-500">₹{size?.basePrice}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* 2. Crust */}
          <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">2. Crust Base</span>
              <span className="font-extrabold text-gray-900">{crust?.name}</span>
              <p className="text-[11px] text-gray-500">+{crust?.additionalPrice ? `₹${crust.additionalPrice}` : 'Included'}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* 3. Sauce */}
          <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">3. Sauce</span>
              <span className="font-extrabold text-gray-900">{sauce?.name}</span>
              <p className="text-[11px] text-gray-500">+{sauce?.additionalPrice ? `₹${sauce.additionalPrice}` : 'Included'}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* 4. Cheese */}
          <div className="p-3.5 bg-gray-50 rounded-2xl flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">4. Cheese</span>
              <span className="font-extrabold text-gray-900">{cheese?.name}</span>
              <p className="text-[11px] text-gray-500">+{cheese?.additionalPrice ? `₹${cheese.additionalPrice}` : 'Included'}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* 5. Toppings List */}
        <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              5. Selected Toppings ({toppings.length})
            </span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Toppings</span>
            </button>
          </div>

          {toppings.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No toppings selected (Plain Cheese Pizza)</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {toppings.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className={`w-2 h-2 rounded-full ${t.topping.vegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
                  <span>{t.topping.name}</span>
                  {t.quantity === 'extra' && (
                    <span className="text-[10px] text-[#E53935] font-black uppercase">(Extra)</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 6. Extras List */}
        {extras.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                6. Optional Extras ({extras.length})
              </span>
              <button
                type="button"
                onClick={() => onEditStep(6)}
                className="text-[#E53935] hover:underline font-bold text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Extras</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {extras.map((ex) => (
                <span
                  key={ex.id}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1 shadow-2xs"
                >
                  <span>{ex.extra.name}</span>
                  <span className="text-[#E53935]">×{ex.quantity}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Allergen & Dietary Information (Spec Section 22) */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Allergen Information:</p>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Contains gluten (crust dough), dairy (mozzarella/cheddar cheese), and yeast. Handled in a facility that also processes soy and eggs.
            </p>
          </div>
        </div>

        {/* Add to Cart Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="w-full sm:w-1/3 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-colors text-xs sm:text-sm text-center"
          >
            Edit Pizza
          </button>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="w-full sm:w-2/3 py-4 px-6 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl shadow-xl transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isAddingToCart
                ? 'Adding to Cart...'
                : `Add to Cart • ₹${breakdown?.total || 349}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
