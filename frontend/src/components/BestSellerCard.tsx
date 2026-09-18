import React from 'react';
import { Plus, Check, Info } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface BestSellerCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const BestSellerCard: React.FC<BestSellerCardProps> = ({ product, onOpenDetails }) => {
  const { addItem, items } = useCartStore();
  const [justAdded, setJustAdded] = React.useState(false);

  const cartItem = items.find((i) => i.productId === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 rounded-2xl overflow-hidden shadow-xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between min-w-[240px] sm:min-w-[270px] max-w-[290px] flex-shrink-0 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-800">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs p-1.5 rounded-md border border-white/10">
          <div
            className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
              product.isVeg ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                product.isVeg ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Best Seller Gold Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          ★ Best Seller
        </div>

        {/* Nutritional info button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails && onOpenDetails(product);
          }}
          className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white/80 rounded-full backdrop-blur-xs text-xs"
          title="Nutritional details"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Section (Spec: Product names: White, Ingredient caption: Small white text) */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
            {product.name}
          </h4>

          {/* Small white ingredients text */}
          <p className="text-[11px] text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
            {product.ingredients || product.description}
          </p>
        </div>

        {/* Price & Add Button Row */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white">
              ₹{product.discountedPrice || product.price}
            </span>
            {product.discountedPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Add button (Spec: Red background, White text, text: `Add +`) */}
          <button
            onClick={handleAdd}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-1 cursor-pointer ${
              justAdded
                ? 'bg-green-600 text-white'
                : 'bg-[#E53935] hover:bg-red-700 active:scale-95 text-white'
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
                {qtyInCart > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-black/40 text-white rounded-full text-[10px]">
                    {qtyInCart}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
