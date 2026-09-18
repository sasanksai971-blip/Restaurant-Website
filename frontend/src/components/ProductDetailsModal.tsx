import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  const { addItem } = useCartStore();

  const [size, setSize] = useState<'regular' | 'medium' | 'large'>('regular');
  const [crust, setCrust] = useState<'classic' | 'cheese-burst' | 'wheat-thin'>('classic');
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraOlives, setExtraOlives] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  if (!product) return null;

  // Calculate dynamic price based on selections
  const basePrice = product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.price;
  
  let sizeMultiplier = 0;
  if (size === 'medium') sizeMultiplier = 120;
  if (size === 'large') sizeMultiplier = 240;

  let crustPrice = 0;
  if (crust === 'cheese-burst') crustPrice = 99;
  if (crust === 'wheat-thin') crustPrice = 49;

  let addonPrice = 0;
  if (extraCheese) addonPrice += 60;
  if (extraOlives) addonPrice += 40;

  const unitPrice = basePrice + sizeMultiplier + crustPrice + addonPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customSummary = [
      `Size: ${size.toUpperCase()}`,
      crust !== 'classic' ? `Crust: ${crust.replace('-', ' ')}` : null,
      extraCheese ? '+Extra Cheese' : null,
      extraOlives ? '+Extra Olives' : null,
    ]
      .filter(Boolean)
      .join(', ');

    // Add with custom customization and calculated price
    const customProduct: Product = {
      ...product,
      price: unitPrice,
      discountedPrice: null,
    };

    addItem(customProduct, quantity, customSummary);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Image */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-gray-900 flex-shrink-0">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Product Details Over Image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                {/* Veg / Non Veg badge */}
                <div className="bg-white p-1 rounded-sm">
                  <div
                    className={`w-3 h-3 border-2 rounded-xs flex items-center justify-center ${
                      product.isVeg ? 'border-green-600' : 'border-red-600'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">
                  {product.isVeg ? 'Pure Veg' : 'Non-Vegetarian'}
                </span>
                {product.isBestSeller && (
                  <span className="px-2 py-0.5 bg-amber-400 text-gray-950 font-black text-[10px] rounded-full uppercase">
                    ★ Top Seller
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{product.name}</h2>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Description & Ingredients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
              {product.ingredients && (
                <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <strong className="text-gray-700">Ingredients:</strong> {product.ingredients}
                </p>
              )}
            </div>

            {/* Nutritional Accordion / Section (Spec: Section 13) */}
            <div className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-gray-900">
                    Nutritional Information (Per Serving)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  {showNutrition ? 'Hide' : 'View Full Details'}
                </button>
              </div>

              {/* Quick macros */}
              <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-medium">Calories</span>
                  <span className="text-xs font-black text-gray-900">{product.calories || 620} kcal</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-medium">Protein</span>
                  <span className="text-xs font-black text-emerald-700">{product.protein || 24}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-medium">Carbs</span>
                  <span className="text-xs font-black text-gray-900">{product.carbs || 78}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-medium">Fat</span>
                  <span className="text-xs font-black text-gray-900">{product.fat || 22}g</span>
                </div>
              </div>

              {/* Full nutritional breakdown table */}
              {showNutrition && (
                <div className="mt-3 pt-3 border-t border-emerald-100">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-emerald-100/60 py-1">
                        <td className="py-1 text-gray-600">Energy (Calories)</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.calories || 620} kcal</td>
                      </tr>
                      <tr className="border-b border-emerald-100/60 py-1">
                        <td className="py-1 text-gray-600">Protein</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.protein || 24} g</td>
                      </tr>
                      <tr className="border-b border-emerald-100/60 py-1">
                        <td className="py-1 text-gray-600">Carbohydrates</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.carbs || 78} g</td>
                      </tr>
                      <tr className="border-b border-emerald-100/60 py-1">
                        <td className="py-1 text-gray-600">Total Fat</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.fat || 22} g</td>
                      </tr>
                      <tr className="border-b border-emerald-100/60 py-1">
                        <td className="py-1 text-gray-600">Added Sugar</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.sugar || 5} g</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">Sodium</td>
                        <td className="py-1 text-right font-bold text-gray-900">{product.sodium || 640} mg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Customization: Size */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                1. Select Pizza Size
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'regular', label: 'Regular (7")', sub: 'Feeds 1', adder: 0 },
                  { id: 'medium', label: 'Medium (10")', sub: 'Feeds 2', adder: 120 },
                  { id: 'large', label: 'Large (12")', sub: 'Feeds 3-4', adder: 240 },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      size === s.id
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{s.label}</div>
                    <div className={`text-[11px] ${size === s.id ? 'text-gray-300' : 'text-gray-500'}`}>
                      {s.sub}
                    </div>
                    <div className={`text-xs font-black mt-1 ${size === s.id ? 'text-red-400' : 'text-[#E53935]'}`}>
                      {s.adder > 0 ? `+₹${s.adder}` : 'Included'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization: Crust Choice */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                2. Select Crust
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'classic', label: 'New Hand Tossed Classic', price: 0 },
                  { id: 'cheese-burst', label: 'Cheese Burst Crust (Molten liquid cheese)', price: 99 },
                  { id: 'wheat-thin', label: '100% Wheat Thin Crust', price: 49 },
                ].map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      crust === c.id
                        ? 'border-black bg-gray-50 font-bold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="crust"
                        checked={crust === c.id}
                        onChange={() => setCrust(c.id as any)}
                        className="w-4 h-4 text-[#E53935] focus:ring-[#E53935]"
                      />
                      <span className="text-xs sm:text-sm text-gray-800">{c.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#E53935]">
                      {c.price > 0 ? `+₹${c.price}` : 'Free'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customization: Add-ons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                3. Delicious Add-ons
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extraCheese}
                      onChange={(e) => setExtraCheese(e.target.checked)}
                      className="w-4 h-4 text-[#E53935] rounded focus:ring-[#E53935]"
                    />
                    <span className="text-xs font-medium text-gray-800">Extra Cheese</span>
                  </div>
                  <span className="text-xs font-bold text-[#E53935]">+₹60</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extraOlives}
                      onChange={(e) => setExtraOlives(e.target.checked)}
                      className="w-4 h-4 text-[#E53935] rounded focus:ring-[#E53935]"
                    />
                    <span className="text-xs font-medium text-gray-800">Extra Olives</span>
                  </div>
                  <span className="text-xs font-bold text-[#E53935]">+₹40</span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer Bar with Dynamic Price & Add Button */}
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            {/* Quantity Control */}
            <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-2xl border border-gray-200 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-xl bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-[#E53935] flex items-center justify-center font-bold transition-colors"
                aria-label="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-black text-sm text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-xl bg-[#E53935] text-white hover:bg-red-700 flex items-center justify-center font-bold transition-colors"
                aria-label="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base text-white shadow-lg flex items-center justify-between transition-all active:scale-98 ${
                added ? 'bg-green-600' : 'bg-[#E53935] hover:bg-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                  </>
                )}
              </div>
              <span className="text-base sm:text-lg">₹{totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
