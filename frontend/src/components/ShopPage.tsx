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

/* ─── Types ─── */
interface ShopProduct {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  badgeText: string;
  specs: string[];
  category: 'herbal' | 'bulk';
  /* Herbal retail */
  retailPrice?: number;
  retailSizeLabel?: string;
  /* Bulk */
  bulkPrices?: { label: string; size: '1l' | '5l'; price: number }[];
}


/* ─── Herbal Product Card ─── */
const HerbalCard: React.FC<{ product: ShopProduct }> = ({ product }) => {
  const { addToRetailCart, isRetailOutOfStock, isDiscontinued } = useApp();
  const [qty, setQty] = useState(1);
  const isOos = isRetailOutOfStock(product.id);
  const discontinued = isDiscontinued(product.id);

  const handleAddToCart = () => {
    if (isOos || discontinued) return;
    addToRetailCart({
      id: product.id,
      name: product.name,
      sizeLabel: product.retailSizeLabel || '50ml',
      unitPrice: product.retailPrice || 299,
      imageUrl: product.image,
    }, qty);
  };

  const handleBuyNow = () => {
    if (isOos || discontinued) return;
    addToRetailCart({
      id: product.id,
      name: product.name,
      sizeLabel: product.retailSizeLabel || '50ml',
      unitPrice: product.retailPrice || 299,
      imageUrl: product.image,
    }, qty);
    // addToRetailCart already opens checkout
  };

  if (discontinued) return null;

  return (
    <div className="group relative rounded-2xl bg-neutral-900/50 border border-white/10 hover:border-[#d4a373]/50 transition-all duration-400 overflow-hidden flex flex-col shadow-lg hover:shadow-[0_8px_30px_rgba(212,163,115,0.12)] hover:-translate-y-0.5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4a373]/8 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4a373]/15 transition-colors duration-500" />

      {/* Image */}
      <div className="relative w-full h-52 bg-neutral-950/60 border-b border-white/8 overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 brightness-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900/70 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-[10px] font-extrabold uppercase tracking-wider">
          {product.badgeText}
        </span>
        {isOos ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>OOS</span>
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
            IN STOCK
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-serif font-bold text-white leading-tight mb-1.5 group-hover:text-[#d4a373] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-4 flex-1 font-sans-custom">
          {product.description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.specs.map((s, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-medium">
              {s}
            </span>
          ))}
        </div>

        {/* Price & Quantity */}
        <div className="mb-4 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
          <div>
            <span className="text-[10px] text-neutral-400 block">Price per bottle</span>
            <span className="text-xl font-extrabold text-[#d4a373]">&#8377;{product.retailPrice}</span>
          </div>
          {!isOos && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >-</button>
              <span className="text-sm font-mono font-bold text-white w-5 text-center">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >+</button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOos}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOos
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOos}
            className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOos
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Bulk Product Card ─── */
const BulkCard: React.FC<{ product: ShopProduct }> = ({ product }) => {
  const { addToRetailCart, isB2BOutOfStock, isDiscontinued } = useApp();
  const [selectedSize, setSelectedSize] = useState<'1l' | '5l'>('1l');
  // Map bulk product id back to the base product id for stock checks
  const baseId = product.id.replace('-bulk', '');
  const isOos = isB2BOutOfStock(baseId);
  const discontinued = isDiscontinued(baseId);

  const selectedOption = product.bulkPrices?.find(p => p.size === selectedSize) || product.bulkPrices?.[0];

  const handleAddToCart = () => {
    if (!selectedOption || isOos || discontinued) return;
    addToRetailCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedOption.label}`,
      sizeLabel: selectedOption.label,
      unitPrice: selectedOption.price,
      imageUrl: product.image,
    }, 1);
  };

  const handleBuyNow = () => {
    if (!selectedOption || isOos || discontinued) return;
    addToRetailCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedOption.label}`,
      sizeLabel: selectedOption.label,
      unitPrice: selectedOption.price,
      imageUrl: product.image,
    }, 1);
  };

  if (discontinued) return null;

  return (
    <div className="group relative rounded-2xl bg-neutral-900/50 border border-[#d4a373]/15 hover:border-[#d4a373]/50 transition-all duration-400 overflow-hidden flex flex-col shadow-lg hover:shadow-[0_8px_30px_rgba(212,163,115,0.12)] hover:-translate-y-0.5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4a373]/30 to-transparent pointer-events-none" />

      {/* Image */}
      <div className="relative w-full h-52 bg-neutral-950/60 border-b border-white/8 overflow-hidden flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 brightness-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900/70 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-[10px] font-extrabold uppercase tracking-wider">
          {product.badgeText}
        </span>
        {isOos ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold uppercase">
            OOS
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
            IN STOCK
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-serif font-bold text-white leading-tight mb-1.5 group-hover:text-[#d4a373] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-4 flex-1 font-sans-custom">
          {product.description}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.specs.map((s, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-[#d4a373]/10 border border-[#d4a373]/20 text-[#d4a373] text-[10px] font-medium">
              {s}
            </span>
          ))}
        </div>

        {/* Size Selector */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Select Size</span>
          <div className="grid grid-cols-2 gap-2">
            {product.bulkPrices?.map(option => (
              <button
                key={option.size}
                onClick={() => setSelectedSize(option.size)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedSize === option.size
                    ? 'bg-[#d4a373]/20 border-[#d4a373]/60 text-white'
                    : 'bg-neutral-950/50 border-white/10 text-neutral-400 hover:border-white/30'
                }`}
              >
                <span className="text-xs font-bold block">{option.size === '1l' ? '1 Litre' : '5 Litres'}</span>
                <span className={`text-base font-extrabold ${selectedSize === option.size ? 'text-[#d4a373]' : 'text-white'}`}>
                  &#8377;{option.price.toLocaleString('en-IN')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOos}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOos
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOos}
            className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOos
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Shop Page ─── */
export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'herbal' | 'bulk'>('herbal');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { allProducts } = useApp();

  const herbalProducts: ShopProduct[] = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    shortName: `${p.categoryTitle} ${p.categorySubtitle}`,
    description: `Therapeutic-grade ${p.categoryTitle.toLowerCase()} formulation for safe human wellness and daily use.`,
    image: p.cardImage,
    badgeText: p.badgeText,
    specs: ['50ml Glass Bottle', p.grade.split('•')[1]?.trim() || p.grade],
    category: 'herbal',
    retailPrice: p.retailPrice || 299,
    retailSizeLabel: '50ml',
  }));

  const bulkProducts: ShopProduct[] = allProducts.map(p => ({
    id: `${p.id}-bulk`,
    name: `${p.categoryTitle} Essential Oil — Bulk`,
    shortName: `${p.categoryTitle} Oil (Bulk)`,
    description: `100% pure steam-distilled ${p.categoryTitle.toLowerCase()} extract for industrial manufacturing, formulation, and commercial processing.`,
    image: p.cardImage,
    badgeText: 'B2B RAW OIL',
    specs: ['100% Pure Unadulterated', 'Industrial & Bulk Processing'],
    category: 'bulk',
    bulkPrices: [
      { label: '1 Litre Amber Glass Bottle', size: '1l', price: p.unitPrice },
      { label: '5 Litre Industrial Drum', size: '5l', price: p.unitPrice * 5 }, // Flat per litre mapping
    ],
  }));

  const products = activeSection === 'herbal' ? herbalProducts : bulkProducts;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-display">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-4">
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
            <span className="font-bold text-white text-sm tracking-tight">Shop</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[#d4a373] font-bold text-sm">
              {activeSection === 'herbal' ? 'Herbal Products' : 'Pure Natural Oils'}
            </span>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="ml-auto lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 relative">
        {/* ─── Left Sidebar ─── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          w-64 shrink-0
          ${sidebarOpen
            ? 'fixed left-0 top-0 h-full z-40 flex flex-col pt-20 px-4 bg-neutral-950 border-r border-white/10 overflow-y-auto'
            : 'hidden lg:block'
          }
        `}>
          <div className="sticky top-24 space-y-2">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mb-4 px-2">
              Categories
            </p>

            {/* Herbal Products Section */}
            <button
              onClick={() => { setActiveSection('herbal'); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-4 rounded-2xl border transition-all cursor-pointer ${
                activeSection === 'herbal'
                  ? 'bg-[#d4a373]/15 border-[#d4a373]/50 text-white'
                  : 'bg-neutral-900/40 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activeSection === 'herbal' ? 'bg-[#d4a373]/30 text-[#d4a373]' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Herbal Products</span>
              </div>
              <p className="text-[11px] text-neutral-500 ml-11 leading-snug">
                50ml therapeutic bottles safe for daily use
              </p>
              <div className="mt-2 ml-11 flex flex-wrap gap-1">
                {herbalProducts.map(p => (
                  <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                    {p.shortName.split(' ')[0]}
                  </span>
                ))}
              </div>
            </button>

            {/* Pure Natural Oils Section */}
            <button
              onClick={() => { setActiveSection('bulk'); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-4 rounded-2xl border transition-all cursor-pointer ${
                activeSection === 'bulk'
                  ? 'bg-[#d4a373]/15 border-[#d4a373]/50 text-white'
                  : 'bg-neutral-900/40 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activeSection === 'bulk' ? 'bg-[#d4a373]/30 text-[#d4a373]' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Pure Natural Oils</span>
              </div>
              <p className="text-[11px] text-neutral-500 ml-11 leading-snug">
                1L &amp; 5L raw essential oils for industrial/B2B use
              </p>
              <div className="mt-2 ml-11 flex flex-wrap gap-1">
                {bulkProducts.map(p => (
                  <span key={p.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                    {p.shortName.split(' ')[0]}
                  </span>
                ))}
              </div>
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-2xl bg-neutral-900/40 border border-white/8 space-y-2">
              <div className="flex items-center gap-2 text-[#d4a373]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold">Fixed Pricing</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                All products are sold at listed fixed rates. No quotation needed — simply add to cart and checkout.
              </p>
            </div>

            {/* Quick Info for Bulk */}
            {activeSection === 'bulk' && (
              <div className="p-4 rounded-2xl bg-[#d4a373]/8 border border-[#d4a373]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#d4a373]">
                  <Package className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold">B2B Packaging</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  1L amber glass bottles or 5L HDPE industrial containers. COA documentation available on request.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="flex-1 min-w-0">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeSection === 'herbal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#d4a373]/20 text-[#d4a373]'
              }`}>
                {activeSection === 'herbal' ? <Leaf className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">
                  {activeSection === 'herbal' ? 'Herbal Products' : 'Pure Natural Oils'}
                </h1>
                <p className="text-xs text-neutral-400 font-sans-custom">
                  {activeSection === 'herbal'
                    ? '50ml therapeutic formulations — researched &amp; safe for human use'
                    : '1L &amp; 5L raw steam-distilled essential oils — for industrial &amp; B2B use'}
                </p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-[#d4a373]/40 to-transparent mt-4" />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {products.map(product =>
              activeSection === 'herbal'
                ? <HerbalCard key={product.id} product={product} />
                : <BulkCard key={product.id} product={product} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
