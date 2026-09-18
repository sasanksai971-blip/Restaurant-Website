import React from 'react';
import { PizzaCrust } from '../../../types/customPizza';
import { Check } from 'lucide-react';

interface CrustStepProps {
  crusts: PizzaCrust[];
  selectedCrust: PizzaCrust | null;
  onSelectCrust: (crust: PizzaCrust) => void;
}

export const CrustStep: React.FC<CrustStepProps> = ({
  crusts,
  selectedCrust,
  onSelectCrust,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 2: Select Your Crust Base</h3>
        <p className="text-xs text-gray-500">
          From crisp thin crust to indulgent molten cheese burst.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {crusts.map((c) => {
          const isSelected = selectedCrust?.id === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCrust(c)}
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

              <div className="pr-8">
                <h4 className="font-extrabold text-base text-gray-900">{c.name}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Additional</span>
                <span className="text-sm font-black text-[#E53935]">
                  {c.additionalPrice === 0 ? 'Included (₹0)' : `+₹${c.additionalPrice}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
