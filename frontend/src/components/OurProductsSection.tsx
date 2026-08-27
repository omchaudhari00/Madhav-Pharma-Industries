import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface PreviewProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  type: 'herbal' | 'bulk';
  badge: string;
  specs: string[];
}

export const PreviewCard: React.FC<{ product: PreviewProduct }> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-2xl p-3 sm:p-6 bg-neutral-900/40 backdrop-blur-2xl border border-white/15 hover:border-[#d4a373]/60 transition-all duration-500 flex flex-col overflow-hidden shadow-[0_8px_24px_0_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_0_rgba(212,163,115,0.15)] hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Glossy top edge & ambient orb */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4a373]/20 transition-colors duration-500" />

      {/* Image */}
      <div className="relative w-full h-28 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950/60 border border-white/10 mb-2 sm:mb-5 group-hover:border-white/20 transition-colors flex items-center justify-center p-2 sm:p-4">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/bulk_1l.jpg';
          }}
          className="w-full h-full object-contain filter brightness-105 contrast-105 transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 h-6 sm:h-12 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Category subtitle + Product name */}
      <div className="mb-2 sm:mb-4">
        <span className="text-[9px] sm:text-[11px] font-bold text-neutral-500 tracking-widest uppercase block mb-0.5">
          {product.type === 'herbal' ? 'Herbal Remedy' : 'Essential Oil'}
        </span>
        <h4 className="text-sm sm:text-xl font-serif font-bold text-white leading-tight group-hover:text-[#d4a373] transition-colors line-clamp-2">
          {product.name}
        </h4>
      </div>

      {/* Price display box */}
      <div className="mb-2 sm:mb-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
        <span className="text-[9px] sm:text-xs text-neutral-400 font-medium">
          {product.type === 'herbal' ? 'Per 50ml bottle' : 'Per litre (bulk)'}
        </span>
        <span className="text-sm sm:text-xl font-extrabold text-white">{product.price}</span>
      </div>

      {/* Specs — hidden on mobile */}
      <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
        {product.specs.map((s, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
            {s}
          </span>
        ))}
      </div>

      {/* View Product button */}
      <div className="mt-auto pt-2 sm:pt-4 border-t border-white/10">
        <div className="w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl border border-white/20 hover:border-[#d4a373] bg-neutral-950/80 text-white font-bold text-[9px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-2 transition-all hover:bg-neutral-800">
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">View Product</span>
          <span className="sm:hidden">View</span>
        </div>
      </div>
    </div>
  );
};

export const OurProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const { allProducts } = useApp();

  const previewProducts: PreviewProduct[] = allProducts.slice(0, 4).map((p) => {
    if (p.id === 'weight-loss-oil') {
      return {
        id: `${p.id}-herbal`,
        name: p.name,
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/favicon-circle.png') : p.cardImage,
        price: `₹${(p.retailPrice || 299).toLocaleString('en-IN')}`,
        type: 'herbal' as const,
        badge: p.badgeText || 'HERBAL REMEDY',
        specs: ['50ml Bottle', p.grade.split('•')[1]?.trim() || p.grade],
      };
    } else {
      return {
        id: `${p.id}-bulk`,
        name: `${p.categoryTitle} Oil — Bulk`,
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/favicon-circle.png') : (p.id === 'cumin-seed-oil' ? '/images/cumin-seed-oil.png' : p.cardImage || '/images/bulk_1l.jpg'),
        price: `₹${p.unitPrice.toLocaleString('en-IN')}`,
        type: 'bulk' as const,
        badge: p.badgeText || 'B2B RAW OIL',
        specs: ['1L / 5L Available', 'Industrial Grade'],
      };
    }
  });

  return (
    <div className="w-full">
      {/* Top Header Banner */}
      <div className="text-center mb-12 sm:mb-16 lg:mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 xl:text-white font-display">
          Our Products
        </h2>
        <p className="mt-4 text-neutral-700 xl:text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto font-sans-custom font-medium xl:font-normal">
          Our company is committed to quality, purity, and customer satisfaction by delivering reliable natural products for pharmaceutical, herbal, and wellness industries.
        </p>
      </div>

      {/* Product Preview Strip — 2 herbal + 2 bulk */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 mb-10">
        {previewProducts.map((product) => (
          <PreviewCard key={product.id} product={product} />
        ))}
      </div>

      {/* Explore More Products Button */}
      <div className="flex justify-center mt-6 mb-16">
        <button
          onClick={() => navigate('/products')}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <span>Explore More Products</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
