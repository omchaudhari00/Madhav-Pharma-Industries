import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, Users, ShoppingBag, Bell, 
  PhoneCall, DollarSign, Send, ArrowLeft, MessageSquare,
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Truck, MapPin, PackageCheck, User, CheckCircle, ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const getIndividualItems = (q: any) => {
  if (q.items && Array.isArray(q.items) && q.items.length > 0) {
    if (q.items.length === 1 && q.items[0].name && q.items[0].name.includes(',')) {
      const names = q.items[0].name.split(',').map((p: string) => p.trim()).filter(Boolean);
      const total = parseInt(String(q.items[0].quantityKg || q.quantity || 10));
      const perItem = Math.max(1, Math.round(total / names.length));
      return names.map((name: string) => ({
        name,
        quantityKg: perItem,
        unitPrice: q.items[0].unitPrice || 1500,
        expectedPrice: q.items[0].expectedPrice,
        standardPrice: q.items[0].standardPrice
      }));
    }
    return q.items.map((i: any) => ({
      name: i.name || i.product_details?.name || i.product || 'Bulk Pharma API',
      quantityKg: i.quantityKg || i.quantity || 5,
      unitPrice: i.unitPrice || i.requested_price || 1500,
      expectedPrice: i.expectedPrice,
      standardPrice: i.standardPrice
    }));
  }
  const names = (q.product || 'Bulk Pharma API').split(',').map((p: string) => p.trim()).filter(Boolean);
  const total = parseInt(String(q.quantity)) || names.length * 5;
  const perItem = Math.max(1, Math.round(total / names.length));
  return names.map((name: string) => ({
    name,
    quantityKg: perItem,
    unitPrice: parseInt(String(q.requestedPrice)?.replace(/[^0-9]/g, '')) || 1500
  }));
};

export const SalesDashboard: React.FC = () => {
  const { user, setPortal } = useApp();
  const [activeTab, setActiveTab] = useState<'quotes' | 'retail_orders' | 'customers' | 'orders' | 'notifications'>('quotes');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const [retailFilter, setRetailFilter] = useState('Preparing in Stock');
  const [b2bFilter, setB2bFilter] = useState('Processing');
  const [retailSearch, setRetailSearch] = useState('');
  const [b2bSearch, setB2bSearch] = useState('');

  const [myQuotes, setMyQuotes] = useState<any[]>([]);
  const [retailOrders, setRetailOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadRetailOrders = () => {
      try {
        const stored = localStorage.getItem('madhav_retail_orders_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRetailOrders(parsed);
            return;
          }
        }
        const demoOrders = [
          {
            id: 'MP-RET-58192',
            date: '2026-08-03',
            customerName: 'Ananya Sharma',
            phone: '+91 98765 43210',
            email: 'ananya.sharma@example.com',
            deliveryAddress: '402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001',
            paymentMethod: 'UPI (GPay Verified)',
            paymentStatus: 'PAID',
            deliveryStatus: 'Preparing in Stock',
            totalAmount: '₹837.00',
            items: [
              { name: '100% Pure Cumin Seed Essential Oil (Jeera Oil)', sizeLabel: '50ml Bottle', quantity: 2, unitPrice: 299 },
              { name: 'Ajwain Seed Essential Oil', sizeLabel: '50ml Bottle', quantity: 1, unitPrice: 239 }
            ]
          },
          {
            id: 'MP-RET-40291',
            date: '2026-08-02',
            customerName: 'Vikramaditya Rao',
            phone: '+91 94221 88900',
            email: 'v.rao@wellnessclinic.in',
            deliveryAddress: '12/B, Green Valley Enclave, Koramangala 4th Block, Bengaluru, Karnataka - 560034',
            paymentMethod: 'Credit Card (Visa)',
            paymentStatus: 'PAID',
            deliveryStatus: 'Ready to Dispatch',
            totalAmount: '₹1,047.00',
            items: [
              { name: 'Pure Black Seed Oil (Kalonji Oil)', sizeLabel: '50ml Bottle', quantity: 3, unitPrice: 349 }
            ]
          }
        ];
        setRetailOrders(demoOrders);
        localStorage.setItem('madhav_retail_orders_list', JSON.stringify(demoOrders));
      } catch (e) {
        console.error('Error loading retail orders:', e);
      }
    };
    loadRetailOrders();
  }, []);

  const handleUpdateDeliveryStatus = (orderId: string, newStatus: string) => {
    setRetailOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, deliveryStatus: newStatus } : o);
      localStorage.setItem('madhav_retail_orders_list', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const loadQuotes = async () => {
      let backendQuotes: any[] = [];
      try {
        const res = await fetch('/api/quotations/quotations/');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            backendQuotes = data.map((item: any) => ({
              id: item.quotation_number || `QT-${item.id}`,
              rawId: item.id,
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              product: item.items && item.items.length > 0 ? item.items.map((i: any) => i.product_details?.name || 'Bulk Pharma API').join(', ') : 'Bulk Pharma API',
              quantity: item.items && item.items.length > 0 ? `${item.items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)} KG` : '100 KG',
              requestedPrice: `₹${item.items && item.items.length > 0 ? item.items[0].requested_price : '1,500'} / KG`,
              targetPrice: item.final_price ? `₹${item.final_price}` : '₹1,500',
              status: item.status || 'Pending',
              customer: item.customer_details ? `${item.customer_details.first_name} ${item.customer_details.last_name}` : 'Enterprise Client',
              customerNote: item.customer_notes || 'Quotation submitted for review',
              customerAddress: item.customer_address || '123 Pharma Estate, Ahmedabad',
              salesRemarks: '',
              phone: item.customer_details?.mobile_number || '9000000000',
              stage: item.customer_details?.customer_stage || 'Lead'
            }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch backend quotes:', e);
      }
      const localQuotes = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
      const combined = backendQuotes.map(bq => {
        const matchingLocal = localQuotes.find((lq: any) => lq.id === bq.id);
        if (matchingLocal) {
          return {
            ...bq,
            status: matchingLocal.status || bq.status,
            targetPrice: matchingLocal.offeredPrice || matchingLocal.targetPrice || bq.targetPrice,
            customerNote: matchingLocal.notes || bq.customerNote,
            salesRemarks: matchingLocal.salesRemarks || bq.salesRemarks
          };
        }
        return bq;
      });
      localQuotes.forEach((lq: any) => {
        if (!combined.some(bq => bq.id === lq.id)) {
          combined.push({
            ...lq,
            targetPrice: lq.offeredPrice || lq.requestedPrice || '₹1,500',
            customerNote: lq.notes || 'Quotation submitted for review',
            salesRemarks: lq.salesRemarks || ''
          });
        }
      });
      setMyQuotes(combined);
    };
    loadQuotes();
  }, [activeTab]);

  const [assignedCustomers, setAssignedCustomers] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);

  const handleQuoteAction = async (id: string, action: 'approve' | 'reject' | 'negotiate' | 'out_of_stock', newPrice?: string, remarks?: string) => {
    try {
      await fetch(`/api/quotations/quotations/${id}/sales_action/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, updated_price: newPrice, remarks })
      });
    } catch (e) {
      console.error(e);
    }
    const newStatus = action === 'approve' ? 'Approved by Sales' : action === 'out_of_stock' ? 'Rejected: Out of Stock' : action === 'reject' ? 'Rejected by Sales' : 'Counter Offer by Sales';
    const noteText = action === 'out_of_stock' ? (remarks || 'Product is currently out of stock. Quotation closed.') : (remarks || '');
    const existing = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
    const updated = existing.map((q: any) => q.id === id ? {
      ...q,
      status: newStatus,
      offeredPrice: newPrice ? `₹${newPrice} / KG` : q.offeredPrice,
      notes: noteText || q.notes,
      salesRemarks: noteText || q.salesRemarks
    } : q);
    localStorage.setItem('madhav_quotes', JSON.stringify(updated));

    setMyQuotes(prev => prev.map(q => q.id === id ? {
      ...q,
      targetPrice: newPrice || q.targetPrice,
      salesRemarks: noteText || q.salesRemarks,
      status: newStatus
    } : q));
    setSelectedQuote(null);
  };

  const handleUpdatePrice = (id: string, newPrice: string, remarks: string) => {
    handleQuoteAction(id, 'negotiate', newPrice, remarks);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[5rem] py-3 flex-wrap sm:flex-nowrap gap-3 flex items-center justify-between">
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
            { 
              id: 'retail_orders', 
              label: 'Retail B2C Orders & Fulfillment', 
              icon: Truck, 
              badge: retailOrders.filter(o => !['Out for Express Delivery', 'Delivered to Doorstep'].includes(o.deliveryStatus || '')).length 
            },
            { id: 'customers', label: 'Assigned Customers & Leads', icon: Users, badge: assignedCustomers.length },
            { id: 'orders', label: 'B2B Bulk Orders', icon: ShoppingBag },
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
                      <div className="mt-1 space-y-1">
                        {getIndividualItems(q).map((item: any, idx: number) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between gap-1 text-xs text-neutral-300 py-0.5 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span className="font-mono font-bold text-amber-200">{item.quantityKg} kg</span>
                              <span className="text-neutral-400">of</span>
                              <span className="font-semibold text-white">{item.name}</span>
                            </div>
                            {item.expectedPrice && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                Exp: {item.expectedPrice}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
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
                    <span className="text-neutral-400 text-xs block mb-1.5">Products & Volume:</span>
                    <div className="space-y-1">
                      {getIndividualItems(selectedQuote).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          <span className="font-mono font-bold text-amber-200">{item.quantityKg} kg</span>
                          <span className="text-neutral-400">of</span>
                          <span className="font-semibold text-white">{item.name}</span>
                        </div>
                      ))}
                    </div>
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

                  {selectedQuote.status === 'Rejected by Customer' && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200">
                      <strong className="text-red-400 block mb-1">Customer Rejected Previous Offer</strong>
                      You can submit a new counter-offer price below to reopen negotiations, or reject/close the deal.
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => handleQuoteAction(selectedQuote.id, 'approve')}
                      className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
                    >
                      Approve Deal
                    </button>
                    <button 
                      type="submit"
                      className="py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
                    >
                      Send Offer
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuoteAction(selectedQuote.id, 'out_of_stock')}
                      className="py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
                    >
                      No Stock (Turn Off)
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuoteAction(selectedQuote.id, 'reject')}
                      className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
                    >
                      Reject Deal
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: RETAIL B2C ORDERS & FULFILLMENT DESK */}
        {activeTab === 'retail_orders' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <Truck className="w-7 h-7 text-[#d4a373]" />
                  <span>Retail B2C Orders &amp; Fulfillment Desk</span>
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Manage Express Courier dispatches, verify customer delivery addresses, and update live tracking status for 50ml retail bottle orders.
                </p>
              </div>
              <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search ID, Name, Phone, Email..."
                  value={retailSearch}
                  onChange={(e) => setRetailSearch(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4a373] w-full xl:w-64 shadow-inner"
                />
                <div className="flex items-center gap-2 w-full xl:w-auto">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">Filter:</span>
                  <select
                    value={retailFilter}
                    onChange={(e) => setRetailFilter(e.target.value)}
                    className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#d4a373] cursor-pointer shadow-inner appearance-none"
                  >
                    <option value="All">All Orders</option>
                    <option value="Preparing in Stock">Just Received (Preparing)</option>
                    <option value="Packed & Purity Verified">Packed & Purity Verified</option>
                    <option value="Ready to Dispatch">Ready to Dispatch</option>
                    <option value="Out for Express Delivery">Out for Express Delivery</option>
                    <option value="Delivered to Doorstep">Delivered to Doorstep</option>
                  </select>
                </div>
                {/* 
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider shrink-0 w-fit">
                  {retailOrders.length} Active Dispatches
                </span> 
                */}
              </div>
            </div>

            <div className="space-y-6">
              {retailOrders
                .filter(o => {
                  const matchFilter = retailFilter === 'All' ? true : (o.deliveryStatus || 'Preparing in Stock') === retailFilter;
                  const search = retailSearch.toLowerCase();
                  const matchSearch = search === '' || 
                    (o.id && o.id.toLowerCase().includes(search)) ||
                    (o.customerName && o.customerName.toLowerCase().includes(search)) ||
                    (o.phone && o.phone.toLowerCase().includes(search)) ||
                    (o.email && o.email.toLowerCase().includes(search));
                  return matchFilter && matchSearch;
                }).length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  No retail orders found. Orders placed via checkout will appear here.
                </div>
              ) : (
                retailOrders
                  .filter(o => {
                    const matchFilter = retailFilter === 'All' ? true : (o.deliveryStatus || 'Preparing in Stock') === retailFilter;
                    const search = retailSearch.toLowerCase();
                    const matchSearch = search === '' || 
                      (o.id && o.id.toLowerCase().includes(search)) ||
                      (o.customerName && o.customerName.toLowerCase().includes(search)) ||
                      (o.phone && o.phone.toLowerCase().includes(search)) ||
                      (o.email && o.email.toLowerCase().includes(search));
                    return matchFilter && matchSearch;
                  })
                  .map((ord) => (
                  <div key={ord.id} className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-all shadow-xl space-y-6">
                    {/* Top Row: Invoice ID, Date, Payment Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-[#d4a373]/15 text-[#d4a373] border border-[#d4a373]/30 text-xs font-bold font-mono">
                          Invoice: {ord.id}
                        </span>
                        <span className="text-xs text-neutral-400">Date: {ord.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{ord.paymentStatus} • {ord.paymentMethod}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Who to Send & Where to Send & What to Send */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Customer Contact & Delivery Address Box */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#d4a373] uppercase tracking-wider">
                            <User className="w-3.5 h-3.5" />
                            <span>Who to send to</span>
                          </div>
                          <div className="text-sm font-bold text-white">{ord.customerName || 'Valued Customer'}</div>
                          <div className="text-xs text-neutral-300">{ord.phone || '+91 98765 43210'}</div>
                          <div className="text-xs text-neutral-400">{ord.email || 'customer@example.com'}</div>

                          <div className="pt-3 border-t border-white/10 mt-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Delivery Address ("Where to send")</span>
                            </div>
                            <p className="text-xs text-white font-medium leading-relaxed">
                              {ord.deliveryAddress || '402, Sunset Heights, MG Road, Mumbai, Maharashtra - 400001'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* What to Send (Items List) */}
                      <div className="lg:col-span-7 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-[#d4a373] uppercase tracking-wider flex items-center gap-2">
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>What to send on delivery (Items to pack)</span>
                          </h5>
                          <span className="text-sm font-extrabold text-white">Total: {ord.totalAmount || '₹837.00'}</span>
                        </div>

                        <div className="space-y-2">
                          {(ord.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-black/50 flex items-center justify-center text-[#d4a373] font-bold">
                                  50ml
                                </div>
                                <div>
                                  <span className="font-bold text-white block">{item.name}</span>
                                  <span className="text-neutral-400">{item.sizeLabel || '50ml Bottle'} • Pharma Grade</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-white font-bold">Qty: {item.quantity}</span>
                                <span className="block text-neutral-400">₹{(item.unitPrice || 299) * item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Logistics Delivery Status Selector */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          Update Logistics Status:
                        </span>
                        <select
                          value={ord.deliveryStatus || 'Preparing in Stock'}
                          onChange={(e) => handleUpdateDeliveryStatus(ord.id, e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-[#d4a373] cursor-pointer"
                        >
                          <option value="Preparing in Stock">Preparing in Stock</option>
                          <option value="Packed & Purity Verified">Packed &amp; Purity Verified</option>
                          <option value="Ready to Dispatch">Ready to Dispatch</option>
                          <option value="Out for Express Delivery">Out for Express Delivery</option>
                          <option value="Delivered to Doorstep">Delivered to Doorstep</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
                          Current: {ord.deliveryStatus || 'Preparing in Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: ASSIGNED CUSTOMERS & LEADS */}
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
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Track Orders & Payments</h3>
                <p className="text-sm text-neutral-400 mt-1">View active orders generated from your quotes (Sales agents cannot cancel or delete orders).</p>
              </div>
              <div className="flex flex-col xl:flex-row xl:items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search ID, Name, Phone..."
                  value={b2bSearch}
                  onChange={(e) => setB2bSearch(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-400 w-full xl:w-64 shadow-inner"
                />
                <div className="flex items-center gap-2 w-full xl:w-auto">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">Filter:</span>
                  <select
                    value={b2bFilter}
                    onChange={(e) => setB2bFilter(e.target.value)}
                    className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-neutral-900/50 border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-blue-400 cursor-pointer shadow-inner appearance-none"
                  >
                    <option value="All">All Orders</option>
                    <option value="Processing">New (Processing)</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
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
                  {salesOrders
                    .filter(o => {
                      const matchFilter = b2bFilter === 'All' ? true : (o.status || 'Processing') === b2bFilter;
                      const search = b2bSearch.toLowerCase();
                      const matchSearch = search === '' || 
                        (o.id && o.id.toLowerCase().includes(search)) ||
                        (o.customer && o.customer.toLowerCase().includes(search)) ||
                        (o.phone && o.phone.toLowerCase().includes(search)) ||
                        (o.email && o.email.toLowerCase().includes(search));
                      return matchFilter && matchSearch;
                    })
                    .map((ord) => (
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



