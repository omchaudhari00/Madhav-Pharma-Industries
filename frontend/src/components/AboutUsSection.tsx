import React from 'react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="relative w-full bg-transparent text-white pt-6 sm:pt-10 pb-16 sm:pb-20 px-6 lg:px-12 max-w-5xl mx-auto font-display">

      {/* Top Header Banner */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 font-display">
          About Us
        </h2>
      </div>

      {/* Main Content: Centered layout positioned cleanly with ample bottom spacing */}
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto -mt-2 sm:-mt-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight font-display">
          Welcome to Madhav Pharma Industries
        </h3>
        <p className="text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 font-sans-custom">
          Madhav Pharma Industries is a trusted manufacturer of premium-quality Cumin Seed Oil (Jeera Oil) and natural essential oils. We specialize in producing pure and high-aroma oils using the <strong className="font-bold text-white">100% Steam Distillation Process</strong>.
        </p>

        {/* Contact Us Button */}
        <div className="flex justify-center">
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/20 sm:bg-white/10 backdrop-blur-md border border-white/30 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] hover:bg-white hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center">
              Contact Us
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
