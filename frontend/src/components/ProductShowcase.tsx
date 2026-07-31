import React, { useState } from 'react';
import { Star, Leaf, Droplets, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ProductShowcaseItem {
  id: string;
  name: string;
  categoryTitle: string;
  categorySubtitle: string;
  titleWhite: string;
  titleGold: string;
  badgeText: string;
  specs: string[];
  cardImage: string;
  heroImage: string;
  unitPrice: number;
  grade: string;
}

const PRODUCTS: ProductShowcaseItem[] = [
  {
    id: 'cumin-seed-oil',
    name: 'Pure Cumin Seed Oil (Jeera Oil)',
    categoryTitle: 'Cumin',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Cumin',
    titleGold: 'Seed Oil',
    badgeText: 'BEST SELLER',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Essential Oil'],
    cardImage: '/images/cumin-seed-oil.png',
    heroImage: '/images/cumin-seed-oil.png',
    unitPrice: 120,
    grade: '100% Steam Distilled • Pharmaceutical Grade',
  },
  {
    id: 'fennel-seed-oil',
    name: 'Natural Fennel Seed Oil',
    categoryTitle: 'Fennel',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Fennel',
    titleGold: 'Seed Oil',
    badgeText: 'POPULAR CHOICE',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Aromatic Essential Oil'],
    cardImage: '/images/fennel-oil.jpg',
    heroImage: '/images/fennel-oil.jpg',
    unitPrice: 85,
    grade: '100% Steam Distilled • Food & Wellness Grade',
  },
  {
    id: 'ajwain-seed-oil',
    name: 'Pure Ajwain Seed Oil',
    categoryTitle: 'Ajwain',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Ajwain',
    titleGold: 'Seed Oil',
    badgeText: 'HIGH POTENCY',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Therapeutic Grade'],
    cardImage: '/images/ajwain-oil.png',
    heroImage: '/images/ajwain-oil.png',
    unitPrice: 95,
    grade: '100% Steam Distilled • Pharma Grade',
  },
];

export const ProductShowcase: React.FC = () => {
  const { addToCart } = useApp();
  const [activeProductId, setActiveProductId] = useState<string>('cumin-seed-oil');

  const activeProduct = PRODUCTS.find((p) => p.id === activeProductId) || PRODUCTS[0];

  const handleShopNow = (product: ProductShowcaseItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      grade: product.grade,
      unitPrice: product.unitPrice,
      imageUrl: product.heroImage,
    }, 5);
  };

  return (
    <div className="w-full max-w-full my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch font-display">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 sm:gap-5 justify-between">
          {PRODUCTS.map((prod) => {
            const isActive = activeProductId === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setActiveProductId(prod.id)}
                className={`relative group rounded-3xl p-6 transition-all duration-500 cursor-pointer flex items-center justify-between overflow-hidden border min-h-[140px] sm:min-h-[155px] lg:min-h-[165px] bg-neutral-900/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 flex-1 ${isActive
                  ? 'border-white/40 bg-neutral-900/50 ring-1 ring-white/20'
                  : 'border-white/10'
                  }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500 z-0" />

                <div
                  className="absolute right-0 inset-y-0 w-3/5 h-full overflow-hidden pointer-events-none z-0"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 55%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 55%)',
                  }}
                >
                  <img
                    src={prod.cardImage}
                    alt={prod.name}
                    className="w-full h-full object-cover object-[85%_center] opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 filter brightness-[1.05] contrast-[1.05]"
                  />
                </div>

                <div className="relative z-10 flex-1 pr-3">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display drop-shadow-md">
                    {prod.categoryTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-200/90 font-sans-custom mt-1 font-semibold drop-shadow-sm">
                    {prod.categorySubtitle}
                  </p>
                </div>

                <div className="relative z-10">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isActive
                    ? 'bg-[#d4a373] text-neutral-950 shadow-md scale-105'
                    : 'bg-black/50 text-white/70 border border-white/20 group-hover:bg-black/75 group-hover:text-white'
                    }`}>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 xl:col-span-9 relative group rounded-3xl p-8 sm:p-10 lg:p-14 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 flex flex-col md:flex-row items-center justify-between overflow-hidden min-h-[500px] lg:min-h-[540px]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500 z-0" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none z-0" />

          <div
            className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 h-full overflow-hidden pointer-events-none z-0"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 45%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 45%)',
            }}
          >
            <img
              src={activeProduct.heroImage}
              alt={activeProduct.name}
              className="w-full h-full object-cover object-right sm:object-[80%_center] opacity-60 group-hover:opacity-85 filter brightness-[1.02] contrast-[1.05] transform group-hover:scale-105 transition-all duration-700"
            />
          </div>

          <div className="w-full md:w-7/12 z-10 flex flex-col justify-between h-full relative">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 text-[#d4a373] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
                <Star className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
                <span>{activeProduct.badgeText}</span>
              </div>

              <h3 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.05] mb-5">
                {activeProduct.titleWhite}
                <span className="block text-[#d4a373] font-serif font-medium mt-1.5">
                  {activeProduct.titleGold}
                </span>
              </h3>

              <div className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans-custom space-y-1.5 mb-8 font-normal">
                {activeProduct.specs.map((spec, idx) => (
                  <p key={idx}>{spec}</p>
                ))}
              </div>

              <div className="flex items-center gap-6 sm:gap-8 mb-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 flex items-center justify-center text-[#d4a373] mb-2 shadow-inner backdrop-blur-md">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-300 font-medium leading-tight max-w-[80px] font-sans-custom">
                    Pure & Natural
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 flex items-center justify-center text-[#d4a373] mb-2 shadow-inner backdrop-blur-md">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-300 font-medium leading-tight max-w-[80px] font-sans-custom">
                    Steam Distilled
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 flex items-center justify-center text-[#d4a373] mb-2 shadow-inner backdrop-blur-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-300 font-medium leading-tight max-w-[80px] font-sans-custom">
                    Premium Quality
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => handleShopNow(activeProduct)}
                className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-wider transition-all duration-300 shadow-[0_6px_24px_rgba(212,163,115,0.35)] hover:shadow-[0_8px_32px_rgba(212,163,115,0.55)] transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
