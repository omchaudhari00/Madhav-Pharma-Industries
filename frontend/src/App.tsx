import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { AboutSection } from './components/AboutSection';
import ScrollBackground from './components/ScrollBackground';
import SmoothScroll from './components/SmoothScroll';
import { AppProvider, useApp } from './context/AppContext';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { RetailCheckoutModal } from './components/RetailCheckoutModal';
import { AdminDashboard } from './components/portals/AdminDashboard';
import { SalesDashboard } from './components/portals/SalesDashboard';
import { CustomerDashboard } from './components/portals/CustomerDashboard';

const AppContent: React.FC = () => {
  const { currentPortal } = useApp();

  return (
    <>
      {currentPortal === 'admin' ? (
        <AdminDashboard />
      ) : currentPortal === 'sales' ? (
        <SalesDashboard />
      ) : currentPortal === 'customer' ? (
        <CustomerDashboard />
      ) : (
        <SmoothScroll>
          <div className="min-h-screen bg-transparent text-white selection:bg-neutral-800 selection:text-white font-display relative">
            {/* Scrollable Background Animation */}
            <ScrollBackground />

            {/* Foreground Content */}
            <div className="relative z-10">
              <Navbar />

              <main>
                <HeroSection />
                <AboutUsSection />
                <AboutSection />
              </main>
            </div>

            {/* Modals & Drawers */}
            <CartModal />
            <RetailCheckoutModal />
            <AuthModal />
          </div>
        </SmoothScroll>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
