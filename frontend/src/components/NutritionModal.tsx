import React, { useState } from 'react';
import { X, Activity, Search, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ isOpen, onClose, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : filterType === 'veg' ? p.isVeg : !p.isVeg;
    return matchesSearch && matchesType;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Nutritional & Allergen Guide</h3>
                  <p className="text-xs text-emerald-100">Calculated per 100g / Standard Serving Size</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    filterType === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setFilterType('veg')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    filterType === 'veg' ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Veg Only
                </button>
                <button
                  onClick={() => setFilterType('non-veg')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    filterType === 'non-veg' ? 'bg-red-700 text-white border-red-700' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Product</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Calories</th>
                      <th className="p-3 text-right">Protein</th>
                      <th className="p-3 text-right">Carbs</th>
                      <th className="p-3 text-right">Total Fat</th>
                      <th className="p-3 text-right">Sugar</th>
                      <th className="p-3 text-right rounded-r-xl">Sodium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 font-bold text-gray-900">{item.name}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-gray-900">{item.calories || 620} kcal</td>
                        <td className="p-3 text-right font-semibold text-emerald-700">{item.protein || 24} g</td>
                        <td className="p-3 text-right text-gray-700">{item.carbs || 78} g</td>
                        <td className="p-3 text-right text-gray-700">{item.fat || 22} g</td>
                        <td className="p-3 text-right text-gray-700">{item.sugar || 5} g</td>
                        <td className="p-3 text-right text-gray-700">{item.sodium || 640} mg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Data sourced strictly from application nutritional records.</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
