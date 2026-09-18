import React from 'react';
import { PizzaSauce } from '../../../types/customPizza';
import { Check } from 'lucide-react';

interface SauceStepProps {
  sauces: PizzaSauce[];
  selectedSauce: PizzaSauce | null;
  onSelectSauce: (sauce: PizzaSauce) => void;
}

export const SauceStep: React.FC<SauceStepProps> = ({
  sauces,
  selectedSauce,
  onSelectSauce,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 3: Pick Your Sauce Base</h3>
        <p className="text-xs text-gray-500">
          Spread with flavorful culinary herbs and vine-ripened tomatoes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {sauces.map((s) => {
          const isSelected = selectedSauce?.id === s.id;

          return (
            <div
              key={s.id}
              onClick={() => onSelectSauce(s)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'border-black bg-gray-50 shadow-md ring-4 ring-black/5 scale-[1.01]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Sauce Color Pill */}
                <div
                  className="w-10 h-10 rounded-2xl flex-shrink-0 shadow-inner border border-black/10 flex items-center justify-center"
                  style={{ backgroundColor: s.color }}
                >
                  <span className="text-xs">🥫</span>
                </div>

                <div className="pr-6">
                  <h4 className="font-extrabold text-base text-gray-900">{s.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Price</span>
                <span className="text-sm font-black text-[#E53935]">
                  {s.additionalPrice === 0 ? 'Free (₹0)' : `+₹${s.additionalPrice}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
