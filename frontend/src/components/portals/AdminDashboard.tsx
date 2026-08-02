import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Package, FileText, Briefcase, 
  ShoppingBag, Settings as SettingsIcon, TrendingUp, 
  CheckCircle, XCircle, AlertCircle, Eye, Edit3, 
  Trash2, Plus, ArrowLeft, UserPlus, Star, DollarSign,
  RefreshCw, Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const renderStatusBadge = (status: string) => {
  let style = 'bg-white/10 border-white/20 text-neutral-200';
  if (status === 'Approved by Sales') {
    style = 'bg-blue-500/15 border-blue-500/30 text-blue-300';
  } else if (status === 'Under Negotiation') {
    style = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
  } else if (status === 'Accepted by Customer' || status === 'Delivered' || status === 'Active' || status === 'Completed') {
    style = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
  } else if (status === 'Rejected by Customer' || status === 'Deactivated') {
    style = 'bg-rose-500/15 border-rose-500/30 text-rose-300';
  } else if (status === 'Pending') {
    style = 'bg-purple-500/15 border-purple-500/30 text-purple-300';
  } else if (status === 'Shipped') {
    style = 'bg-sky-500/15 border-sky-500/30 text-sky-300';
  } else if (status === 'Processing') {
    style = 'bg-amber-500/15 border-amber-500/30 text-amber-300';
  }

  return (
    <div className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${style}`}>
      {status}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const {
    user,
    setPortal,
    toggleProductStock,
    isProductOutOfStock,
    toggleRetailStock,
    toggleB2BStock,
    toggleDiscontinued,
    isRetailOutOfStock,
    isB2BOutOfStock,
    isDiscontinued,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'customers' | 'products' | 'sales' | 'orders' | 'settings'
  >('overview');

  // Mock State for interactivity
  const [customers, setCustomers] = useState([
    { id: 101, name: 'Apex Remedies Ltd', email: 'procurement@apexremedies.com', phone: '+91 98234 11220', stage: 'Customer', ordersCount: 14, totalSpent: '₹14,50,000', status: 'Active' },
    { id: 102, name: 'Vedic Herbs Bio', email: 'sourcing@vedicherbs.in', phone: '+91 94220 55667', stage: 'Lead', ordersCount: 0, totalSpent: '₹0', status: 'Active' },
    { id: 103, name: 'CureAll Formulations', email: 'contact@cureall.co.in', phone: '+91 98980 12345', stage: 'Customer', ordersCount: 6, totalSpent: '₹6,80,000', status: 'Active' },
    { id: 104, name: 'Sanjivani Naturals', email: 'info@sanjivaninatural.com', phone: '+91 97112 33445', stage: 'Lead', ordersCount: 0, totalSpent: '₹0', status: 'Active' },
  ]);

  const [quotes, setQuotes] = useState<any[]>([]);

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
              customer: item.customer_details ? `${item.customer_details.first_name} ${item.customer_details.last_name}` : 'Enterprise Client',
              product: item.items && item.items.length > 0 ? item.items.map((i: any) => i.product_details?.name || 'Bulk Pharma API').join(', ') : 'Bulk Pharma API',
              price: item.final_price ? `₹${item.final_price}` : `₹${item.items && item.items.length > 0 ? item.items[0].requested_price : '1,500'}/KG`,
              status: item.status || 'Pending',
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              salesAgent: item.sales_agent_details ? `${item.sales_agent_details.first_name} ${item.sales_agent_details.last_name}` : 'Unassigned',
            }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch backend quotes:', e);
      }
      const localQuotes = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
      const combined = [...backendQuotes];
      localQuotes.forEach((lq: any) => {
        if (!combined.some(bq => bq.id === lq.id)) {
          combined.push({
            ...lq,
            price: lq.offeredPrice || lq.requestedPrice || '₹1,500/KG',
          });
        }
      });
      setQuotes(combined);
    };
    loadQuotes();
  }, [activeTab]);

  const [products, setProducts] = useState([
    { id: 1, codeId: 'cumin-seed-oil', name: 'Pure Cumin Seed Oil (Jeera Oil)', moq: '5 KG', price: '₹120/KG', availability: 'In Stock', active: true },
    { id: 2, codeId: 'fennel-seed-oil', name: 'Natural Fennel Seed Oil', moq: '10 KG', price: '₹85/KG', availability: 'In Stock', active: true },
    { id: 3, codeId: 'ajwain-seed-oil', name: 'Pure Ajwain Seed Oil', moq: '5 KG', price: '₹95/KG', availability: 'In Stock', active: true },
    { id: 4, codeId: 'coriander-oil', name: 'Organic Coriander Essential Oil', moq: '5 KG', price: '₹110/KG', availability: 'In Stock', active: true },
  ]);

  const [salesUsers, setSalesUsers] = useState([
    { id: 201, name: 'Vikram Sharma', email: 'sales@madhavpharma.com', phone: '+91 98100 44556', activeQuotes: 12, closedDeals: 38 },
    { id: 202, name: 'Pooja Verma', email: 'pooja.v@madhavpharma.com', phone: '+91 98111 22334', activeQuotes: 7, closedDeals: 24 },
  ]);

  const [orders, setOrders] = useState<any[]>([]);

  const handleAssignQuote = (quoteId: string, agentName: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, salesAgent: agentName, status: 'Under Negotiation' } : q));
  };

  const handleApproveQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'Approved by Sales' } : q));
  };

  const handleDeactivateCustomer = (id: number) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Deactivated' : 'Active' } : c));
  };

  const handleToggleProductStatus = (id: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        if (p.codeId) toggleProductStock(p.codeId);
        return { ...p, availability: p.availability === 'In Stock' ? 'Out of Stock' : 'In Stock' };
      }
      return p;
    }));
  };

  return (
    <div 
      className="min-h-screen text-white font-display pb-20 relative bg-cover bg-center bg-fixed selection:bg-neutral-800 selection:text-white"
      style={{ backgroundImage: "url('/scroll-frames/ezgif-frame-300.jpg')" }}
    >
      {/* Dark Luxury Overlay to match main landing page aesthetic without blur */}
      <div className="absolute inset-0 bg-neutral-950/70 pointer-events-none z-0" />
      <div className="relative z-10">
        {/* Top Banner Header */}
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
              <div className="w-9 h-9 rounded-full bg-[#d4a373]/20 border border-[#d4a373] flex items-center justify-center text-[#d4a373]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-white leading-none">
                  Madhav Pharma <span className="text-[#d4a373] font-normal font-serif">Enterprise Admin</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Administrator • Full Management Control
                </p>
              </div>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
              ADMIN ROLE
            </span>
            <span className="text-sm text-neutral-300 hidden md:block">
              {user?.email || 'admin@madhavpharma.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'quotes', label: 'Quotes & Pricing', icon: FileText, badge: '3' },
            { id: 'customers', label: 'Customers & Leads', icon: Users, badge: '4' },
            { id: 'products', label: 'Products (MOQ & Stock)', icon: Package },
            { id: 'sales', label: 'Sales Team', icon: Briefcase },
            { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag },
            { id: 'settings', label: 'Company & GST Settings', icon: SettingsIcon },
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
                {tab.badge && (
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

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Unified Enterprise System Status Panel (Everything in One Box, All Numbers Zero) */}
            <div className="p-8 rounded-3xl bg-neutral-900/70 border border-white/15 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <span>Enterprise System Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold">LIVE TELEMETRY</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">Real-time operational overview and metrics across Madhav Pharma divisions</p>
                </div>
                <div className="text-right text-xs text-neutral-400">
                  <span className="block font-mono text-neutral-300">System Status: Optimal</span>
                  <span className="text-[#d4a373] font-bold">0 Active Alerts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#d4a373]" />
                  </div>
                  <div className="text-3xl font-serif font-extrabold text-white">₹0</div>
                  <p className="text-xs text-neutral-400 mt-1">
                    0.0% change • 0 transactions
                  </p>
                </div>

                <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Leads vs Customers</span>
                    <Users className="w-4 h-4 text-[#d4a373]" />
                  </div>
                  <div className="text-3xl font-serif font-extrabold text-white">
                    0 <span className="text-sm text-neutral-400 font-sans">Leads</span> / 0 <span className="text-sm text-[#d4a373] font-sans">Customers</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    0% conversion rate
                  </p>
                </div>

                <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pending Quotes</span>
                    <FileText className="w-4 h-4 text-[#d4a373]" />
                  </div>
                  <div className="text-3xl font-serif font-extrabold text-white">0</div>
                  <p className="text-xs text-neutral-400 mt-1">
                    0 require sales agent assignment
                  </p>
                </div>

                <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                  </div>
                  <div className="text-3xl font-serif font-extrabold text-white">0</div>
                  <p className="text-xs text-neutral-400 mt-1">
                    0 in processing • 0 shipped
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Activity Table */}
            <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl">
              <h3 className="text-xl font-serif font-bold text-white mb-6">Recent Quotation Requests & Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Quote ID</th>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Product & Qty</th>
                      <th className="py-3 px-4">Requested Price</th>
                      <th className="py-3 px-4">Assigned Sales Rep</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#d4a373]">{q.id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{q.customer}</td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-extrabold tracking-wide uppercase whitespace-nowrap shadow-sm ${
                            q.customer === 'Vedic Herbs Bio' || q.customer === 'Sanjivani Naturals'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {q.customer === 'Vedic Herbs Bio' || q.customer === 'Sanjivani Naturals' ? 'Lead' : 'Customer'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-neutral-300">{q.product} ({q.quantity})</td>
                        <td className="py-4 px-4 text-white font-mono">{q.requestedPrice}</td>
                        <td className="py-4 px-4 text-neutral-300">{q.salesAgent}</td>
                        <td className="py-4 px-4">
                          {renderStatusBadge(q.status)}
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleApproveQuote(q.id)}
                            className="px-3 py-1 rounded-lg bg-[#d4a373]/20 hover:bg-[#d4a373] text-[#d4a373] hover:text-neutral-950 border border-[#d4a373]/40 text-xs font-bold uppercase transition-all"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QUOTES MANAGEMENT */}
        {activeTab === 'quotes' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">All Quotations (Admin Control)</h3>
                <p className="text-sm text-neutral-400 mt-1">Assign quotes to sales agents, approve target prices, or expire quotations.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Quote Number</th>
                    <th className="py-3 px-4">Customer / Lead</th>
                    <th className="py-3 px-4">Product & Volume</th>
                    <th className="py-3 px-4">Requested Price</th>
                    <th className="py-3 px-4">Sales Agent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#d4a373]">{q.id}</td>
                      <td className="py-4 px-4 font-semibold text-white">{q.customer}</td>
                      <td className="py-4 px-4 text-neutral-300">{q.product} • {q.quantity}</td>
                      <td className="py-4 px-4 font-mono text-white">{q.requestedPrice}</td>
                      <td className="py-4 px-4">
                        <select
                          value={q.salesAgent}
                          onChange={(e) => handleAssignQuote(q.id, e.target.value)}
                          className="bg-neutral-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#d4a373]"
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="Vikram Sharma">Vikram Sharma</option>
                          <option value="Pooja Verma">Pooja Verma</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        {renderStatusBadge(q.status)}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <button 
                          onClick={() => handleApproveQuote(q.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-neutral-950 border border-emerald-500/40 text-xs font-bold uppercase transition-all"
                        >
                          Approve
                        </button>
                        <button className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Edit Quote">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white" title="Delete Quote">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CUSTOMERS & LEADS */}
        {activeTab === 'customers' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Customer & Lead Directory</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  New users start as <span className="text-amber-300 font-bold">LEAD</span> and automatically upgrade to <span className="text-emerald-400 font-bold">CUSTOMER</span> after their first completed order.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Stage Badge</th>
                    <th className="py-3 px-4">Orders Placed</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Admin Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-neutral-400">#{c.id}</td>
                      <td className="py-4 px-4 font-bold text-white">{c.name}</td>
                      <td className="py-4 px-4">
                        <div className="text-neutral-200">{c.email}</div>
                        <div className="text-xs text-neutral-400">{c.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-extrabold uppercase tracking-wide whitespace-nowrap shadow-sm ${
                          c.stage === 'Lead'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {c.stage}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-white">{c.ordersCount} orders</td>
                      <td className="py-4 px-4 font-bold text-[#d4a373]">{c.totalSpent}</td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                          c.status === 'Active' ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-red-400 bg-red-500/15 border-red-500/30'
                        }`}>
                          {c.status}
                        </div>
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <button 
                          onClick={() => handleDeactivateCustomer(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                        >
                          {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Reset Password">
                          <Lock className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Product Catalog & MOQ Management</h3>
                <p className="text-sm text-neutral-400 mt-1">Admin has full control to add/edit products, MOQ, upload certificates, and toggle availability.</p>
              </div>
              <button className="px-4 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">MOQ</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Retail Stock</th>
                    <th className="py-3 px-4">B2B Bulk Stock</th>
                    <th className="py-3 px-4">Display Status</th>
                    <th className="py-3 px-4">Granular Inventory Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {products.map((p) => {
                    const retailOos = isRetailOutOfStock(p.codeId);
                    const b2bOos = isB2BOutOfStock(p.codeId);
                    const discontinued = isDiscontinued(p.codeId);

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-mono text-neutral-400">#{p.id}</td>
                        <td className="py-4 px-4 font-bold text-white">{p.name}</td>
                        <td className="py-4 px-4 font-mono text-amber-200">{p.moq}</td>
                        <td className="py-4 px-4 font-mono text-white">{p.price}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                            retailOos
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {retailOos ? 'Out of Stock (Retail)' : 'In Stock (50ml)'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                            b2bOos
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {b2bOos ? 'Out of Stock (B2B)' : 'In Stock (Bulk)'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                            discontinued
                              ? 'bg-neutral-800 text-neutral-400 border-neutral-600'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}>
                            {discontinued ? 'Discontinued (Hidden)' : 'Active (Visible)'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => toggleRetailStock(p.codeId)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                retailOos
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {retailOos ? 'Restore Retail' : 'OOS Retail'}
                            </button>
                            <button
                              onClick={() => toggleB2BStock(p.codeId)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                b2bOos
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {b2bOos ? 'Restore B2B' : 'OOS B2B'}
                            </button>
                            <button
                              onClick={() => toggleDiscontinued(p.codeId)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                discontinued
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-400 border-white/10 hover:bg-neutral-700 hover:text-white'
                              }`}
                            >
                              {discontinued ? 'Restore Display' : 'Discontinue'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: SALES TEAM MANAGEMENT */}
        {activeTab === 'sales' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Sales Team & Assignees</h3>
                <p className="text-sm text-neutral-400 mt-1">Create sales users, assign them to leads/quotes, or reset their credentials.</p>
              </div>
              <button className="px-4 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <UserPlus className="w-4 h-4" />
                <span>Create Sales User</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salesUsers.map(s => (
                <div key={s.id} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{s.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{s.email} • {s.phone}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
                      <span className="text-amber-300">{s.activeQuotes} Active Quotes</span>
                      <span className="text-emerald-400">{s.closedDeals} Deals Closed</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                      Assign Customers
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-300">
                      Revoke Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Orders & Invoice Management</h3>
              <p className="text-sm text-neutral-400 mt-1">Admin can view all orders, update shipping status, view payments, and generate tax invoices.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Invoice Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#d4a373]">{ord.id}</td>
                      <td className="py-4 px-4 font-semibold text-white">{ord.customer}</td>
                      <td className="py-4 px-4 font-mono text-white">{ord.amount}</td>
                      <td className="py-4 px-4">
                        {renderStatusBadge(ord.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                          ord.payment === 'Completed' ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                        }`}>
                          {ord.payment}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-400">{ord.date}</td>
                      <td className="py-4 px-4">
                        <button className="px-3 py-1.5 rounded-lg bg-[#d4a373]/20 hover:bg-[#d4a373] text-[#d4a373] hover:text-neutral-950 text-xs font-bold uppercase transition-all">
                          Generate Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: COMPANY SETTINGS & REVIEWS */}
        {activeTab === 'settings' && (
          <div className="p-8 rounded-3xl bg-neutral-900/30 backdrop-blur-xl border border-white/10 shadow-xl space-y-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Company, GST & Review Approvals</h3>
              <p className="text-sm text-neutral-400 mt-1">Configure Madhav Pharma enterprise settings and approve customer product reviews.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-4">
                <h4 className="text-lg font-bold text-white">Company & Bank Details</h4>
                <div className="space-y-3 text-xs text-neutral-300">
                  <div><span className="text-neutral-500 block">Legal Entity Name:</span> Madhav Pharma Industries Private Limited</div>
                  <div><span className="text-neutral-500 block">GSTIN Number:</span> 24AABCM1234F1Z9</div>
                  <div><span className="text-neutral-500 block">Registered Office:</span> Phase IV, GIDC Industrial Estate, Gujarat</div>
                  <div><span className="text-neutral-500 block">Bank Account:</span> HDFC Bank (AC: 50200012998811 • IFSC: HDFC0001234)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-4">
                <h4 className="text-lg font-bold text-white">Pending Review Approvals</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-amber-300 font-bold">5★ - Pure Cumin Oil</span>
                      <p className="text-neutral-300 mt-0.5">"Excellent aroma and GC-MS purity verified." - Apex Remedies</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">Approve</button>
                      <button className="px-2 py-1 rounded bg-red-500/20 text-red-400 font-bold">Reject</button>
                    </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
