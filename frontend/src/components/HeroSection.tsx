"use client";

import React from 'react';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const { openCart } = useApp();

  return (
    <section id="hero" className="relative w-full min-h-[calc(100vh-88px)] bg-transparent text-white flex flex-col justify-center px-6 lg:px-12 py-8 max-w-7xl mx-auto overflow-hidden font-display">
      {/* Subtle layout grid lines (ultra minimal) */}
      <div className="absolute inset-0 pointer-events-none -z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-3 opacity-10">
        <div className="border-r border-neutral-800 h-full" />
        <div className="border-r border-neutral-800 h-full" />
        <div className="h-full" />
      </div>

      {/* Main Center Content */}
      <div className="my-auto pt-8 pb-16 lg:py-16 relative z-10 flex flex-col justify-center items-end text-right ml-auto">
        <div className="max-w-2xl relative">

          {/* Headline with exact geometric bold display font style */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] sm:leading-[1.1] tracking-tight text-white mb-6 sm:mb-8 font-display">
            <span>Pure Cumin Seed Oil &</span>
            <br />
            <span className="text-neutral-100">Natural Essential Oils</span>
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-300 text-xs sm:text-base md:text-lg leading-relaxed font-normal mb-8 sm:mb-12 max-w-xl font-sans-custom">
            Leading manufacturer of 100% steam distilled essential oils with high purity and strong aroma. Trusted by pharmaceutical and food industries worldwide.
          </p>

          {/* Action Buttons: Request Quote & Explore Products */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-6 font-display">
            <button
              onClick={openCart}
              className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none w-full sm:w-auto"
            >
              <span className="relative flex items-center justify-center px-6 sm:px-8 py-3 rounded-full border border-white/80 group-hover:border-white text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto">
                Request Quote
              </span>
            </button>

            <a
              href="#products"
              className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none w-full sm:w-auto text-center"
            >
              <span className="relative flex items-center justify-center px-6 sm:px-8 py-3 rounded-full border border-white/80 group-hover:border-white text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto">
                Explore Products
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
