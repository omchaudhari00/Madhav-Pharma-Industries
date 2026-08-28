import React, { useState, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToRetailCart, isRetailOutOfStock, isB2BOutOfStock, isDiscontinued } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll to top immediately when product detail page loads
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  if (!id) return <div>Product not found</div>;

  const isHerbal = id.endsWith('-herbal');
  const isBulk = id.endsWith('-bulk');
  const [selectedSize, setSelectedSize] = useState('1l');
  
  // Extract base product ID
  let baseId = id;
  if (isHerbal) baseId = id.replace('-herbal', '');
  else if (isBulk) baseId = id.replace('-bulk', '');

  const baseProduct = allProducts.find(p => p.id === baseId);
  if (!baseProduct) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="px-6 py-2.5 rounded-full bg-[#d4a373] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c29161] transition-colors cursor-pointer">
              Return to Shop
            </button>
          </div>
        </div>
        <Footer />
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
  let specs = [];
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
      price = baseProduct.unitPrice * 5;
      priceLabel = 'Price per 5 Litre drum';
      sizeLabel = '5L';
      category = 'B2B Bulk Material';
      specs = ['5 Litre HDPE Industrial Drum', '100% Pure Unadulterated', 'Industrial Grade'];
      description = baseProduct.description || `100% pure steam-distilled ${baseProduct.categoryTitle.toLowerCase()} extract in bulk packaging. Designed for high-volume industrial and commercial manufacturing pipelines.`;
      defaultImage = '/images/bulk_5l.jpg';
    }
  }

  const images = baseProduct.customImages !== undefined 
    ? (baseProduct.customImages.length > 0 ? baseProduct.customImages : ['/images/favicon-circle.png']) 
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
  };

  if (discontinued) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">This product has been discontinued.</h2>
            <button onClick={() => navigate('/products')} className="px-6 py-2.5 rounded-full bg-[#d4a373] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c29161] transition-colors cursor-pointer">
              Return to Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-display relative selection:bg-neutral-200 selection:text-black flex flex-col">
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
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8a5d2b]" />
              <span>Back to Shop</span>
            </button>
          </div>

          {/* Top Section: Image on left, Title & Info on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-8 lg:mb-10">
            
            {/* Left: Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-3xl bg-neutral-50 border border-neutral-200 overflow-hidden shadow-md flex items-center justify-center p-8 sm:p-12 min-h-[380px] sm:min-h-[460px]">
                <img 
                  src={currentImage} 
                  alt={productName} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/bulk_1l.jpg';
                  }}
                  className="w-full h-full max-h-[360px] sm:max-h-[420px] object-contain filter brightness-105 relative z-10 transition-all duration-500"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${activeImageIndex === idx ? 'border-[#d4a373] shadow-md' : 'border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400'}`}
                    >
                      <div className="absolute inset-0 bg-neutral-50" />
                      <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-contain p-2 relative z-10" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Title, Description & Specs */}
            <div className="flex flex-col space-y-5 sm:space-y-6">
              <div>
                <span className="text-[#8a5d2b] text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-1.5 block">
                  {category}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight mb-3">
                  {productName}
                </h1>
                {baseId === 'weight-loss-oil' ? (
                  <div className="space-y-3 mt-2">
                    <p className="text-lg sm:text-xl font-medium text-neutral-900 italic border-l-4 border-[#d4a373] pl-4">
                      Healthy Body, Fit Life – Now Lose Weight Naturally
                    </p>
                    <p className="text-sm sm:text-base text-neutral-600 font-sans-custom leading-relaxed">
                      A 100% natural herbal and Ayurvedic oil designed to boost your metabolism and support your detoxification journey.
                    </p>
                  </div>
                ) : (
                  <p className="text-base sm:text-lg text-neutral-600 font-sans-custom leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-neutral-700 uppercase tracking-wider">Specifications</h3>
                <div className="flex flex-wrap gap-2">
                  {specs.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Selector for Bulk Products */}
              {isBulk && (
                <div className="space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-neutral-700 uppercase tracking-wider">Select Packaging Size</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedSize('1l')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSize === '1l'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30 text-neutral-900 shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">1 Litre Bottle</span>
                      <span className={`text-lg font-extrabold ${selectedSize === '1l' ? 'text-[#8a5d2b]' : 'text-neutral-900'}`}>
                        &#8377;{baseProduct.unitPrice.toLocaleString('en-IN')}
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedSize('5l')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSize === '5l'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30 text-neutral-900 shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-bold block mb-1">5 Litre Drum</span>
                      <span className={`text-lg font-extrabold ${selectedSize === '5l' ? 'text-[#8a5d2b]' : 'text-neutral-900'}`}>
                        &#8377;{(baseProduct.unitPrice * 5).toLocaleString('en-IN')}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Key Benefits on left aligned with Pricing Box on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            
            {/* Left: Key Benefits & Why Choose This Oil */}
            <div>
              {baseId === 'weight-loss-oil' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 shadow-sm">
                    <h4 className="text-[#8a5d2b] font-extrabold mb-3 uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Benefits
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Helps in Weight Loss:</strong> Actively assists in your weight management goals.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Boosts Metabolism:</strong> Accelerates your body's natural fat-burning processes.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">100% Natural Ingredients:</strong> Formulated purely from nature's best elements.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Improves Digestion:</strong> Enhances and strengthens your digestive power.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Detoxifies &amp; Purifies:</strong> Cleanses the body by flushing out toxins.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#d4a373]/10 rounded-2xl p-5 border border-[#d4a373]/20 shadow-sm">
                    <h4 className="text-[#8a5d2b] font-extrabold mb-3 uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#8a5d2b]" /> Why Choose This Oil?
                    </h4>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8a5d2b] mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">No Side Effects:</strong> Completely safe for regular use.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8a5d2b] mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Safe &amp; Effective:</strong> A trusted Ayurvedic formulation.</p>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8a5d2b] mt-1.5 shrink-0" />
                        <p className="text-xs text-neutral-700"><strong className="text-neutral-900">Visible Results:</strong> See the difference in your wellness journey.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 text-neutral-600 text-sm leading-relaxed">
                  <h4 className="font-bold text-neutral-900 mb-2 uppercase text-xs tracking-wider">Extraction &amp; Quality Standard</h4>
                  <p>100% steam distilled from high-grade natural botanicals with GC-MS and Certificate of Analysis (COA) verification.</p>
                </div>
              )}
            </div>

            {/* Right: Pricing Box (At the exact same level) */}
            <div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                      {priceLabel}
                    </span>
                    <div className="text-4xl sm:text-5xl font-extrabold text-[#8a5d2b]">
                      &#8377;{price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {!isOos && (
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1.5">
                        Quantity
                      </span>
                      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => setQty(q => Math.max(1, q - 1))}
                          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-[#d4a373] hover:text-black text-neutral-800 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                        >-</button>
                        <span className="text-base font-mono font-bold text-neutral-900 w-8 text-center">{qty}</span>
                        <button
                          onClick={() => setQty(q => q + 1)}
                          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-[#d4a373] hover:text-black text-neutral-800 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOos}
                    className={`py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOos
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                        : 'bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 shadow-sm'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 text-neutral-700" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOos}
                    className={`py-3.5 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOos
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                        : 'bg-[#d4a373] hover:bg-[#c29161] text-black shadow-md active:scale-95'
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

export default ProductDetailPage;
