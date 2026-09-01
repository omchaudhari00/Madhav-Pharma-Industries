import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OurProductsSection } from './components/OurProductsSection';
import { AboutUsSection } from './components/AboutUsSection';
import { OurProcessSection } from './components/OurProcessSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ContactUsSection } from './components/ContactUsSection';
import ScrollBackground from './components/ScrollBackground';
import SmoothScroll from './components/SmoothScroll';
import { AppProvider, useApp } from './context/AppContext';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { RetailCheckoutModal } from './components/RetailCheckoutModal';
import { LegalModals } from './components/LegalModals';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { FloatingCartButton } from './components/FloatingCartButton';

// Lazy-loaded portals for bundle optimization
const AdminDashboard = React.lazy(() => import('./components/portals/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SalesDashboard = React.lazy(() => import('./components/portals/SalesDashboard').then(m => ({ default: m.SalesDashboard })));
const CustomerDashboard = React.lazy(() => import('./components/portals/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const ScrollToTopOnNav = () => {
  const { pathname, hash } = useLocation();

  React.useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });

      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const previousPath = React.useRef(location.pathname);

  React.useEffect(() => {
    // Show premium splash screen for 1.5s on app load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Trigger loading screen on portal changes
    if (location.pathname !== previousPath.current) {
      const isEnteringCustomerSide = location.pathname.startsWith('/customer');
      const isExitingCustomerSideToStorefront = previousPath.current.startsWith('/customer') && (location.pathname === '/' || location.pathname.startsWith('/products'));
      previousPath.current = location.pathname;

      if (isEnteringCustomerSide || isExitingCustomerSideToStorefront) {
        setIsLoading(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

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
      <ScrollToTopOnNav />
      <Routes>
        {/* Portals with Code-Splitting */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <React.Suspense fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
                <img src="/images/favicon-circle.png" alt="Loading Admin Portal..." className="w-24 h-24 object-contain animate-spin-coin relative z-10" />
              </div>
            }>
              <AdminDashboard />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute allowedRoles={['Sales']}>
            <React.Suspense fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
                <img src="/images/favicon-circle.png" alt="Loading Sales Portal..." className="w-24 h-24 object-contain animate-spin-coin relative z-10" />
              </div>
            }>
              <SalesDashboard />
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Sales']}>
            <React.Suspense fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
                <img src="/images/favicon-circle.png" alt="Loading Customer Portal..." className="w-24 h-24 object-contain animate-spin-coin relative z-10" />
              </div>
            }>
              <CustomerDashboard />
            </React.Suspense>
          </ProtectedRoute>
        } />
        {/* /products — Dedicated Shop Page */}
        <Route path="/products" element={
          <>
            <ShopPage />
            <CartModal />
            <RetailCheckoutModal />
            <AuthModal />
            <LegalModals />
          </>
        } />

        {/* /product/:id — Individual Product Detail Page */}
        <Route path="/product/:id" element={
          <>
            <ProductDetailPage />
            <CartModal />
            <RetailCheckoutModal />
            <AuthModal />
            <LegalModals />
          </>
        } />

        {/* / — Main Storefront Landing Page */}
        <Route path="/*" element={
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

                  {/* Products, About Us, and Manufacturing Preview Section */}
                  <div className="bg-transparent text-white relative z-20">
                    <section id="products" className="relative w-full bg-[#B4B3B3] xl:bg-transparent text-neutral-900 xl:text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto rounded-none font-display">
                      <div id="about" />

                      {/* 1. Our Products Section */}
                      <OurProductsSection />

                      {/* 2. About Us Section */}
                      <div className="border-t border-black/10 xl:border-white/10 pt-4 pb-4">
                        <AboutUsSection />
                      </div>

                      {/* 3. Our Process Section */}
                      <div className="pt-16 mt-8 border-t border-black/10 xl:border-white/10">
                        <OurProcessSection />
                      </div>

                      {/* 4. Why Choose Us Section */}
                      <div className="pt-16 mt-8">
                        <WhyChooseUsSection />
                      </div>
                    </section>

                    {/* 5. Contact Us Section */}
                    <ContactUsSection />
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
        } />
      </Routes>
      <FloatingCartButton />
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
