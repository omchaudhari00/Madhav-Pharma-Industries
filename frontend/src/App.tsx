import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { AboutSection } from './components/AboutSection';
import ScrollBackground from './components/ScrollBackground';
import SmoothScroll from './components/SmoothScroll';
import { AppProvider } from './context/AppContext';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  return (
    <AppProvider>
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
          <AuthModal />
        </div>
      </SmoothScroll>
    </AppProvider>
  );
}
