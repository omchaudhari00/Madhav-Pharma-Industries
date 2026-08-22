import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  Droplets,
  Leaf,
  ChevronRight,
  ShoppingCart,
  Zap,
  AlertCircle,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface ShopProduct {
  id: string; // The URL slug e.g. cumin-seed-oil, cumin-seed-oil-bulk-1l
  baseId: string; // The original product ID
  name: string;
  shortName: string;
  image: string;
  badgeText: string;
  category: 'herbal' | 'bulk';
  price: number;
  priceLabel: string;
}


/* ─── Minimal Product Card ─── */
const ShopCard: React.FC<{ product: ShopProduct }> = ({ product }) => {
  const navigate = useNavigate();
  const { isRetailOutOfStock, isB2BOutOfStock, isDiscontinued } = useApp();

  const discontinued = isDiscontinued(product.baseId);
  const isOos = product.category === 'herbal' ? isRetailOutOfStock(product.baseId) : isB2BOutOfStock(product.baseId);

  if (discontinued) return null;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-[#d4a373]/50 transition-all duration-400 overflow-hidden flex flex-col shadow-lg hover:shadow-[0_8px_30px_rgba(212,163,115,0.12)] hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4a373]/8 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4a373]/15 transition-colors duration-500" />

      {/* Image */}
      <div className="relative w-full h-52 bg-neutral-950/60 border-b border-white/8 overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 brightness-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900/70 to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-[10px] font-extrabold uppercase tracking-wider shadow-sm z-10">
          {product.badgeText}
        </span>
        {isOos ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 z-10">
            <AlertCircle className="w-3 h-3" />
            <span>OOS</span>
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider z-10">
            IN STOCK
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-serif font-bold text-white leading-tight mb-2 group-hover:text-[#d4a373] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 block mb-0.5">{product.priceLabel}</span>
            <span className="text-xl font-extrabold text-[#d4a373]">&#8377;{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#d4a373] group-hover:text-black group-hover:border-[#d4a373] transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Shop Page ─── */
export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { allProducts, openRetailCheckout, retailCartTotalCount } = useApp();

  const shopProducts: ShopProduct[] = allProducts.map(p => {
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
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/favicon-circle.png') : '/images/bulk_1l.jpg',
        badgeText: 'B2B RAW OIL',
        category: 'bulk',
        price: p.unitPrice,
        priceLabel: 'Starting at (1L)',
      };
    }
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-display">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <img src="/images/favicon-circle.png" alt="Logo" className="w-7 h-7 rounded-full object-cover border border-[#d4a373]/40" />
              <span className="font-bold text-white text-sm tracking-tight">Shop All Products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ─── Main Content ─── */}
        <main className="w-full">
          {/* Section Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
              Madhav Pharma Collection
            </h1>
            <p className="text-sm text-neutral-400 font-sans-custom max-w-2xl mx-auto">
              100% natural essential oils and therapeutic remedies. Carefully steam-distilled and formulated for your wellness and vitality.
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#d4a373]/40 to-transparent mt-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {shopProducts.map(product =>
              <ShopCard key={product.id} product={product} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};