import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, Play, Facebook, Twitter, Instagram, Handshake, Linkedin, MessageCircle, User, Send, Activity, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Footer } from './Footer';

export const ContactUsSection: React.FC = () => {
  const { openCart, openLegalModal } = useApp();
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




            {/* Embedded Google Map with Glass Frame */}
            <div className="w-full relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/40 backdrop-blur-xl shadow-xl group">
              <iframe
                title="Madhav Pharma Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.659345719875!2d72.62849037509536!3d23.395758578912853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c330022501157%3A0xf42518f88e35d748!2sMadhav%20Pharma%20industries!5e0!3m2!1sen!2sin!4v1714930355152!5m2!1sen!2sin"
                className="w-full h-full filter grayscale invert opacity-80 hover:opacity-100 transition-opacity"
              />
              {/* Overlay Link Button */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <a 
                  href="https://maps.app.goo.gl/2JGZZPks5hjxwcor7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-black text-xs font-bold font-display uppercase tracking-wider rounded-lg shadow-lg hover:bg-neutral-200 transition-colors flex items-center space-x-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
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
      <Footer />
    </>
  );
};
