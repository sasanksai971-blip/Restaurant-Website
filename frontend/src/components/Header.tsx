import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, ShoppingBag, MapPin, Navigation, Search, Menu as MenuIcon, PhoneCall } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  onOpenProfile?: () => void;
  onOpenLocation?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenLocation,
  onOpenSearch,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { currentAddress, cityName, detectLocation } = useLocationStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const isMenuPage = location.pathname.startsWith('/menu');
  const isOffersPage = location.pathname.startsWith('/deals') || location.pathname.startsWith('/offers');

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#E53935] to-[#FF6B6B] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl sm:text-2xl">🍕</span>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-950 flex items-center">
                  PIZZA<span className="text-[#E53935]">RUSH</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-gray-400 -mt-1 tracking-widest uppercase">
                  Fresh & Oven-Hot
                </span>
              </div>
            </Link>

            {/* Beside Logo: Location & Detect Location underneath */}
            <div className="border-l border-gray-200 pl-3 sm:pl-5 min-w-0">
              <div
                onClick={onOpenLocation}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-[#E53935] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[220px] group-hover:text-[#E53935] transition-colors">
                  {cityName ? `${cityName} • ${currentAddress}` : 'Select Location'}
                </span>
              </div>

              {/* Under logo/location: Detect Location */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  detectLocation();
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#1565C0] hover:text-[#0D47A1] hover:underline mt-0.5 text-left"
              >
                <Navigation className="w-2.5 h-2.5" />
                <span>Detect Location</span>
              </button>
            </div>
          </div>

          {/* Right Area: Search, Profile, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Search shortcut button */}
            <button
              onClick={onOpenSearch || (() => navigate('/menu'))}
              className="p-2 sm:px-3 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full sm:rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-transparent sm:border-gray-200 transition-colors"
              title="Search menu"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="hidden md:inline">Search Pizza...</span>
            </button>

            {/* Profile Button (Specification: Profile area with White background, Grey text) */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 rounded-xl border border-gray-200 shadow-sm transition-all"
              aria-label="User Account"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-gray-700 leading-tight">
                  {isAuthenticated ? (user?.name || user?.phone || 'My Account') : 'Account'}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {isAuthenticated ? 'Logged In' : 'Login / Register'}
                </p>
              </div>
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 sm:px-3.5 sm:py-2 bg-red-50 hover:bg-red-100 text-[#E53935] rounded-xl flex items-center gap-2 font-bold text-xs sm:text-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 bg-[#E53935] text-white text-[11px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Persistent Navigation: Menu & Offers (Specification: Transparent appearance, Bold text) */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link
              to="/menu"
              className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all border-b-2 ${
                isMenuPage
                  ? 'border-[#E53935] text-[#E53935]'
                  : 'border-transparent text-gray-800 hover:text-[#E53935]'
              }`}
            >
              <span>🍕</span>
              <span>Menu</span>
            </Link>

            <Link
              to="/deals"
              className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all border-b-2 ${
                isOffersPage
                  ? 'border-[#E53935] text-[#E53935]'
                  : 'border-transparent text-gray-800 hover:text-[#E53935]'
              }`}
            >
              <span>🏷️</span>
              <span>Offers & Deals</span>
            </Link>

            <Link
              to="/bulk-order"
              className="hidden md:flex py-2.5 px-3 text-xs sm:text-sm font-bold tracking-wide uppercase text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>🎉</span>
              <span>Bulk Order</span>
            </Link>

            <Link
              to="/nutrition"
              className="hidden lg:flex py-2.5 px-3 text-xs sm:text-sm font-bold tracking-wide uppercase text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>🥗</span>
              <span>Nutrition</span>
            </Link>
          </nav>

          {/* Hotline */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
            <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>24/7 Delivery Hotline: <strong className="text-gray-900">1800-PIZZA-NOW</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
