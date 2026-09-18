import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Product } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NutritionModal } from '../components/NutritionModal';

export const NutritionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products').then((res) => {
      if (res.data.success) setProducts(res.data.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <NutritionModal isOpen={true} onClose={() => window.history.back()} products={products} />
      </main>
      <Footer />
    </div>
  );
};
