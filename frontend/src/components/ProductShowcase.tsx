import React, { useState } from 'react';
import { Star, Leaf, Droplets, Sparkles, ArrowRight, Package, Factory, AlertCircle } from 'lucide-react';
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
  retailPrice?: number;
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
    retailPrice: 299,
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
    retailPrice: 249,
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
    retailPrice: 279,
    grade: '100% Steam Distilled • Pharma Grade',
  },
  {
    id: 'black-seed-oil',
    name: 'Pure Black Seed Oil (Kalonji Oil)',
    categoryTitle: 'Black Seed',
    categorySubtitle: 'Essential Oil',
    titleWhite: 'Black Seed',
    titleGold: 'Essential Oil',
    badgeText: 'PREMIUM CHOICE',
    specs: ['100% Pure & Cold Pressed/Distilled', 'Rich in Thymoquinone', 'Therapeutic Grade'],
    cardImage: '/images/all-oils.png',
    heroImage: '/images/all-oils.png',
    unitPrice: 150,
    retailPrice: 349,
    grade: '100% Steam Distilled • Pharma & Wellness Grade',
  },
];

export const ProductShowcase: React.FC = () => {
  const { addToCart, addToRetailCart, isProductOutOfStock } = useApp();
  const [activeProductId, setActiveProductId] = useState<string>('cumin-seed-oil');
  const [retailQty, setRetailQty] = useState<Record<string, number>>({});
  const [cardMode, setCardMode] = useState<Record<string, 'retail' | 'bulk'>>({});

  const activeProduct = PRODUCTS.find((p) => p.id === activeProductId) || PRODUCTS[0];

  const getMode = (id: string) => cardMode[id] || 'retail';
  const setMode = (id: string, mode: 'retail' | 'bulk') => {
    setCardMode(prev => ({ ...prev, [id]: mode }));
  };

  const getQty = (id: string) => (retailQty[id] !== undefined ? retailQty[id] : 1);
  const changeQty = (id: string, delta: number) => {
    const current = getQty(id);
    const next = Math.max(1, current + delta);
    setRetailQty(prev => ({ ...prev, [id]: next }));
  };

  const handleShopNow = (product: ProductShowcaseItem) => {
    addToCart({
      id: product.id,
      name: product.name,
      grade: product.grade,
      unitPrice: product.unitPrice,
      imageUrl: product.heroImage,
    }, 1);
  };

  const handleAddRetail = (product: ProductShowcaseItem) => {
    const qty = getQty(product.id);
    addToRetailCart({
      id: product.id,
      name: product.name,
      sizeLabel: '50ml Bottle',
      unitPrice: product.retailPrice || 299,
      imageUrl: product.heroImage,
    }, qty);
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
                  <div>
                    <span className="text-xs font-semibold text-[#d4a373] tracking-widest uppercase block mb-1">
                      {prod.categoryTitle} <span className="text-neutral-400 font-normal">{prod.categorySubtitle}</span>
                      {isProductOutOfStock(prod.id) && <span className="ml-2 text-[10px] text-red-400 font-bold">(OUT OF STOCK)</span>}
                    </span>
                    <h4 className="text-lg sm:text-xl font-serif text-white font-bold leading-tight">
                      {prod.name}
                    </h4>
                  </div>
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

        <div className="lg:col-span-8 xl:col-span-9 relative group rounded-3xl p-5 sm:p-8 lg:p-14 bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] hover:border-white/25 hover:bg-neutral-900/50 transition-all duration-500 flex flex-col md:flex-row items-center justify-between overflow-hidden min-h-[460px] sm:min-h-[500px] lg:min-h-[540px]">
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
              {isProductOutOfStock(activeProduct.id) ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/60 bg-red-500/15 text-red-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>OUT OF STOCK</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4a373]/60 bg-[#d4a373]/15 text-[#d4a373] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
                  {getMode(activeProduct.id) === 'retail' ? (
                    <Package className="w-4 h-4 text-[#d4a373]" />
                  ) : (
                    <Star className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
                  )}
                  <span>{getMode(activeProduct.id) === 'retail' ? '50ML RETAIL BOTTLE • FIXED PRICE' : activeProduct.badgeText}</span>
                </div>
              )}

              <h3 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-white tracking-tight leading-[1.05] mb-5">
                {activeProduct.titleWhite}
                <span className="block text-[#d4a373] font-serif font-medium mt-1.5">
                  {activeProduct.titleGold}
                </span>
              </h3>

              {/* Pack Size Selector (Idea 4) */}
              <div className="my-4 inline-flex flex-wrap items-center p-1.5 rounded-2xl bg-neutral-900/90 border border-white/20 text-xs sm:text-sm font-bold shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setMode(activeProduct.id, 'retail')}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    getMode(activeProduct.id) === 'retail'
                      ? 'bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 shadow-md font-extrabold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span>50ml Bottle (₹{activeProduct.retailPrice || 299})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode(activeProduct.id, 'bulk')}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    getMode(activeProduct.id) === 'bulk'
                      ? 'bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 shadow-md font-extrabold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Factory className="w-4 h-4 shrink-0" />
                  <span>Bulk Drum (1kg+ B2B)</span>
                </button>
              </div>

              {getMode(activeProduct.id) === 'retail' ? (
                <div className="mb-4 inline-flex items-center gap-2.5 bg-[#d4a373]/20 border border-[#d4a373]/60 rounded-xl px-4 py-2 text-[#d4a373] shadow-md">
                  <span className="text-xl sm:text-2xl font-extrabold">₹{activeProduct.retailPrice || 299}</span>
                  <span className="text-xs sm:text-sm text-neutral-200 font-medium">/ 50ml Bottle (Fixed Size & Price)</span>
                </div>
              ) : (
                <div className="mb-4 inline-flex items-center gap-2.5 bg-blue-500/20 border border-blue-500/60 rounded-xl px-4 py-2 text-blue-300 shadow-md">
                  <span className="text-xl sm:text-2xl font-extrabold">₹{activeProduct.unitPrice}</span>
                  <span className="text-xs sm:text-sm text-neutral-200 font-medium">/ KG (Commercial Bulk & Quotation)</span>
                </div>
              )}

              <div className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans-custom space-y-1.5 mb-8 font-normal">
                {(getMode(activeProduct.id) === 'retail' ? ['50ml Pure Bottle (Fixed Size & Price)', ...activeProduct.specs] : activeProduct.specs).map((spec, idx) => (
                  <p key={idx}>{spec}</p>
                ))}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 mb-8">
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
              {getMode(activeProduct.id) === 'retail' ? (
                <div className="flex flex-wrap items-center gap-4">
                  {/* Quantity Selector [-] 1 [+] */}
                  <div className="flex items-center bg-neutral-900 border border-[#d4a373]/60 rounded-full px-2 py-1.5 gap-2 shadow-inner">
                    <button
                      type="button"
                      onClick={() => changeQty(activeProduct.id, -1)}
                      className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center transition-colors font-extrabold text-lg cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-base font-extrabold text-white min-w-[32px] text-center font-mono">
                      {getQty(activeProduct.id)}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(activeProduct.id, 1)}
                      className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center transition-colors font-extrabold text-lg cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => !isProductOutOfStock(activeProduct.id) && handleAddRetail(activeProduct)}
                    disabled={isProductOutOfStock(activeProduct.id)}
                    className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 ${
                      isProductOutOfStock(activeProduct.id)
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                        : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_6px_24px_rgba(212,163,115,0.35)] hover:shadow-[0_8px_32px_rgba(212,163,115,0.55)] transform hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    <span>{isProductOutOfStock(activeProduct.id) ? 'OUT OF STOCK' : `ADD TO CART (${getQty(activeProduct.id)} BOTTLE${getQty(activeProduct.id) > 1 ? 'S' : ''} • ₹${(activeProduct.retailPrice || 299) * getQty(activeProduct.id)})`}</span>
                    {!isProductOutOfStock(activeProduct.id) && <ArrowRight className="w-4 h-4 text-neutral-950 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => !isProductOutOfStock(activeProduct.id) && handleShopNow(activeProduct)}
                  disabled={isProductOutOfStock(activeProduct.id)}
                  className={`group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-wider transition-all duration-300 ${
                    isProductOutOfStock(activeProduct.id)
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_6px_24px_rgba(212,163,115,0.35)] hover:shadow-[0_8px_32px_rgba(212,163,115,0.55)] transform hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  <span>{isProductOutOfStock(activeProduct.id) ? 'OUT OF STOCK' : 'REQUEST BULK QUOTE'}</span>
                  {!isProductOutOfStock(activeProduct.id) && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950 group-hover:translate-x-1 transition-transform" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
