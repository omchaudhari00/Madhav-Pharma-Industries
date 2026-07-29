import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, Play, Facebook, Twitter, Instagram, Handshake, Linkedin, MessageCircle, User, Send, Activity } from 'lucide-react';

export const ContactUsSection: React.FC = () => {
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
    <section id="contact" className="w-full bg-transparent text-white pt-16 mt-16 border-t border-neutral-900 font-display">
      {/* Top Header Banner - Pure Solid Black, No background visuals */}
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 font-display">
          Contact Us
        </h2>
      </div>

      {/* Main Grid: Left Contact Form + Right Info & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20 lg:mb-28">
        {/* Left Column: Get In Touch Form Container */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-display">
            Get In Touch
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans-custom">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="Your Name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="example@yourmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Title..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Type Here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 border border-neutral-700 hover:border-white text-white rounded-full py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 font-display bg-neutral-900 hover:bg-neutral-800"
            >
              Send Now
            </button>
          </form>
        </div>

        {/* Right Column: Description + Contact Details Grid + Map */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-neutral-300 text-sm leading-relaxed mb-8 font-sans-custom">
              In tempus nisl turpis, at ultricies dui eleifend a. Quisque et quam vel
              nunc consectetur pharetra euismod et elit. Morbi nibh tortor,
              ullamcorper id purus eu, rhoncus consequat velit.
            </p>

            {/* 2x2 Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 font-sans-custom">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-display">Phone Number</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">+6282 4032 567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-display">Email Address</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Example@Email.Com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-display">Whatsapp</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">082-245-7253</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-display">Our Office</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">2443 Oak Ridge Omaha, QA 45065</p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
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

      {/* Banner: Ready to Source Premium Essential Oils? */}
      <div className="my-16 sm:my-24 py-12 px-6 sm:px-12 rounded-3xl bg-neutral-950 border border-neutral-800 text-center relative overflow-hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-full text-white inline-flex items-center justify-center">
            <Handshake className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 max-w-3xl mx-auto leading-tight font-display">
          Ready to Source Premium Essential Oils?
        </h3>
        <div>
          <button className="px-8 py-3.5 rounded-full bg-white text-black font-bold uppercase text-xs sm:text-sm tracking-wider hover:bg-neutral-200 transition-colors duration-300 font-display">
            Request a Quote
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="pt-12 pb-8 border-t border-neutral-900 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Col 1: Brand & Description & Social */}
          <div>
            <div className="flex items-center space-x-2.5 font-bold text-lg tracking-wider text-white font-display mb-5">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <span className="font-brand text-lg text-white font-bold">Madhav Pharma</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans-custom max-w-sm mb-6">
              Leading manufacturer of Cumin Seed Oil and natural essential oils, produced through 100% steam distillation with high purity and strong aroma.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#whatsapp" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-base text-white font-display mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400 font-sans-custom">
              <li><a href="#about-us" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#about-us" className="hover:text-white transition-colors">Manufacturing</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Quality &amp; Certifications</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Applications</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Our Products */}
          <div>
            <h4 className="font-bold text-base text-white font-display mb-4">Our Products</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400 font-sans-custom">
              <li><a href="#about" className="hover:text-white transition-colors">Cumin Seed Oil</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Fennel Oil</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Ajwain Oil</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">All Essential Oils</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Downloads</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div>
            <h4 className="font-bold text-base text-white font-display mb-4">Contact Us</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-400 font-sans-custom mb-6">
              <li className="flex items-start space-x-3">
                <User className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Alpesh</div>
                  <div className="text-xs text-neutral-400">Contact Person</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="tel:9023385917" className="hover:text-white transition-colors">9023385917</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="mailto:madhavpharmaindustries@gmail.com" className="hover:text-white transition-colors break-all">madhavpharmaindustries@gmail.com</a>
              </li>
            </ul>
            <a
              href="#contact"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors duration-200 font-display"
            >
              <Send className="w-4 h-4" />
              <span>Get Your Quote</span>
            </a>
          </div>
        </div>

        {/* Copyright notice & Links */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-sans-custom gap-4">
          <div>
            © 2026 Madhav Pharma Industries. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </section>
  );
};
