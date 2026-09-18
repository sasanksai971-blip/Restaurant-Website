import React from 'react';
import { CheckCircle2, Clock, ChefHat, Package, Bike, Sparkles, MapPin } from 'lucide-react';
import { Order, OrderStatus, OrderType } from '../types';

interface OrderTrackerProps {
  order: Order;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const getSteps = (type: OrderType): Array<{ id: OrderStatus; label: string; desc: string }> => {
    if (type === 'takeaway') {
      return [
        { id: 'placed', label: 'Order Placed', desc: 'Received & sent to kitchen' },
        { id: 'preparing', label: 'Preparing', desc: 'Handcrafted with fresh toppings' },
        { id: 'ready', label: 'Ready for Pickup', desc: 'Hot & waiting at store counter' },
        { id: 'picked_up', label: 'Picked Up', desc: 'Enjoy your delicious feast!' },
      ];
    }

    if (type === 'dine-in') {
      return [
        { id: 'placed', label: 'Order Placed', desc: 'Sent directly to kitchen station' },
        { id: 'preparing', label: 'Preparing', desc: 'Baking in stone oven' },
        { id: 'ready', label: 'Ready', desc: 'Piping hot on serving tray' },
        { id: 'served', label: 'Served to Table', desc: 'Enjoy your dine-in experience!' },
      ];
    }

    // Default Delivery
    return [
      { id: 'placed', label: 'Order Placed', desc: 'Order received by restaurant' },
      { id: 'preparing', label: 'Preparing', desc: 'Fresh dough hand-tossed & baked' },
      { id: 'ready', label: 'Ready for Dispatch', desc: 'Packed in insulated hot bag' },
      { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Delivery partner on the way' },
      { id: 'delivered', label: 'Delivered', desc: 'Enjoy your hot meal!' },
    ];
  };

  const steps = getSteps(order.orderType);

  const getStepIndex = (status: OrderStatus, stepList: typeof steps) => {
    const idx = stepList.findIndex((s) => s.id === status);
    return idx === -1 ? 1 : idx; // default to preparing if in progress
  };

  const currentIdx = getStepIndex(order.status, steps);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E53935] block mb-1">
            Live Order Status
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <span className="text-sm font-black text-gray-900">25 - 35 Mins</span>
          </div>
        </div>
      </div>

      {/* Vertical / Horizontal Timeline */}
      <div className="relative">
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-gray-200">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Step Circle Indicator */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all font-bold text-sm shadow-md flex-shrink-0 ${
                    isCompleted
                      ? 'bg-[#2E7D32] text-white ring-4 ring-green-100'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm sm:text-base font-extrabold ${
                        isCurrent
                          ? 'text-[#2E7D32]'
                          : isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map / Location Tracker Placeholder (Spec Requirement) */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E53935]" />
            <span className="text-xs font-bold text-gray-900">
              Live Rider GPS Tracking
            </span>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">Live Satellite Signal</span>
        </div>

        {/* Mock GPS Map Visual */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 border border-gray-200 flex items-center justify-center">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1a237e_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Restaurant Marker */}
          <div className="absolute top-8 left-12 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E53935] text-white flex items-center justify-center text-xs shadow-lg border-2 border-white">
              🍕
            </div>
            <span className="text-[10px] font-bold text-gray-800 bg-white/90 px-1.5 py-0.5 rounded-md mt-1 shadow-2xs">
              Kitchen
            </span>
          </div>

          {/* Delivery Rider Marker (Pulsing) */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
            <div className="w-9 h-9 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-xs shadow-lg border-2 border-white">
              <Bike className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-blue-900 bg-white/90 px-2 py-0.5 rounded-md mt-1 shadow-2xs">
              Rider Ravi (2.1 km away)
            </span>
          </div>

          {/* Destination Customer Marker */}
          <div className="absolute bottom-8 right-12 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs shadow-lg border-2 border-white">
              🏠
            </div>
            <span className="text-[10px] font-bold text-gray-800 bg-white/90 px-1.5 py-0.5 rounded-md mt-1 shadow-2xs">
              Your Location
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
