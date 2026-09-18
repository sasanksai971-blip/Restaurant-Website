import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import api from '../lib/api';
import { Product, Category } from '../types';

import { Header } from '../components/Header';
import { MenuFilters, VegFilterType, SortType } from '../components/MenuFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ProfileMenu } from '../components/ProfileMenu';
import { LocationModal } from '../components/LocationModal';
import { CartBar } from '../components/CartBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { Footer } from '../components/Footer';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [vegFilter, setVegFilter] = useState<VegFilterType>('all');
  const [sortFilter, setSortFilter] = useState<SortType>('default');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
      } catch (err) {
        console.error('Error fetching menu data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        const matchesCategory =
          activeCategorySlug === 'all' || p.category?.slug === activeCategorySlug;

        // Veg / Non-Veg filter
        let matchesVeg = true;
        if (vegFilter === 'veg') matchesVeg = p.isVeg;
        if (vegFilter === 'non-veg') matchesVeg = !p.isVeg;

        // Search query
        const matchesSearch =
          !searchTerm.trim() ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ingredients?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesVeg && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;

        if (sortFilter === 'price_asc') return priceA - priceB;
        if (sortFilter === 'price_desc') return priceB - priceA;
        return 0;
      });
  }, [products, activeCategorySlug, vegFilter, sortFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Top Controls Bar: Search + Veg/NonVeg/Sort */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pizzas, garlic breads, desserts..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Three Primary Controls (Spec Section 24): 1. Veg Only, 2. Non Veg Only, 3. Sort */}
          <MenuFilters
            vegFilter={vegFilter}
            sortFilter={sortFilter}
            onVegFilterChange={(v) => setVegFilter(v)}
            onSortChange={(s) => setSortFilter(s)}
          />
        </div>

        {/* Layout: Sticky Category Sidebar on Desktop + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar (17 Full Menu Categories from Spec Section 27) */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-gray-100 p-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-3 mb-3">
                Full Menu Categories
              </h3>

              {/* Horizontal Scroll on Mobile / Vertical on Desktop */}
              <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className={`px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between whitespace-nowrap flex-shrink-0 lg:w-full cursor-pointer ${
                    activeCategorySlug === 'all'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>All Items</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeCategorySlug === 'all' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {products.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected = activeCategorySlug === cat.slug;
                  const count = products.filter((p) => p.category?.slug === cat.slug).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between whitespace-nowrap flex-shrink-0 lg:w-full cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{cat.slug.includes('veg') ? '🥗' : cat.slug.includes('chicken') ? '🍗' : '🍕'}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20' : 'bg-gray-200'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 capitalize">
                {activeCategorySlug === 'all'
                  ? 'All Menu Delights'
                  : categories.find((c) => c.slug === activeCategorySlug)?.name || 'Menu'}
              </h2>
              <span className="text-xs text-gray-500 font-semibold">
                Showing {filteredProducts.length} items
              </span>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenDetails={(item) => setSelectedProduct(item)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state (Spec Section 46) */
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 p-8">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-900 text-lg">No pizzas found</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters, clearing your search query, or picking another category.
                </p>
                <button
                  onClick={() => {
                    setVegFilter('all');
                    setSortFilter('default');
                    setSearchTerm('');
                    handleSelectCategory('all');
                  }}
                  className="mt-4 px-5 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CartBar onOpenCart={() => navigate('/cart')} />
      <BottomNavigation onOpenProfile={() => setIsProfileOpen(true)} />
      <Footer />

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
};
