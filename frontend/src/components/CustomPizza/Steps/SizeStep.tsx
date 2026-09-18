import React from 'react';
import { PizzaSize } from '../../../types/customPizza';
import { Check, Users } from 'lucide-react';

interface SizeStepProps {
  sizes: PizzaSize[];
  selectedSize: PizzaSize | null;
  onSelectSize: (size: PizzaSize) => void;
}

export const SizeStep: React.FC<SizeStepProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-900">Step 1: Choose Your Pizza Size</h3>
        <p className="text-xs text-gray-500">
          Select base diameter and crust portion for your custom creation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {sizes.map((s) => {
          const isSelected = selectedSize?.id === s.id;
          const diameter = s.name === 'Small' ? '7"' : s.name === 'Medium' ? '10"' : '12"';
          const sliceCircleSize = s.name === 'Small' ? 'w-12 h-12' : s.name === 'Medium' ? 'w-16 h-16' : 'w-20 h-20';

          return (
            <div
              key={s.id}
              onClick={() => onSelectSize(s)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between items-center text-center relative ${
                isSelected
                  ? 'border-black bg-gray-50 shadow-md ring-4 ring-black/5 scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Pizza Visual Scale Icon */}
              <div className="my-3 h-24 flex items-center justify-center">
                <div
                  className={`${sliceCircleSize} rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md border-4 border-amber-200/80 flex items-center justify-center text-white font-black text-xs transition-transform hover:scale-105`}
                >
                  {diameter}
                </div>
              </div>

              <div className="w-full">
                <h4 className="font-extrabold text-base text-gray-900">{s.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span>{s.description}</span>
                </p>
                <p className="text-[11px] text-gray-400">{s.servingSize}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Base Price</span>
                  <span className="text-base font-black text-[#E53935]">₹{s.basePrice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
