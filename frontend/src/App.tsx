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
import { LegalModals } from './components/LegalModals';
import { AdminDashboard } from './components/portals/AdminDashboard';
import { SalesDashboard } from './components/portals/SalesDashboard';
import { CustomerDashboard } from './components/portals/CustomerDashboard';

const AppContent: React.FC = () => {
  const { currentPortal } = useApp();
  const [isLoading, setIsLoading] = React.useState(true);
  const previousPortal = React.useRef(currentPortal);

  React.useEffect(() => {
    // Show premium splash screen for 1.5s on app load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Trigger loading screen on portal changes
    if (currentPortal !== previousPortal.current) {
      const isEnteringCustomerSide = currentPortal === 'customer';
      const isExitingCustomerSideToStorefront = previousPortal.current === 'customer' && currentPortal === 'storefront';
      previousPortal.current = currentPortal;

      if (isEnteringCustomerSide || isExitingCustomerSideToStorefront) {
        setIsLoading(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [currentPortal]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
        <div className="relative">
          {/* Subtle glowing background behind the logo */}
          <div className="absolute inset-0 bg-[#d4a373] blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <img 
            src="/images/favicon-circle.png" 
            alt="Madhav Pharma Loading" 
            className="w-28 h-28 object-contain animate-spin-coin relative z-10" 
          />
        </div>
      </div>
    );
  }

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
                {/* Home Page Section Container with Background Image (< 1280px) */}
                <div className="relative w-full overflow-hidden">
                  {/* Dedicated Mobile & iPad (including iPad Pro) Background Image ONLY for Home Page */}
                  <div className="block xl:hidden absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <img 
                      src="/images/home-about-gy.png" 
                      alt="Madhav Pharma Home Background" 
                      className="w-full h-full object-cover object-[51%_top] filter brightness-75 contrast-105"
                    />
                  </div>

                  {/* Home Section Content */}
                  <div className="relative z-10">
                    <HeroSection />
                  </div>
                </div>

                {/* About Us Section */}
                <div className="relative z-20">
                  <AboutUsSection />
                </div>

                {/* All Subsequent Sections */}
                <div className="bg-transparent text-white relative z-20">
                  <AboutSection />
                </div>
              </main>
            </div>

            {/* Modals & Drawers */}
            <CartModal />
            <RetailCheckoutModal />
            <AuthModal />
            <LegalModals />
          </div>
        </SmoothScroll>
      )}
      <LegalModals />
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
