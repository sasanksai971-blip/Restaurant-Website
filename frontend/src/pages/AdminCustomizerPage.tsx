import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Check, X, Shield, RefreshCw, Eye, EyeOff, Tag, Sparkles } from 'lucide-react';
import api from '../lib/api';
import {
  PizzaSize,
  PizzaCrust,
  PizzaSauce,
  PizzaCheese,
  PizzaTopping,
  PizzaExtra,
} from '../types/customPizza';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AdminCustomizerPage: React.FC = () => {
  const navigate = useNavigate();

  const [sizes, setSizes] = useState<PizzaSize[]>([]);
  const [crusts, setCrusts] = useState<PizzaCrust[]>([]);
  const [sauces, setSauces] = useState<PizzaSauce[]>([]);
  const [cheeses, setCheeses] = useState<PizzaCheese[]>([]);
  const [toppings, setToppings] = useState<PizzaTopping[]>([]);
  const [extras, setExtras] = useState<PizzaExtra[]>([]);
  const [loading, setLoading] = useState(true);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'sizes' | 'crusts' | 'sauces' | 'cheeses' | 'toppings' | 'extras'>('toppings');

  // Editing modal/form state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/custom-pizza/all');
      if (res.data.success) {
        const { sizes, crusts, sauces, cheeses, toppings, extras } = res.data.data;
        setSizes(sizes);
        setCrusts(crusts);
        setSauces(sauces);
        setCheeses(cheeses);
        setToppings(toppings);
        setExtras(extras);
      }
    } catch (err) {
      console.error('Failed to load admin inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleToggleActive = async (type: string, id: string, currentActive: boolean) => {
    try {
      await api.patch(`/admin/custom-pizza/${type}/${id}`, { active: !currentActive });
      fetchInventory();
      setStatusMsg(`Updated active status!`);
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingType) return;

    setIsSaving(true);
    try {
      if (editingItem.id) {
        // Update existing
        await api.patch(`/admin/custom-pizza/${editingType}/${editingItem.id}`, editingItem);
      } else {
        // Create new
        await api.post(`/admin/custom-pizza/${editingType}`, editingItem);
      }
      setEditingItem(null);
      fetchInventory();
      setStatusMsg('Saved changes successfully!');
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Kitchen Admin Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Pizza Customizer Management
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Configure live pizza sizes, crusts, sauces, cheese varieties, toppings, and pricing.
            </p>
          </div>

          <button
            onClick={() => navigate('/build-your-pizza')}
            className="px-5 py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md w-fit"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Customer Builder</span>
          </button>
        </div>

        {statusMsg && (
          <div className="p-4 bg-green-50 text-green-800 font-bold text-xs rounded-2xl border border-green-200 flex items-center justify-between animate-fade-in">
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { id: 'toppings', label: '🍕 Toppings', count: toppings.length },
            { id: 'sizes', label: '📏 Pizza Sizes', count: sizes.length },
            { id: 'crusts', label: '🍞 Crusts', count: crusts.length },
            { id: 'sauces', label: '🥫 Sauces', count: sauces.length },
            { id: 'cheeses', label: '🧀 Cheeses', count: cheeses.length },
            { id: 'extras', label: '🥤 Extras & Dips', count: extras.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table & Content Area */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-gray-900 capitalize">
              {activeTab} Management ({
                activeTab === 'toppings' ? toppings.length :
                activeTab === 'sizes' ? sizes.length :
                activeTab === 'crusts' ? crusts.length :
                activeTab === 'sauces' ? sauces.length :
                activeTab === 'cheeses' ? cheeses.length : extras.length
              })
            </h3>

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'toppings') {
                  setEditingType('topping');
                  setEditingItem({ name: '', category: 'Vegetables', price: 30, extraPrice: 50, vegetarian: true, active: true, color: '#E53935' });
                } else if (activeTab === 'sizes') {
                  setEditingType('size');
                  setEditingItem({ name: '', description: 'Serves 2', basePrice: 299, servingSize: '10 inches • 6 slices', active: true });
                } else if (activeTab === 'crusts') {
                  setEditingType('crust');
                  setEditingItem({ name: '', description: '', additionalPrice: 50, active: true });
                } else if (activeTab === 'sauces') {
                  setEditingType('sauce');
                  setEditingItem({ name: '', description: '', additionalPrice: 0, color: '#C62828', active: true });
                } else if (activeTab === 'cheeses') {
                  setEditingType('cheese');
                  setEditingItem({ name: '', description: '', additionalPrice: 40, color: '#FFF9C4', active: true });
                } else {
                  setEditingType('extra');
                  setEditingItem({ name: '', category: 'Dips', price: 30, active: true });
                }
              }}
              className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Render Inventory Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Name / Category</th>
                  <th className="p-3">Details / Serving</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* 1. TOPPINGS */}
                {activeTab === 'toppings' &&
                  toppings.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${t.vegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
                        <span>{t.name}</span>
                        <span className="text-[10px] text-gray-400">({t.category})</span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {t.vegetarian ? 'Pure Veg' : 'Non-Veg'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">
                        ₹{t.price} (Extra: ₹{t.extraPrice})
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {t.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('topping');
                            setEditingItem(t);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('topping', t.id, t.active)}
                          className={`px-2.5 py-1 rounded-lg font-bold ${t.active ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}
                        >
                          {t.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* 2. SIZES */}
                {activeTab === 'sizes' &&
                  sizes.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{s.name}</td>
                      <td className="p-3 text-gray-600">{s.description} • {s.servingSize}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">₹{s.basePrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {s.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('size');
                            setEditingItem(s);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('size', s.id, s.active)}
                          className="px-2.5 py-1 rounded-lg font-bold text-red-600 hover:bg-red-50"
                        >
                          {s.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* 3. CRUSTS */}
                {activeTab === 'crusts' &&
                  crusts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{c.name}</td>
                      <td className="p-3 text-gray-600">{c.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">+₹{c.additionalPrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {c.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('crust');
                            setEditingItem(c);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('crust', c.id, c.active)}
                          className="px-2.5 py-1 rounded-lg font-bold text-red-600 hover:bg-red-50"
                        >
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* 4. SAUCES */}
                {activeTab === 'sauces' &&
                  sauces.map((sc) => (
                    <tr key={sc.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{sc.name}</td>
                      <td className="p-3 text-gray-600">{sc.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">+₹{sc.additionalPrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {sc.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('sauce');
                            setEditingItem(sc);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('sauce', sc.id, sc.active)}
                          className="px-2.5 py-1 rounded-lg font-bold text-red-600 hover:bg-red-50"
                        >
                          {sc.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* 5. CHEESES */}
                {activeTab === 'cheeses' &&
                  cheeses.map((ch) => (
                    <tr key={ch.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{ch.name}</td>
                      <td className="p-3 text-gray-600">{ch.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">+₹{ch.additionalPrice}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ch.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {ch.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('cheese');
                            setEditingItem(ch);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('cheese', ch.id, ch.active)}
                          className="px-2.5 py-1 rounded-lg font-bold text-red-600 hover:bg-red-50"
                        >
                          {ch.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* 6. EXTRAS */}
                {activeTab === 'extras' &&
                  extras.map((ex) => (
                    <tr key={ex.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{ex.name} ({ex.category})</td>
                      <td className="p-3 text-gray-600">{ex.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">₹{ex.price}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ex.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {ex.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingType('extra');
                            setEditingItem(ex);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive('extra', ex.id, ex.active)}
                          className="px-2.5 py-1 rounded-lg font-bold text-red-600 hover:bg-red-50"
                        >
                          {ex.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit / Create Ingredient Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-extrabold text-base text-gray-900">
                {editingItem.id ? 'Edit Ingredient' : 'Add New Ingredient'} ({editingType})
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {editingItem.category !== undefined && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              )}

              {editingItem.description !== undefined && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {editingItem.basePrice !== undefined && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingItem.basePrice || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, basePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                )}

                {editingItem.price !== undefined && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingItem.price || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                )}

                {editingItem.extraPrice !== undefined && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Extra Portion Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingItem.extraPrice || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, extraPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                )}

                {editingItem.additionalPrice !== undefined && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Additional Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingItem.additionalPrice || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, additionalPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                )}
              </div>

              {editingItem.vegetarian !== undefined && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingItem.vegetarian}
                    onChange={(e) => setEditingItem({ ...editingItem, vegetarian: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="font-bold text-gray-700">Vegetarian Item</span>
                </label>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {isSaving ? 'Saving...' : 'Save Ingredient'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
