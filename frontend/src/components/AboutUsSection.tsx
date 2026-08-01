import React from 'react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="relative w-full bg-transparent text-white pt-16 mt-16 border-t border-neutral-900 px-6 lg:px-12 max-w-7xl mx-auto font-display">

      {/* Top Header Banner */}
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 font-display">
          About Us
        </h2>
      </div>

      {/* Main Content Grid: Image + Text Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Image */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl group">
          <img
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80"
            alt="About Us Workspace"
            className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center text-left">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
            Welcome to Madhav Pharma Industries
          </h3>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-sans-custom">
            Madhav Pharma Industries is a trusted manufacturer of premium-quality Cumin Seed Oil (Jeera Oil) and natural essential oils. We specialize in producing pure and high-aroma oils using the <strong className="font-bold text-white">100% Steam Distillation Process</strong>.
          </p>

          {/* Contact Us Button */}
          <div>
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center p-[3px] rounded-full border border-white/60 hover:border-white transition-all duration-300 focus:outline-none"
            >
              <span className="relative flex items-center justify-center px-8 py-3 rounded-full border border-white/80 group-hover:border-white text-white font-display text-sm font-bold uppercase tracking-wider transition-colors">
                Contact Us
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
