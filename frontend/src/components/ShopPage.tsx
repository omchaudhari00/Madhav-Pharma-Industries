import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  ArrowLeft,
  ArrowDown,
  Sparkles,
  ShoppingBag,
  Droplets,
  Leaf,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

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
export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProducts } = useApp();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

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
        image: p.customImages !== undefined ? (p.customImages[0] || '/images/bulk_1l.jpg') : (p.id === 'cumin-seed-oil' ? (p.cardImage || '/images/bulk_1l.jpg') : p.cardImage || '/images/bulk_1l.jpg'),
        badgeText: 'B2B RAW OIL',
        category: 'bulk',
        price: p.unitPrice,
        priceLabel: 'Starting at (1L)',
      };
    }
  });

  // Hero Slides Data with Curated Brand Accents, Floating Elements & Matching Panel Tints
  const heroSlides = [
    {
      id: 'cumin-seed-oil-bulk',
      wordmark: 'CUMIN',
      title: 'Pure Steam-Distilled Cumin Seed Oil',
      tagline: 'High-potency therapeutic Jeera extract crafted for digestive balance, immunity, and vitality.',
      badge: '100% PURE THERAPEUTIC',
      price: 2200,
      priceLabel: 'Starting at 1L Bulk Container',
      image: '/images/bulk_1l.jpg',
      panelGradient: 'from-[#342010] via-[#23150a] to-[#150c05]',
      glowColor: 'bg-[#d4a373]/25',
      accentColor: 'text-[#d4a373]',
      badgeStyle: 'bg-[#d4a373]/15 border-[#d4a373]/35 text-[#d4a373]',
      buttonStyle: 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_0_30px_rgba(212,163,115,0.4)]',
      dotsActive: 'bg-[#d4a373]',
      ingredients: [
        { type: 'seed-cluster', label: 'Cumin Seeds', pos: 'top-8 right-12 sm:top-12 sm:right-16', delay: '0s' },
        { type: 'leaf', label: 'Botanical Leaf', pos: 'bottom-16 left-6 sm:bottom-20 sm:left-10', delay: '1s' },
        { type: 'drop', label: 'Pure Extract', pos: 'top-20 left-12 sm:top-24 sm:left-16', delay: '2s' },
        { type: 'seed', label: 'Jeera Grain', pos: 'bottom-8 right-24 sm:bottom-10 sm:right-32', delay: '1.5s' },
      ],
    },
    {
      id: 'weight-loss-oil-herbal',
      wordmark: 'HERBAL',
      title: 'Completely Natural Weight Loss Remedy',
      tagline: 'Researched Ayurvedic metabolic formulation designed to burn fat naturally and revitalize body wellness.',
      badge: '100% AYURVEDIC FORMULATION',
      price: 349,
      priceLabel: 'Price per 50ml therapeutic bottle',
      image: '/images/weight-loss-oil.jpg',
      panelGradient: 'from-[#152a1c] via-[#0d1d13] to-[#07120a]',
      glowColor: 'bg-emerald-500/25',
      accentColor: 'text-emerald-400',
      badgeStyle: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400',
      buttonStyle: 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
      dotsActive: 'bg-emerald-400',
      ingredients: [
        { type: 'leaf', label: 'Herbal Leaf', pos: 'top-10 left-10 sm:top-14 sm:left-16', delay: '0.5s' },
        { type: 'leaf-sprig', label: 'Botanical Sprig', pos: 'bottom-14 right-10 sm:bottom-16 sm:right-16', delay: '1.2s' },
        { type: 'drop', label: 'Herbal Essence', pos: 'top-16 right-20 sm:top-20 sm:right-28', delay: '2.2s' },
        { type: 'seed', label: 'Ayurvedic Seed', pos: 'bottom-20 left-16 sm:bottom-24 sm:left-24', delay: '1.8s' },
      ],
    },
    {
      id: 'fennel-seed-oil-bulk',
      wordmark: 'FENNEL',
      title: 'Natural Steam-Distilled Fennel Seed Oil',
      tagline: 'Sweet, aromatic Saunf essence steam-distilled for gourmet infusion and holistic wellness.',
      badge: 'FOOD & WELLNESS GRADE',
      price: 85,
      priceLabel: 'Starting at 1L Bulk Container',
      image: '/images/fennel-oil.png',
      panelGradient: 'from-[#1a2d1f] via-[#112015] to-[#09130c]',
      glowColor: 'bg-emerald-600/20',
      accentColor: 'text-emerald-300',
      badgeStyle: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
      buttonStyle: 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
      dotsActive: 'bg-emerald-300',
      ingredients: [
        { type: 'seed-cluster', label: 'Fennel Seeds', pos: 'top-12 left-12 sm:top-16 sm:left-20', delay: '0.3s' },
        { type: 'leaf', label: 'Saunf Leaf', pos: 'bottom-12 right-12 sm:bottom-16 sm:right-20', delay: '1.4s' },
        { type: 'drop', label: 'Aromatic Drop', pos: 'top-8 right-24 sm:top-12 sm:right-32', delay: '2.1s' },
        { type: 'seed', label: 'Sweet Seed', pos: 'bottom-16 left-8 sm:bottom-20 sm:left-14', delay: '0.8s' },
      ],
    },
    {
      id: 'ajwain-seed-oil-bulk',
      wordmark: 'AJWAIN',
      title: 'Pure Concentrated Ajwain Seed Oil',
      tagline: 'Intensely aromatic carom extract delivering fast-acting therapeutic relief and digestive comfort.',
      badge: 'PHARMA GRADE POTENCY',
      price: 95,
      priceLabel: 'Starting at 1L Bulk Container',
      image: '/images/ajwain-oil.png',
      panelGradient: 'from-[#351c14] via-[#24120c] to-[#140906]',
      glowColor: 'bg-amber-600/20',
      accentColor: 'text-amber-400',
      badgeStyle: 'bg-amber-500/15 border-amber-500/35 text-amber-400',
      buttonStyle: 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_0_30px_rgba(245,158,11,0.4)]',
      dotsActive: 'bg-amber-400',
      ingredients: [
        { type: 'seed-cluster', label: 'Ajwain Florets', pos: 'top-10 right-14 sm:top-14 sm:right-20', delay: '0.2s' },
        { type: 'leaf', label: 'Herbal Flourish', pos: 'top-20 left-8 sm:top-24 sm:left-14', delay: '1.6s' },
        { type: 'drop', label: 'Potent Extract', pos: 'bottom-12 right-20 sm:bottom-16 sm:right-28', delay: '2.4s' },
        { type: 'seed', label: 'Carom Seed', pos: 'bottom-14 left-14 sm:bottom-18 sm:left-20', delay: '1.1s' },
      ],
    },
    {
      id: 'black-seed-oil-bulk',
      wordmark: 'KALONJI',
      title: 'Pure Nigella Sativa Black Seed Oil',
      tagline: 'Ancient miracle elixir cold-extracted and rich in Thymoquinone for deep whole-body rejuvenation.',
      badge: 'PREMIUM COLD EXTRACT',
      price: 150,
      priceLabel: 'Starting at 1L Bulk Container',
      image: '/images/all-oils.png',
      panelGradient: 'from-[#251e2c] via-[#18121d] to-[#0d0910]',
      glowColor: 'bg-amber-500/18',
      accentColor: 'text-[#e5c07b]',
      badgeStyle: 'bg-[#e5c07b]/15 border-[#e5c07b]/35 text-[#e5c07b]',
      buttonStyle: 'bg-[#e5c07b] hover:bg-[#d6af66] text-neutral-950 shadow-[0_0_30px_rgba(229,192,123,0.4)]',
      dotsActive: 'bg-[#e5c07b]',
      ingredients: [
        { type: 'seed-cluster', label: 'Black Kalonji Seeds', pos: 'top-12 left-10 sm:top-16 sm:left-16', delay: '0.4s' },
        { type: 'leaf', label: 'Nigella Herb', pos: 'bottom-16 right-12 sm:bottom-20 sm:right-20', delay: '1.3s' },
        { type: 'drop', label: 'Golden Drop', pos: 'top-14 right-20 sm:top-18 sm:right-28', delay: '2.0s' },
        { type: 'seed', label: 'Nigella Seed', pos: 'bottom-10 left-16 sm:bottom-14 sm:left-24', delay: '0.9s' },
      ],
    },
  ];

  // Preload all product images
  useEffect(() => {
    heroSlides.forEach(slide => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, []);

  // Auto-cycle every 3 seconds, pause on hover
  useEffect(() => {
    if (isHeroHovered || heroSlides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isHeroHovered, heroSlides.length]);

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

          {/* ─── Hero Section with Per-Product Cycling Content ─── */}
          <section
            className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] mb-16 sm:mb-24 shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/20 bg-neutral-950/75 backdrop-blur-md"
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
          >
            {/* Fixed Studio Lighting & Subtle Top Edge Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div 
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background: 'radial-gradient(circle 700px at 72% 45%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
              }}
            />

            {heroSlides.map((slide, idx) => {
              const isActive = idx === activeHeroIndex;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-between p-6 sm:p-10 lg:p-14 ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[0.98] pointer-events-none z-0'
                  }`}
                >
                  {/* Distinct Matching Tinted Panel Background per Product Slide */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.panelGradient} opacity-95 pointer-events-none`} />

                  {/* Giant Bold Background Text Wordmark */}
                  <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-10 pointer-events-none select-none overflow-hidden">
                    <span className="text-[100px] sm:text-[150px] md:text-[200px] lg:text-[240px] xl:text-[280px] font-serif font-black tracking-tighter text-white/[0.07] uppercase leading-none whitespace-nowrap transform translate-y-4">
                      {slide.wordmark}
                    </span>
                  </div>

                  {/* Main Grid Content */}
                  <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center flex-1 my-auto">
                    {/* Left Column: Text & CTAs */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                      {/* Slide Index + Eyebrow Pill */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-xs sm:text-sm font-mono font-bold text-white/50 tracking-wider">
                          0{idx + 1} / 0{heroSlides.length}
                        </span>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider ${slide.badgeStyle}`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{slide.badge}</span>
                        </div>
                      </div>

                      {/* Large Headline */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-serif font-bold text-white tracking-tight leading-[1.12] mb-4">
                        {slide.title}
                      </h1>

                      {/* Tagline */}
                      <p className="text-base sm:text-lg text-neutral-300 font-sans-custom leading-relaxed mb-6 max-w-xl">
                        {slide.tagline}
                      </p>

                      {/* Price Tag Highlight */}
                      <div className="flex items-baseline gap-2 mb-8 px-4 py-2 rounded-xl bg-black/25 border border-white/10">
                        <span className="text-xs text-neutral-400">{slide.priceLabel}:</span>
                        <span className={`text-xl font-extrabold ${slide.accentColor}`}>
                          &#8377;{slide.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => navigate(`/product/${slide.id}`)}
                          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${slide.buttonStyle}`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Explore Product</span>
                        </button>

                        <button
                          onClick={() => {
                            const el = document.getElementById('collection-grid');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer"
                        >
                          <span>View Full Grid</span>
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Prominent Product Bottle + Floating Ingredients */}
                    <div className="lg:col-span-5 w-full flex items-center justify-center relative min-h-[320px] sm:min-h-[380px] lg:min-h-[460px]">
                      {/* Ambient Glowing Blob behind Bottle */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                        <div className={`w-[260px] sm:w-[340px] lg:w-[400px] h-[260px] sm:h-[340px] lg:h-[400px] ${slide.glowColor} rounded-full blur-[80px] sm:blur-[110px] transform scale-110`} />
                      </div>

                      {/* Floating Ingredients */}
                      {slide.ingredients.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={`absolute ${item.pos} pointer-events-none z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-[11px] font-medium text-white/90 shadow-lg animate-pulse`}
                          style={{ animationDuration: '3.5s', animationDelay: item.delay }}
                        >
                          {item.type === 'leaf' || item.type === 'leaf-sprig' ? (
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                          ) : item.type === 'drop' ? (
                            <Droplets className="w-3.5 h-3.5 text-amber-300" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#d4a373] shadow-sm" />
                          )}
                          <span className="hidden sm:inline text-[10px] font-sans-custom">{item.label}</span>
                        </div>
                      ))}

                      {/* Prominent Bottle Image */}
                      <div
                        onClick={() => navigate(`/product/${slide.id}`)}
                        className="relative cursor-pointer group flex items-center justify-center w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] h-[300px] sm:h-[360px] lg:h-[420px]"
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/bulk_1l.jpg';
                          }}
                          className="max-h-[280px] sm:max-h-[340px] lg:max-h-[400px] w-auto object-contain filter brightness-105 contrast-105 drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Controls Bar (Dot Indicators + Navigation) */}
            <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-between px-6 sm:px-10 pointer-events-auto">
              {/* Minimal Dot Indicators */}
              <div className="flex items-center gap-2">
                {heroSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeHeroIndex ? `w-8 ${heroSlides[activeHeroIndex].dotsActive}` : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide to ${s.wordmark}`}
                  />
                ))}
              </div>

              {/* Arrow Cycle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveHeroIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous Product"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveHeroIndex(prev => (prev + 1) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next Product"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* ─── Product Grid Section ─── */}
          <main id="collection-grid" className="w-full scroll-mt-24">
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