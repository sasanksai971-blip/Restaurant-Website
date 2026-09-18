import React, { useState } from 'react';
import { Plus, Minus, Check, Activity } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  const { addItem, updateQuantity, items } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find((i) => i.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addItem(product, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const finalPrice = product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.price;

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Section with Bottom-Right Add Button */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs border border-gray-200">
          <div
            className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
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

        {/* Best Seller or Veg Tag */}
        {product.isBestSeller && (
          <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            ★ Bestseller
          </div>
        )}

        {/* Nutritional Badge */}
        {product.calories && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails && onOpenDetails(product);
            }}
            className="absolute bottom-2.5 left-2.5 bg-black/60 hover:bg-black/80 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 transition-colors"
          >
            <Activity className="w-2.5 h-2.5 text-emerald-400" />
            <span>{product.calories} kcal</span>
          </button>
        )}

        {/* Add Button at Bottom-Right of the Image/Card (Specification requirement) */}
        <div className="absolute bottom-2.5 right-2.5">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1 transition-all active:scale-95 ${
                justAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-[#E53935] hover:bg-red-700 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <span>Add +</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-red-200 flex items-center p-0.5">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-lg bg-red-50 text-[#E53935] hover:bg-[#E53935] hover:text-white flex items-center justify-center transition-colors font-bold"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-black text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-lg bg-[#E53935] text-white hover:bg-red-700 flex items-center justify-center transition-colors font-bold"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-[#E53935] transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-gray-950">
              ₹{finalPrice}
            </span>
            {product.discountedPrice && product.discountedPrice < product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-[#E53935] group-hover:underline">
            Customise &gt;
          </span>
        </div>
      </div>
    </div>
  );
};
