import React from 'react';
import { ContactUsSection } from './ContactUsSection';
import { useApp } from '../context/AppContext';

export const AboutSection: React.FC = () => {
  const { openCart } = useApp();

  return (
    <section id="about" className="relative w-full bg-transparent text-white py-20 px-6 lg:px-12 max-w-7xl mx-auto font-display">

      {/* Top Header Banner */}
      <div className="text-center mb-16 sm:mb-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-display">
          Our Products
        </h2>
      </div>

      {/* Products Heading & Description Section (Above the 4 glassmorphism boxes) */}
      <div className="mb-12 max-w-2xl text-left">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
          We Always Make The Best
        </h3>
        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-sans-custom">
          Our company is committed to quality, purity, and customer satisfaction by delivering reliable natural products for pharmaceutical, herbal, and wellness industries.
        </p>

        {/* All Products Pill Button */}
        <div>
          <button
            onClick={openCart}
            className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none"
          >
            <span className="relative flex items-center justify-center px-8 py-2.5 rounded-full border border-white/80 group-hover:border-white text-white font-display text-sm font-bold uppercase tracking-wider transition-colors">
              All Products
            </span>
          </button>
        </div>
      </div>

      {/* Glassmorphism Showcase: 16:9 aspect ratio container with 3 stacked boxes on the left + 1 large box on the right */}
      <div className="my-12 lg:my-16 py-6 lg:py-10 w-full flex justify-center">
        <div className="w-full max-w-5xl aspect-[16/9] flex gap-4 sm:gap-6 items-stretch">
          {/* Left Column: 3 glassmorphism boxes stacked vertically, filling height proportionally */}
          <div className="w-1/3 sm:w-1/4 lg:w-1/3 flex flex-col gap-3 sm:gap-4 h-full flex-shrink-0">
            {[1, 2, 3].map((boxNum) => (
              <div
                key={boxNum}
                className="relative group rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 flex-1 h-0 overflow-hidden"
              >
                {/* Top glossy glass edge highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                {/* Subtle glass reflection highlight */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
              </div>
            ))}
          </div>

          {/* Right Column: Large glassmorphism box filling full height beside the 3 stacked boxes */}
          <div className="flex-1 h-full relative group rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 overflow-hidden flex flex-col justify-between">
            {/* Top glossy glass edge highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            {/* Subtle glass reflection highlight */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Our Skills & 4 Glassmorphism Cards */}
      <div className="pt-12 border-t border-neutral-900">
        <div className="mb-10 text-center flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl uppercase tracking-wider text-neutral-400 font-semibold mb-2 font-display">
            Our Process
          </h3>
          <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 font-display">
            100% Steam Distillation
          </h4>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl font-sans-custom mx-auto">
            Our advanced steam distillation process preserves the natural properties of each botanical, ensuring maximum purity and potency in every batch.
          </p>
        </div>

        {/* Four Glassmorphism Cards arranged side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
          {[1, 2, 3, 4].map((cardNum) => (
            <div
              key={cardNum}
              className="relative group rounded-3xl p-8 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 min-h-[280px] flex flex-col justify-between overflow-hidden"
            >
              {/* Top glossy glass edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              {/* Subtle glass reflection highlight */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* New Section: Why Choose Us & 4 Glassmorphism Cards */}
      <div className="pt-16 mt-16 border-t border-neutral-900">
        <div className="mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Why Choose Us
          </h3>
        </div>

        {/* Four Glassmorphism Cards arranged side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
          {[1, 2, 3, 4].map((cardNum) => (
            <div
              key={cardNum}
              className="relative group rounded-3xl p-8 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 min-h-[280px] flex flex-col justify-between overflow-hidden"
            >
              {/* Top glossy glass edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              {/* Subtle glass reflection highlight */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Section matching requested design */}
      <ContactUsSection />
    </section>
  );
};
