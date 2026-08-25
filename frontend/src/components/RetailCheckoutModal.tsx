"use client";

import React, { useState, useEffect } from 'react';
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
  User,
  Mail,
  Phone,
  Clock,
  Download,
  Check,
  Lock,
  ArrowLeft,
  Edit3,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateInvoicePDF } from '../utils/InvoiceGenerator';

export interface PaymentSuccessDetails {
  method: string;
  status: 'Paid';
  referenceId: string;
  amountINR: number;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
    cartTotalCount,
    openAuth,
    openLegalModal,
    token
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'processing' | 'paid'>('cart');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Customer form fields (pulled from user profile or fallbacks)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod] = useState<'Card'>('Card');
  const [orderId, setOrderId] = useState('');
  const [isLaunchingRazorpay, setIsLaunchingRazorpay] = useState(false);
  const [verifiedPayment, setVerifiedPayment] = useState<PaymentSuccessDetails | null>(null);

  const env = (import.meta as any).env || {};
  const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID_HERE';
  const razorpayCompanyName = env.VITE_RAZORPAY_COMPANY_NAME || 'Madhav Pharma Industries';
  const isRazorpayConfigured = razorpayKeyId && razorpayKeyId !== 'rzp_test_YOUR_KEY_ID_HERE';

  // Sync user profile data whenever modal opens or user logs in
  useEffect(() => {
    if (user) {
      setName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Ananya Sharma');
      setPhone(user.mobile_number || '9876543210');
      setEmail(user.email || 'ananya.sharma@example.com');
      setAddress(
        user.address || '402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001'
      );
    } else {
      setName('Ananya Sharma');
      setPhone('9876543210');
      setEmail('ananya.sharma@example.com');
      setAddress('402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001');
    }
  }, [user, isRetailCheckoutOpen]);

  const totalINR = retailCartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const handleProceedToCheckout = () => {
    if (retailCartItems.length === 0) {
      alert('Your retail cart is empty!');
      return;
    }
    if (!user) {
      closeRetailCheckout();
      openAuth('signin');
      return;
    }
    setStep('checkout');
  };

  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !email.trim()) {
      alert('Please fill in Name, Mobile Number, Address, and Email to complete your order.');
      return;
    }
    if (retailCartItems.length === 0) {
      alert('Your retail cart is empty!');
      return;
    }

    setIsLaunchingRazorpay(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com';
      const orderCreateRes = await fetch(`${apiUrl}/api/orders/payments/create-razorpay-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          amount: totalINR,
          items: retailCartItems.map(i => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          }))
        })
      });

      const orderCreateData = await orderCreateRes.json();
      const rzpOrderId = orderCreateData.order_id || `order_sim_${Date.now()}`;
      const rzpKey = orderCreateData.key_id || razorpayKeyId;

      if (!orderCreateData.is_simulated && isRazorpayConfigured) {
        const loaded = await loadRazorpayScript();
        setIsLaunchingRazorpay(false);

        if (loaded && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay({
            key: rzpKey,
            amount: Math.round(totalINR * 100),
            currency: 'INR',
            name: razorpayCompanyName,
            description: `Retail Order for ${name}`,
            order_id: rzpOrderId.startsWith('order_sim') ? undefined : rzpOrderId,
            handler: function (response: any) {
              handlePaymentSuccess({
                method: 'Razorpay Gateway (UPI / Card / NetBanking)',
                status: 'Paid',
                referenceId: response.razorpay_payment_id || `PAY-${Date.now()}`,
                amountINR: totalINR,
                razorpay_order_id: response.razorpay_order_id || rzpOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
            },
            prefill: {
              name: name,
              email: email,
              contact: phone
            },
            modal: {
              ondismiss: function () {
                setIsLaunchingRazorpay(false);
              }
            }
          });
          rzp.open();
          return;
        }
      }

      // Sandbox or fallback test flow
      setIsLaunchingRazorpay(false);
      handlePaymentSuccess({
        method: 'Razorpay Test Simulation',
        status: 'Paid',
        referenceId: `TEST-PAY-${Math.floor(10000 + Math.random() * 90000)}`,
        amountINR: totalINR,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
        razorpay_signature: 'simulated_signature'
      });
    } catch (err) {
      console.error("Order initiation error:", err);
      setIsLaunchingRazorpay(false);
      alert("Payment gateway connection error. Please check your connection and try again.");
    }
  };

  const handlePaymentSuccess = async (details: PaymentSuccessDetails & { razorpay_order_id?: string, razorpay_payment_id?: string, razorpay_signature?: string }) => {
    setVerifiedPayment(details);
    setStep('processing');

    const apiUrl = import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com';
    const orderPayload = {
      razorpay_order_id: details.razorpay_order_id || `order_sim_${Date.now()}`,
      razorpay_payment_id: details.razorpay_payment_id || details.referenceId,
      razorpay_signature: details.razorpay_signature || 'simulated',
      orderDetails: {
        customerName: name,
        phone: phone,
        email: email,
        deliveryAddress: address,
        totalAmount: totalINR,
        items: retailCartItems.map(i => ({
          name: i.name,
          sizeLabel: i.sizeLabel || '50ml Bottle',
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      }
    };

    let serverOrderId = `MP-RET-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const verifyRes = await fetch(`${apiUrl}/api/orders/payments/verify-razorpay-signature/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.order_id) {
          serverOrderId = verifyData.order_id;
        }
      }
    } catch (err) {
      console.error("Failed to verify & save order to backend DB:", err);
    }

    setOrderId(serverOrderId);

    const newOrder = {
      id: serverOrderId,
      date: new Date().toISOString().split('T')[0],
      customerName: name,
      phone: phone,
      email: email,
      deliveryAddress: address,
      paymentMethod: details.method,
      paymentStatus: `PAID (${details.referenceId})`,
      deliveryStatus: 'Preparing in Stock',
      totalAmount: `₹${totalINR.toLocaleString()}.00`,
      items: retailCartItems.map(i => ({
        name: i.name,
        sizeLabel: i.sizeLabel || '50ml Bottle',
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    };

    try {
      const stored = localStorage.getItem('madhav_retail_orders_list');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [newOrder, ...existing];
      localStorage.setItem('madhav_retail_orders_list', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save retail order cache:', err);
    }

    // Call Backend to Send WhatsApp Confirmation
    fetch(`${apiUrl}/api/orders/orders/confirm-payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrder)
    }).catch(e => console.error("Failed to trigger WhatsApp confirmation:", e));

    setTimeout(() => {
      setStep('paid');
    }, 1000);
  };

  const handleClose = () => {
    if (step === 'paid') {
      clearRetailCart();
    }
    setStep('cart');
    closeRetailCheckout();
  };

  const handleDownloadInvoice = () => {
    const orderDetails = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customerName: name,
      phone: phone,
      deliveryAddress: address,
      items: retailCartItems
    };
    generateInvoicePDF(orderDetails);
  };

  useEffect(() => {
    if (isRetailCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRetailCheckoutOpen]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden font-display transition-all duration-500 ${
        isRetailCheckoutOpen ? 'visible' : 'invisible pointer-events-none delay-500'
      }`} 
      data-lenis-prevent="true"
    >
      {/* Simple Backdrop Blur */}
      <div
        className={`absolute inset-0 backdrop-blur-md bg-black/40 transition-opacity duration-500 ${
          isRetailCheckoutOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 w-full lg:w-auto flex pl-0 lg:pl-10">
        {/* Modal Drawer (Full Screen on Mobile & iPad < 1024px) */}
        <div
          className={`w-full lg:w-screen lg:max-w-2xl bg-neutral-950 border-l border-neutral-800 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-full max-h-screen overflow-hidden transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRetailCheckoutOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          data-lenis-prevent="true"
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 rounded-xl shadow-md">
                {step === 'checkout' ? (
                  <Lock className="w-5 h-5 font-bold" />
                ) : (
                  <ShoppingBag className="w-5 h-5 font-bold" />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                  {step === 'paid'
                    ? 'Invoice Paid & Status'
                    : step === 'checkout'
                      ? 'Secure Amazon-Style Checkout'
                      // : '50ml Retail Cart'}
                      : 'Your Cart'}
                </h2>
                <p className="text-xs text-[#d4a373] font-medium">
                  {step === 'paid'
                    ? `Order ID: #${orderId}`
                    : step === 'checkout'
                      ? '100% Guaranteed Steam Distilled Purity • Verified Delivery'
                      : '100% Pure Essential Oils • Fixed Price Store'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Cart</span>
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Cart Switcher Tabs (Commented out for now as per owner discussion)
          {step === 'cart' && (
            <div className="flex items-center p-1 bg-neutral-900 border-b border-neutral-800 text-xs font-bold shrink-0">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg bg-[#d4a373] text-black font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>50ml Retail Cart ({retailCartItems.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  closeRetailCheckout();
                  openCart();
                }}
                className="flex-1 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>B2B Quote Cart ({cartTotalCount})</span>
              </button>
            </div>
          )}
          */}


          {/* Body Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-5 sm:p-6 space-y-6" data-lenis-prevent="true">
            {step === 'processing' ? (
              /* Step: Processing Payment */
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
              /* Step: Paid Invoice & Live Delivery Status */
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
                    Your invoice of <span className="font-bold">₹{totalINR}.00</span> has been paid via{' '}
                    <span className="font-bold uppercase">{verifiedPayment?.method || paymentMethod}</span>.
                    {verifiedPayment?.referenceId && (
                      <span className="block mt-1 text-[11px] text-emerald-400 font-mono">
                        Ref / UTR: <strong>{verifiedPayment.referenceId}</strong>
                      </span>
                    )}
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

                {/* Invoice Summary Card */}
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
            ) : step === 'checkout' ? (
              /* Step 2: Amazon-Style Checkout Details Page */
              <form onSubmit={handlePayInvoice} className="space-y-6">
                {/* 1. Delivering to Card (Amazon Style Address & Contact Section) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h3 className="text-xs sm:text-sm uppercase font-bold text-[#d4a373] tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#d4a373]" />
                      <span>1. Delivering to {name}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingAddress ? 'Done Editing' : 'Change / Edit'}</span>
                    </button>
                  </div>

                  {!isEditingAddress ? (
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-neutral-500 text-xs block">Full Name:</span>
                          <strong className="text-white text-sm">{name}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-xs block">Mobile Number:</span>
                          <strong className="text-white text-sm font-mono">{phone}</strong>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-neutral-500 text-xs block">Delivery Address:</span>
                        <p className="text-white font-medium bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 mt-1">
                          {address}
                        </p>
                      </div>
                      <div className="pt-1">
                        <span className="text-neutral-500 text-xs block">Email Address:</span>
                        <span className="text-neutral-300 font-mono">{email}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-[#d4a373] focus:outline-none font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-[#d4a373] focus:outline-none resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-[#d4a373] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Select Payment Method (Amazon Style Radio Cards) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-4">
                  <h3 className="text-xs sm:text-sm uppercase font-bold text-[#d4a373] tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <CreditCard className="w-4 h-4 text-[#d4a373]" />
                    <span>2. Select Payment Method</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* Card Option - Only Option */}
                    <div
                      className={`col-span-2 p-4 rounded-2xl border bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30 shadow-lg flex items-center justify-between`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                          <CreditCard className="w-5 h-5 text-[#d4a373]" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">
                            Razorpay & Airtm Secure Checkout
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            Cards, UPI, NetBanking, Airtm & USD Escrow
                          </span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-[#d4a373] bg-[#d4a373] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neutral-950" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Review Items and Delivery (With Small Product Thumbnails) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-4">
                  <h3 className="text-xs sm:text-sm uppercase font-bold text-[#d4a373] tracking-wider flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                      <span>3. Review Items & Guaranteed Delivery (2-3 Days)</span>
                    </span>
                    <span className="text-xs text-neutral-400">
                      {retailCartItems.length} Product(s)
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {retailCartItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 gap-3"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/bulk_1l.jpg';
                            }}
                            className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                              {item.name}
                            </h4>
                            <span className="text-xs text-[#d4a373] font-medium block">
                              {item.sizeLabel} • ₹{item.unitPrice} each
                            </span>
                            <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
                              ✓ Guaranteed 100% Steam Distilled Purity
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono text-neutral-400 block">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-base font-extrabold text-white">
                            ₹{(item.quantity * item.unitPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amazon Style Order Summary & Submit Button */}
                <div className="p-6 rounded-3xl bg-neutral-900/80 border border-amber-500/30 space-y-4 shadow-xl">
                  <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Items ({retailCartItems.length}):</span>
                      <span className="font-mono text-white">₹{totalINR}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Express Insured Delivery:</span>
                      <span className="text-emerald-400 font-bold uppercase">FREE</span>
                    </div>
                    <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-white">Order Total Payable:</span>
                      <span className="text-2xl font-serif font-extrabold text-[#d4a373]">
                        ₹{totalINR}.00
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLaunchingRazorpay}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4a373] via-[#e6bc92] to-[#c29161] hover:opacity-95 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(212,163,115,0.4)] cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{isLaunchingRazorpay ? 'OPENING SECURE GATEWAY...' : `PLACE YOUR ORDER AND PAY (₹${totalINR}.00)`}</span>
                  </button>

                  <p className="text-[11px] text-center text-neutral-400">
                    By placing your order, you agree to Madhav Pharma's{' '}
                    <button type="button" onClick={() => openLegalModal('terms')} className="text-[#d4a373] underline hover:text-[#e6bc92] bg-transparent border-0 p-0 text-[11px] cursor-pointer">Terms of Service</button>
                    {', '}
                    <button type="button" onClick={() => openLegalModal('privacy')} className="text-[#d4a373] underline hover:text-[#e6bc92] bg-transparent border-0 p-0 text-[11px] cursor-pointer">Privacy Policy</button>
                    {' and '}
                    <button type="button" onClick={() => openLegalModal('refund')} className="text-[#d4a373] underline hover:text-[#e6bc92] bg-transparent border-0 p-0 text-[11px] cursor-pointer">Refund & Return Policy</button>.
                  </p>
                </div>
              </form>
            ) : (
              /* Step 1: Retail Cart ('cart' view) - Exactly Like B2B Quote Cart */
              <div className="space-y-4">
                {retailCartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-4 stroke-1" />
                    <p className="text-neutral-300 font-medium text-sm mb-1">
                      Your retail cart is empty
                    </p>
                    <p className="text-neutral-500 text-xs mb-6">
                      Add 50ml botanical oil bottles to proceed to instant checkout.
                    </p>
                    <button
                      onClick={() => {
                        handleClose();
                        setTimeout(() => {
                          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <>
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
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/bulk_1l.jpg';
                              }}
                              className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">
                                {item.name}
                              </h4>
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
                                onClick={() =>
                                  updateRetailQuantity(item.id, Math.max(1, item.quantity - 1))
                                }
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

                    {/* Cart Footer Bar */}
                    <div className="p-6 border-t border-neutral-800 bg-neutral-900/30 rounded-3xl mt-6">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-neutral-400">Total Bottles</span>
                        <span className="font-bold text-white">
                          {retailCartItems.reduce((sum, item) => sum + item.quantity, 0)} bottle(s)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-base mb-6">
                        <span className="text-neutral-300 font-medium">Estimated Pricing</span>
                        <span className="font-extrabold text-white text-lg">
                          ₹{totalINR}.00
                        </span>
                      </div>

                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4a373] via-[#e6bc92] to-[#c29161] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                      >
                        <span>PROCEED TO CHECKOUT</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>ISO 9001:2015 &amp; GMP Certified Quality</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals are handled directly now */}
    </div>
  );
};

