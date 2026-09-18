import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Tag,
  MapPin,
  ClipboardList,
  FileText,
  MessageCircle,
  Activity,
  Users,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Phone,
  Mail,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeals?: () => void;
  onOpenTrack?: () => void;
  onOpenTerms?: () => void;
  onOpenHelp?: () => void;
  onOpenNutrition?: () => void;
  onOpenBulk?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  onOpenDeals,
  onOpenTrack,
  onOpenTerms,
  onOpenHelp,
  onOpenNutrition,
  onOpenBulk,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleNavigate = (path: string, callback?: () => void) => {
    onClose();
    if (callback) {
      callback();
    } else {
      navigate(path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-in Drawer from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span>Profile & Account</span>
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close profile menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* User Section (White bg, grey text as per spec) */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {user.name ? user.name[0].toUpperCase() : '👤'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">
                            {user.name || 'Valued Pizza Customer'}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>+91 {user.phone}</span>
                          </p>
                          {user.email && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span>{user.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-600 font-medium mb-3">
                        Login or sign up with your phone number to manage orders, coupons & saved addresses.
                      </p>
                      {/* Prominent Red LOGIN button as per spec */}
                      <button
                        onClick={() => handleNavigate('/login')}
                        className="w-full py-3 bg-[#E53935] hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                      >
                        <span>LOGIN / SIGN UP</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Navigation Options in EXACT Order from Spec:
                    1. Deals and Offers
                    2. Track the Order
                    3. Order History
                    4. Terms and Conditions
                    5. Need Help, Ask Us
                    6. Nutritional Information
                */}
                <div>
                  <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">
                    Quick Access
                  </h5>

                  <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-xs">
                    {/* 1. Deals and Offers */}
                    <button
                      onClick={() => handleNavigate('/deals', onOpenDeals)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-[#2E7D32] flex items-center justify-center">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            1. Deals and Offers
                          </span>
                          <p className="text-[11px] text-gray-400">Exclusive coupons & promotional discounts</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* 2. Track the Order */}
                    <button
                      onClick={() => handleNavigate('/orders', onOpenTrack)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1565C0] flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            2. Track the Order
                          </span>
                          <p className="text-[11px] text-gray-400">Live order status & delivery progress</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* 3. Order History */}
                    <button
                      onClick={() => handleNavigate('/orders')}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E65100] flex items-center justify-center">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            3. Order History
                          </span>
                          <p className="text-[11px] text-gray-400">Past orders, receipts & quick re-order</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* 4. Terms and Conditions */}
                    <button
                      onClick={() => handleNavigate('/terms', onOpenTerms)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            4. Terms and Conditions
                          </span>
                          <p className="text-[11px] text-gray-400">Cancellation, late night delivery & cashback rules</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* 5. Need Help, Ask Us */}
                    <button
                      onClick={() => handleNavigate('/support', onOpenHelp)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E53935] flex items-center justify-center">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            5. Need Help, Ask Us
                          </span>
                          <p className="text-[11px] text-gray-400">AI Customer Care & immediate resolution</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* 6. Nutritional Information */}
                    <button
                      onClick={() => handleNavigate('/nutrition', onOpenNutrition)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-gray-950">
                            6. Nutritional Information
                          </span>
                          <p className="text-[11px] text-gray-400">Calories, protein, allergens & ingredients</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Additional Spec Feature: Bulk Orders */}
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h6 className="font-bold text-gray-900 text-sm">Party & Bulk Orders</h6>
                        <p className="text-xs text-gray-600">Planning a gathering or corporate feast?</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigate('/bulk-order', onOpenBulk)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              {isAuthenticated && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 text-gray-600 hover:text-red-600 hover:bg-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
