import React, { useState } from 'react';
import { 
  Briefcase, FileText, Users, ShoppingBag, Bell, 
  PhoneCall, DollarSign, Send, ArrowLeft, MessageSquare,
  CheckCircle2, Clock, AlertCircle, TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalesDashboard: React.FC = () => {
  const { user, setPortal } = useApp();
  const [activeTab, setActiveTab] = useState<'quotes' | 'customers' | 'orders' | 'notifications'>('quotes');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const [myQuotes, setMyQuotes] = useState([
    { 
      id: 'QT-8821', 
      customer: 'Vedic Herbs Bio', 
      stage: 'Lead',
      product: 'Pure Cumin Seed Oil (Jeera Oil)', 
      quantity: '25 KG', 
      requestedPrice: '₹115/KG', 
      targetPrice: '₹118/KG',
      status: 'Under Negotiation', 
      customerNote: 'Need urgent shipment for Ayurvedic batch formulation.',
      salesRemarks: 'Offered ₹118/KG including express freight.',
      phone: '+91 94220 55667'
    },
    { 
      id: 'QT-8820', 
      customer: 'Apex Remedies Ltd', 
      stage: 'Customer',
      product: 'Natural Fennel Seed Oil', 
      quantity: '100 KG', 
      requestedPrice: '₹80/KG', 
      targetPrice: '₹82/KG',
      status: 'Approved by Sales', 
      customerNote: 'Standard monthly supply contract.',
      salesRemarks: 'Discounted rate approved for 100 KG moq.',
      phone: '+91 98234 11220'
    },
  ]);

  const [assignedCustomers] = useState([
    { id: 101, name: 'Apex Remedies Ltd', contactPerson: 'Mr. Alok Mehta', phone: '+91 98234 11220', stage: 'Customer', activeOrders: 2, negotiationCount: 5 },
    { id: 102, name: 'Vedic Herbs Bio', contactPerson: 'Dr. Sunita Rao', phone: '+91 94220 55667', stage: 'Lead', activeOrders: 0, negotiationCount: 1 },
  ]);

  const [salesOrders] = useState([
    { id: 'ORD-9901', customer: 'Apex Remedies Ltd', product: 'Natural Fennel Seed Oil (100 KG)', amount: '₹3,60,000', status: 'Delivered', payment: 'Completed' },
    { id: 'ORD-9903', customer: 'Apex Remedies Ltd', product: 'Pure Cumin Seed Oil (50 KG)', amount: '₹2,40,000', status: 'Processing', payment: 'Pending' },
  ]);

  const handleUpdatePrice = (id: string, newPrice: string, remarks: string) => {
    setMyQuotes(prev => prev.map(q => q.id === id ? {
      ...q,
      targetPrice: newPrice,
      salesRemarks: remarks,
      status: 'Approved by Sales'
    } : q));
    setSelectedQuote(null);
  };

  return (
    <div 
      className="min-h-screen text-white font-display pb-20 relative bg-cover bg-center bg-fixed selection:bg-neutral-800 selection:text-white"
      style={{ backgroundImage: "url('/scroll-frames/ezgif-frame-300.jpg')" }}
    >
      {/* Dark Luxury Overlay to match main landing page aesthetic without blur */}
      <div className="absolute inset-0 bg-neutral-950/70 pointer-events-none z-0" />
      <div className="relative z-10">
        {/* Sales Top Banner Header */}
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
              <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-white leading-none">
                  Madhav Pharma <span className="text-blue-400 font-normal font-serif">Sales Portal</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Assigned Quotes • Negotiations • Lead & Customer Outreach
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 uppercase tracking-wider">
              SALES AGENT
            </span>
            <span className="text-sm text-neutral-300 hidden md:block">
              {user?.email || 'sales@madhavpharma.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-8">
          {[
            { id: 'quotes', label: 'My Quotes & Negotiations', icon: FileText, badge: myQuotes.length },
            { id: 'customers', label: 'Assigned Customers & Leads', icon: Users, badge: assignedCustomers.length },
            { id: 'orders', label: 'Track Orders', icon: ShoppingBag },
            { id: 'notifications', label: 'Send Reminders', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-blue-500 text-neutral-950 shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                    : 'bg-neutral-900/50 text-neutral-300 border border-white/10 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-neutral-950 text-white' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: QUOTES & NEGOTIATIONS */}
        {activeTab === 'quotes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left List of Quotes */}
            <div className={`${selectedQuote ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              <h3 className="text-xl font-serif font-bold text-white mb-4">Assigned Quotations ({myQuotes.length})</h3>
              {myQuotes.map((q) => (
                <div 
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`p-6 rounded-3xl bg-neutral-900/40 backdrop-blur-xl border transition-all cursor-pointer ${
                    selectedQuote?.id === q.id ? 'border-blue-400 bg-neutral-900/70 shadow-lg' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-400 text-base">{q.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                          q.stage === 'Lead' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'
                        }`}>
                          {q.stage}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1">{q.customer}</h4>
                      <p className="text-xs text-neutral-300">{q.product} ({q.quantity})</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Requested: <span className="font-mono text-white">{q.requestedPrice}</span></div>
                      <div className="text-sm font-bold text-[#d4a373]">Offered: {q.targetPrice}</div>
                      <div className={`inline-flex items-center justify-center mt-1 px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                        q.status === 'Approved by Sales'
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                          : q.status === 'Under Negotiation'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : q.status === 'Accepted by Customer'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/10 border-white/20 text-neutral-200'
                      }`}>
                        {q.status}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                    <span className="italic">"{q.customerNote}"</span>
                    <button className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-neutral-950 font-bold transition-all">
                      Negotiate & Reply →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Negotiation Panel */}
            {selectedQuote && (
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/60 backdrop-blur-2xl border border-blue-500/40 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg font-bold text-white">Negotiate Price: {selectedQuote.id}</h4>
                  <button 
                    onClick={() => setSelectedQuote(null)}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-neutral-400 text-xs block">Customer/Lead Name:</span>
                    <span className="font-bold text-white">{selectedQuote.customer} ({selectedQuote.stage})</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">Product & Volume:</span>
                    <span className="text-neutral-200">{selectedQuote.product} • {selectedQuote.quantity}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">Customer Note:</span>
                    <p className="text-neutral-300 italic bg-white/5 p-3 rounded-xl mt-1">"{selectedQuote.customerNote}"</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const price = (form.elements.namedItem('price') as HTMLInputElement).value;
                    const remarks = (form.elements.namedItem('remarks') as HTMLTextAreaElement).value;
                    handleUpdatePrice(selectedQuote.id, price, remarks);
                  }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">Update Target Price (₹ per KG)</label>
                    <input 
                      name="price" 
                      type="text" 
                      defaultValue={selectedQuote.targetPrice} 
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white font-mono focus:border-blue-400 focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">Sales Agent Remarks</label>
                    <textarea 
                      name="remarks" 
                      rows={3} 
                      defaultValue={selectedQuote.salesRemarks} 
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white text-sm focus:border-blue-400 focus:outline-none" 
                      placeholder="Add negotiation note..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg"
                    >
                      Send Approved Quote
                    </button>
                    <a 
                      href={`tel:${selectedQuote.phone}`}
                      className="px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-neutral-950 font-bold text-xs flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call Lead</span>
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ASSIGNED CUSTOMERS & LEADS */}
        {activeTab === 'customers' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">My Assigned Customers & Leads</h3>
              <p className="text-sm text-neutral-400 mt-1">Sales agents can contact leads and track negotiation history (Cannot delete or deactivate users).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedCustomers.map((c) => (
                <div key={c.id} className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">{c.name}</h4>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                      c.stage === 'Lead' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {c.stage}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 space-y-1">
                    <div><span className="text-neutral-500">Contact:</span> {c.contactPerson}</div>
                    <div><span className="text-neutral-500">Phone:</span> {c.phone}</div>
                    <div><span className="text-neutral-500">Active Orders:</span> {c.activeOrders}</div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <a 
                      href={`tel:${c.phone}`}
                      className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call Customer</span>
                    </a>
                    <span className="text-xs text-neutral-400 font-medium">Read-Only Profile</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: ORDERS TRACKING */}
        {activeTab === 'orders' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Track Orders & Payments</h3>
              <p className="text-sm text-neutral-400 mt-1">View active orders generated from your quotes (Sales agents cannot cancel or delete orders).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Product details</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {salesOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-blue-400">{ord.id}</td>
                      <td className="py-4 px-4 font-bold text-white">{ord.customer}</td>
                      <td className="py-4 px-4 text-neutral-300">{ord.product}</td>
                      <td className="py-4 px-4 font-mono text-white">{ord.amount}</td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}>
                          {ord.status}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                          ord.payment === 'Completed' ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                        }`}>
                          {ord.payment}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Send Quote Reminders & Outreach</h3>
              <p className="text-sm text-neutral-400 mt-1">Quickly dispatch SMS or email notifications to leads when quotations are expiring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white">Quote Ready Alert</h4>
                  <p className="text-xs text-neutral-400 mt-1">Notify customer that their custom GC-MS quote is ready for download.</p>
                </div>
                <button className="mt-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-neutral-950 font-bold text-xs uppercase">
                  Send Notification
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white">Payment Reminder</h4>
                  <p className="text-xs text-neutral-400 mt-1">Send polite reminder for pending order payment completion.</p>
                </div>
                <button className="mt-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-neutral-950 font-bold text-xs uppercase">
                  Send Notification
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white">Quote Expiring Reminder</h4>
                  <p className="text-xs text-neutral-400 mt-1">Alert lead that their special discounted quote expires in 48 hours.</p>
                </div>
                <button className="mt-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-neutral-950 font-bold text-xs uppercase">
                  Send Notification
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
