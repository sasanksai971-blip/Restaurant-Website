import React from 'react';
import { X, FileText, ShieldAlert, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Terms & Conditions</h3>
                  <p className="text-xs text-gray-300">Official ordering, cancellation & delivery policies</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body (Spec Requirement: Order cancellation, Late-night delivery, Cashback, General ordering conditions) */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {/* 1. Order Cancellation Policy */}
              <section className="space-y-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm sm:text-base">
                  <ShieldAlert className="w-4 h-4 text-[#E53935]" />
                  <h4>1. Order Cancellation Policy</h4>
                </div>
                <p>
                  Orders can be cancelled free of charge within <strong>60 seconds</strong> of placement. Once the kitchen commences dough preparation and stone oven baking, full cancellation may incur a kitchen preparation fee. In case of store delay beyond 50 minutes without prior intimation, a 100% refund is initiated.
                </p>
              </section>

              {/* 2. Late Night Delivery Policy */}
              <section className="space-y-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm sm:text-base">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h4>2. Late-Night Delivery Policy (11:00 PM – 03:00 AM)</h4>
                </div>
                <p>
                  Late-night orders are serviced through our central cloud hubs. A nominal midnight convenience surcharge of ₹35 applies to orders placed after 11:30 PM. Delivery partners are equipped with safety GPS monitoring for secure midnight doorstep drops.
                </p>
              </section>

              {/* 3. Cashback & Coupon Terms */}
              <section className="space-y-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm sm:text-base">
                  <RefreshCw className="w-4 h-4 text-green-600" />
                  <h4>3. Cashback & Refund Rules</h4>
                </div>
                <p>
                  Promotional coupons (e.g. <code>FIRST50</code>, <code>DINEIN249</code>, <code>TAKEAWAY499</code>) are non-transferable and can only be applied once per registered phone number. In case of paid order cancellation or payment failure, refunds are credited back to the original UPI / Card account within 2–4 banking hours.
                </p>
              </section>

              {/* 4. General Ordering Conditions */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <h4>4. General Ordering & Dine-In Conditions</h4>
                </div>
                <p>
                  All displayed pizza dimensions (7" Regular, 10" Medium, 12" Large) are approximate uncooked dough diameters. Dine-in reservations are held for up to 15 minutes past the reserved slot time. Alcohol consumption is strictly governed by local municipality guidelines.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
