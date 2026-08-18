"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut, Info, Package, Factory, Phone, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuth, openCart, cartTotalCount, user, logout, setPortal, openRetailCheckout, retailCartTotalCount } = useApp();

  const totalCartCount = retailCartTotalCount + cartTotalCount;

  // Close mobile menu when tapping outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const headerElement = document.getElementById('main-navbar-header');
      if (headerElement && !headerElement.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleCartClick = () => {
    if (retailCartTotalCount > 0) openRetailCheckout();
    else if (cartTotalCount > 0) openCart();
    else openRetailCheckout();
  };

  return (
    <header id="main-navbar-header" className="sticky top-0 z-40 w-full bg-neutral-950/90 xl:bg-transparent backdrop-blur-xl xl:backdrop-blur-none border-b border-white/10 xl:border-b-0 transition-all duration-300">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between text-white relative font-display">
        {/* Left: Brand Logo */}
        <a href="#hero" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
          <img 
            src="/images/favicon-circle.png" 
            alt="Madhav Pharma Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-amber-500/40 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white font-brand whitespace-nowrap">
            Madhav Pharma
          </span>
        </a>

        {/* Right-Aligned Desktop Navigation Links (Visible on Large Screens 1280px+) */}
        <div className="hidden xl:flex items-center space-x-6 xl:space-x-8 text-xs sm:text-sm font-medium text-neutral-300 whitespace-nowrap ml-auto mr-6 xl:mr-8">
          <a
            href="#about-us"
            className="hover:text-white transition-colors duration-200 py-1"
          >
            About Us
          </a>
          <a
            href="#products"
            className="hover:text-white transition-colors duration-200 py-1"
          >
            Products
          </a>
          <a
            href="#manufacturing"
            className="hover:text-white transition-colors duration-200 py-1"
          >
            Manufacturing
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-200 py-1"
          >
            Contact
          </a>
        </div>

        {/* Right Actions: Cart Logo Icon & SIGN IN / UP or User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Smart Cart Pure Icon Button (No Box/Border) */}
          <button
            onClick={handleCartClick}
            className="relative group p-1.5 text-[#d4a373] hover:text-white transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4a373] group-hover:text-white transition-colors" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d4a373] text-neutral-950 text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Logged In State vs Sign In / Up */}
          {user ? (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  if (user.role === 'Admin') setPortal('admin');
                  else if (user.role === 'Sales') setPortal('sales');
                  else setPortal('customer');
                }}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md whitespace-nowrap shrink-0"
              >
                Portal ({user.role})
              </button>
              <div className="flex items-center space-x-2 bg-neutral-900/80 border border-neutral-800 rounded-full pl-3 pr-1.5 py-1 shrink-0">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.first_name || user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Glassmorphism Theme Desktop SIGN IN / UP Button (Visible ONLY on Desktop >= 1280px) */
            <button
              onClick={() => openAuth('signin')}
              className="hidden xl:inline-flex group relative items-center justify-center px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-[#d4a373]/60 text-white font-display text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(212,163,115,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 cursor-pointer overflow-hidden"
            >
              {/* Glossy top edge highlight line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <LogIn className="w-3.5 h-3.5 text-[#d4a373] group-hover:text-white transition-colors" />
                <span>SIGN IN / UP</span>
              </span>
            </button>
          )}

          {/* Mobile & iPad Pure Icon Hamburger Menu Toggle (No Box/Border) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-neutral-300 hover:text-white focus:outline-none shrink-0 ml-1 cursor-pointer transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile & iPad Dropdown Menu (Overlay for screens < 1280px) */}
        {mobileMenuOpen && (
          <div className="fixed top-[60px] left-0 right-0 bottom-0 h-[calc(100dvh-60px)] overflow-y-auto bg-neutral-950/98 backdrop-blur-2xl border-t border-neutral-800 px-6 pt-4 pb-24 flex flex-col space-y-6 xl:hidden z-50 shadow-2xl overscroll-contain">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#d4a373] uppercase block mb-2 px-3">
                Navigation Menu
              </span>
              <a
                href="#about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-neutral-900/90 text-neutral-200 hover:text-white transition-colors text-base font-medium border border-transparent hover:border-neutral-800"
              >
                <Info className="w-5 h-5 text-[#d4a373]" />
                <span>About Us</span>
              </a>
              <a
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-neutral-900/90 text-neutral-200 hover:text-white transition-colors text-base font-medium border border-transparent hover:border-neutral-800"
              >
                <Package className="w-5 h-5 text-[#d4a373]" />
                <span>Products</span>
              </a>
              <a
                href="#manufacturing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-neutral-900/90 text-neutral-200 hover:text-white transition-colors text-base font-medium border border-transparent hover:border-neutral-800"
              >
                <Factory className="w-5 h-5 text-[#d4a373]" />
                <span>Manufacturing</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3.5 rounded-xl hover:bg-neutral-900/90 text-neutral-200 hover:text-white transition-colors text-base font-medium border border-transparent hover:border-neutral-800"
              >
                <Phone className="w-5 h-5 text-[#d4a373]" />
                <span>Contact</span>
              </a>
            </div>

            {/* Mobile & iPad Actions Section */}
            <div className="pt-4 border-t border-neutral-800 space-y-3 pb-8">
              {/* Cart Drawer Link */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCartClick();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/90 border border-amber-500/30 text-white font-medium text-sm"
              >
                <span className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                  <span>My Cart</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#d4a373] text-neutral-950 text-xs font-extrabold">
                  {totalCartCount} items
                </span>
              </button>

              {/* Mobile/iPad SIGN IN / UP Button or Logged in portal controls */}
              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (user.role === 'Admin') setPortal('admin');
                      else if (user.role === 'Sales') setPortal('sales');
                      else setPortal('customer');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider text-center shadow-lg"
                  >
                    Open My Portal ({user.role})
                  </button>
                  <div className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-sm font-bold text-white">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>{user.first_name || user.role}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1 text-xs text-red-400 hover:text-red-300 font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                /* Glassmorphism Theme Mobile & iPad Hamburger Menu Sign In / Up Button */
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('signin');
                  }}
                  className="w-full relative group flex items-center justify-center space-x-2.5 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-[#d4a373]/60 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(212,163,115,0.25)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Glossy top edge highlight line */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                  <LogIn className="w-4 h-4 text-[#d4a373] group-hover:text-white transition-colors" />
                  <span className="relative z-10">SIGN IN / SIGN UP</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};


