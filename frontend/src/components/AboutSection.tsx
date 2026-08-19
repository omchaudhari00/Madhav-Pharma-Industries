import React from 'react';
import { ContactUsSection } from './ContactUsSection';
import { ProductShowcase } from './ProductShowcase';

export const AboutSection: React.FC = () => {
  return (
    <>
      <section id="products" className="relative w-full bg-[#B4B3B3] xl:bg-transparent text-neutral-900 xl:text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto rounded-none font-display">
        <div id="about" />

        {/* Top Header Banner */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 xl:text-white font-display">
            Our Products
          </h2>
        </div>

        {/* Products Heading & Description Section (Centered) */}
        <div className="mb-12 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 xl:text-white mb-6 leading-tight font-display">
            We Always Make The Best
          </h3>
          <p className="text-neutral-700 xl:text-neutral-300 text-sm sm:text-base leading-relaxed font-sans-custom max-w-2xl font-medium xl:font-normal">
            Our company is committed to quality, purity, and customer satisfaction by delivering reliable natural products for pharmaceutical, herbal, and wellness industries.
          </p>
        </div>

        {/* Product Showcase */}
        <div className="my-12 lg:my-16 py-2">
          <ProductShowcase />
        </div>

        {/* Bottom Section: Our Process & 4 Cards */}
        <div id="manufacturing" className="pt-16 mt-8">
          <div className="mb-10 text-center flex flex-col items-center">
            <h3 className="text-sm sm:text-base uppercase tracking-widest text-black font-extrabold mb-2 font-display">
              OUR PROCESS
            </h3>
            <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 xl:text-white mb-4 font-display">
              100% Steam Distillation
            </h4>
            <p className="text-neutral-800 xl:text-white text-sm sm:text-base leading-relaxed max-w-2xl font-sans-custom mx-auto font-medium xl:font-normal">
              Our advanced steam distillation process preserves the natural properties of each botanical, ensuring maximum purity and potency in every batch.
            </p>
          </div>

          {/* Four Process Cards arranged side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 font-display relative items-stretch">
            {[
              {
                step: 1,
                title: "Sourcing",
                desc: "Premium quality seeds sourced from trusted farms for high-grade raw materials.",
                icon: (
                  <svg className="w-10 h-10 text-emerald-400 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 4.4-3.6 8-8 8h-2z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                ),
              },
              {
                step: 2,
                title: "Preparation",
                desc: "Seeds are carefully cleaned, sorted, and prepared for distillation.",
                icon: (
                  <svg className="w-10 h-10 text-emerald-400 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11h16a1 1 0 0 1 1 1c0 5-4.03 9-9 9s-9-4-9-9a1 1 0 0 1 1-1z" />
                    <circle cx="7.5" cy="14" r="0.75" fill="currentColor" />
                    <circle cx="10" cy="14" r="0.75" fill="currentColor" />
                    <circle cx="12.5" cy="14" r="0.75" fill="currentColor" />
                    <circle cx="15" cy="14" r="0.75" fill="currentColor" />
                    <circle cx="16.5" cy="14" r="0.75" fill="currentColor" />
                    <circle cx="9" cy="16" r="0.75" fill="currentColor" />
                    <circle cx="11.5" cy="16" r="0.75" fill="currentColor" />
                    <circle cx="14" cy="16" r="0.75" fill="currentColor" />
                    <path d="M12 11V6" />
                    <path d="M12 6c0-2 2-3 4-3 0 2-1.5 4-4 4z" />
                    <path d="M12 8c0-1.5-1.5-2.5-3-2.5 0 1.5 1 2.5 3 2.5z" />
                  </svg>
                ),
              },
              {
                step: 3,
                title: "Steam Distillation",
                desc: "100% steam distillation at controlled temperatures for pure essential oils.",
                icon: (
                  <svg className="w-10 h-10 text-emerald-400 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3c0 1 1 1.5 1 2.5S8 7 8 8" />
                    <path d="M12 3c0 1 1 1.5 1 2.5S12 7 12 8" />
                    <path d="M16 3c0 1 1 1.5 1 2.5S16 7 16 8" />
                    <rect x="5" y="9" width="14" height="11" rx="2" />
                    <path d="M4 9h16" />
                    <path d="M8 9V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                    <path d="M12 14c-1 1-1 2 0 3 1-1 1-2 0-3z" fill="currentColor" fillOpacity="0.3" />
                  </svg>
                ),
              },
              {
                step: 4,
                title: "Quality Testing",
                desc: "Each batch undergoes rigorous GC testing to verify purity and potency.",
                icon: (
                  <svg className="w-10 h-10 text-emerald-400 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2h4" />
                    <path d="M11 2v5.3L4.3 17.6A2 2 0 0 0 6 20h12a2 2 0 0 0 1.7-2.4L13 7.3V2" />
                    <path d="M7 14h10" />
                    <path d="M10.5 16.5l1.5 1.5 3-3" strokeWidth="2" />
                  </svg>
                ),
              },
            ].map((card, index, array) => (
              <div key={card.step} className="relative flex flex-col items-center h-full w-full">
                <div
                  className="w-full h-full relative group rounded-3xl p-6 sm:p-7 bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 hover:bg-neutral-900/60 transition-all duration-500 flex flex-col items-center text-center justify-between overflow-hidden"
                >
                  {/* Icon Container */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 mb-3">
                    {card.icon}
                  </div>

                  {/* Step Number Badge */}
                  <div className="w-7 h-7 rounded-full bg-[#d4a373] text-neutral-950 font-bold text-xs flex items-center justify-center mb-3">
                    {card.step}
                  </div>

                  {/* Title */}
                  <h5 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {card.title}
                  </h5>

                  {/* Small Accent Line */}
                  <div className="w-6 h-0.5 bg-[#d4a373] rounded mb-3" />

                  {/* Description */}
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans-custom">
                    {card.desc}
                  </p>
                </div>

                {/* Connecting Arrow between cards for large screens */}
                {index < array.length - 1 && (
                  <div className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#d4a373]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Why Choose Us */}
        <div id="certifications" className="pt-16 mt-8">
          <div className="mb-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 xl:text-white font-display">
              Why Choose Us
            </h3>
          </div>

          {/* Four Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 font-display items-stretch">
            {[
              {
                title: "High Purity Products",
                desc: "Every batch tested and certified for purity levels exceeding industry standards.",
                icon: (
                  <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Strong Natural Aroma",
                desc: "Premium quality seeds ensure rich, authentic aroma in every drop.",
                icon: (
                  <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )
              },
              {
                title: "Modern Manufacturing Process",
                desc: "State-of-the-art facilities with 100% steam distillation technology.",
                icon: (
                  <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Trusted Quality & Service",
                desc: "Committed to honesty, consistency, and excellence in every delivery.",
                icon: (
                  <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative group rounded-3xl p-6 sm:p-7 bg-neutral-900/30 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 hover:bg-neutral-900/50 transition-all duration-500 flex flex-col justify-between overflow-hidden h-full w-full"
              >
                <div className="mb-4">{item.icon}</div>
                <div>
                  <h5 className="text-lg font-bold text-white mb-2">{item.title}</h5>
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans-custom">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section & Full-Page Footer */}
      <ContactUsSection />
    </>
  );
};
