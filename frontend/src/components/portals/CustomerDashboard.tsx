import React, { useState } from 'react';
import { 
  FileText, ShoppingBag, User, Package, ArrowLeft, 
  CheckCircle, XCircle, RefreshCw, Award, Clock, 
  ExternalLink, Download, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerDashboard: React.FC = () => {
  const { user, setPortal, openCart } = useApp();
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders' | 'products' | 'profile'>('quotes');

  const stage = user?.customer_stage || 'Lead';
  const isCustomer = stage === 'Customer';

  const [myQuotes, setMyQuotes] = useState([
    { 
      id: 'QT-8821', 
      product: 'Pure Cumin Seed Oil (Jeera Oil)', 
      quantity: '25 KG', 
      requestedPrice: '₹115/KG', 
      offeredPrice: '₹118/KG',
      status: 'Approved by Sales', 
      date: 'Today, 10:15 AM',
      salesAgent: 'Vikram Sharma',
      notes: 'Express steam-distilled pharma batch 2026-A1'
    },
    { 
      id: 'QT-8815', 
      product: 'Natural Fennel Essential Oil', 
      quantity: '10 KG', 
      requestedPrice: '₹85/KG', 
      offeredPrice: '₹85/KG',
      status: 'Accepted by Customer', 
      date: '24 Jul 2026',
      salesAgent: 'Vikram Sharma',
      notes: 'Accepted rate. Ready for invoice & shipping.'
    },
    { 
      id: 'QT-8812', 
      product: 'Pure Ajwain Seed Oil', 
      quantity: '15 KG', 
      requestedPrice: '₹90/KG', 
      offeredPrice: '₹95/KG',
      status: 'Under Negotiation', 
      date: '20 Jul 2026',
      salesAgent: 'Pooja Verma',
      notes: 'Counter offer sent by sales agent.'
    }
  ]);

  const [orders] = useState(
    isCustomer ? [
      { id: 'ORD-9901', product: 'Natural Fennel Essential Oil (100 KG)', amount: '₹8,50,000', status: 'Delivered', date: '12 Jun 2026', invoiceUrl: '#' },
      { id: 'ORD-9880', product: 'Pure Cumin Seed Oil (50 KG)', amount: '₹6,00,000', status: 'Delivered', date: '04 May 2026', invoiceUrl: '#' },
    ] : []
  );

  const handleQuoteAction = (quoteId: string, action: 'accept' | 'reject' | 'revision') => {
    setMyQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        let newStatus = q.status;
        if (action === 'accept') newStatus = 'Accepted by Customer';
        else if (action === 'reject') newStatus = 'Rejected by Customer';
        else if (action === 'revision') newStatus = 'Under Negotiation';
        return { ...q, status: newStatus };
      }
      return q;
    }));
  };

  return (
    <div 
      className="min-h-screen text-white font-display pb-20 relative bg-cover bg-center bg-fixed selection:bg-neutral-800 selection:text-white"
      style={{ backgroundImage: "url('/scroll-frames/ezgif-frame-300.jpg')" }}
    >
      {/* Dark Luxury Glassmorphism Overlay to match main landing page aesthetic */}
      <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md pointer-events-none z-0" />
      <div className="relative z-10">
        {/* Customer Header */}
      <div className="border-b border-white/10 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPortal('storefront')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#d4a373]/20 border border-[#d4a373] flex items-center justify-center text-[#d4a373]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-white leading-none">
                  Madhav Pharma <span className="text-[#d4a373] font-normal font-serif">Buyer Portal</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Welcome, {user?.first_name || 'Valued Buyer'} • {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Luxury Stage Badge */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
              isCustomer 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCustomer ? 'VERIFIED ENTERPRISE CUSTOMER' : 'LEAD PROSPECT'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lead Stage Notice Banner */}
      {!isCustomer && (
        <div className="bg-gradient-to-r from-amber-500/10 via-[#d4a373]/15 to-neutral-900 border-b border-amber-500/30 py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#d4a373]" />
              <span>
                <strong>Your Account Status is LEAD:</strong> Once your first order is confirmed and delivered, your profile automatically promotes to <strong>VERIFIED CUSTOMER</strong> with VIP contract pricing.
              </span>
            </div>
            <button 
              onClick={() => setPortal('storefront')}
              className="px-3.5 py-1.5 rounded-lg bg-[#d4a373] text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:bg-[#c29161] shrink-0"
            >
              Request New Quote
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-8">
          {[
            { id: 'quotes', label: 'My Quotation Requests', icon: FileText, badge: myQuotes.length },
            { id: 'orders', label: 'My Orders & Invoices', icon: ShoppingBag, badge: orders.length },
            { id: 'products', label: 'Pharma Products & MOQ', icon: Package },
            { id: 'profile', label: 'Company Profile & Address', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#d4a373] text-neutral-950 shadow-[0_4px_16px_rgba(212,163,115,0.3)]'
                    : 'bg-neutral-900/50 text-neutral-300 border border-white/10 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-neutral-950 text-white' : 'bg-[#d4a373]/20 text-[#d4a373]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: MY QUOTATION REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Quotation Requests & Negotiation Desk</h3>
                <p className="text-sm text-neutral-400 mt-1">Review target prices from your dedicated sales rep. Accept to proceed to order invoice.</p>
              </div>
            </div>

            <div className="space-y-4">
              {myQuotes.map((q) => (
                <div 
                  key={q.id} 
                  className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#d4a373] text-base">{q.id}</span>
                        <span className="text-xs text-neutral-400">• {q.date}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mt-1">{q.product}</h4>
                      <p className="text-sm text-neutral-300 mt-0.5">Quantity Required: <span className="font-mono text-amber-200">{q.quantity}</span></p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Requested Price: <span className="font-mono text-white">{q.requestedPrice}</span></div>
                      <div className="text-lg font-bold text-[#d4a373] mt-0.5">Offered Price: {q.offeredPrice}</div>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          q.status === 'Accepted by Customer'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : q.status === 'Approved by Sales'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {q.notes && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300">
                      <span className="text-neutral-500 font-bold uppercase mr-1">Sales Rep Note ({q.salesAgent}):</span>
                      <span>"{q.notes}"</span>
                    </div>
                  )}

                  {/* Negotiation One-Click Buttons */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-neutral-400">
                      Assigned Agent: <strong className="text-white">{q.salesAgent}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {q.status !== 'Accepted by Customer' ? (
                        <>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'accept')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept Quote</span>
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'revision')}
                            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase transition-all"
                          >
                            Request Revision
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'reject')}
                            className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs uppercase transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Quote Accepted • Order Invoice in Process</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: MY ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">My Order History & Invoices</h3>
              <p className="text-sm text-neutral-400 mt-1">
                {isCustomer 
                  ? 'View your active pharma shipments and download GST-compliant tax invoices.'
                  : 'You have 0 completed orders. Accept a quotation and place your first order to unlock Verified Customer perks!'}
              </p>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Order Number</th>
                      <th className="py-3 px-4">Product & Quantity</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Delivery Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#d4a373]">{ord.id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{ord.product}</td>
                        <td className="py-4 px-4 font-mono text-white">{ord.amount}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-400">{ord.date}</td>
                        <td className="py-4 px-4">
                          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white">No Orders Placed Yet</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  As a Lead Prospect, accept one of your approved quotations from the Negotiation Desk to create your first order.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PHARMA PRODUCTS & MOQ */}
        {activeTab === 'products' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Madhav Pharma Products & MOQ Reference</h3>
              <p className="text-sm text-neutral-400 mt-1">100% steam distilled natural essential oils with GC-MS and COA certification.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Pure Cumin Seed Oil (Jeera Oil)', moq: '5 KG', grade: 'Pharmaceutical & Food Grade' },
                { name: 'Natural Fennel Seed Oil', moq: '10 KG', grade: 'High Aroma Steam Distilled' },
                { name: 'Pure Ajwain Seed Oil', moq: '5 KG', grade: 'Therapeutic & Wellness Grade' },
                { name: 'Organic Coriander Essential Oil', moq: '5 KG', grade: 'Standardized Aroma Profile' },
              ].map((p, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{p.name}</h4>
                    <p className="text-xs text-[#d4a373] mt-1">{p.grade}</p>
                    <div className="mt-4 text-xs text-neutral-300">
                      <span className="text-neutral-500">Minimum Order Quantity (MOQ):</span>
                      <strong className="text-white block text-sm mt-0.5">{p.moq}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => setPortal('storefront')}
                    className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#d4a373] hover:text-neutral-950 text-xs font-bold uppercase transition-all"
                  >
                    Request Bulk Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: COMPANY PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">My Company & Tax Profile</h3>
              <p className="text-sm text-neutral-400 mt-1">Manage your GSTIN, company registration, and shipping addresses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-4">
                <h4 className="text-lg font-bold text-white">Account Details</h4>
                <div className="space-y-3 text-sm text-neutral-300">
                  <div><span className="text-neutral-500 block text-xs">Email Address:</span> {user?.email}</div>
                  <div><span className="text-neutral-500 block text-xs">Full Name:</span> {user?.first_name} {user?.last_name}</div>
                  <div><span className="text-neutral-500 block text-xs">Current Stage:</span> <strong className="text-[#d4a373]">{stage}</strong></div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-4">
                <h4 className="text-lg font-bold text-white">Billing & Shipping Address</h4>
                <p className="text-xs text-neutral-400">
                  Primary Delivery: Phase II, Industrial Park, Mumbai, Maharashtra 400013
                </p>
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white">
                  Edit Delivery Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
