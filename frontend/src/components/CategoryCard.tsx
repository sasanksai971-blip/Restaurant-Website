import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

// Creative custom emojis & icons for categories
const emojiMap: Record<string, string> = {
  'cheese-lava': '🧀',
  'big-big-pizza': '🍕',
  'lunch-feast': '🍱',
  'veg-pizza': '🥗',
  'non-veg-pizza': '🍗',
  'deals': '🏷️',
  'chicken-feast': '🍖',
  'cheese-burst-pizza': '🫧',
  'cheese-volcano': '🌋',
  'pizza-mania': '🎯',
  'garlic-breads-dips': '🍞',
  'beverages': '🥤',
  'dessert': '🍰',
  'no-onion-no-garlic': '🚫',
  'tacos-parcel': '🌮',
  'slices': '✂️',
  'cheese-burst-2in1': '2️⃣',
};

const bgColors: Record<string, string> = {
  'cheese-lava': 'from-amber-50 to-orange-50 text-amber-900 border-amber-200',
  'big-big-pizza': 'from-red-50 to-rose-50 text-red-900 border-red-200',
  'lunch-feast': 'from-emerald-50 to-teal-50 text-emerald-900 border-emerald-200',
  'veg-pizza': 'from-green-50 to-lime-50 text-green-900 border-green-200',
  'non-veg-pizza': 'from-rose-50 to-red-50 text-rose-900 border-rose-200',
  'deals': 'from-yellow-50 to-amber-50 text-yellow-900 border-yellow-200',
  'chicken-feast': 'from-orange-50 to-amber-50 text-orange-900 border-orange-200',
  'cheese-burst-pizza': 'from-blue-50 to-indigo-50 text-blue-900 border-blue-200',
  'cheese-volcano': 'from-amber-50 to-red-50 text-amber-900 border-amber-200',
  'pizza-mania': 'from-purple-50 to-indigo-50 text-purple-900 border-purple-200',
  'garlic-breads-dips': 'from-stone-50 to-amber-50 text-stone-900 border-stone-200',
  'beverages': 'from-cyan-50 to-blue-50 text-cyan-900 border-cyan-200',
  'dessert': 'from-pink-50 to-rose-50 text-pink-900 border-pink-200',
  'no-onion-no-garlic': 'from-emerald-50 to-green-50 text-emerald-900 border-emerald-200',
  'tacos-parcel': 'from-orange-50 to-yellow-50 text-orange-900 border-orange-200',
  'slices': 'from-red-50 to-amber-50 text-red-900 border-red-200',
  'cheese-burst-2in1': 'from-indigo-50 to-purple-50 text-indigo-900 border-indigo-200',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onClick,
}) => {
  const emoji = emojiMap[category.slug] || '🍕';
  const colorClass = bgColors[category.slug] || 'from-gray-50 to-gray-100 text-gray-900 border-gray-200';

  return (
    <button
      onClick={onClick}
      className={`group p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-b from-gray-900 to-black text-white border-black shadow-lg scale-105'
          : `bg-gradient-to-b ${colorClass} hover:shadow-md hover:scale-102`
      }`}
    >
      {/* Icon Circle */}
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-2 sm:mb-2.5 transition-transform group-hover:scale-110 ${
          isSelected ? 'bg-white/20' : 'bg-white shadow-xs'
        }`}
      >
        {emoji}
      </div>

      <span
        className={`text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 ${
          isSelected ? 'text-white' : 'text-gray-900'
        }`}
      >
        {category.name}
      </span>
    </button>
  );
};
