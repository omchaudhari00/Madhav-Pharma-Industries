import React, { useState } from 'react';
import { Star, Leaf, Droplets, Sparkles, ArrowRight, Package, Factory, AlertCircle, ShoppingBag, FileText, CheckCircle2 } from 'lucide-react';
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


export const ProductShowcase: React.FC = () => {
  const { 
    addToCart, 
    addToRetailCart, 
    isRetailOutOfStock, 
    isB2BOutOfStock, 
    isDiscontinued, 
    allProducts,
    setViewingBulkProductId 
  } = useApp();

  const [retailQty, setRetailQty] = useState<Record<string, number>>({});

  const visibleProducts = allProducts.filter(p => !isDiscontinued(p.id));
  const heroProduct = visibleProducts.find((p) => p.id === 'weight-loss-oil') || visibleProducts[0];
  const bulkProducts = visibleProducts.filter(p => p.id !== heroProduct.id);

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
    <div className="w-full max-w-full my-8 space-y-12">
      {/* ─── Hero Product Section ─── */}
      <div className="relative rounded-[2rem] bg-neutral-900/40 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center p-8 md:p-12 gap-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4a373]/40 to-transparent z-10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#d4a373]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Hero Image */}
        <div className="w-full md:w-1/3 relative z-10">
          <div className="relative rounded-3xl bg-neutral-950/60 border border-white/10 aspect-[4/5] flex items-center justify-center p-6 shadow-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/50 to-transparent" />
            <img 
              src={heroProduct.heroImage} 
              alt={heroProduct.name} 
              className="w-full h-full object-contain filter brightness-105 contrast-105 relative z-10 group-hover:scale-110 transition-transform duration-700"
            />
            {isRetailOutOfStock(heroProduct.id) ? (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase tracking-wider z-20">
                Out of Stock
              </div>
            ) : (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                In Stock
              </div>
            )}
          </div>
        </div>

        {/* Hero Details */}
        <div className="w-full md:w-2/3 flex flex-col justify-center space-y-6 relative z-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/50 text-[#d4a373] text-xs font-extrabold uppercase tracking-widest mb-4">
              {heroProduct.badgeText}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4">
              {heroProduct.name}
            </h2>
            <p className="text-xl text-[#d4a373] italic font-medium border-l-4 border-[#d4a373] pl-4">
              Healthy Body, Fit Life – Now Lose Weight Naturally
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {heroProduct.specs.slice(0, 3).map((spec, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {spec}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Fixed Retail Price</span>
              <span className="text-4xl font-extrabold text-[#d4a373]">₹{heroProduct.retailPrice || 349} <span className="text-lg text-neutral-400">/ 50ml</span></span>
            </div>

            <div className="flex-1 w-full flex items-center gap-3">
              <div className="flex items-center justify-between bg-neutral-950/80 border border-white/15 rounded-xl px-4 py-3 min-w-[120px]">
                <button
                  onClick={() => changeQty(heroProduct.id, -1)}
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                >-</button>
                <span className="text-base font-mono font-extrabold text-white w-8 text-center">{getQty(heroProduct.id)}</span>
                <button
                  onClick={() => changeQty(heroProduct.id, 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                >+</button>
              </div>

              <button
                onClick={() => !isRetailOutOfStock(heroProduct.id) && handleAddRetail(heroProduct)}
                disabled={isRetailOutOfStock(heroProduct.id)}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                  isRetailOutOfStock(heroProduct.id)
                    ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                    : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold shadow-lg hover:shadow-xl active:scale-95'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isRetailOutOfStock(heroProduct.id) ? 'OUT OF STOCK' : `BUY NOW • ₹${(heroProduct.retailPrice || 349) * getQty(heroProduct.id)}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {/* ─── Bulk Oils Section ─── */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Droplets className="w-6 h-6 text-[#d4a373]" />
            Pure Natural Oils <span className="text-sm font-sans font-bold text-neutral-500 uppercase tracking-widest mt-1">(B2B Bulk)</span>
          </h3>
          <p className="text-sm text-neutral-400 mt-1">100% pure steam-distilled essential oils available in 1L and 5L industrial drums.</p>
        </div>
      </div>

      {/* Bulk Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 font-display items-stretch">
        {bulkProducts.map((product) => {
          const isOos = isB2BOutOfStock(product.id);

          return (
            <div
              key={product.id}
              className="relative group rounded-3xl p-6 bg-neutral-900/40 backdrop-blur-2xl border border-white/15 hover:border-[#d4a373]/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_16px_48px_0_rgba(0,0,0,0.4)] hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-neutral-700/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4a373]/10 transition-colors duration-500" />

              <div>
                {/* Header Badge & Stock Tag */}
                <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-600 text-neutral-300 text-[10px] font-extrabold uppercase tracking-wider">
                    B2B RAW OIL
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
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-neutral-950/60 border border-white/10 mb-5 group-hover:border-white/20 transition-colors flex items-center justify-center p-4">
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    className="w-full h-full object-contain filter brightness-105 contrast-105 transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
                </div>

                {/* Product Name & Category */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-neutral-500 tracking-widest uppercase block mb-1">
                    {product.categoryTitle} Oil
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white leading-tight group-hover:text-[#d4a373] transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Price Display */}
                <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">Per KG Bulk</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">
                      ₹{product.unitPrice}
                    </span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="mb-6 space-y-1 text-xs text-neutral-300 font-sans-custom">
                  {product.specs.slice(0, 2).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => setViewingBulkProductId(product.id)}
                  className="w-full py-2.5 px-4 rounded-xl border border-white/20 hover:border-[#d4a373] bg-neutral-950/80 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-neutral-800"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>View 1kg/5kg Specs</span>
                </button>
                <button
                  onClick={() => !isOos && handleShopNow(product)}
                  disabled={isOos}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    isOos
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold shadow-md active:scale-95'
                  }`}
                >
                  <span>{isOos ? 'OUT OF STOCK' : 'REQUEST BULK QUOTE'}</span>
                  {!isOos && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
