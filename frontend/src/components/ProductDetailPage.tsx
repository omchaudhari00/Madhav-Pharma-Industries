import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allProducts, addToRetailCart, isRetailOutOfStock, isB2BOutOfStock, isDiscontinued, openRetailCheckout, retailCartTotalCount } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll to top immediately when product page loads or id changes
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [id]);

  if (!id) return <div>Product not found</div>;

  const isHerbal = id.endsWith('-herbal');
  const isBulk = id.endsWith('-bulk');
  const [selectedSize, setSelectedSize] = useState<'1l' | '5l'>('1l');
  
  // Extract base product ID
  let baseId = id;
  if (isHerbal) baseId = id.replace('-herbal', '');
  else if (isBulk) baseId = id.replace('-bulk', '');

  const baseProduct = allProducts.find(p => p.id === baseId);
  if (!baseProduct) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-display">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button onClick={() => navigate('/products')} className="text-[#d4a373] hover:underline cursor-pointer">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const discontinued = isDiscontinued(baseId);
  const isOos = isHerbal ? isRetailOutOfStock(baseId) : isB2BOutOfStock(baseId);

  // Generate specific details based on the variant
  let productName = baseProduct.name;
  let price = 0;
  let priceLabel = '';
  let sizeLabel = '';
  let specs: string[] = [];
  let description = '';
  let category = '';

  let defaultImage = baseProduct.heroImage || baseProduct.cardImage;

  if (isHerbal) {
    productName = baseProduct.name;
    price = baseProduct.retailPrice || 299;
    priceLabel = 'Price per bottle';
    sizeLabel = '50ml';
    category = 'Therapeutic Formulation';
    specs = ['50ml Glass Bottle', baseProduct.grade.split('•')[1]?.trim() || baseProduct.grade];
    description = baseProduct.description || `Therapeutic-grade ${baseProduct.categoryTitle.toLowerCase()} formulation for safe human wellness and daily use. Rich in natural compounds and carefully steam-distilled for maximum efficacy.`;
  } else if (isBulk) {
    if (selectedSize === '1l') {
      productName = `${baseProduct.categoryTitle} Essential Oil (1 Litre)`;
      price = baseProduct.unitPrice;
      priceLabel = 'Price per 1 Litre bottle';
      sizeLabel = '1L';
      category = 'B2B Raw Material';
      specs = ['1 Litre Amber Glass Bottle', '100% Pure Unadulterated', 'Industrial Grade'];
      description = baseProduct.description || `100% pure steam-distilled ${baseProduct.categoryTitle.toLowerCase()} extract. Ideal for industrial manufacturing, pharmaceutical formulation, and commercial processing.`;
      defaultImage = '/images/bulk_1l.jpg';
    } else {
      productName = `${baseProduct.categoryTitle} Essential Oil (5 Litre)`;
      price = baseProduct.price5L ? Number(baseProduct.price5L) : (baseProduct.unitPrice * 5);
      priceLabel = 'Price per 5 Litre drum';
      sizeLabel = '5L';
      category = 'B2B Bulk Material';
      specs = ['5 Litre HDPE Industrial Drum', '100% Pure Unadulterated', 'Industrial Grade'];
      description = baseProduct.description5L || baseProduct.description || `100% pure steam-distilled ${baseProduct.categoryTitle.toLowerCase()} extract in bulk packaging. Designed for high-volume industrial and commercial manufacturing pipelines.`;
      defaultImage = '/images/bulk_5l.jpg';
    }
  }

  let customImagesForVariant: string[] | undefined = undefined;
  if (isBulk && selectedSize === '5l') {
    customImagesForVariant = baseProduct.customImages5L && baseProduct.customImages5L.length > 0 
      ? baseProduct.customImages5L 
      : undefined;
  } else {
    customImagesForVariant = baseProduct.customImages && baseProduct.customImages.length > 0 
      ? baseProduct.customImages 
      : undefined;
  }

  const images = customImagesForVariant !== undefined 
    ? customImagesForVariant 
    : [defaultImage];
  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    if (isOos || discontinued) return;
    addToRetailCart({
      id: isBulk ? `${baseId}-bulk-${selectedSize}` : id,
      name: productName,
      sizeLabel: sizeLabel,
      unitPrice: price,
      imageUrl: currentImage,
    }, qty);
  };

  const handleBuyNow = () => {
    if (isOos || discontinued) return;
    addToRetailCart({
      id: isBulk ? `${baseId}-bulk-${selectedSize}` : id,
      name: productName,
      sizeLabel: sizeLabel,
      unitPrice: price,
      imageUrl: currentImage,
    }, qty);
    // addToRetailCart already opens checkout modal contextually in App
  };

  if (discontinued) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-display">
        <h2 className="text-2xl font-bold text-red-500">This product has been discontinued.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-display relative selection:bg-neutral-800 selection:text-white flex flex-col">
      {/* Themed Static Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Static Background Image with Dark Toning */}
        <img
          src="/images/home-about-gy.png"
          alt="Madhav Pharma Background"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/bulk_1l.jpg';
          }}
          className="w-full h-full object-cover object-[51%_top] filter brightness-[0.3] contrast-[1.1] opacity-75"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/70 to-neutral-950/95" />

        {/* Subtle Ambient Color Glow Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d4a373]/15 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Landing Page Navbar */}
        <Navbar />

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#d4a373]" />
              <span>Back to Shop</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative rounded-3xl bg-neutral-900/50 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-12 min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-transparent to-[#d4a373]/10 opacity-50" />
              <img 
                src={currentImage} 
                alt={productName} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/bulk_1l.jpg';
                }}
                className="w-full h-full max-h-[400px] object-contain filter brightness-105 relative z-10 transition-all duration-500"
              />
              {isOos && (
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 z-20 shadow-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Out of Stock</span>
                </div>
              )}
              {!isOos && (
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 z-20 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>In Stock</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${activeImageIndex === idx ? 'border-[#d4a373] opacity-100' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}
                  >
                    <div className="absolute inset-0 bg-neutral-900/50" />
                    <img 
                      src={img} 
                      alt={`${productName} thumbnail ${idx + 1}`} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/bulk_1l.jpg';
                      }}
                      className="w-full h-full object-cover relative z-10 brightness-110" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-8">
            <div>
              <span className="text-[#d4a373] text-sm font-extrabold tracking-widest uppercase mb-2 block">
                {category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight mb-4">
                {productName}
              </h1>
              {baseId === 'weight-loss-oil' ? (
                <div className="space-y-6 mt-4">
                  <p className="text-xl font-medium text-white italic border-l-4 border-[#d4a373] pl-4">
                    Healthy Body, Fit Life – Now Lose Weight Naturally
                  </p>
                  <p className="text-base text-neutral-300 font-sans-custom leading-relaxed">
                    A 100% natural herbal and Ayurvedic oil designed to boost your metabolism and support your detoxification journey.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <h4 className="text-[#d4a373] font-extrabold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Key Benefits
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Helps in Weight Loss:</strong> Actively assists in your weight management goals.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Boosts Metabolism:</strong> Accelerates your body's natural fat-burning processes.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">100% Natural Ingredients:</strong> Formulated purely from nature's best elements.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Improves Digestion:</strong> Enhances and strengthens your digestive power.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Detoxifies & Purifies:</strong> Cleanses the body by flushing out toxins.</p>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#d4a373]/10 rounded-2xl p-5 border border-[#d4a373]/20">
                      <h4 className="text-[#d4a373] font-extrabold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Why Choose This Oil?
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">No Side Effects:</strong> Completely safe for regular use.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Safe & Effective:</strong> A trusted Ayurvedic formulation.</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                          <p className="text-xs text-neutral-300"><strong className="text-white">Visible Results:</strong> See the difference in your wellness journey.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-neutral-400 font-sans-custom leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-neutral-300 uppercase tracking-wider">Specifications</h3>
              <div className="flex flex-wrap gap-2">
                {specs.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-bold transition-all">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector for Bulk Products */}
            {isBulk && (
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-neutral-300 uppercase tracking-wider">Select Packaging Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setSelectedSize('1l'); setActiveImageIndex(0); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSize === '1l'
                        ? 'bg-[#d4a373]/20 border-[#d4a373]/60 text-white shadow-[0_0_15px_rgba(212,163,115,0.15)]'
                        : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">1 Litre Bottle</span>
                    <span className={`text-lg font-extrabold ${selectedSize === '1l' ? 'text-[#d4a373]' : 'text-white'}`}>
                      &#8377;{baseProduct.unitPrice.toLocaleString('en-IN')}
                    </span>
                  </button>
                  <button
                    onClick={() => { setSelectedSize('5l'); setActiveImageIndex(0); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSize === '5l'
                        ? 'bg-[#d4a373]/20 border-[#d4a373]/60 text-white shadow-[0_0_15px_rgba(212,163,115,0.15)]'
                        : 'bg-neutral-900/50 border-white/10 text-neutral-400 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">5 Litre Drum</span>
                    <span className={`text-lg font-extrabold ${selectedSize === '5l' ? 'text-[#d4a373]' : 'text-white'}`}>
                      &#8377;{(baseProduct.price5L ? Number(baseProduct.price5L) : (baseProduct.unitPrice * 5)).toLocaleString('en-IN')}
                    </span>
                  </button>
                </div>
              </div>
            )}


            {/* Pricing Box */}
            <div className="bg-neutral-900/50 border border-[#d4a373]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 relative z-10">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    {priceLabel}
                  </span>
                  <div className="text-5xl font-extrabold text-[#d4a373]">
                    &#8377;{price.toLocaleString('en-IN')}
                  </div>
                </div>

                {!isOos && (
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 bg-neutral-950 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                      >-</button>
                      <span className="text-lg font-mono font-bold text-white w-8 text-center">{qty}</span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                      >+</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <button
                  onClick={handleAddToCart}
                  disabled={isOos}
                  className={`py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOos
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOos}
                  className={`py-4 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOos
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      : 'bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_0_20px_rgba(212,163,115,0.4)] hover:shadow-[0_0_30px_rgba(212,163,115,0.6)] active:scale-95'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Landing Page Footer */}
      <Footer />
      </div>
    </div>
  );
};
