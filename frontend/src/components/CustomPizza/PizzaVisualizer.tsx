import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomPizzaConfig } from '../../types/customPizza';

interface PizzaVisualizerProps {
  config: CustomPizzaConfig;
  className?: string;
}

// Deterministic seed coordinates for topping placement on radial pizza surface
const TOPPING_POSITIONS = [
  // Inner ring (radius 22%)
  { r: 22, angle: 0 },
  { r: 22, angle: 72 },
  { r: 22, angle: 144 },
  { r: 22, angle: 216 },
  { r: 22, angle: 288 },

  // Middle ring (radius 44%)
  { r: 44, angle: 25 },
  { r: 44, angle: 85 },
  { r: 44, angle: 145 },
  { r: 44, angle: 205 },
  { r: 44, angle: 265 },
  { r: 44, angle: 325 },

  // Outer ring (radius 68%)
  { r: 68, angle: 15 },
  { r: 68, angle: 60 },
  { r: 68, angle: 105 },
  { r: 68, angle: 150 },
  { r: 68, angle: 195 },
  { r: 68, angle: 240 },
  { r: 68, angle: 285 },
  { r: 68, angle: 330 },
];

export const PizzaVisualizer: React.FC<PizzaVisualizerProps> = ({ config, className = '' }) => {
  const { size, crust, sauce, cheese, toppings } = config;

  // Size visual scale
  const sizeScale = useMemo(() => {
    if (size?.name === 'Small') return 0.82;
    if (size?.name === 'Large') return 1.05;
    return 0.94; // Medium default
  }, [size]);

  // Sauce color
  const sauceColor = useMemo(() => {
    if (sauce?.name.includes('BBQ')) return '#4E342E';
    if (sauce?.name.includes('Spicy')) return '#B71C1C';
    if (sauce?.name.includes('Garlic')) return '#FFF9C4';
    return '#C62828'; // Classic Tomato
  }, [sauce]);

  // Cheese color
  const cheeseColor = useMemo(() => {
    if (cheese?.name.includes('Cheddar')) return '#FFE082';
    if (cheese?.name.includes('Vegan')) return '#FFFDE7';
    if (cheese?.name.includes('Extra')) return '#FFF59D';
    return '#FFF9C4'; // Standard Mozzarella
  }, [cheese]);

  // Generate dynamic summary string
  const summaryText = useMemo(() => {
    const parts = [
      size?.name || 'Medium',
      crust?.name || 'Classic Hand Tossed',
      sauce?.name || 'Classic Tomato',
      cheese?.name || 'Mozzarella',
      ...toppings.map((t) => `${t.topping.name}${t.quantity === 'extra' ? ' (Extra)' : ''}`),
    ];
    return parts.join(' • ');
  }, [size, crust, sauce, cheese, toppings]);

  // Icon / Graphic generator for each topping type
  const renderToppingIcon = (name: string, color: string) => {
    const lower = name.toLowerCase();

    if (lower.includes('onion')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm">
          <path d="M4 12a8 8 0 0 1 16 0c0 4.418-3.582 8-8 8s-8-3.582-8-8z" fill="none" stroke="#BA68C8" strokeWidth="3" strokeDasharray="6 3" />
        </svg>
      );
    }
    if (lower.includes('capsicum')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm">
          <path d="M5 9c2-4 8-4 12 0 3 3 1 8-2 10-3 2-7 2-10 0-3-2-2-7 0-10z" fill="#4CAF50" opacity="0.9" />
          <path d="M7 11c1-2 5-2 8 0" fill="none" stroke="#2E7D32" strokeWidth="2" />
        </svg>
      );
    }
    if (lower.includes('mushroom')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm">
          <path d="M6 12a6 6 0 0 1 12 0c0 1-2 1-3 1v4a1 1 0 0 1-2 0v-4c-1 0-3 0-3-1z" fill="#8D6E63" />
          <circle cx="10" cy="9" r="1" fill="#D7CCC8" />
          <circle cx="14" cy="9" r="1.2" fill="#D7CCC8" />
        </svg>
      );
    }
    if (lower.includes('corn')) {
      return (
        <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-500 shadow-xs transform rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
        </div>
      );
    }
    if (lower.includes('olive')) {
      return (
        <div className="w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-700 shadow-xs flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-100" />
        </div>
      );
    }
    if (lower.includes('jalapeño') || lower.includes('jalapeno')) {
      return (
        <div className="w-4 h-4 rounded-full bg-emerald-700 border-2 border-emerald-900 shadow-xs flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-emerald-300" />
        </div>
      );
    }
    if (lower.includes('tomato')) {
      return (
        <div className="w-4 h-4 rounded-full bg-red-600 border border-red-800 shadow-xs flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 opacity-80" />
        </div>
      );
    }
    if (lower.includes('paneer')) {
      return (
        <div className="w-4 h-4 bg-white border border-gray-300 rounded-xs shadow-xs transform rotate-12 flex items-center justify-center">
          <div className="w-2 h-2 bg-amber-100 rounded-2xs" />
        </div>
      );
    }
    if (lower.includes('pepperoni')) {
      return (
        <div className="w-6 h-6 rounded-full bg-[#B71C1C] border border-[#7F0000] shadow-sm flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-amber-100/70" />
        </div>
      );
    }
    if (lower.includes('chicken')) {
      return (
        <div className="w-4 h-3.5 bg-[#D84315] rounded-lg shadow-xs transform -rotate-12 border border-[#BF360C] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-amber-200" />
        </div>
      );
    }
    if (lower.includes('sausage')) {
      return (
        <div className="w-5 h-3 bg-[#8D6E63] rounded-full border border-[#4E342E] shadow-xs transform rotate-45" />
      );
    }

    // Default fallback marker
    return (
      <div
        className="w-4 h-4 rounded-full shadow-xs border border-black/20"
        style={{ backgroundColor: color || '#E53935' }}
      />
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Pizza Plate / Board Container */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center select-none">
        {/* Wooden Pizza Peel / Board */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D7CCC8] to-[#A1887F] shadow-2xl p-3 border-4 border-[#8D6E63]/30 flex items-center justify-center">
          {/* Pizza Slicing Guidelines */}
          <div className="absolute inset-0 rounded-full opacity-10 bg-[radial-gradient(#5D4037_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="absolute w-full h-0.5 bg-black/5" />
          <div className="absolute h-full w-0.5 bg-black/5" />
          <div className="absolute w-full h-0.5 bg-black/5 rotate-45" />
          <div className="absolute w-full h-0.5 bg-black/5 -rotate-45" />
        </div>

        {/* Scalable Pizza Disc with Smooth Framer Motion transitions */}
        <motion.div
          animate={{ scale: sizeScale }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="relative w-[86%] h-[86%] rounded-full flex items-center justify-center overflow-hidden shadow-2xl"
          style={{
            // Crust Layer
            background:
              crust?.name === 'Cheese Burst'
                ? 'radial-gradient(circle, #E65100 0%, #D84315 70%, #FFB300 95%, #FFA000 100%)'
                : crust?.name === 'Thin Crust'
                ? 'radial-gradient(circle, #BF360C 0%, #D84315 80%, #E65100 96%, #8D6E63 100%)'
                : 'radial-gradient(circle, #D84315 0%, #E65100 85%, #F57C00 96%, #E65100 100%)',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4), 0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Sauce Layer */}
          <motion.div
            animate={{ backgroundColor: sauceColor }}
            transition={{ duration: 0.3 }}
            className="absolute w-[88%] h-[88%] rounded-full opacity-95 shadow-inner"
            style={{
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
            }}
          />

          {/* Cheese Layer with melted texture */}
          <motion.div
            animate={{ backgroundColor: cheeseColor }}
            transition={{ duration: 0.3 }}
            className="absolute w-[82%] h-[82%] rounded-full opacity-90"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 183, 77, 0.4) 15%, transparent 20%), radial-gradient(rgba(230, 81, 0, 0.25) 15%, transparent 20%)',
              backgroundPosition: '0 0, 10px 10px',
              backgroundSize: '20px 20px',
              boxShadow: 'inset 0 0 12px rgba(230, 81, 0, 0.3)',
            }}
          />

          {/* Herbs & Oregano Speckles */}
          <div className="absolute w-[78%] h-[78%] rounded-full opacity-35 bg-[radial-gradient(#2E7D32_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

          {/* Render Active Toppings Layer by Layer */}
          <AnimatePresence>
            {toppings.map((selTopping, tIndex) => {
              // Distribute topping pieces across radial positions
              const count = selTopping.quantity === 'extra' ? 12 : 7;
              const stepOffset = (tIndex * 5) % TOPPING_POSITIONS.length;

              return (
                <React.Fragment key={selTopping.id}>
                  {Array.from({ length: count }).map((_, pIdx) => {
                    const posIdx = (pIdx * 3 + stepOffset) % TOPPING_POSITIONS.length;
                    const pos = TOPPING_POSITIONS[posIdx];

                    // Convert polar to cartesian percentage coordinates
                    const rad = (pos.angle * Math.PI) / 180;
                    const x = 50 + (pos.r / 2) * Math.cos(rad);
                    const y = 50 + (pos.r / 2) * Math.sin(rad);

                    return (
                      <motion.div
                        key={`${selTopping.id}-${pIdx}`}
                        initial={{ scale: 0, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: pIdx * 45 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          damping: 15,
                          stiffness: 250,
                          delay: pIdx * 0.02,
                        }}
                        style={{
                          position: 'absolute',
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className="pointer-events-none z-10"
                      >
                        {renderToppingIcon(selTopping.topping.name, selTopping.topping.color)}
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dynamic Summary Label (Spec Section 11) */}
      <div className="text-center mt-4 max-w-sm px-4">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#E53935] block">
          Your Pizza Preview
        </span>
        <p className="text-xs sm:text-sm font-extrabold text-gray-800 leading-snug mt-1 line-clamp-2">
          {summaryText}
        </p>
      </div>
    </div>
  );
};
