import React from 'react';
import { PresetCombo } from '../../types/customPizza';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetCombo) => void;
}

export const PRESET_COMBOS: PresetCombo[] = [
  {
    id: 'spicy-chicken',
    name: 'Spicy Chicken Fiesta',
    emoji: '🔥',
    tagline: 'Peri Peri Chicken, Jalapeños & BBQ Sauce',
    isVeg: false,
    sizeName: 'Medium',
    crustName: 'Thin Crust',
    sauceName: 'BBQ Sauce',
    cheeseName: 'Mozzarella',
    toppingNames: [
      { name: 'Peri Peri Chicken', quantity: 'normal' },
      { name: 'Jalapeño', quantity: 'normal' },
      { name: 'Onion', quantity: 'normal' },
    ],
  },
  {
    id: 'farmhouse-veg',
    name: 'Farmhouse Gourmet Veg',
    emoji: '🍄',
    tagline: 'Mushroom, Capsicum, Corn & Olives',
    isVeg: true,
    sizeName: 'Medium',
    crustName: 'Classic Hand Tossed',
    sauceName: 'Classic Tomato',
    cheeseName: 'Mozzarella',
    toppingNames: [
      { name: 'Mushroom', quantity: 'normal' },
      { name: 'Capsicum', quantity: 'normal' },
      { name: 'Sweet Corn', quantity: 'normal' },
      { name: 'Olives', quantity: 'normal' },
    ],
  },
  {
    id: 'cheese-lover',
    name: 'Ultimate Cheese Explosion',
    emoji: '🧀',
    tagline: 'Cheese Burst Crust + Extra Mozzarella',
    isVeg: true,
    sizeName: 'Medium',
    crustName: 'Cheese Burst',
    sauceName: 'Classic Tomato',
    cheeseName: 'Extra Mozzarella',
    toppingNames: [
      { name: 'Paneer Cubes', quantity: 'normal' },
      { name: 'Double Cheese', quantity: 'normal' },
    ],
  },
  {
    id: 'indian-spicy',
    name: 'Desi Tadka Spicy Veg',
    emoji: '🌶️',
    tagline: 'Paneer Cubes, Spicy Tomato & Capsicum',
    isVeg: true,
    sizeName: 'Medium',
    crustName: 'Classic Hand Tossed',
    sauceName: 'Spicy Tomato',
    cheeseName: 'Mozzarella',
    toppingNames: [
      { name: 'Paneer Cubes', quantity: 'normal' },
      { name: 'Onion', quantity: 'normal' },
      { name: 'Capsicum', quantity: 'normal' },
      { name: 'Jalapeño', quantity: 'normal' },
    ],
  },
  {
    id: 'chicken-tikka-special',
    name: 'Royal Chicken Tikka',
    emoji: '🍗',
    tagline: 'Tandoori Chicken Tikka, Sausage & Olives',
    isVeg: false,
    sizeName: 'Large',
    crustName: 'Cheese Burst',
    sauceName: 'Classic Tomato',
    cheeseName: 'Extra Mozzarella',
    toppingNames: [
      { name: 'Chicken Tikka', quantity: 'extra' },
      { name: 'Chicken Sausage', quantity: 'normal' },
      { name: 'Olives', quantity: 'normal' },
    ],
    extraNames: [{ name: 'Garlic Dip', quantity: 1 }],
  },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-3xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <h4 className="font-extrabold text-sm text-gray-900">
          Not sure what to choose? Pick a Chef Recipe Preset:
        </h4>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {PRESET_COMBOS.map((combo) => (
          <button
            key={combo.id}
            type="button"
            onClick={() => onSelectPreset(combo)}
            className="bg-white hover:bg-amber-100/50 border border-amber-200 p-3.5 rounded-2xl text-left transition-all min-w-[220px] max-w-[240px] flex-shrink-0 shadow-2xs hover:shadow-sm cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{combo.emoji}</span>
              <span className="font-bold text-xs text-gray-900 truncate">
                {combo.name}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 leading-snug">
              {combo.tagline}
            </p>
            <div className="mt-2 text-[10px] font-black text-[#E53935] flex items-center justify-between">
              <span>Auto-fill recipe</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
