import React from 'react';
import { Bike, Clock, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { OrderType } from '../types';

interface OrderingModeSelectorProps {
  onSelectSchedule?: () => void;
  onSelectTakeaway?: () => void;
  onSelectDineIn?: () => void;
}

export const OrderingModeSelector: React.FC<OrderingModeSelectorProps> = ({
  onSelectSchedule,
  onSelectTakeaway,
  onSelectDineIn,
}) => {
  const { orderingMode, setOrderingMode, scheduledDate, scheduledTime, selectedStore } = useOrderStore();

  const modes: Array<{
    id: OrderType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'delivery',
      label: 'Delivery',
      sublabel: 'Hot & Fresh in 30 mins',
      icon: <Bike className="w-5 h-5" />,
      badge: '30 MINS',
    },
    {
      id: 'scheduled',
      label: 'Schedule Delivery',
      sublabel: scheduledDate ? `${scheduledDate} @ ${scheduledTime || 'Selected Time'}` : 'Pick date & slot',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'takeaway',
      label: 'Take Away',
      sublabel: selectedStore ? selectedStore.name : 'Self pickup from store',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: 'NO WAIT',
    },
    {
      id: 'dine-in',
      label: 'Dine In',
      sublabel: 'Reserve table & pre-order',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      badge: 'EXPERIENCE',
    },
  ];

  const handleModeClick = (mode: OrderType) => {
    setOrderingMode(mode);
    if (mode === 'scheduled' && onSelectSchedule) {
      onSelectSchedule();
    } else if (mode === 'takeaway' && onSelectTakeaway) {
      onSelectTakeaway();
    } else if (mode === 'dine-in' && onSelectDineIn) {
      onSelectDineIn();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {modes.map((mode) => {
          const isSelected = orderingMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between min-h-[96px] sm:min-h-[110px] ${
                isSelected
                  ? 'bg-black text-white border-black shadow-lg scale-[1.02]'
                  : 'bg-gray-100/80 hover:bg-gray-200/70 text-black border-transparent hover:border-gray-300 shadow-xs'
              }`}
            >
              {/* Badge if any */}
              {mode.badge && (
                <span
                  className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {mode.badge}
                </span>
              )}

              <div className={`p-2 rounded-xl w-fit ${isSelected ? 'bg-white/15 text-white' : 'bg-white text-gray-800 shadow-2xs'}`}>
                {mode.icon}
              </div>

              <div className="mt-2.5">
                <h4 className="font-extrabold text-sm sm:text-base leading-tight">
                  {mode.label}
                </h4>
                <p
                  className={`text-[11px] sm:text-xs mt-0.5 truncate ${
                    isSelected ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {mode.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
