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

/* ─── Premium Glassmorphic Product Card ─── */
const ShopCard: React.FC<{ product: ShopProduct }> = ({ product }) => {
  const navigate = useNavigate();
  const { isRetailOutOfStock, isB2BOutOfStock, isDiscontinued } = useApp();

  const discontinued = isDiscontinued(product.baseId);
  const isOos = product.category === 'herbal' ? isRetailOutOfStock(product.baseId) : isB2BOutOfStock(product.baseId);

  if (discontinued) return null;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/15 hover:border-[#d4a373]/60 transition-all duration-400 overflow-hidden flex flex-col shadow-xl hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4a373]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4a373]/20 transition-colors duration-500" />

      {/* Image Container */}
      <div className="relative w-full h-44 sm:h-56 bg-neutral-950/60 border-b border-white/10 overflow-hidden flex items-center justify-center p-4 sm:p-6">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/bulk_1l.jpg';
          }}
          className="w-full h-full object-contain filter brightness-105 contrast-105 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />

        {/* Badge */}
        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-sm z-10">
          {product.badgeText}
        </span>

        {/* Stock status indicator */}
        {isOos ? (
          <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 z-10">
            <AlertCircle className="w-3 h-3" />
            <span>OOS</span>
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider z-10">
            IN STOCK
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight mb-2 group-hover:text-[#d4a373] transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 block mb-0.5">{product.priceLabel}</span>
            <span className="text-base sm:text-xl font-extrabold text-[#d4a373]">&#8377;{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-[#d4a373] group-hover:text-black group-hover:border-[#d4a373] transition-all text-white">
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Shop Page ─── */
export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProducts, isDiscontinued } = useApp();

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

  const shopProducts: ShopProduct[] = (allProducts || [])
    .filter(p => !isDiscontinued(p.id))
    .map(p => {
      if (p.id === 'weight-loss-oil') {
        return {
          id: `${p.id}-herbal`,
          baseId: p.id,
          name: p.name,
          shortName: `${p.categoryTitle} ${p.categorySubtitle}`,
          image: p.customImages !== undefined && p.customImages.length > 0 ? (p.customImages[0] || '/images/favicon-circle.png') : (p.cardImage || '/images/weight-loss-oil.jpg'),
          badgeText: p.badgeText || '100% Natural',
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
          image: p.customImages !== undefined && p.customImages.length > 0 ? (p.customImages[0] || '/images/bulk_1l.jpg') : (p.cardImage || '/images/bulk_1l.jpg'),
          badgeText: p.badgeText || 'B2B RAW OIL',
          category: 'bulk',
          price: p.unitPrice || 0,
          priceLabel: 'Starting at (1L)',
        };
      }
    });

  // Curated Visual Configs per Product
  const productConfigs: Record<string, {
    wordmark: string;
    panelGradient: string;
    glowColor: string;
    accentColor: string;
    badgeStyle: string;
    buttonStyle: string;
    dotsActive: string;
    fallbackImage: string;
    fallbackTitle: string;
    fallbackTagline: string;
    fallbackBadge: string;
    fallbackPrice: number;
    priceLabel: string;
    ingredients: Array<{ type: string; label: string; pos: string; delay: string }>;
  }> = {
    'cumin-seed-oil': {
      wordmark: 'CUMIN',
      panelGradient: 'from-[#342010] via-[#23150a] to-[#150c05]',
      glowColor: 'bg-[#d4a373]/25',
      accentColor: 'text-[#d4a373]',
      badgeStyle: 'bg-[#d4a373]/15 border-[#d4a373]/35 text-[#d4a373]',
      buttonStyle: 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_0_30px_rgba(212,163,115,0.4)]',
      dotsActive: 'bg-[#d4a373]',
      fallbackImage: '/images/bulk_1l.jpg',
      fallbackTitle: 'Pure Steam-Distilled Cumin Seed Oil',
      fallbackTagline: 'High-potency therapeutic Jeera extract crafted for digestive balance, immunity, and vitality.',
      fallbackBadge: '100% PURE THERAPEUTIC',
      fallbackPrice: 2200,
      priceLabel: 'Starting at 1L Bulk Container',
      ingredients: [
        { type: 'seed-cluster', label: 'Cumin Seeds', pos: 'top-8 right-12 sm:top-12 sm:right-16', delay: '0s' },
        { type: 'leaf', label: 'Botanical Leaf', pos: 'bottom-16 left-6 sm:bottom-20 sm:left-10', delay: '1s' },
        { type: 'drop', label: 'Pure Extract', pos: 'top-20 left-12 sm:top-24 sm:left-16', delay: '2s' },
        { type: 'seed', label: 'Jeera Grain', pos: 'bottom-8 right-24 sm:bottom-10 sm:right-32', delay: '1.5s' },
      ],
    },
    'weight-loss-oil': {
      wordmark: 'HERBAL',
      panelGradient: 'from-[#152a1c] via-[#0d1d13] to-[#07120a]',
      glowColor: 'bg-emerald-500/25',
      accentColor: 'text-emerald-400',
      badgeStyle: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400',
      buttonStyle: 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
      dotsActive: 'bg-emerald-400',
      fallbackImage: '/images/weight-loss-oil.jpg',
      fallbackTitle: 'Completely Natural Weight Loss Remedy',
      fallbackTagline: 'Researched Ayurvedic metabolic formulation designed to burn fat naturally and revitalize body wellness.',
      fallbackBadge: '100% AYURVEDIC FORMULATION',
      fallbackPrice: 349,
      priceLabel: 'Price per 50ml therapeutic bottle',
      ingredients: [
        { type: 'leaf', label: 'Herbal Leaf', pos: 'top-10 left-10 sm:top-14 sm:left-16', delay: '0.5s' },
        { type: 'leaf-sprig', label: 'Botanical Sprig', pos: 'bottom-14 right-10 sm:bottom-16 sm:right-16', delay: '1.2s' },
        { type: 'drop', label: 'Herbal Essence', pos: 'top-16 right-20 sm:top-20 sm:right-28', delay: '2.2s' },
        { type: 'seed', label: 'Ayurvedic Seed', pos: 'bottom-20 left-16 sm:bottom-24 sm:left-24', delay: '1.8s' },
      ],
    },
    'fennel-seed-oil': {
      wordmark: 'FENNEL',
      panelGradient: 'from-[#1a2d1f] via-[#112015] to-[#09130c]',
      glowColor: 'bg-emerald-600/20',
      accentColor: 'text-emerald-300',
      badgeStyle: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
      buttonStyle: 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
      dotsActive: 'bg-emerald-300',
      fallbackImage: '/images/fennel-oil.png',
      fallbackTitle: 'Natural Steam-Distilled Fennel Seed Oil',
      fallbackTagline: 'Sweet, aromatic Saunf essence steam-distilled for gourmet infusion and holistic wellness.',
      fallbackBadge: 'FOOD & WELLNESS GRADE',
      fallbackPrice: 85,
      priceLabel: 'Starting at 1L Bulk Container',
      ingredients: [
        { type: 'seed-cluster', label: 'Fennel Seeds', pos: 'top-12 left-12 sm:top-16 sm:left-20', delay: '0.3s' },
        { type: 'leaf', label: 'Saunf Leaf', pos: 'bottom-12 right-12 sm:bottom-16 sm:right-20', delay: '1.4s' },
        { type: 'drop', label: 'Aromatic Drop', pos: 'top-8 right-24 sm:top-12 sm:right-32', delay: '2.1s' },
        { type: 'seed', label: 'Sweet Seed', pos: 'bottom-16 left-8 sm:bottom-20 sm:left-14', delay: '0.8s' },
      ],
    },
    'ajwain-seed-oil': {
      wordmark: 'AJWAIN',
      panelGradient: 'from-[#351c14] via-[#24120c] to-[#140906]',
      glowColor: 'bg-amber-600/20',
      accentColor: 'text-amber-400',
      badgeStyle: 'bg-amber-500/15 border-amber-500/35 text-amber-400',
      buttonStyle: 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_0_30px_rgba(245,158,11,0.4)]',
      dotsActive: 'bg-amber-400',
      fallbackImage: '/images/ajwain-oil.png',
      fallbackTitle: 'Pure Concentrated Ajwain Seed Oil',
      fallbackTagline: 'Intensely aromatic carom extract delivering fast-acting therapeutic relief and digestive comfort.',
      fallbackBadge: 'PHARMA GRADE POTENCY',
      fallbackPrice: 95,
      priceLabel: 'Starting at 1L Bulk Container',
      ingredients: [
        { type: 'seed-cluster', label: 'Ajwain Florets', pos: 'top-10 right-14 sm:top-14 sm:right-20', delay: '0.2s' },
        { type: 'leaf', label: 'Herbal Flourish', pos: 'top-20 left-8 sm:top-24 sm:left-14', delay: '1.6s' },
        { type: 'drop', label: 'Potent Extract', pos: 'bottom-12 right-20 sm:bottom-16 sm:right-28', delay: '2.4s' },
        { type: 'seed', label: 'Carom Seed', pos: 'bottom-14 left-14 sm:bottom-18 sm:left-20', delay: '1.1s' },
      ],
    },
    'black-seed-oil': {
      wordmark: 'KALONJI',
      panelGradient: 'from-[#251e2c] via-[#18121d] to-[#0d0910]',
      glowColor: 'bg-amber-500/18',
      accentColor: 'text-[#e5c07b]',
      badgeStyle: 'bg-[#e5c07b]/15 border-[#e5c07b]/35 text-[#e5c07b]',
      buttonStyle: 'bg-[#e5c07b] hover:bg-[#d6af66] text-neutral-950 shadow-[0_0_30px_rgba(229,192,123,0.4)]',
      dotsActive: 'bg-[#e5c07b]',
      fallbackImage: '/images/all-oils.png',
      fallbackTitle: 'Pure Nigella Sativa Black Seed Oil',
      fallbackTagline: 'Ancient miracle elixir cold-extracted and rich in Thymoquinone for deep whole-body rejuvenation.',
      fallbackBadge: 'PREMIUM COLD EXTRACT',
      fallbackPrice: 150,
      priceLabel: 'Starting at 1L Bulk Container',
      ingredients: [
        { type: 'seed-cluster', label: 'Black Kalonji Seeds', pos: 'top-12 left-10 sm:top-16 sm:left-16', delay: '0.4s' },
        { type: 'leaf', label: 'Nigella Herb', pos: 'bottom-16 right-12 sm:bottom-20 sm:right-20', delay: '1.3s' },
        { type: 'drop', label: 'Golden Drop', pos: 'top-14 right-20 sm:top-18 sm:right-28', delay: '2.0s' },
        { type: 'seed', label: 'Nigella Seed', pos: 'bottom-10 left-16 sm:bottom-14 sm:left-24', delay: '0.9s' },
      ],
    },
  };

  // Dynamic Hero Slides derived live from allProducts (reflecting admin price & image edits)
  const heroSlides = allProducts
    .filter(p => !isDiscontinued(p.id))
    .map(p => {
      const cfg = productConfigs[p.id] || {
        wordmark: p.categoryTitle.toUpperCase(),
        panelGradient: 'from-[#251e2c] via-[#18121d] to-[#0d0910]',
        glowColor: 'bg-[#d4a373]/25',
        accentColor: 'text-[#d4a373]',
        badgeStyle: 'bg-[#d4a373]/15 border-[#d4a373]/35 text-[#d4a373]',
        buttonStyle: 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_0_30px_rgba(212,163,115,0.4)]',
        dotsActive: 'bg-[#d4a373]',
        fallbackImage: '/images/bulk_1l.jpg',
        fallbackTitle: p.name,
        fallbackTagline: p.description || '',
        fallbackBadge: p.badgeText || '100% PURE',
        fallbackPrice: p.unitPrice,
        priceLabel: p.id === 'weight-loss-oil' ? 'Price per 50ml bottle' : 'Starting at 1L Bulk Container',
        ingredients: [],
      };

      const isHerbal = p.id === 'weight-loss-oil';
      const targetId = isHerbal ? `${p.id}-herbal` : `${p.id}-bulk`;
      const dynamicPrice = isHerbal
        ? (p.retailPrice !== undefined ? p.retailPrice : cfg.fallbackPrice)
        : (p.unitPrice !== undefined ? p.unitPrice : cfg.fallbackPrice);

      const dynamicImage = (p.customImages && p.customImages.length > 0 && p.customImages[0])
        ? p.customImages[0]
        : (p.cardImage || p.heroImage || cfg.fallbackImage);

      return {
        id: targetId,
        baseId: p.id,
        wordmark: cfg.wordmark,
        title: p.name || cfg.fallbackTitle,
        tagline: p.description || cfg.fallbackTagline,
        badge: p.badgeText || cfg.fallbackBadge,
        price: dynamicPrice,
        priceLabel: cfg.priceLabel,
        image: dynamicImage,
        panelGradient: cfg.panelGradient,
        glowColor: cfg.glowColor,
        accentColor: cfg.accentColor,
        badgeStyle: cfg.badgeStyle,
        buttonStyle: cfg.buttonStyle,
        dotsActive: cfg.dotsActive,
        ingredients: cfg.ingredients,
      };
    });

  // Preload all product images
  useEffect(() => {
    heroSlides.forEach(slide => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, [heroSlides]);

  // Auto-cycle every 3 seconds, pause on hover
  useEffect(() => {
    if (isHeroHovered || heroSlides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isHeroHovered, heroSlides.length]);

  return (
    <div className="min-h-screen bg-[#B4B3B3] text-white font-display relative selection:bg-neutral-800 selection:text-white flex flex-col">
      {/* Background Ambience Layer - Fixed Lighter Warm Charcoal-Grey (#B4B3B3) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#B4B3B3]">
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
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-black transition-colors cursor-pointer"
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
                      idx === activeHeroIndex ? `w-8 ${heroSlides[activeHeroIndex]?.dotsActive || 'bg-[#d4a373]'}` : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide to ${s.wordmark}`}
                  />
                ))}
              </div>

              {/* Arrow Cycle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveHeroIndex(prev => (heroSlides.length > 0 ? (prev - 1 + heroSlides.length) % heroSlides.length : 0))}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous Product"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveHeroIndex(prev => (heroSlides.length > 0 ? (prev + 1) % heroSlides.length : 0))}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-950 mb-3">
                Madhav Pharma Collection
              </h2>
              <p className="text-sm sm:text-base text-neutral-800 font-sans-custom max-w-2xl mx-auto leading-relaxed font-medium">
                100% natural essential oils and therapeutic remedies. Carefully steam-distilled and formulated for your wellness and vitality.
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-[#d4a373]/60 to-transparent mt-8 max-w-2xl mx-auto" />
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