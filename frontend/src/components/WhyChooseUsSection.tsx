import React from 'react';

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      title: "High Purity Products",
      desc: "Every batch tested and certified for purity levels exceeding industry standards.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Strong Natural Aroma",
      desc: "Premium quality seeds ensure rich, authentic aroma in every drop.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: "Modern Manufacturing Process",
      desc: "State-of-the-art facilities with 100% steam distillation technology.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Trusted Quality & Service",
      desc: "Committed to honesty, consistency, and excellence in every delivery.",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div id="certifications" className="w-full">
      <div className="mb-10 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 xl:text-white font-display">
          Why Choose Us
        </h3>
      </div>

      {/* Four Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 font-display items-stretch">
        {features.map((item, idx) => (
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
  );
};
