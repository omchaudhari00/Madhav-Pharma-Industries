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
    allProducts,
    addProduct,
    deleteProduct,
    token,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'customers' | 'products' | 'sales' | 'orders' | 'settings'
  >('overview');

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage] = useState('/images/all-oils.png');
  const [newProductUnitPrice, setNewProductUnitPrice] = useState<number | ''>(100);
  const [newProductRetailPrice, setNewProductRetailPrice] = useState<number | ''>(279);
  const [newProductMoq, setNewProductMoq] = useState('5 KG');
  const [newProductGrade, setNewProductGrade] = useState('100% Steam Distilled • Pharmaceutical Grade');
  const [newProductAvailability, setNewProductAvailability] = useState<'In Stock' | 'Out of Stock'>('In Stock');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProd = {
      id: newId,
      name: newProductName.trim(),
      categoryTitle: newProductCategory.trim() || newProductName.split(' ')[0],
      categorySubtitle: 'Essential Oil',
      titleWhite: newProductCategory.trim() || newProductName.split(' ')[0],
      titleGold: 'Essential Oil',
      badgeText: 'NEW LAUNCH',
      specs: ['100% Pure & Natural', 'Steam Distilled', 'Essential Oil'],
      cardImage: newProductImage.trim() || '/images/all-oils.png',
      heroImage: newProductImage.trim() || '/images/all-oils.png',
      unitPrice: Number(newProductUnitPrice) || 100,
      retailPrice: Number(newProductRetailPrice) || 279,
      moq: newProductMoq.trim() || '5 KG',
      grade: newProductGrade.trim() || '100% Steam Distilled • Pharmaceutical Grade',
      availability: newProductAvailability,
    };

    addProduct(newProd);

    if (newProductAvailability === 'Out of Stock') {
      toggleRetailStock(newId);
      toggleB2BStock(newId);
    }

    alert(`Product "${newProductName}" added successfully! It is now live in Admin and Website Catalog.`);
    setIsAddProductModalOpen(false);

    setNewProductName('');
    setNewProductCategory('');
    setNewProductImage('/images/all-oils.png');
    setNewProductUnitPrice(100);
    setNewProductRetailPrice(279);
    setNewProductMoq('5 KG');
    setNewProductGrade('100% Steam Distilled • Pharmaceutical Grade');
  };

  // Empty arrays for real data
  const [customers, setCustomers] = useState<any[]>([]);

  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const loadQuotes = async () => {
      let backendQuotes: any[] = [];
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/quotations/quotations/`);
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

  const [products, setProducts] = useState<any[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    minimum_order_quantity: 5,
    availability_status: 'In Stock'
  });

  const loadProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/catalog/products/`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.map((p: any) => ({
          ...p,
          codeId: p.id.toString(),
          moq: `${p.minimum_order_quantity} KG`,
          price: `₹${p.price}`,
          availability: p.availability_status,
          active: p.is_active
        })));
      }
    } catch (e) {
      console.error('Failed to load products', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    }
  }, [activeTab, token]);

  const handleSaveProduct = async () => {
    if (!token) return;
    setProductLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/catalog/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setIsAddingProduct(false);
        setNewProduct({ name: '', description: '', price: '', minimum_order_quantity: 5, availability_status: 'In Stock' });
        loadProducts();
      }
    } catch (e) {
      console.error('Failed to add product', e);
    }
    setProductLoading(false);
  };
  const [salesUsers, setSalesUsers] = useState<any[]>([]);

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
      className="min-h-screen text-white font-display pb-20 relative selection:bg-neutral-800 selection:text-white"
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('/scroll-frames/ezgif-frame-001.jpg')", transform: 'scaleX(-1)' }} 
      />
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
                  Madhav Pharma <span className="text-[#d4a373] font-normal font-serif">Admin Portal</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Administrator Dashboard
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
                    <span>System Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold">LIVE</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">Real-time overview of orders and revenue</p>
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
              <h3 className="text-xl font-serif font-bold text-white mb-6">Recent Price Requests & New Customers</h3>
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
                            {q.customer === 'Vedic Herbs Bio' || q.customer === 'Sanjivani Naturals' ? 'New Customer' : 'Customer'}
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
                <h3 className="text-2xl font-serif font-bold text-white">All Price Requests</h3>
                <p className="text-sm text-neutral-400 mt-1">Assign requests to sales team, approve target prices, or manage offers.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Request Number</th>
                    <th className="py-3 px-4">Customer</th>
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
                <h3 className="text-2xl font-serif font-bold text-white">Customer Directory</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  New users start as <span className="text-amber-300 font-bold">NEW CUSTOMER</span> and automatically upgrade to <span className="text-emerald-400 font-bold">VERIFIED CUSTOMER</span> after their first completed order.
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
                          {c.stage === 'Lead' ? 'New Customer' : 'Customer'}
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
              <button onClick={() => setIsAddingProduct(true)} className="px-4 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {isAddingProduct && (
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-[#d4a373]/30 space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-white">Add New Product</h4>
                  <button onClick={() => setIsAddingProduct(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                  <input type="number" placeholder="Price (₹)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                  <input type="number" placeholder="MOQ (KG)" value={newProduct.minimum_order_quantity} onChange={e => setNewProduct({...newProduct, minimum_order_quantity: parseInt(e.target.value)})} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                  <select value={newProduct.availability_status} onChange={e => setNewProduct({...newProduct, availability_status: e.target.value})} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-white">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Made to Order">Made to Order</option>
                  </select>
                  <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] md:col-span-2 h-24"></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setIsAddingProduct(false)} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase text-white">Cancel</button>
                  <button onClick={handleSaveProduct} disabled={productLoading} className="px-6 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-black text-xs font-bold uppercase">
                    {productLoading ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">MOQ</th>
                    <th className="py-3 px-4">Bulk Unit Price</th>
                    <th className="py-3 px-4">Retail Stock</th>
                    <th className="py-3 px-4">B2B Bulk Stock</th>
                    <th className="py-3 px-4">Display Status</th>
                    <th className="py-3 px-4">Granular Inventory Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {allProducts.map((p, idx) => {
                    const retailOos = isRetailOutOfStock(p.id);
                    const b2bOos = isB2BOutOfStock(p.id);
                    const discontinued = isDiscontinued(p.id);

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-mono text-neutral-400 text-xs">#{idx + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.cardImage || p.heroImage}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{p.name}</div>
                              <div className="text-[11px] text-neutral-400">{p.grade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-amber-200">{p.moq || '5 KG'}</td>
                        <td className="py-4 px-4 font-mono text-white">₹{p.unitPrice}/KG</td>
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
                              onClick={() => toggleRetailStock(p.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                retailOos
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {retailOos ? 'Restore Retail' : 'OOS Retail'}
                            </button>
                            <button
                              onClick={() => toggleB2BStock(p.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                b2bOos
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-300 border-white/10 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {b2bOos ? 'Restore B2B' : 'OOS B2B'}
                            </button>
                            <button
                              onClick={() => toggleDiscontinued(p.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                                discontinued
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500 hover:text-black'
                                  : 'bg-neutral-800 text-neutral-400 border-white/10 hover:bg-neutral-700 hover:text-white'
                              }`}
                            >
                              {discontinued ? 'Restore Display' : 'Discontinue'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">Company & Bank Details</h4>
                  <button 
                    onClick={() => {
                      if (window.confirm('This will delete all test orders and price requests from local storage. Continue?')) {
                        localStorage.removeItem('madhav_retail_orders_list');
                        localStorage.removeItem('madhav_quotes');
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs font-bold uppercase transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe Test Orders
                  </button>
                </div>
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
      {/* Add Product Modal Overlay */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto font-display">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#d4a373] text-neutral-950 rounded-xl shadow-md">
                  <Plus className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white">Add New Product</h3>
                  <p className="text-xs text-neutral-400">Add essential oil product to Admin &amp; Storefront catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Peppermint Essential Oil"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peppermint"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Minimum Order Quantity (MOQ)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 KG"
                    value={newProductMoq}
                    onChange={(e) => setNewProductMoq(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    B2B Bulk Price (₹/KG) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 110"
                    value={newProductUnitPrice}
                    onChange={(e) => setNewProductUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Retail Price (₹/50ml) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 279"
                    value={newProductRetailPrice}
                    onChange={(e) => setNewProductRetailPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Product Image Asset Path or URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /images/all-oils.png or https://..."
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none font-mono"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[11px] text-neutral-400 self-center">Presets:</span>
                  {['/images/cumin-seed-oil.png', '/images/fennel-oil.jpg', '/images/ajwain-oil.png', '/images/all-oils.png'].map((img) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setNewProductImage(img)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${newProductImage === img ? 'bg-[#d4a373] text-black border-[#d4a373] font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'}`}
                    >
                      {img.split('/').pop()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Grade &amp; Purity Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Steam Distilled • Pharmaceutical Grade"
                  value={newProductGrade}
                  onChange={(e) => setNewProductGrade(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Initial Availability State
                </label>
                <select
                  value={newProductAvailability}
                  onChange={(e) => setNewProductAvailability(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:border-[#d4a373] focus:outline-none cursor-pointer"
                >
                  <option value="In Stock">In Stock (Available)</option>
                  <option value="Out of Stock">Out of Stock (OOS)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a373] to-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save &amp; Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
};




