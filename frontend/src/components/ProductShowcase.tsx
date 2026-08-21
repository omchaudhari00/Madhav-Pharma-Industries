import React, { useState } from 'react';
import { Star, Leaf, Droplets, Sparkles, ArrowRight, Package, Factory, AlertCircle, ShoppingBag } from 'lucide-react';
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
  const { 
    addToCart, 
    addToRetailCart, 
    isProductOutOfStock, 
    isRetailOutOfStock, 
    isB2BOutOfStock, 
    isDiscontinued, 
    allProducts,
    setViewingBulkProductId 
  } = useApp();
  const [activeProductId, setActiveProductId] = useState<string>('cumin-seed-oil');
  const [retailQty, setRetailQty] = useState<Record<string, number>>({});
  const [cardMode, setCardMode] = useState<Record<string, 'retail' | 'bulk'>>({});

  const visibleProducts = allProducts.filter(p => !isDiscontinued(p.id));
  const activeProduct = visibleProducts.find((p) => p.id === activeProductId) || visibleProducts[0] || allProducts[0] || PRODUCTS[0];

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
    <div className="w-full max-w-full my-8 space-y-6">
      {/* Industrial B2B Bulk Announcement Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-[#d4a373]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 flex items-center justify-center text-[#d4a373] shrink-0">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-white">Looking for Industrial Raw Material Supply (1 KG &amp; 5 KG)?</h4>
            <p className="text-xs text-neutral-400 font-sans-custom">100% natural, pure steam-distilled essential oils with GC-MS assay &amp; COA documentation.</p>
          </div>
        </div>

        <button
          onClick={() => setViewingBulkProductId('cumin-seed-oil')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c39262] text-black font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
        >
          <span>View Bulk Catalog &amp; Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 font-display items-stretch">
        {visibleProducts.map((product) => {
          const mode = getMode(product.id);
          const qty = getQty(product.id);
          const isRetailOos = isRetailOutOfStock(product.id);
          const isB2bOos = isB2BOutOfStock(product.id);
          const isOos = mode === 'retail' ? isRetailOos : isB2bOos;

          return (
            <div
              key={product.id}
              className="relative group rounded-3xl p-6 bg-neutral-900/40 backdrop-blur-2xl border border-white/15 hover:border-[#d4a373]/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_16px_48px_0_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_0_rgba(212,163,115,0.15)] hover:-translate-y-1"
            >
              {/* Glossy top edge highlight & ambient background orb */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4a373]/20 transition-colors duration-500" />

              <div>
                {/* Header Badge & Stock Tag */}
                <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-[#d4a373]/15 border border-[#d4a373]/40 text-[#d4a373] text-[11px] font-extrabold uppercase tracking-wider">
                    {product.badgeText}
                  </span>
                  {isOos ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>OOS</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                      IN STOCK
                    </span>
                  )}
                </div>

                {/* Product Image Container */}
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-neutral-950/60 border border-white/10 mb-5 group-hover:border-white/20 transition-colors flex items-center justify-center p-4">
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    className="w-full h-full object-contain filter brightness-105 contrast-105 transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
                </div>

                {/* Product Name & Category */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-[#d4a373] tracking-widest uppercase block mb-1">
                    {product.categoryTitle} {product.categorySubtitle}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white leading-tight group-hover:text-[#d4a373] transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Pack Size / Mode Toggle (Retail 50ml vs Bulk 1kg+) */}
                <div className="mb-4 p-1 rounded-xl bg-neutral-950/80 border border-white/10 flex items-center text-xs font-bold gap-1">
                  <button
                    type="button"
                    onClick={() => setMode(product.id, 'retail')}
                    className={`flex-1 py-1.5 px-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === 'retail'
                        ? 'bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 shrink-0" />
                    <span>50ml Retail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode(product.id, 'bulk')}
                    className={`flex-1 py-1.5 px-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === 'bulk'
                        ? 'bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Factory className="w-3.5 h-3.5 shrink-0" />
                    <span>Bulk (B2B)</span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">
                    {mode === 'retail' ? '50ml Bottle' : 'Per KG Bulk'}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#d4a373]">
                      ₹{mode === 'retail' ? (product.retailPrice || 299) : product.unitPrice}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal block">
                      {mode === 'retail' ? 'Fixed Retail Price' : 'Quotation Rate'}
                    </span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="mb-6 space-y-1 text-xs text-neutral-300 font-sans-custom">
                  {product.specs.slice(0, 2).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: Quantity Selector & Add to Cart / Request Quote Button */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {mode === 'retail' && !isOos && (
                  <div className="flex items-center justify-between bg-neutral-950/80 border border-white/15 rounded-xl px-3 py-1.5">
                    <span className="text-xs font-bold text-neutral-300">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(product.id, -1)}
                        className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-extrabold text-white w-6 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(product.id, 1)}
                        className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'retail' ? (
                  <button
                    onClick={() => !isOos && handleAddRetail(product)}
                    disabled={isOos}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      isOos
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                        : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold shadow-md hover:shadow-lg active:scale-95'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOos ? 'OUT OF STOCK' : `ADD TO CART • ₹${(product.retailPrice || 299) * qty}`}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setViewingBulkProductId(product.id)}
                      className="w-full py-2.5 px-4 rounded-xl border border-white/20 hover:border-[#d4a373] bg-neutral-950/80 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-neutral-800"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#d4a373]" />
                      <span>View 1kg/5kg Specs &amp; COA</span>
                    </button>
                    <button
                      onClick={() => !isOos && handleShopNow(product)}
                      disabled={isOos}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                        isOos
                          ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                          : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold shadow-md hover:shadow-lg active:scale-95'
                      }`}
                    >
                      <span>{isOos ? 'OUT OF STOCK (BULK)' : 'REQUEST BULK QUOTE'}</span>
                      {!isOos && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
