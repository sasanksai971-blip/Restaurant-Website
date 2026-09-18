import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Flame, ArrowRight, Utensils, Award, Zap } from 'lucide-react';
import api from '../lib/api';
import { Product, Category, Offer } from '../types';

// Components
import { Header } from '../components/Header';
import { LocationBar } from '../components/LocationBar';
import { NotificationPopup } from '../components/NotificationPopup';
import { OrderingModeSelector } from '../components/OrderingModeSelector';
import { OfferCard } from '../components/OfferCard';
import { BestSellerCard } from '../components/BestSellerCard';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ProfileMenu } from '../components/ProfileMenu';
import { LocationModal } from '../components/LocationModal';
import { StoreSelectorModal } from '../components/StoreSelectorModal';
import { TableBookingModal } from '../components/TableBookingModal';
import { ScheduleDeliveryModal } from '../components/ScheduleDeliveryModal';
import { SupportChatModal } from '../components/SupportChatModal';
import { BulkOrderModal } from '../components/BulkOrderModal';
import { NutritionModal } from '../components/NutritionModal';
import { TermsModal } from '../components/TermsModal';
import { CartBar } from '../components/CartBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { Footer } from '../components/Footer';
import { ProductCardSkeleton, BestSellerSkeleton } from '../components/LoadingSkeleton';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // State for data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isTableBookingOpen, setIsTableBookingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [prodRes, catRes, offRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/offers'),
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (offRes.data.success) setOffers(offRes.data.data);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter helper functions
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 10);
  const cravingCategories = categories.slice(0, 12);

  const getProductsByCatSlug = (slug: string, limit = 8) => {
    return products.filter((p) => p.category?.slug === slug).slice(0, limit);
  };

  const vegPizzas = products.filter((p) => p.isVeg && p.category?.slug.includes('pizza')).slice(0, 8);
  const nonVegPizzas = products.filter((p) => !p.isVeg && p.category?.slug.includes('pizza')).slice(0, 8);
  const garlicBreads = getProductsByCatSlug('garlic-breads-dips');
  const crazyDeals = getProductsByCatSlug('deals');
  const pizzaMania = getProductsByCatSlug('pizza-mania');
  const cheeseLava = getProductsByCatSlug('cheese-lava');
  const cheeseBurst = getProductsByCatSlug('cheese-burst-pizza');
  const lunchFeast = getProductsByCatSlug('lunch-feast');

  // Spotlight filtered lists
  const localDelights = products.slice(0, 10);
  const top5Veg = products.filter((p) => p.isVeg).slice(0, 5);
  const top4NonVeg = products.filter((p) => !p.isVeg).slice(0, 4);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-red-500 selection:text-white">
      {/* 1. Header (Left logo, location, detect location, right profile) */}
      <Header
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      {/* 2. Location Bar (Spec: Dark Blue bg, "Give us your exact location" in white) */}
      <LocationBar onOpenSelector={() => setIsLocationOpen(true)} />

      {/* 3. Notification Popup (Spec Section 7) */}
      <NotificationPopup />

      <main className="flex-1 space-y-8 sm:space-y-12 pb-16">
        {/* 4. Ordering Mode Selector (Delivery, Schedule, Takeaway, Dine-in) */}
        <OrderingModeSelector
          onSelectSchedule={() => setIsScheduleOpen(true)}
          onSelectTakeaway={() => setIsStoreOpen(true)}
          onSelectDineIn={() => setIsTableBookingOpen(true)}
        />

        {/* 5. Offers for You Section (Spec: Green text heading, Blue & Orange ribbons) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              {/* Green text heading as explicitly specified */}
              <h3 className="text-xl sm:text-2xl font-black text-[#2E7D32] tracking-tight">
                Offers for you
              </h3>
            </div>
            <button
              onClick={() => navigate('/deals')}
              className="text-xs sm:text-sm font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onApply={() => navigate('/menu')}
              />
            ))}
          </div>
        </section>

        {/* 6. Top 10 Best Sellers (Spec: Gold text heading, Golden background section) */}
        <section className="bg-[#FFF8E1] border-y border-amber-200/60 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-bold">
                  ★
                </div>
                {/* Gold colored text heading as explicitly specified */}
                <h3 className="text-xl sm:text-2xl font-black text-[#B8860B] tracking-tight">
                  Top 10 Best Sellers
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
                Most Loved Pizzas
              </span>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <BestSellerSkeleton key={i} />)
                : bestSellers.map((prod) => (
                    <BestSellerCard
                      key={prod.id}
                      product={prod}
                      onOpenDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* Build Your Own Pizza Feature Showcase Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white shadow-xl p-6 sm:p-8">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Interactive 2D Pizza Studio</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Build Your Own Pizza <span className="text-amber-200">Just The Way You Like It!</span>
                </h3>
                <p className="text-sm text-red-50 leading-relaxed">
                  Choose from 3 sizes, 4 artisanal crusts, rich gourmet sauces, stretchy cheeses, and 17+ fresh toppings. Watch your pizza come to life in real-time with our interactive live visualizer!
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs font-semibold text-amber-100">
                  <span className="bg-black/20 px-2.5 py-1 rounded-lg">🍕 3 Sizes</span>
                  <span className="bg-black/20 px-2.5 py-1 rounded-lg">🧀 Cheese Burst & Stuffed</span>
                  <span className="bg-black/20 px-2.5 py-1 rounded-lg">🌶️ 17+ Fresh Toppings</span>
                  <span className="bg-black/20 px-2.5 py-1 rounded-lg">✨ Chef Presets</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => navigate('/build-your-pizza')}
                  className="px-8 py-4 bg-white hover:bg-amber-50 text-red-600 text-base font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Utensils className="w-5 h-5 text-red-600" />
                  <span>Start Customizing</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <span className="text-xs text-white/80 font-medium">Starting at just ₹199</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. What Are You Craving For? (Spec Section 22: 12 Category Cards) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤤</span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                What are you craving for?
              </h3>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="text-xs sm:text-sm font-bold text-[#E53935] hover:underline flex items-center gap-1"
            >
              <span>Explore Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {cravingCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => navigate(`/menu?category=${cat.slug}`)}
              />
            ))}
          </div>
        </section>

        {/* 8. Main Menu Section with Featured 5 Course Meal (Spec Section 28) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Featured 5 Course Meal Banner (Spec: Featured 5 Course Meal representing 5 pizzas) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-gray-950 via-red-950 to-black text-white p-6 sm:p-10 border border-red-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 sm:space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-600/30 border border-red-500/40 rounded-full text-xs font-black uppercase tracking-wider text-red-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chef's Ultimate Experience</span>
                </span>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                  The Royal <span className="text-[#FFD700]">5 Course Meal</span> Feast
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
                  Includes 1 Starters Combo, 2 Signature Medium Pizzas, 1 Gourmet Garlic Bread with Cheesy Dip, 2 Chilled Beverages & Hot Molten Choco Lava Cake.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <div className="text-2xl font-black text-[#FFD700]">
                    ₹899 <span className="text-xs text-gray-400 line-through">₹1499</span>
                  </div>
                  <button
                    onClick={() => navigate('/menu?category=deals')}
                    className="px-6 py-3 bg-[#E53935] hover:bg-red-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Order Feast Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Pizza collage visual */}
              <div className="grid grid-cols-3 gap-2 relative">
                <img
                  src="https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=400&q=80"
                  alt="Pizza 1"
                  className="rounded-2xl object-cover h-24 sm:h-28 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80"
                  alt="Pizza 2"
                  className="rounded-2xl object-cover h-24 sm:h-28 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
                  alt="Pizza 3"
                  className="rounded-2xl object-cover h-24 sm:h-28 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1534308983596-a01c86a64e32?w=400&q=80"
                  alt="Pizza 4"
                  className="rounded-2xl object-cover h-24 sm:h-28 w-full shadow-md col-span-2"
                />
                <img
                  src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80"
                  alt="Pizza 5"
                  className="rounded-2xl object-cover h-24 sm:h-28 w-full shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Specified Categories in Exact Order (Spec Section 28):
              1. Veg Pizza
              2. Pizza Mania
              3. Crazy Deals
              4. Cheese Mania / Lava
              5. Cheese Lava
              6. Cheese Burst
              7. Special Combos (Lunch Feast)
          */}
          {/* 1. Veg Pizza */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-600" />
                <span>Veg Pizzas</span>
              </h4>
              <button
                onClick={() => navigate('/menu?category=veg-pizza')}
                className="text-xs font-bold text-[#E53935] hover:underline"
              >
                See All ({vegPizzas.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : vegPizzas.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpenDetails={(item) => setSelectedProduct(item)}
                    />
                  ))}
            </div>
          </div>

          {/* 2. Pizza Mania */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span>🎯</span>
                <span>Pizza Mania (Pocket Friendly)</span>
              </h4>
              <button
                onClick={() => navigate('/menu?category=pizza-mania')}
                className="text-xs font-bold text-[#E53935] hover:underline"
              >
                See All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {pizzaMania.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenDetails={(item) => setSelectedProduct(item)}
                />
              ))}
            </div>
          </div>

          {/* 3. Crazy Deals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg sm:text-xl font-black text-[#E53935] flex items-center gap-2">
                <Zap className="w-5 h-5 fill-red-500" />
                <span>Crazy Deals & Combos</span>
              </h4>
              <button
                onClick={() => navigate('/menu?category=deals')}
                className="text-xs font-bold text-[#E53935] hover:underline"
              >
                See All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {crazyDeals.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenDetails={(item) => setSelectedProduct(item)}
                />
              ))}
            </div>
          </div>

          {/* 4 & 5. Cheese Lava & Burst */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <span>🧀</span>
                <span>Cheese Lava & Volcano Special</span>
              </h4>
              <button
                onClick={() => navigate('/menu?category=cheese-lava')}
                className="text-xs font-bold text-[#E53935] hover:underline"
              >
                See All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {cheeseLava.concat(cheeseBurst).slice(0, 4).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenDetails={(item) => setSelectedProduct(item)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9. Spotlight Section (Spec Section 29) */}
        <section className="bg-gray-50/70 border-t border-gray-100 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-8 bg-[#E53935] rounded-full" />
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Spotlight
                </h3>
                <p className="text-xs text-gray-500">Curated top picks in your neighborhood</p>
              </div>
            </div>

            {/* Top 10 Delights in Your Locality */}
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-gray-800 mb-3 flex items-center gap-2">
                <span>📍</span>
                <span>Top 10 Delights in Your Locality</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {localDelights.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>

            {/* Top 5 in Veg */}
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-green-700 mb-3 flex items-center gap-2">
                <span>🥗</span>
                <span>Top 5 in Veg</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {top5Veg.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>

            {/* Top 4 in Non Veg */}
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-red-700 mb-3 flex items-center gap-2">
                <span>🍗</span>
                <span>Top 4 in Non Veg</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {top4NonVeg.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>

            {/* Garlic Breads and Dips */}
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-amber-800 mb-3 flex items-center gap-2">
                <span>🥖</span>
                <span>Garlic Breads and Dips</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {garlicBreads.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Bottom Red Cart Bar */}
      <CartBar onOpenCart={() => navigate('/cart')} />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenDeals={() => navigate('/deals')}
        onOpenTrack={() => navigate('/orders')}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenHelp={() => setIsSupportOpen(true)}
        onOpenNutrition={() => setIsNutritionOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      <StoreSelectorModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
      />

      <TableBookingModal
        isOpen={isTableBookingOpen}
        onClose={() => setIsTableBookingOpen(false)}
        onSuccess={() => navigate('/menu')}
      />

      <ScheduleDeliveryModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <BulkOrderModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
      />

      <NutritionModal
        isOpen={isNutritionOpen}
        onClose={() => setIsNutritionOpen(false)}
        products={products}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
};
