"use client";

import React, { useState } from 'react';
import { Activity, Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuth, openCart, cartTotalCount, user, logout, switchDemoRole, setPortal } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/85 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between text-white relative font-display">
        {/* Left: Logo & Desktop Navigation Links */}
        <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-12">
          {/* Logo */}
          <a href="#hero" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Activity className="w-4 h-4 text-black" />
            </div>
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
          {/* Cart Option Button */}
          <button
            onClick={openCart}
            className="relative group p-2 sm:p-2.5 rounded-full border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 backdrop-blur-sm text-white transition-all duration-300 flex items-center space-x-2 px-3 sm:px-4 shrink-0"
            aria-label="View Quotation Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-neutral-200 group-hover:text-white transition-colors" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 group-hover:text-white hidden sm:inline">
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
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md whitespace-nowrap shrink-0"
              >
                Portal ({user.role})
              </button>
              <div className="flex items-center space-x-2 bg-neutral-900/80 border border-neutral-800 rounded-full pl-3 pr-1 py-1 shrink-0">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="max-w-[120px] truncate">{user.first_name || user.role}</span>
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

            {/* Mobile Cart Option */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="flex items-center justify-between py-2 text-neutral-300 hover:text-white border-t border-neutral-800 pt-4"
            >
              <span className="flex items-center space-x-2 text-base font-medium">
                <ShoppingBag className="w-5 h-5" />
                <span>Quotation Cart</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-extrabold">
                {cartTotalCount} kg
              </span>
            </button>

            {/* Mobile Sign In/Up or User State */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-3">
              {user ? (
                <>
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
                </>
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
