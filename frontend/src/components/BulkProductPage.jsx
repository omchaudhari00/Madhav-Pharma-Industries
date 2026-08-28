import React, { useState } from "react";
import { 
  ShieldCheck, 
  Droplets, 
  FlaskConical, 
  Leaf, 
  Package, 
  FileText, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  Clock,
  Layers,
  Award,
  ArrowLeft
} from "lucide-react";
import { useApp } from "../context/AppContext";


export const BULK_PRODUCTS = {
  "cumin-seed-oil": {
    id: "cumin-seed-oil",
    name: "Pure Cumin Seed Essential Oil",
    botanicalName: "Cuminum cyminum L.",
    category: "Industrial Raw Material / Bulk Essential Oil",
    shortDescription:
      "100% natural, steam-distilled essential oil extracted from selected Gujarat cumin seeds. Standardized with high Cuminaldehyde content for pharmaceutical synthesis, natural flavor houses, and therapeutic formulations.",
    pricePerKg: "₹1,200 / KG",
    moq: "1 KG / 5 KG Available",
    extractionMethod: "Superheated Steam Distillation",
    purity: "100% Pure, Unadulterated Natural Oil",
    casNumber: "8014-13-9",
    origin: "Gujarat, India",
    hsnCode: "3301.29.90",
    cardImage: "/images/cumin-seed-oil.png",
    packagingOptions: [
      {
        name: "1 KG Laboratory Grade Bottle",
        size: "1 KG (Net Wt)",
        description: "Amber glass canister with tamper-evident seal. Ideal for pilot trials, R&D labs, and master formula development.",
        type: "1kg"
      },
      {
        name: "5 KG Industrial Container",
        size: "5 KG (Net Wt)",
        description: "UN-certified food & pharma grade HDPE jerrycan with airtight induction seal for commercial production batches.",
        type: "5kg"
      }
    ],
    applications: [
      {
        title: "Pharmaceutical Formulations",
        description: "Carminative active agent, digestive syrup synthesis, and therapeutic topical ointment constituent."
      },
      {
        title: "Nutraceuticals & Wellness",
        description: "Softgel encapsulation raw material, metabolic wellness blends, and botanical extract supplements."
      },
      {
        title: "Cosmetic & Personal Care",
        description: "Active constituent in clarifying serums, antimicrobial hair care, and prestige perfumes."
      },
      {
        title: "Food & Flavor Synthesis",
        description: "Standardized aroma booster for seasonings, natural spice oleoresins, culinary marinades, and beverage flavoring."
      }
    ],
    specifications: {
      "Appearance": "Clear, pale yellow to brownish-yellow volatile liquid",
      "Odor / Aroma": "Strong, spicy, penetrating, characteristic cumin fragrance",
      "Active Constituents": "Cuminaldehyde (35% – 50%), Cymene, Terpenes",
      "Specific Gravity (25°C)": "0.905 – 0.925",
      "Refractive Index (20°C)": "1.4950 – 1.5090",
      "Optical Rotation (20°C)": "+3.0° to +8.0°",
      "Solubility": "Soluble in 95% Ethyl Alcohol & Essential Oil carriers; insoluble in water",
      "Storage Conditions": "Store in tightly closed containers in a cool, dry place away from heat & direct sunlight"
    },
    certifications: [
      "ISO 9001:2015 Certified Quality Management",
      "WHO-GMP Standard Distillation Facility",
      "FSSAI Food Grade Certified",
      "Batch-wise GC-MS & COA Lab Tested",
      "100% Solvent-Free & Hexane-Free"
    ]
  },
  "fennel-seed-oil": {
    id: "fennel-seed-oil",
    name: "Natural Fennel Seed Essential Oil",
    botanicalName: "Foeniculum vulgare Mill.",
    category: "Industrial Raw Material / Bulk Essential Oil",
    shortDescription:
      "Sweet and aromatic essential oil steam-distilled from premium fennel seeds. Rich in natural Anethole and Fenchone, engineered for digestive medicine formulations, oral care products, and food flavorings.",
    pricePerKg: "₹850 / KG",
    moq: "1 KG / 5 KG Available",
    extractionMethod: "Steam Distillation",
    purity: "100% Pure & Natural",
    casNumber: "8006-84-6",
    origin: "Rajasthan / Gujarat, India",
    hsnCode: "3301.29.90",
    cardImage: "/images/fennel-oil.jpg",
    packagingOptions: [
      {
        name: "1 KG Laboratory Grade Bottle",
        size: "1 KG (Net Wt)",
        description: "Amber glass bottle with hermetic cap. Perfect for formulation testing and laboratory pilot batches.",
        type: "1kg"
      },
      {
        name: "5 KG Industrial Container",
        size: "5 KG (Net Wt)",
        description: "Pharma-grade HDPE container with airtight induction liner for industrial manufacturing.",
        type: "5kg"
      }
    ],
    applications: [
      {
        title: "Oral Care & Toothpaste",
        description: "Primary natural flavor and antimicrobial constituent in premium herbal oral care products."
      },
      {
        title: "Digestive Healthcare",
        description: "Key active in antispasmodic and gastrointestinal tonics, carminative drops, and syrup bases."
      },
      {
        title: "Confectionery & Beverages",
        description: "Standardized sweet licorice-like aroma for syrups, pastilles, and natural beverages."
      },
      {
        title: "Aromatherapy & Soaps",
        description: "Calming botanical ingredient in artisanal luxury soaps, lotions, and diffuser oils."
      }
    ],
    specifications: {
      "Appearance": "Colorless to pale straw-yellow liquid",
      "Odor / Aroma": "Sweet, warm, anise-like characteristic fennel aroma",
      "Active Constituents": "trans-Anethole (60% – 75%), Fenchone (10% – 15%)",
      "Specific Gravity (25°C)": "0.953 – 0.973",
      "Refractive Index (20°C)": "1.5320 – 1.5430",
      "Optical Rotation (20°C)": "+12.0° to +24.0°",
      "Solubility": "Soluble in 90% ethanol; miscible in organic carrier oils",
      "Storage Conditions": "Cool, well-ventilated dry warehouse away from oxidation sources"
    },
    certifications: [
      "ISO 9001:2015 Quality Certified",
      "WHO-GMP Standard Distillation Facility",
      "FSSAI Food Grade Compliance",
      "GC-MS Chemical Profile Verified"
    ]
  },
  "ajwain-seed-oil": {
    id: "ajwain-seed-oil",
    name: "Pure Ajwain Seed Essential Oil",
    botanicalName: "Trachyspermum ammi L.",
    category: "Industrial Raw Material / Bulk Essential Oil",
    shortDescription:
      "High-potency essential oil steam-distilled from pure carom seeds. Exceptional natural Thymol concentration (40%–55%) for topical pain-relief balms, antiseptic formulations, and respiratory inhalants.",
    pricePerKg: "₹950 / KG",
    moq: "1 KG / 5 KG Available",
    extractionMethod: "Steam Distillation",
    purity: "100% Pure & Potent",
    casNumber: "8001-99-8",
    origin: "Gujarat, India",
    hsnCode: "3301.29.90",
    cardImage: "/images/ajwain-oil.png",
    packagingOptions: [
      {
        name: "1 KG Laboratory Grade Bottle",
        size: "1 KG (Net Wt)",
        description: "Amber glass bottle designed for precise laboratory compounding and test formulation.",
        type: "1kg"
      },
      {
        name: "5 KG Industrial Container",
        size: "5 KG (Net Wt)",
        description: "Heavy-duty HDPE drum with leakproof safety closure for commercial pharma manufacturing.",
        type: "5kg"
      }
    ],
    applications: [
      {
        title: "Topical Pain Relief & Balms",
        description: "Natural rubefacient and warming active in pain-relief ointments and muscle liniments."
      },
      {
        title: "Antiseptic & Wound Care",
        description: "Potent natural phenolic antimicrobial agent against bacterial and fungal strains."
      },
      {
        title: "Respiratory Care & Inhalants",
        description: "Decongestant active in steam inhalation capsules and respiratory relief blends."
      },
      {
        title: "Veterinary Healthcare",
        description: "Gastrointestinal and antiparasitic botanical agent in animal wellness products."
      }
    ],
    specifications: {
      "Appearance": "Colorless to brownish-yellow liquid",
      "Odor / Aroma": "Pungent, warm, intensely spicy thymolic aroma",
      "Active Constituents": "Thymol (40% – 55%), gamma-Terpinene, p-Cymene",
      "Specific Gravity (25°C)": "0.910 – 0.930",
      "Refractive Index (20°C)": "1.4980 – 1.5080",
      "Solubility": "Freely soluble in 95% ethanol and fixed carrier oils",
      "Storage Conditions": "Airtight containers in a dark, temperature-controlled environment"
    },
    certifications: [
      "ISO 9001:2015 Quality Certified",
      "WHO-GMP Standard Distillation Facility",
      "Lab Tested Assay Certificate"
    ]
  },
  "black-seed-oil": {
    id: "black-seed-oil",
    name: "Pure Black Seed Essential Oil (Kalonji)",
    botanicalName: "Nigella sativa L.",
    category: "Industrial Raw Material / Bulk Essential Oil",
    shortDescription:
      "Premium therapeutic essential oil extracted from organic Nigella sativa seeds. High Thymoquinone (TQ) bio-activity for immune-support capsules, dermatological cosmeceuticals, and advanced wellness therapies.",
    pricePerKg: "₹1,500 / KG",
    moq: "1 KG / 5 KG Available",
    extractionMethod: "Cold Distillation / Supercritical Extraction",
    purity: "100% Pure Therapeutic Grade",
    casNumber: "90064-32-7",
    origin: "India",
    hsnCode: "3301.29.90",
    cardImage: "/images/all-oils.png",
    packagingOptions: [
      {
        name: "1 KG Laboratory Grade Bottle",
        size: "1 KG (Net Wt)",
        description: "Protective amber bottle with tamper seal for research, compounding, and pilot formulations.",
        type: "1kg"
      },
      {
        name: "5 KG Industrial Container",
        size: "5 KG (Net Wt)",
        description: "Industrial food-grade certified canister with secure induction seal.",
        type: "5kg"
      }
    ],
    applications: [
      {
        title: "Immune & Metabolic Softgels",
        description: "Standardized active constituent for dietary softgels and therapeutic longevity supplements."
      },
      {
        title: "Dermatology & Skin Barrier",
        description: "Targeted active ingredient in soothing eczema treatments, acne therapies, and scalp serums."
      },
      {
        title: "Hair Vitality Formulations",
        description: "Follicle-nourishing botanical active in premium hair revitalization oils and hair care."
      },
      {
        title: "Pharma Active Compound",
        description: "Bioactive antioxidant constituent for integrative medicinal compounding."
      }
    ],
    specifications: {
      "Appearance": "Amber to dark brownish-yellow clear oil",
      "Odor / Aroma": "Characteristic peppery, aromatic, slightly bitter herbal notes",
      "Active Constituents": "Thymohydroquinone, Thymoquinone (TQ), p-Cymene",
      "Specific Gravity (25°C)": "0.915 – 0.935",
      "Refractive Index (20°C)": "1.5010 – 1.5150",
      "Solubility": "Miscible in all botanical oils and ethanol",
      "Storage Conditions": "Store sealed away from oxygen and direct sunlight under 25°C"
    },
    certifications: [
      "ISO 9001:2015 Quality Certified",
      "WHO-GMP Standard Distillation Facility",
      "High-TQ Certified by GC-MS"
    ]
  }
};

export const BulkProductPage = ({
  initialProductId = "cumin-seed-oil",
  onBack
}) => {
  const { openAuth, user } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(
    BULK_PRODUCTS[initialProductId] ? initialProductId : "cumin-seed-oil"
  );
  
  const product = BULK_PRODUCTS[selectedProductId] || BULK_PRODUCTS["cumin-seed-oil"];
  const [selectedPackaging, setSelectedPackaging] = useState(product.packagingOptions[0].name);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-display selection:bg-[#d4a373]/30 selection:text-white">
      
      {/* =====================================================
          TOP HEADER & BREADCRUMB
      ====================================================== */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans-custom overflow-x-auto">
            {onBack ? (
              <button 
                onClick={onBack}
                className="text-[#d4a373] hover:underline font-bold mr-2 flex items-center gap-1.5 cursor-pointer bg-neutral-800/60 px-3 py-1 rounded-full border border-neutral-700 hover:border-[#d4a373]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Storefront</span>
              </button>
            ) : (
              <a 
                href="#hero" 
                className="text-[#d4a373] hover:underline font-bold mr-2 flex items-center gap-1.5 cursor-pointer bg-neutral-800/60 px-3 py-1 rounded-full border border-neutral-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </a>
            )}
            <span className="hidden sm:inline">Products</span>
            <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0 hidden sm:inline" />
            <span className="text-[#d4a373] font-semibold">Bulk Raw Materials (1kg / 5kg)</span>
            <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
            <span className="text-white font-medium truncate">{product.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Steam Distillation Plant Gujarat
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCT SWITCHER BAR (Choose between the 4 bulk oils)
      ====================================================== */}
      <div className="bg-neutral-900/40 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider shrink-0 mr-1">
              Select Raw Oil:
            </span>
            {Object.values(BULK_PRODUCTS).map((p) => {
              const isCurrent = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProductId(p.id);
                    setSelectedPackaging(p.packagingOptions[0].name);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? "bg-[#d4a373] text-black shadow-md shadow-[#d4a373]/20 font-extrabold"
                      : "bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700"
                  }`}
                >
                  <span>{p.name.replace(' Essential Oil', '').replace(' Natural', '')}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCT HERO SECTION
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT: PRODUCT VISUAL CARD */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d4a373]/20 via-transparent to-emerald-500/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl p-8 flex flex-col items-center justify-center min-h-[460px] overflow-hidden shadow-2xl">
              
              {/* Top pill badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#d4a373]/20 text-[#d4a373] border border-[#d4a373]/30">
                  Bulk Raw Oil (100% Pure)
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {product.origin}
                </span>
              </div>

              {/* Product Image */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 relative flex items-center justify-center my-4">
                <img
                  src={product.cardImage}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target).style.display = 'none';
                  }}
                />
              </div>

              {/* Bottom Quick Badges */}
              <div className="w-full grid grid-cols-3 gap-2 pt-6 border-t border-neutral-800 text-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-500">Form</p>
                  <p className="text-xs font-semibold text-white mt-0.5">100% Raw Oil</p>
                </div>
                <div className="border-x border-neutral-800">
                  <p className="text-[10px] uppercase font-bold text-neutral-500">Extraction</p>
                  <p className="text-xs font-semibold text-white mt-0.5">Steam Distilled</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-500">CAS Registry</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{product.casNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO & ACTION PANEL */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Category Subtitle */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4a373]/10 text-[#d4a373] border border-[#d4a373]/20">
                <Sparkles className="w-3.5 h-3.5" />
                {product.category}
              </span>
              <span className="text-xs text-neutral-500 font-sans-custom">
                HSN Code: <strong className="text-neutral-300">{product.hsnCode}</strong>
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="italic text-base sm:text-lg text-neutral-400 font-serif mt-1.5">
                {product.botanicalName}
              </p>
            </div>

            {/* Short Description */}
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans-custom">
              {product.shortDescription}
            </p>

            {/* Key Metric Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
                  <Droplets className="w-3 h-3 text-[#d4a373]" />
                  <span>Purity</span>
                </div>
                <p className="text-sm font-bold text-white truncate">100% Pure</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
                  <FlaskConical className="w-3 h-3 text-[#d4a373]" />
                  <span>Process</span>
                </div>
                <p className="text-sm font-bold text-white truncate">Steam Distilled</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
                  <Package className="w-3 h-3 text-[#d4a373]" />
                  <span>Available MOQ</span>
                </div>
                <p className="text-sm font-bold text-white truncate">1 KG / 5 KG</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Standard</span>
                </div>
                <p className="text-sm font-bold text-emerald-400 truncate">Pharma Grade</p>
              </div>
            </div>

            {/* PACKAGING SELECTOR (1 KG vs 5 KG) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d4a373]" />
                  <span>Select Bulk Packaging Unit (1 KG vs 5 KG)</span>
                </label>
                <span className="text-xs text-neutral-500">Tamper-Proof Industrial Grade</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.packagingOptions.map((option) => {
                  const isSelected = selectedPackaging === option.name;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setSelectedPackaging(option.name)}
                      className={`text-left p-4 rounded-2xl border transition-all relative cursor-pointer ${
                        isSelected
                          ? "bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/50 shadow-lg"
                          : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{option.size}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#d4a373] text-black flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#d4a373]">{option.name}</p>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800/80">
              <button
                onClick={() => {
                  if (!user) {
                    openAuth('signin');
                  } else {
                    window.location.hash = '#customer-quotes';
                  }
                }}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#d4a373] hover:bg-[#c39262] text-black font-bold uppercase text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-[#d4a373]/10 cursor-pointer active:scale-95"
              >
                <span>Request B2B Bulk Price Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  alert(`Downloading technical specification and Certificate of Analysis (COA) for ${product.name}...`);
                }}
                className="py-4 px-6 rounded-2xl border border-neutral-700 hover:border-white bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#d4a373]" />
                <span>COA &amp; Spec Sheet</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500 font-sans-custom pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GC-MS Verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GST Tax Invoiced
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pan-India Dispatch
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          TAB NAVIGATION
      ====================================================== */}
      <section className="border-y border-neutral-800 bg-neutral-900/60 sticky top-12 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            {[
              { id: "overview", label: "Product Overview", icon: Sparkles },
              { id: "specifications", label: "Technical Specifications", icon: FlaskConical },
              { id: "applications", label: "Industrial Applications", icon: Leaf },
              { id: "packaging", label: "1KG & 5KG Packaging", icon: Package },
              { id: "certifications", label: "Quality & Certifications", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "border-[#d4a373] text-[#d4a373] bg-[#d4a373]/5"
                      : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          TAB CONTENT PANELS
      ====================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <h2 className="text-2xl font-serif font-bold text-white">Botanical Description &amp; Source</h2>
                <p className="text-neutral-300 text-sm leading-relaxed font-sans-custom">
                  {product.name} is derived from pure botanical sources of <em className="text-white">{product.botanicalName}</em> through a specialized low-temperature steam distillation protocol. Our facility guarantees the retention of all active aromatic and therapeutic monoterpenes without utilizing chemical solvents or synthetic preservatives.
                </p>
                <p className="text-neutral-300 text-sm leading-relaxed font-sans-custom">
                  Supplied strictly as a pure 100% natural B2B raw ingredient for compounding pharmacies, wellness brand manufacturers, fragrance houses, and food manufacturers requiring consistent batch-to-batch density and GC-MS certified active percentages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#d4a373]" />
                    <span>Key Active Phytochemicals</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans-custom">
                    High standardization of natural active fractions verified by automated laboratory GC-MS chromatography analysis.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#d4a373]" />
                    <span>Zero Solvent Contamination</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans-custom">
                    100% steam distilled without hexane, petroleum ethers, or additives. Suitable for pharmaceutical and clean-label foods.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Key Summary */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white">Commercial Summary</h3>
              <div className="divide-y divide-neutral-800 text-xs font-sans-custom">
                <div className="py-3 flex justify-between">
                  <span className="text-neutral-500">Grade:</span>
                  <span className="font-semibold text-white">Pharmaceutical / Food</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-neutral-500">CAS Registry:</span>
                  <span className="font-semibold text-white">{product.casNumber}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-neutral-500">Country of Origin:</span>
                  <span className="font-semibold text-white">{product.origin}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-neutral-500">HSN Code:</span>
                  <span className="font-semibold text-white">{product.hsnCode}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-neutral-500">Selected Packaging:</span>
                  <span className="font-semibold text-[#d4a373]">{selectedPackaging}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Technical Certificate of Analysis (COA) Specifications</h2>
                <p className="text-xs text-neutral-400 mt-1">Physicochemical testing parameters for quality assurance.</p>
              </div>

              <button
                onClick={() => alert(`Downloading full specification sheet for ${product.name}`)}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#d4a373] text-xs font-bold text-[#d4a373] flex items-center gap-2 w-fit cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Specification</span>
              </button>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/90 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-6">Testing Parameter</th>
                    <th className="py-4 px-6">Pharma &amp; Export Standard Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans-custom">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-neutral-300 w-1/3">{key}</td>
                      <td className="py-4 px-6 text-neutral-200">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Target Industrial &amp; Manufacturing Applications</h2>
              <p className="text-xs text-neutral-400 mt-1">Formulation-ready pure essential oil suitable across multiple B2B manufacturing sectors.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.applications.map((app, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-[#d4a373]/50 transition-all space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d4a373]/10 border border-[#d4a373]/30 text-[#d4a373] flex items-center justify-center font-bold">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">{app.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans-custom">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGING */}
        {activeTab === "packaging" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Bulk Supply Packaging Configurations (1 KG &amp; 5 KG Only)</h2>
              <p className="text-xs text-neutral-400 mt-1">Industrial hermetically-sealed containers for safe transport and prolonged active shelf life.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.packagingOptions.map((pkg, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d4a373]/10 text-[#d4a373] border border-[#d4a373]/20">
                        {pkg.type === '1kg' ? 'Laboratory & Pilot Scale' : 'Commercial Production Scale'}
                      </span>
                      <strong className="text-lg font-bold text-white">{pkg.size}</strong>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white mt-4">{pkg.name}</h3>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans-custom">{pkg.description}</p>

                    <div className="mt-6 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs text-neutral-400 font-sans-custom">
                      <div className="flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Airtight nitrogen flush upon request</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>UN-approved outer container protection</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPackaging(pkg.name);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className={`w-full py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedPackaging === pkg.name
                        ? "bg-[#d4a373] text-black border-[#d4a373]"
                        : "border-neutral-700 hover:border-white text-white bg-neutral-900"
                    }`}
                  >
                    {selectedPackaging === pkg.name ? "Selected for Quotation" : "Select this Packaging"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATIONS */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Certifications &amp; Quality Compliance</h2>
              <p className="text-xs text-neutral-400 mt-1">Quality auditing protocols adhered to in every distillation cycle.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.certifications.map((cert, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">{cert}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Verified &amp; compliant with international export standards.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =====================================================
          BOTTOM B2B CTA BANNER
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-[#d4a373]/30 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a373]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#d4a373]/20 text-[#d4a373] border border-[#d4a373]/30">
            Wholesale &amp; Export Inquiries
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white mt-4 max-w-2xl mx-auto">
            Procure Commercial Batches of {product.name}
          </h2>

          <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-3 font-sans-custom">
            Directly connect with our sales engineers for contract pricing, custom packaging specifications, or recurring supply schedules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => {
                if (!user) {
                  openAuth('signin');
                } else {
                  window.location.hash = '#customer-quotes';
                }
              }}
              className="px-8 py-3.5 rounded-full bg-[#d4a373] hover:bg-[#c39262] text-black font-bold uppercase text-xs tracking-wider transition-all shadow-xl cursor-pointer"
            >
              Request Price Quote
            </button>
            <a
              href="mailto:contact@madhavpharmaindustries.com"
              className="px-8 py-3.5 rounded-full border border-neutral-700 hover:border-white text-white font-bold uppercase text-xs tracking-wider transition-all bg-neutral-900"
            >
              Contact Sales Team
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BulkProductPage;
