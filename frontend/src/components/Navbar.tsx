"use client";

import React, { useState } from 'react';
import { Activity, Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuth, openCart, cartTotalCount, user, logout, switchDemoRole, setPortal, shopMode, setShopMode, openRetailCheckout, retailCartTotalCount } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/85 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between text-white relative font-display">
        {/* Left: Logo & Desktop Navigation Links */}
        <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-12">
          {/* Logo */}
          <a href="#hero" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <img 
              src="/images/favicon-circle.png" 
              alt="Madhav Pharma Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white font-brand whitespace-nowrap">
              Madhav Pharma
            </span>
          </a>

          {/* Desktop Nav Links (Visible on Large Screens 1024px+) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-normal text-neutral-300 whitespace-nowrap">
            <a
              href="#about-us"
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              About Us
            </a>
            <a
              href="#products"
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              Products
            </a>
            <a
              href="#manufacturing"
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              Manufacturing
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Right: Cart Option & SIGN IN / UP or User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Unified Smart Cart Button */}
          <button
            onClick={() => {
              if (retailCartTotalCount > 0) openRetailCheckout();
              else if (cartTotalCount > 0) openCart();
              else openRetailCheckout();
            }}
            className="relative group p-2 sm:p-2.5 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 text-white hover:bg-[#d4a373]/25 transition-all duration-300 flex items-center space-x-2 px-3.5 sm:px-4 shrink-0 cursor-pointer"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#d4a373] group-hover:text-white transition-colors" />
              {(retailCartTotalCount + cartTotalCount) > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center justify-center">
                  {retailCartTotalCount + cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4a373] group-hover:text-white hidden sm:inline">
              Cart
            </span>
          </button>

          {/* User Logged In State vs Sign In / Up (Shown on Desktop 1024px+) */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  if (user.role === 'Admin') setPortal('admin');
                  else if (user.role === 'Sales') setPortal('sales');
                  else setPortal('customer');
                }}
                className="flex items-center space-x-2 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-1.5 hover:bg-neutral-800 transition-colors shrink-0 shadow-md group"
              >
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-white max-w-[120px] truncate group-hover:text-emerald-400 transition-colors">
                  {user.first_name || user.role}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth('signin')}
              className="hidden lg:inline-flex group relative items-center justify-center p-[2px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none shrink-0"
            >
              <span className="relative flex items-center justify-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/80 group-hover:border-white text-white font-display text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap">
                SIGN IN / UP
              </span>
            </button>
          )}

          {/* Mobile & Tablet Menu Toggle Button (Visible on screens < 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-neutral-300 hover:text-white focus:outline-none shrink-0 ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile & Tablet Dropdown Menu (Screens < 1024px) */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 max-h-[85vh] overflow-y-auto bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-6 py-6 flex flex-col space-y-4 lg:hidden z-50 shadow-2xl">
            <a
              href="#about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 whitespace-nowrap text-base font-medium"
            >
              About Us
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 whitespace-nowrap text-base font-medium"
            >
              Products
            </a>
            <a
              href="#manufacturing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 whitespace-nowrap text-base font-medium"
            >
              Manufacturing
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1 whitespace-nowrap text-base font-medium"
            >
              Contact
            </a>

            {/* Mobile Unified Cart Option */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (retailCartTotalCount > 0) openRetailCheckout();
                else if (cartTotalCount > 0) openCart();
                else openRetailCheckout();
              }}
              className="flex items-center justify-between py-2 text-neutral-300 hover:text-white border-t border-neutral-800 pt-4"
            >
              <span className="flex items-center space-x-2 text-base font-medium">
                <ShoppingBag className="w-5 h-5 text-[#d4a373]" />
                <span>My Cart</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-extrabold">
                {retailCartTotalCount + cartTotalCount} items
              </span>
            </button>

            {/* Mobile Sign In/Up or User State */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => {
                    if (user.role === 'Admin') setPortal('admin');
                    else if (user.role === 'Sales') setPortal('sales');
                    else setPortal('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user.first_name || user.role}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('signin');
                  }}
                  className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none w-full"
                >
                  <span className="relative flex items-center justify-center w-full py-2.5 rounded-full border border-white/80 text-white font-display text-sm font-bold uppercase tracking-wider">
                    SIGN IN / UP
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
