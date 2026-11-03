/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { ShopPage } from './components/ShopPage';
import { SaveToBuyHub } from './components/SaveToBuyHub';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SaveToBuyModal } from './components/SaveToBuyModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaystackModal } from './components/PaystackModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const MainAppContent: React.FC = () => {
  const { currentView, selectedProduct, setSelectedProduct, user, setCurrentView } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Admin views are never rendered for ordinary customer accounts.
  React.useEffect(() => {
    if (currentView === 'admin_dashboard' && user.role !== 'admin') setCurrentView('home');
  }, [currentView, user.role, setCurrentView]);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#FAF7F2] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FAF7F2]">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <Storefront />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'savetobuy_hub' && <SaveToBuyHub />}
        {currentView === 'customer_dashboard' && <CustomerDashboard />}
        {currentView === 'admin_dashboard' && user.role === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-Over Shopping Bag */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Product Detail Modal (PDP) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Save to Buy Interactive Configurator Modal */}
      <SaveToBuyModal />

      {/* Paystack Payment Gateway Modal */}
      <PaystackModal />

      {/* Floating Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
