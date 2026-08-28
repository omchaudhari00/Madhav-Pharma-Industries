import React, { useLayoutEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';



/* ─── Minimal Product Card ─── */
const ShopCard = ({ product }) => {
  const navigate = useNavigate();
  const { isRetailOutOfStock, isB2BOutOfStock, isDiscontinued } = useApp();

  const discontinued = isDiscontinued(product.baseId);
  const isOos = product.category === 'herbal' ? isRetailOutOfStock(product.baseId) : isB2BOutOfStock(product.baseId);

  if (discontinued) return null;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative rounded-2xl bg-white border border-neutral-200 hover:border-[#d4a373]/60 transition-all duration-400 overflow-hidden flex flex-col shadow-md hover:shadow-[0_8px_30px_rgba(212,163,115,0.18)] hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4a373]/8 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4a373]/15 transition-colors duration-500" />

      {/* Image */}
      <div className="relative w-full h-52 bg-neutral-50 border-b border-neutral-200 overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/bulk_1l.jpg';
          }}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 brightness-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900/70 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-serif font-bold text-black leading-tight mb-2 group-hover:text-[#d4a373] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 border-t border-neutral-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 block mb-0.5">{product.priceLabel}</span>
            <span className="text-xl font-extrabold text-[#d4a373]">&#8377;{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center group-hover:bg-[#d4a373] group-hover:text-black group-hover:border-[#d4a373] transition-all text-black">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Shop Page ─── */
export const ShopPage = () => {
  const navigate = useNavigate();
  const { allProducts } = useApp();

  // Scroll to top immediately when shop page loads
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  const shopProducts = allProducts.map(p => {
    if (p.id === 'weight-loss-oil') {
      return {
        id: `${p.id}-herbal`,
        baseId: p.id,
        name: p.name,
        shortName: `${p.categoryTitle} ${p.categorySubtitle}`,
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/favicon-circle.png') : p.cardImage,
        badgeText: p.badgeText,
        category: 'herbal',
        price: p.retailPrice || 349,
        priceLabel: 'Price per 50ml bottle',
      };
    } else {
      return {
        id: `${p.id}-bulk`,
        baseId: p.id,
        name: `${p.categoryTitle} Essential Oil (Bulk)`,
        shortName: `${p.categoryTitle} Oil (Bulk)`,
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/bulk_1l.jpg') : (p.id === 'cumin-seed-oil' ? (p.cardImage || '/images/bulk_1l.jpg') : p.cardImage || '/images/bulk_1l.jpg'),
        badgeText: 'B2B RAW OIL',
        category: 'bulk',
        price: p.unitPrice,
        priceLabel: 'Starting at (1L)',
      };
    }
  });

  return (
    <div className="min-h-screen bg-white text-white font-display relative selection:bg-neutral-200 selection:text-black flex flex-col">
      {/* Background Ambience Layer - White */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d4a373]/15 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Landing Page Navbar */}
        <Navbar />

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8a5d2b]" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* ─── Product Grid Section ─── */}
          <main id="collection-grid" className="w-full">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-black mb-3">
                Madhav Pharma Collection
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 font-sans-custom max-w-2xl mx-auto leading-relaxed">
                100% natural essential oils and therapeutic remedies. Carefully steam-distilled and formulated for your wellness and vitality.
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-[#d4a373]/50 to-transparent mt-8 max-w-2xl mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
              {shopProducts.map(product => (
                <ShopCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>

        {/* Landing Page Footer */}
        <Footer />
      </div>
    </div>
  );
};