import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { OTPPage } from './pages/OTPPage';
import { MenuPage } from './pages/MenuPage';
import { OffersPage } from './pages/OffersPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { TakeawayPage } from './pages/TakeawayPage';
import { DineInPage } from './pages/DineInPage';
import { BulkOrderPage } from './pages/BulkOrderPage';
import { NutritionPage } from './pages/NutritionPage';
import { TermsPage } from './pages/TermsPage';
import { SupportPage } from './pages/SupportPage';
import { BuildPizzaPage } from './pages/BuildPizzaPage';
import { AdminCustomizerPage } from './pages/AdminCustomizerPage';

export function App() {
  const { fetchMe, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/deals" element={<OffersPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/build-your-pizza" element={<BuildPizzaPage />} />
        <Route path="/admin/customizer" element={<AdminCustomizerPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track/:id" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/takeaway" element={<TakeawayPage />} />
        <Route path="/dine-in" element={<DineInPage />} />
        <Route path="/bulk-order" element={<BulkOrderPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
