import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Tag, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface BottomNavigationProps {
  onOpenProfile?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onOpenProfile }) => {
  const location = useLocation();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const isMenu = location.pathname.startsWith('/menu');
  const isDeals = location.pathname.startsWith('/deals') || location.pathname.startsWith('/offers');
  const isCart = location.pathname.startsWith('/cart');
  const isHome = location.pathname === '/';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-gray-200/80 px-4 py-2">
      <nav className="flex items-center justify-around">
        {/* Menu (Specification: Menu + Transparent appearance + Bold text) */}
        <Link
          to="/menu"
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            isMenu ? 'text-[#E53935] font-black' : 'text-gray-700 font-bold hover:text-black'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[11px] tracking-wide uppercase">Menu</span>
        </Link>

        {/* Offers (Specification: Offers + Bold text) */}
        <Link
          to="/deals"
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            isDeals ? 'text-[#E53935] font-black' : 'text-gray-700 font-bold hover:text-black'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[11px] tracking-wide uppercase">Offers</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center gap-1 p-1.5 transition-colors ${
            isCart ? 'text-[#E53935] font-black' : 'text-gray-700 font-bold hover:text-black'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#E53935] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-wide uppercase">Cart</span>
        </Link>

        {/* Account / Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-1 p-1.5 text-gray-700 font-bold hover:text-black transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] tracking-wide uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
};
