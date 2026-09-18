import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Clock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-12 pb-24 md:pb-12 border-t border-gray-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#E53935] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">30-Min Delivery</h5>
              <p className="text-xs text-gray-500">Fast & piping hot</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Fresh Dough</h5>
              <p className="text-xs text-gray-500">Handcrafted daily</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Hygiene Assured</h5>
              <p className="text-xs text-gray-500">Contactless safety</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🧀</span>
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Real Cheese</h5>
              <p className="text-xs text-gray-500">No artificial substitutes</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-gray-800">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#E53935] flex items-center justify-center text-white font-bold text-lg">
                🍕
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                PIZZA<span className="text-[#E53935]">RUSH</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Order your favorite oven-baked pizzas, garlic breads, cheesy pastas & refreshing beverages. Fast delivery across Bangalore, Koramangala, Indiranagar, Whitefield and beyond!
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E53935]" />
                <span>1800-PIZZA-NOW</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E53935]" />
                <span>support@pizzarush.com</span>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Pizza Menu
            </h6>
            <ul className="space-y-2 text-xs">
              <li><Link to="/menu" className="hover:text-white transition-colors">Veg Pizzas</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Non-Veg Pizzas</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Cheese Lava Burst</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Pizza Mania</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Garlic Breads & Dips</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors">Desserts & Cakes</Link></li>
            </ul>
          </div>

          {/* Ordering Modes */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Services
            </h6>
            <ul className="space-y-2 text-xs">
              <li><Link to="/menu" className="hover:text-white transition-colors">Express Delivery</Link></li>
              <li><Link to="/takeaway" className="hover:text-white transition-colors">Take Away / Pickup</Link></li>
              <li><Link to="/dine-in" className="hover:text-white transition-colors">Dine-In & Table Booking</Link></li>
              <li><Link to="/bulk-order" className="hover:text-white transition-colors">Party & Bulk Orders</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Coupons & Offers</Link></li>
            </ul>
          </div>

          {/* Legal & Care */}
          <div>
            <h6 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Help & Policies
            </h6>
            <ul className="space-y-2 text-xs">
              <li><Link to="/support" className="hover:text-white transition-colors">24/7 AI Customer Support</Link></li>
              <li><Link to="/nutrition" className="hover:text-white transition-colors">Nutritional Information</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Order Cancellation Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Late Night Delivery Terms</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Cashback & Refunds</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} PizzaRush Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for pizza lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
