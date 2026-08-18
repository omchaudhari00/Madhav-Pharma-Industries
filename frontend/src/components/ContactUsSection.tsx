import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, Play, Facebook, Twitter, Instagram, Handshake, Linkedin, MessageCircle, User, Send, Activity, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactUsSection: React.FC = () => {
  const { openCart } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! Your message has been sent.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <section id="contact" className="w-full max-w-7xl mx-auto bg-[#B4B3B3] xl:bg-transparent text-neutral-900 xl:text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12 rounded-none font-display">
        {/* Top Header Banner */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 xl:text-white mb-3 font-display">
            Contact Us
          </h2>
        </div>

        {/* Main Grid: Left Glassmorphism Contact Form + Right Info & Map */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-start mb-20 xl:mb-28">
          {/* Left Column: Get In Touch Glassmorphism Form Container */}
          <div className="xl:col-span-5 relative group rounded-3xl p-6 sm:p-8 bg-neutral-900/40 backdrop-blur-2xl border border-white/15 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] hover:border-emerald-500/40 transition-all duration-500 overflow-hidden">
            {/* Top Glossy Highlight Line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-display">
              Get In Touch
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans-custom">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#d4a373] focus:bg-white/10 transition-all duration-300 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="example@yourmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#d4a373] focus:bg-white/10 transition-all duration-300 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry / Order..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#d4a373] focus:bg-white/10 transition-all duration-300 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type Here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#d4a373] focus:bg-white/10 transition-all duration-300 resize-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/20 sm:bg-white/10 backdrop-blur-md border border-white/30 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] hover:bg-white hover:text-neutral-950 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Send Now
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details Grid + Map */}
          <div className="xl:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-neutral-900 xl:text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-sans-custom font-medium xl:font-normal text-center xl:text-left">
                Reach out to Madhav Pharma Industries for inquiries, wholesale orders, or product support.
              </p>

              {/* 2x2 Glassmorphism Contact Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 font-sans-custom">
                <div className="flex flex-col items-center text-center xl:flex-row xl:items-start xl:text-left space-y-2 xl:space-y-0 xl:space-x-4">
                  <div className="p-2.5 sm:p-3.5 bg-neutral-900/10 xl:bg-white/5 backdrop-blur-md border border-neutral-900/20 xl:border-white/15 rounded-2xl text-[#d4a373] shadow-sm">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 xl:text-white font-display">Phone Number</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-900 xl:text-neutral-300 mt-0.5 font-semibold xl:font-normal">+91 9023385917</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center xl:flex-row xl:items-start xl:text-left space-y-2 xl:space-y-0 xl:space-x-4">
                  <div className="p-2.5 sm:p-3.5 bg-neutral-900/10 xl:bg-white/5 backdrop-blur-md border border-neutral-900/20 xl:border-white/15 rounded-2xl text-[#d4a373] shadow-sm">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 xl:text-white font-display">Email Address</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-900 xl:text-neutral-300 mt-0.5 font-semibold xl:font-normal break-all sm:break-normal">madhavpharmaindustries@gmail.com</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center xl:flex-row xl:items-start xl:text-left space-y-2 xl:space-y-0 xl:space-x-4">
                  <div className="p-2.5 sm:p-3.5 bg-neutral-900/10 xl:bg-white/5 backdrop-blur-md border border-neutral-900/20 xl:border-white/15 rounded-2xl text-[#d4a373] shadow-sm">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 xl:text-white font-display">Whatsapp</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-900 xl:text-neutral-300 mt-0.5 font-semibold xl:font-normal">+91 9023385917</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center xl:flex-row xl:items-start xl:text-left space-y-2 xl:space-y-0 xl:space-x-4">
                  <div className="p-2.5 sm:p-3.5 bg-neutral-900/10 xl:bg-white/5 backdrop-blur-md border border-neutral-900/20 xl:border-white/15 rounded-2xl text-[#d4a373] shadow-sm">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 xl:text-white font-display">Our Facility</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-900 xl:text-neutral-300 mt-0.5 font-semibold xl:font-normal">Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map with Glass Frame */}
            <div className="w-full h-56 sm:h-64 rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/40 backdrop-blur-xl shadow-xl">
              <iframe
                title="Office Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=London%20Eye&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full filter grayscale invert opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Banner: Ready to Source Premium Essential Oils? (Glassmorphism Theme) */}
        <div className="my-16 sm:my-24 py-12 px-6 sm:px-12 rounded-3xl bg-neutral-900/40 backdrop-blur-2xl border border-white/15 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] text-center relative overflow-hidden group transition-all duration-500 hover:border-emerald-500/40">
          {/* Glossy Edge Highlight & Ambient Light Orb */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-5">
              <div className="p-3.5 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl text-[#d4a373] inline-flex items-center justify-center shadow-sm">
                <Handshake className="w-6 h-6 text-[#d4a373]" />
              </div>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 max-w-3xl mx-auto leading-tight font-display">
              Ready to Source Premium Essential Oils?
            </h3>
            <div>
              <button
                onClick={openCart}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/20 sm:bg-white/10 backdrop-blur-md border border-white/30 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] hover:bg-white hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Request a Quote
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Full-Page Glassmorphism Footer Section */}
      <footer className="relative w-full pt-16 pb-8 px-6 sm:px-12 lg:px-16 mt-0 mb-0 bg-neutral-900/30 backdrop-blur-2xl border-t border-white/15 shadow-[0_-16px_48px_0_rgba(0,0,0,0.6)] text-left font-display overflow-hidden rounded-none">
        {/* Top glossy glass edge highlight line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Ambient background glass light orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d4a373]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-12 mb-12">
          {/* Col 1: Brand & Description & Glass Social Buttons */}
          <div>
            <div className="flex items-center space-x-2.5 font-bold text-lg tracking-wider text-white font-display mb-5">
              <img 
                src="/images/madhav-pharma-logo-1.jpeg" 
                alt="Madhav Pharma Logo" 
                className="w-9 h-9 rounded-full object-cover border border-[#d4a373]/60 shadow-[0_0_15px_rgba(212,163,115,0.4)]"
              />
              <span className="font-brand text-xl text-white font-bold tracking-tight">Madhav Pharma</span>
            </div>
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
              <li><a href="#about-us" className="hover:text-[#d4a373] transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-[#d4a373] transition-colors">Our Products</a></li>
              <li><a href="#manufacturing" className="hover:text-[#d4a373] transition-colors">100% Steam Process</a></li>
              <li><a href="#certifications" className="hover:text-[#d4a373] transition-colors">Why Choose Us</a></li>
              <li><a href="#contact" className="hover:text-[#d4a373] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Our Products */}
          <div>
            <h4 className="font-bold text-base text-white font-display mb-4">
              Our Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-sans-custom">
              <li><a href="#products" className="hover:text-[#d4a373] transition-colors">Pure Cumin Seed Oil (Jeera Oil)</a></li>
              <li><a href="#products" className="hover:text-[#d4a373] transition-colors">Natural Fennel Seed Oil</a></li>
              <li><a href="#products" className="hover:text-[#d4a373] transition-colors">Pure Ajwain Seed Oil</a></li>
              <li><a href="#products" className="hover:text-[#d4a373] transition-colors">Pharma Grade Essential Oils</a></li>
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
            <span> by elite webworks</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
};
