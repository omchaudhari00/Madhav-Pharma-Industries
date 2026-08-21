"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative w-full min-h-[calc(100vh-88px)] bg-transparent text-black sm:text-white flex flex-col justify-center px-6 sm:px-8 xl:px-12 py-8 max-w-7xl mx-auto overflow-hidden font-display">
      {/* Main Center Content: Centered on Mobile, iPad & iPad Pro (< 1280px), Right-aligned on Large Desktop */}
      <div className="my-auto pt-8 pb-16 xl:py-16 relative z-10 flex flex-col justify-center items-center text-center mx-auto xl:items-end xl:text-right xl:ml-auto xl:mr-0">
        <div className="max-w-2xl sm:max-w-3xl relative flex flex-col items-center xl:items-end">

          {/* Headline matching image typography exactly */}
          <div className="flex flex-col items-center text-center xl:items-end xl:text-right w-full">
            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-white font-display">
              Pure Cumin Seed Oil
            </h1>

            {/* Decorative Ornamental Divider */}
            <div className="flex items-center justify-center xl:justify-end gap-3 my-4 sm:my-6 w-full opacity-90">
              <div className="h-[1.5px] w-12 sm:w-32 bg-gradient-to-r from-transparent via-amber-200/70 to-amber-200/70" />
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <div className="h-[1.5px] w-12 sm:w-32 bg-gradient-to-l from-transparent via-amber-200/70 to-amber-200/70" />
            </div>

            {/* Subtitle */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-serif text-amber-100/90 font-medium tracking-wide mb-3 sm:mb-4">
              Natural Essential Oils
            </h2>
          </div>

          {/* Subtitle Description */}
          <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed font-semibold mb-8 sm:mb-12 max-w-xl font-sans-custom text-center xl:text-right drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Leading manufacturer of 100% steam distilled essential oils with high purity and strong aroma. Trusted by pharmaceutical and food industries worldwide.
          </p>

          {/* Action Button: Explore Products only */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center xl:justify-end gap-4 sm:gap-6 font-display w-full sm:w-auto">
            <button
              onClick={() => navigate('/products')}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/20 sm:bg-white/10 backdrop-blur-md border border-white/30 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] hover:bg-white hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center">
                Explore Products
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
