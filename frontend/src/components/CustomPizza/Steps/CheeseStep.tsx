import React from 'react';
import { PizzaCheese } from '../../../types/customPizza';
import { Check } from 'lucide-react';

interface CheeseStepProps {
  cheeses: PizzaCheese[];
  selectedCheese: PizzaCheese | null;
  onSelectCheese: (cheese: PizzaCheese) => void;
}

export const CheeseStep: React.FC<CheeseStepProps> = ({
  cheeses,
  selectedCheese,
  onSelectCheese,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 4: Select Your Cheese Layer</h3>
        <p className="text-xs text-gray-500">
          Creamy 100% mozzarella, rich cheddar blend, or dairy-free vegan cheese.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {cheeses.map((ch) => {
          const isSelected = selectedCheese?.id === ch.id;

          return (
            <div
              key={ch.id}
              onClick={() => onSelectCheese(ch)}
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
                <div
                  className="w-10 h-10 rounded-2xl flex-shrink-0 shadow-inner border border-amber-200 flex items-center justify-center"
                  style={{ backgroundColor: ch.color }}
                >
                  <span className="text-xs">🧀</span>
                </div>

                <div className="pr-6">
                  <h4 className="font-extrabold text-base text-gray-900">{ch.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ch.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Additional</span>
                <span className="text-sm font-black text-[#E53935]">
                  {ch.additionalPrice === 0 ? 'Included (₹0)' : `+₹${ch.additionalPrice}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
