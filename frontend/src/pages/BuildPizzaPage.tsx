import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, ShoppingBag, Sparkles, Check, Info } from 'lucide-react';
import api from '../lib/api';
import {
  PizzaSize,
  PizzaCrust,
  PizzaSauce,
  PizzaCheese,
  PizzaTopping,
  PizzaExtra,
  SelectedTopping,
  SelectedExtra,
  CustomPizzaConfig,
  CustomPizzaBreakdown,
  PresetCombo,
} from '../types/customPizza';
import { useCartStore } from '../store/cartStore';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PizzaVisualizer } from '../components/CustomPizza/PizzaVisualizer';
import { StepProgress, CustomizerStep } from '../components/CustomPizza/StepProgress';
import { PresetSelector } from '../components/CustomPizza/PresetSelector';
import { LivePriceCard } from '../components/CustomPizza/LivePriceCard';

import { SizeStep } from '../components/CustomPizza/Steps/SizeStep';
import { CrustStep } from '../components/CustomPizza/Steps/CrustStep';
import { SauceStep } from '../components/CustomPizza/Steps/SauceStep';
import { CheeseStep } from '../components/CustomPizza/Steps/CheeseStep';
import { ToppingsStep } from '../components/CustomPizza/Steps/ToppingsStep';
import { ExtrasStep } from '../components/CustomPizza/Steps/ExtrasStep';
import { ReviewStep } from '../components/CustomPizza/Steps/ReviewStep';

export const BuildPizzaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editItemId = searchParams.get('editItemId');

  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  // Inventory options from backend
  const [sizes, setSizes] = useState<PizzaSize[]>([]);
  const [crusts, setCrusts] = useState<PizzaCrust[]>([]);
  const [sauces, setSauces] = useState<PizzaSauce[]>([]);
  const [cheeses, setCheeses] = useState<PizzaCheese[]>([]);
  const [toppings, setToppings] = useState<PizzaTopping[]>([]);
  const [extras, setExtras] = useState<PizzaExtra[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Active step (1: Size, 2: Crust, 3: Sauce, 4: Cheese, 5: Toppings, 6: Extras, 7: Review)
  const [currentStep, setCurrentStep] = useState<CustomizerStep>(1);

  // User's custom configuration
  const [config, setConfig] = useState<CustomPizzaConfig>({
    size: null,
    crust: null,
    sauce: null,
    cheese: null,
    toppings: [],
    extras: [],
  });

  // Server-calculated breakdown
  const [breakdown, setBreakdown] = useState<CustomPizzaBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Fetch options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await api.get('/custom-pizza/options');
        if (res.data.success) {
          const { sizes, crusts, sauces, cheeses, toppings, extras } = res.data.data;
          setSizes(sizes);
          setCrusts(crusts);
          setSauces(sauces);
          setCheeses(cheeses);
          setToppings(toppings);
          setExtras(extras);

          // Check if editing existing item from cart
          if (editItemId) {
            const existing = items.find((i) => i.id === editItemId);
            if (existing && existing.customization) {
              try {
                const parsed = JSON.parse(existing.customization);
                if (parsed.customPizzaConfig) {
                  setConfig(parsed.customPizzaConfig);
                  return;
                }
              } catch (e) {
                console.error('Failed to parse existing custom pizza', e);
              }
            }
          }

          // Otherwise set reasonable defaults
          if (sizes.length > 0 && crusts.length > 0 && sauces.length > 0 && cheeses.length > 0) {
            setConfig({
              size: sizes.find((s: any) => s.name === 'Medium') || sizes[0],
              crust: crusts[0],
              sauce: sauces[0],
              cheese: cheeses[0],
              toppings: [],
              extras: [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to load customizer options', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [editItemId]);

  // 2. Authoritative server-side price calculation
  const calculateServerPrice = useCallback(async (currentConfig: CustomPizzaConfig) => {
    if (!currentConfig.size || !currentConfig.crust || !currentConfig.sauce || !currentConfig.cheese) {
      return;
    }

    setIsCalculating(true);
    try {
      const payload = {
        sizeId: currentConfig.size.id,
        crustId: currentConfig.crust.id,
        sauceId: currentConfig.sauce.id,
        cheeseId: currentConfig.cheese.id,
        toppings: currentConfig.toppings.map((t) => ({
          id: t.id,
          quantity: t.quantity,
        })),
        extras: currentConfig.extras.map((e) => ({
          id: e.id,
          quantity: e.quantity,
        })),
      };

      const res = await api.post('/custom-pizza/calculate', payload);
      if (res.data.success && res.data.data) {
        setBreakdown(res.data.data.breakdown);
      }
    } catch (err) {
      console.error('Calculation error', err);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Recalculate whenever config changes
  useEffect(() => {
    if (config.size && config.crust && config.sauce && config.cheese) {
      calculateServerPrice(config);
    }
  }, [config, calculateServerPrice]);

  // Handle Preset combo selection
  const handleSelectPreset = (preset: PresetCombo) => {
    const s = sizes.find((sz) => sz.name === preset.sizeName) || sizes[0];
    const c = crusts.find((cr) => cr.name === preset.crustName) || crusts[0];
    const sa = sauces.find((sc) => sc.name === preset.sauceName) || sauces[0];
    const ch = cheeses.find((cs) => cs.name === preset.cheeseName) || cheeses[0];

    const mappedToppings: SelectedTopping[] = [];
    preset.toppingNames.forEach((tn) => {
      const topObj = toppings.find((t) => t.name.toLowerCase() === tn.name.toLowerCase());
      if (topObj) {
        mappedToppings.push({ id: topObj.id, topping: topObj, quantity: tn.quantity });
      }
    });

    const mappedExtras: SelectedExtra[] = [];
    if (preset.extraNames) {
      preset.extraNames.forEach((en) => {
        const extObj = extras.find((e) => e.name.toLowerCase() === en.name.toLowerCase());
        if (extObj) {
          mappedExtras.push({ id: extObj.id, extra: extObj, quantity: en.quantity });
        }
      });
    }

    setConfig({
      size: s,
      crust: c,
      sauce: sa,
      cheese: ch,
      toppings: mappedToppings,
      extras: mappedExtras,
    });

    setToastMessage(`Loaded '${preset.name}' recipe preset!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Reset to default Medium Classic Pizza
  const handleReset = () => {
    if (sizes.length > 0 && crusts.length > 0 && sauces.length > 0 && cheeses.length > 0) {
      setConfig({
        size: sizes.find((s) => s.name === 'Medium') || sizes[0],
        crust: crusts[0],
        sauce: sauces[0],
        cheese: cheeses[0],
        toppings: [],
        extras: [],
      });
      setCurrentStep(1);
      setToastMessage('Pizza customizer reset to standard base.');
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  // Step completion validator
  const isStepComplete = (stepNumber: CustomizerStep): boolean => {
    switch (stepNumber) {
      case 1:
        return !!config.size;
      case 2:
        return !!config.crust;
      case 3:
        return !!config.sauce;
      case 4:
        return !!config.cheese;
      case 5:
        return true; // toppings optional
      case 6:
        return true; // extras optional
      case 7:
        return !!config.size && !!config.crust && !!config.sauce && !!config.cheese;
      default:
        return false;
    }
  };

  // Step Navigation
  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((currentStep + 1) as CustomizerStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CustomizerStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle topping in and out
  const handleToggleTopping = (topping: PizzaTopping) => {
    const exists = config.toppings.find((t) => t.id === topping.id);
    if (exists) {
      setConfig({
        ...config,
        toppings: config.toppings.filter((t) => t.id !== topping.id),
      });
    } else {
      setConfig({
        ...config,
        toppings: [...config.toppings, { id: topping.id, topping, quantity: 'normal' }],
      });
    }
  };

  // Set topping quantity
  const handleSetToppingQuantity = (toppingId: string, quantity: 'normal' | 'extra') => {
    setConfig({
      ...config,
      toppings: config.toppings.map((t) => (t.id === toppingId ? { ...t, quantity } : t)),
    });
  };

  // Update extras quantity
  const handleUpdateExtraQuantity = (extra: PizzaExtra, quantity: number) => {
    if (quantity <= 0) {
      setConfig({
        ...config,
        extras: config.extras.filter((e) => e.id !== extra.id),
      });
    } else {
      const exists = config.extras.find((e) => e.id === extra.id);
      if (exists) {
        setConfig({
          ...config,
          extras: config.extras.map((e) => (e.id === extra.id ? { ...e, quantity } : e)),
        });
      } else {
        setConfig({
          ...config,
          extras: [...config.extras, { id: extra.id, extra, quantity }],
        });
      }
    }
  };

  // Final Add to Cart
  const handleAddToCart = () => {
    if (!config.size || !config.crust || !config.sauce || !config.cheese || !breakdown) return;

    setIsAddingToCart(true);

    const customPizzaName = `${config.size.name} ${config.crust.name.replace(' Hand Tossed', '')} Custom Pizza`;

    // Serialized metadata structure as specified in Section 15
    const customizationData = JSON.stringify({
      productType: 'custom-pizza',
      customPizzaConfig: config,
      breakdown,
    });

    const mockCustomProduct: any = {
      id: `custom-pizza-${Date.now()}`,
      name: customPizzaName,
      description: breakdown.toppings.length > 0
        ? breakdown.toppings.map((t) => `${t.name}${t.quantity === 'extra' ? ' (Extra)' : ''}`).join(', ')
        : 'Chef Handcrafted Custom Pizza',
      price: breakdown.subtotal,
      discountedPrice: null,
      isVeg: !config.toppings.some((t) => !t.topping.vegetarian),
      isBestSeller: false,
      image: 'https://images.unsplash.com/photo-1565299624096-d0d9bbf4ab22?w=400&q=80',
    };

    // If editing existing item, remove the old one first
    if (editItemId) {
      removeItem(editItemId);
    }

    addItem(mockCustomProduct, 1, customizationData);

    setTimeout(() => {
      setIsAddingToCart(false);
      navigate('/cart');
    }, 400);
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#E53935] border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-gray-700">Loading Pizza Ingredients & Kitchen Station...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-red-500 selection:text-white">
      <Header />

      {/* Toast alert message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Top Header & Reset Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E53935]">
              Interactive Pizza Kitchen
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Build Your Own Pizza
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pizza</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar (Spec Section 2) */}
        <StepProgress
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
          isStepComplete={isStepComplete}
        />

        {/* Preset Combinations Section (Spec Section 33) */}
        <PresetSelector onSelectPreset={handleSelectPreset} />

        {/* 2-Column Responsive Layout (Spec Section 23) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Step Customization Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs min-h-[420px] flex flex-col justify-between">
              {/* Render Active Step */}
              <div className="flex-1">
                {currentStep === 1 && (
                  <SizeStep
                    sizes={sizes}
                    selectedSize={config.size}
                    onSelectSize={(s) => setConfig({ ...config, size: s })}
                  />
                )}

                {currentStep === 2 && (
                  <CrustStep
                    crusts={crusts}
                    selectedCrust={config.crust}
                    onSelectCrust={(c) => setConfig({ ...config, crust: c })}
                  />
                )}

                {currentStep === 3 && (
                  <SauceStep
                    sauces={sauces}
                    selectedSauce={config.sauce}
                    onSelectSauce={(sa) => setConfig({ ...config, sauce: sa })}
                  />
                )}

                {currentStep === 4 && (
                  <CheeseStep
                    cheeses={cheeses}
                    selectedCheese={config.cheese}
                    onSelectCheese={(ch) => setConfig({ ...config, cheese: ch })}
                  />
                )}

                {currentStep === 5 && (
                  <ToppingsStep
                    toppings={toppings}
                    selectedToppings={config.toppings}
                    onToggleTopping={handleToggleTopping}
                    onSetToppingQuantity={handleSetToppingQuantity}
                  />
                )}

                {currentStep === 6 && (
                  <ExtrasStep
                    extras={extras}
                    selectedExtras={config.extras}
                    onUpdateExtraQuantity={handleUpdateExtraQuantity}
                  />
                )}

                {currentStep === 7 && (
                  <ReviewStep
                    config={config}
                    breakdown={breakdown}
                    onEditStep={(st) => setCurrentStep(st as CustomizerStep)}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                  />
                )}
              </div>

              {/* Step Navigation Controls (Prev / Next) */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Next: {currentStep === 1 ? 'Crust' : currentStep === 2 ? 'Sauce' : currentStep === 3 ? 'Cheese' : currentStep === 4 ? 'Toppings' : currentStep === 5 ? 'Extras' : 'Review'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm & Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Pizza Visualizer + Live Price Breakdown */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* Visualizer Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col items-center justify-center">
              <PizzaVisualizer config={config} />
            </div>

            {/* Live Price Calculator Breakdown (Spec Section 12 & 13) */}
            <LivePriceCard breakdown={breakdown} loading={isCalculating} />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Price Bar (Spec Section 23) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3.5 px-4 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Price</span>
          <span className="text-lg font-black text-[#E53935]">
            ₹{breakdown?.total || 299}
          </span>
        </div>

        <div className="flex gap-2">
          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-3 bg-[#E53935] hover:bg-red-700 text-white font-black rounded-2xl text-xs uppercase shadow-md flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white font-black rounded-2xl text-xs uppercase shadow-md flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
