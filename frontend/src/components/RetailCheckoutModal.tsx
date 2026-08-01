"use client";

import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  CreditCard,
  Smartphone,
  User,
  Mail,
  Phone,
  Clock,
  Download,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RetailCheckoutModal: React.FC = () => {
  const {
    isRetailCheckoutOpen,
    closeRetailCheckout,
    retailCartItems,
    updateRetailQuantity,
    removeFromRetailCart,
    clearRetailCart,
    user,
    openCart,
    cartTotalCount
  } = useApp();

  const [step, setStep] = useState<'checkout' | 'processing' | 'paid'>('checkout');

  // Customer form fields
  const [name, setName] = useState(
    user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Ananya Sharma'
  );
  const [phone, setPhone] = useState(user?.mobile_number || '9876543210');
  const [email, setEmail] = useState(user?.email || 'ananya.sharma@example.com');
  const [address, setAddress] = useState(
    '402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001'
  );
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [orderId, setOrderId] = useState('');

  if (!isRetailCheckoutOpen) return null;

  const totalINR = retailCartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !email.trim()) {
      alert('Please fill in Name, Mobile Number, Address, and Email to complete your order.');
      return;
    }
    if (retailCartItems.length === 0) {
      alert('Your retail cart is empty!');
      return;
    }

    const generatedId = `MP-RET-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(generatedId);
    setStep('processing');

    setTimeout(() => {
      setStep('paid');
    }, 1500);
  };

  const handleClose = () => {
    if (step === 'paid') {
      clearRetailCart();
      setStep('checkout');
    }
    closeRetailCheckout();
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading Tax Invoice (${orderId})... All B2C GST & COA details attached!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        {/* Modal Drawer */}
        <div className="w-screen max-w-2xl bg-neutral-950 border-l border-neutral-800 text-white shadow-2xl flex flex-col justify-between h-full">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 rounded-xl shadow-md">
                <ShoppingBag className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                  {step === 'paid' ? 'Invoice Paid & Status' : 'Retail Checkout (50ml Bottles)'}
                </h2>
                <p className="text-xs text-[#d4a373] font-medium">
                  {step === 'paid'
                    ? `Order ID: #${orderId}`
                    : '100% Pure Essential Oils • Fixed Price Store'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Switcher Tabs */}
          <div className="flex items-center p-1 bg-neutral-900 border-b border-neutral-800 text-xs font-bold shrink-0">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-lg bg-[#d4a373] text-black font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>50ml Retail Cart ({retailCartItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => { closeRetailCheckout(); openCart(); }}
              className="flex-1 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>B2B Quote Cart ({cartTotalCount})</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {step === 'processing' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 border-4 border-[#d4a373] border-t-transparent rounded-full animate-spin mb-6" />
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                  Processing Invoice Payment...
                </h3>
                <p className="text-sm text-neutral-400 max-w-sm">
                  Securing payment via {paymentMethod} and allocating your 50ml therapeutic oil bottles.
                </p>
              </div>
            ) : step === 'paid' ? (
              /* Step 3: Paid Invoice & Live Delivery Status */
              <div className="space-y-6">
                {/* Success Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/40 text-center relative overflow-hidden">
                  <div className="w-14 h-14 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
                    Payment Successful & Order Confirmed!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-300 font-medium">
                    Your invoice of <span className="font-bold">₹{totalINR}</span> has been paid via{' '}
                    <span className="font-bold uppercase">{paymentMethod}</span>.
                  </p>
                </div>

                {/* Live Delivery Tracker */}
                <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="text-xs uppercase tracking-widest text-[#d4a373] font-bold">
                      Live Delivery Status
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Express Dispatch
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Order Confirmed & Invoice Paid
                        </h4>
                        <p className="text-xs text-neutral-400">
                          We have received your payment via {paymentMethod}.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/60 text-[#d4a373] flex items-center justify-center font-bold shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Bottling & QC Lab Verification
                        </h4>
                        <p className="text-xs text-neutral-400">
                          Your 50ml bottles are undergoing purity seal inspection.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 flex items-center justify-center font-bold shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-400">
                          Out for Express Courier Delivery
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Will be dispatched with air-express priority tracking.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 flex items-center justify-center font-bold shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-400">
                          Delivered to Doorstep
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Estimated delivery within 2-3 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Invoice Details
                    </span>
                    <span className="text-xs font-mono text-[#d4a373]">#{orderId}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                    <div>
                      <span className="text-neutral-500 block">Customer Name:</span>
                      <span className="font-bold text-white">{name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Mobile Number:</span>
                      <span className="font-bold text-white">{phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block">Delivery Address:</span>
                      <span className="font-bold text-white">{address}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block">Email Address:</span>
                      <span className="font-bold text-white">{email}</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-300 font-bold">Total Paid:</span>
                    <span className="text-lg font-bold text-emerald-400">₹{totalINR}.00</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadInvoice}
                    className="flex-1 py-3 px-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Invoice (PDF)</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#d4a373] to-[#c29161] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 1: Cart Items + Customer Details Form + Payment Method */
              <form onSubmit={handlePayInvoice} className="space-y-6">
                {/* Retail Cart List */}
                <div>
                  <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">
                    1. Order Summary ({retailCartItems.length} Products)
                  </h3>

                  {retailCartItems.length === 0 ? (
                    <div className="p-8 text-center bg-neutral-900/50 rounded-2xl border border-neutral-800">
                      <p className="text-sm text-neutral-400">Your retail 50ml bottle cart is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {retailCartItems.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/80 border border-white/10 gap-3"
                        >
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                              <span className="text-xs text-[#d4a373] font-medium block">
                                {item.sizeLabel} • ₹{item.unitPrice} each
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            {/* [-] 1 [+] Quantity Selector */}
                            <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-full px-2 py-1 gap-2">
                              <button
                                type="button"
                                onClick={() => updateRetailQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-white min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateRetailQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-full bg-neutral-800 hover:bg-[#d4a373] hover:text-black text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromRetailCart(item.id)}
                              className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Details Form */}
                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                  <h3 className="text-xs uppercase font-bold text-[#d4a373] tracking-wider">
                    2. Customer Details & Shipping
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-400 mb-1">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                        <textarea
                          required
                          rows={2}
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="Street Address, City, State, Pincode"
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-400 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
                  <h3 className="text-xs uppercase font-bold text-[#d4a373] tracking-wider">
                    3. Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* UPI Option */}
                    <div
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === 'UPI'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-[#d4a373]" />
                        <div>
                          <span className="text-sm font-bold text-white block">UPI Payment</span>
                          <span className="text-[11px] text-neutral-400">GPay, PhonePe, Paytm</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'UPI' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-700'
                        }`}
                      >
                        {paymentMethod === 'UPI' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                    </div>

                    {/* Card Option */}
                    <div
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === 'Card'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-[#d4a373]" />
                        <div>
                          <span className="text-sm font-bold text-white block">Credit / Debit Card</span>
                          <span className="text-[11px] text-neutral-400">Visa, MasterCard, RuPay</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'Card' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-700'
                        }`}
                      >
                        {paymentMethod === 'Card' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pay Button */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-neutral-400 font-medium">Total Amount to Pay:</span>
                    <span className="text-2xl font-serif font-extrabold text-[#d4a373]">
                      ₹{totalINR}.00
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={retailCartItems.length === 0}
                    className={`w-full py-4 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      retailCartItems.length === 0
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#d4a373] via-[#e6bc92] to-[#c29161] hover:opacity-95 text-black shadow-[0_6px_24px_rgba(212,163,115,0.4)]'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>PAY INVOICE (₹{totalINR}.00) VIA {paymentMethod}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
