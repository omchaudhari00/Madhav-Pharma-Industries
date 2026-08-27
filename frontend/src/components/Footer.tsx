import React from 'react';
import { Facebook, Linkedin, Instagram, MessageCircle, User, Phone, Mail, Send, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { openCart, openLegalModal } = useApp();
  const navigate = useNavigate();

  return (
    <footer className="relative w-full pt-16 pb-8 px-6 sm:px-12 lg:px-16 mt-0 mb-0 bg-[#0a0a0a] backdrop-blur-2xl border-t border-white/15 text-left font-display overflow-hidden rounded-none">
      {/* Top glossy glass edge highlight line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Ambient background glass light orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d4a373]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-12 mb-12">
        {/* Col 1: Brand & Description & Glass Social Buttons */}
        <div>
          <a href="/#hero" className="inline-flex items-center space-x-2.5 font-bold text-lg tracking-wider text-white font-display mb-5 group">
            <img 
              src="/images/favicon-circle.png" 
              alt="Madhav Pharma Logo" 
              className="w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(212,163,115,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="font-brand text-xl text-white font-bold tracking-tight">Madhav Pharma</span>
          </a>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans-custom max-w-sm mb-6">
            Leading manufacturer of Cumin Seed Oil and natural essential oils, produced through 100% steam distillation with high purity and strong aroma.
          </p>
          <div className="flex items-center space-x-3">
            <a href="#facebook" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-[#d4a373] hover:border-[#d4a373]/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(212,163,115,0.3)] transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-[#d4a373] hover:border-[#d4a373]/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(212,163,115,0.3)] transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#instagram" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-[#d4a373] hover:border-[#d4a373]/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(212,163,115,0.3)] transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#whatsapp" aria-label="WhatsApp" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-neutral-300 hover:text-[#d4a373] hover:border-[#d4a373]/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(212,163,115,0.3)] transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-bold text-base text-white font-display mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-sans-custom">
            <li><a href="/#about-us" className="hover:text-[#d4a373] transition-colors">About Us</a></li>
            <li><button onClick={() => navigate('/products')} className="hover:text-[#d4a373] transition-colors text-left cursor-pointer">Shop All Products</button></li>
            <li><a href="/#manufacturing" className="hover:text-[#d4a373] transition-colors">100% Steam Process</a></li>
            <li><a href="/#certifications" className="hover:text-[#d4a373] transition-colors">Why Choose Us</a></li>
            <li><a href="/#contact" className="hover:text-[#d4a373] transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Col 3: Our Products */}
        <div>
          <h4 className="font-bold text-base text-white font-display mb-4">
            Our Products
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-sans-custom">
            <li><button onClick={() => navigate('/product/cumin-seed-oil-bulk')} className="hover:text-[#d4a373] transition-colors text-left cursor-pointer">Pure Cumin Seed Oil (Jeera Oil)</button></li>
            <li><button onClick={() => navigate('/product/fennel-seed-oil-bulk')} className="hover:text-[#d4a373] transition-colors text-left cursor-pointer">Natural Fennel Seed Oil</button></li>
            <li><button onClick={() => navigate('/product/ajwain-seed-oil-bulk')} className="hover:text-[#d4a373] transition-colors text-left cursor-pointer">Pure Ajwain Seed Oil</button></li>
            <li><button onClick={() => navigate('/products')} className="hover:text-[#d4a373] transition-colors text-left cursor-pointer">Pharma Grade Essential Oils</button></li>
          </ul>
        </div>

        {/* Col 4: Direct Contact */}
        <div>
          <h4 className="font-bold text-base text-white font-display mb-4">
            Direct Contact
          </h4>
          <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300 font-sans-custom mb-6">
            <li className="flex items-start space-x-3">
              <User className="w-4 h-4 text-[#d4a373] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Alpesh</div>
                <div className="text-xs text-neutral-400">Contact Person</div>
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#d4a373] flex-shrink-0" />
              <a href="tel:9023385917" className="hover:text-white transition-colors font-medium">9023385917</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#d4a373] flex-shrink-0" />
              <a href="mailto:madhavpharmaindustries@gmail.com" className="hover:text-white transition-colors break-all font-medium">madhavpharmaindustries@gmail.com</a>
            </li>
          </ul>
          <button
            onClick={openCart}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_25px_rgba(212,163,115,0.4)] font-display cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Get Instant Quote</span>
          </button>
        </div>
      </div>

      {/* Copyright notice, Elite Webworks credit & Links */}
      <div className="relative z-10 max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-sans-custom gap-4">
        <div>
          © 2026 Madhav Pharma Industries. All rights reserved.
        </div>
        <div className="flex items-center justify-center text-center">
          <span>made with </span>
          <Heart className="w-3.5 h-3.5 inline-block text-neutral-500 fill-neutral-500 mx-1.5" />
          <span> by elite community</span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => openLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-neutral-400">Privacy Policy</button>
          <button onClick={() => openLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-neutral-400">Terms of Service</button>
          <button onClick={() => openLegalModal('refund')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs text-neutral-400">Refund & Return Policy</button>
        </div>
      </div>
    </footer>
  );
};
