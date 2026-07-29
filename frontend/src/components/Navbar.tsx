"use client";

import React, { useState } from 'react';
import { Activity, Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAuth, openCart, cartTotalCount, user, logout } = useApp();

  return (
    <nav className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between text-white relative z-30 font-display">
      {/* Left: Logo & Navigation Links */}
      <div className="flex items-center space-x-12">
        {/* Logo */}
        <a href="#hero" className="flex items-center space-x-2.5 group">
          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Activity className="w-4 h-4 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-brand">
            Madhav Pharma Industries
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-normal text-neutral-300">
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            Products
          </a>
          <a
            href="#about-us"
            className="hover:text-white transition-colors duration-200"
          >
            Manufacturing
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            Certifications
          </a>
          <a
            href="#about-us"
            className="hover:text-white transition-colors duration-200"
          >
            About
          </a>
        </div>
      </div>

      {/* Right: Cart Option & SIGN IN / UP Button */}
      <div className="hidden sm:flex items-center space-x-4">
        {/* Cart Option near Login */}
        <button
          onClick={openCart}
          className="relative group p-2.5 rounded-full border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 backdrop-blur-sm text-white transition-all duration-300 flex items-center space-x-2 px-4"
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
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 group-hover:text-white">
            Cart
          </span>
        </button>

        {/* User Logged In State vs Sign In / Up */}
        {user ? (
          <div className="flex items-center space-x-3 bg-neutral-900/80 border border-neutral-800 rounded-full pl-4 pr-1.5 py-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user.first_name || 'Client'}</span>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuth('signin')}
            className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none"
          >
            <span className="relative flex items-center justify-center px-6 py-2 rounded-full border border-white/80 group-hover:border-white text-white font-display text-xs font-bold uppercase tracking-wider transition-colors">
              SIGN IN / UP
            </span>
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-1.5 text-neutral-300 hover:text-white focus:outline-none"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-6 py-6 flex flex-col space-y-4 md:hidden z-50">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-neutral-300 hover:text-white py-1"
          >
            Products
          </a>
          <a
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="text-neutral-300 hover:text-white py-1"
          >
            Manufacturing
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-neutral-300 hover:text-white py-1"
          >
            Certifications
          </a>
          <a
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="text-neutral-300 hover:text-white py-1"
          >
            About
          </a>

          {/* Mobile Cart Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
            className="flex items-center justify-between py-2 text-neutral-300 hover:text-white border-t border-neutral-800 pt-4"
          >
            <span className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Quotation Cart</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-xs font-extrabold">
              {cartTotalCount} kg
            </span>
          </button>

          {/* Mobile Sign In/Up or Logout */}
          <div className="pt-3 border-t border-neutral-800 flex justify-center">
            {user ? (
              <div className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-white">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user.first_name || 'Client'}</span>
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
  );
};
