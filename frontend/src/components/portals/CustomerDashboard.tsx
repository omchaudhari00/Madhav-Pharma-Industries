import React, { useState, useEffect } from 'react';
import { 
  FileText, ShoppingBag, User, Package, ArrowLeft, 
  CheckCircle, XCircle, RefreshCw, Award, Clock, 
  ExternalLink, Download, ShieldCheck, Sparkles, AlertCircle,
  CreditCard, Smartphone, Lock, X, MapPin, Truck, Check, ChevronDown, ChevronUp, LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/InvoiceGenerator';

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

export const CustomerDashboard: React.FC = () => {
  const { user, setPortal, openCart, token, logout, login } = useApp();
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders' | 'products' | 'profile'>('quotes');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('-');
    if (parts.length > 1 && parts[0] === 'customer') {
      setActiveTab(parts[1] as any);
    }
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    const parts = currentHash.split('-');
    if (parts[0] === 'customer' && parts[1] !== activeTab) {
      window.history.replaceState(null, '', `#${parts[0]}-${activeTab}`);
    } else if (currentHash === 'customer') {
      window.history.replaceState(null, '', `#${currentHash}-${activeTab}`);
    }
  }, [activeTab]);

  const stage = user?.customer_stage || 'Lead';
  const isCustomer = stage === 'Customer';

  const [myQuotes, setMyQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState<any | null>(null);
  const [b2bPaymentMethod, setB2bPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [isB2bProcessing, setIsB2bProcessing] = useState(false);

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addressData, setAddressData] = useState({
    address_line_1: '', city: '', state: '', postal_code: '', country: 'India', is_default: true
  });
  const [addressLoading, setAddressLoading] = useState(false);

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    mobile_number: user?.mobile_number || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mobile_number: user.mobile_number || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    setProfileError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.user) {
          login(data.user, token);
        }
        setIsEditingProfile(false);
      } else {
        setProfileError(data.error || 'Failed to save profile. Please try again.');
      }
    } catch (e) {
      setProfileError('Network error. Could not connect to server.');
    }
    setProfileLoading(false);
  };


  useEffect(() => {
    const loadQuotes = async () => {
      let backendQuotes: any[] = [];
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/quotations/quotations/`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            backendQuotes = data.map((item: any) => ({
              id: item.quotation_number || `QT-${item.id}`,
              rawId: item.id,
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              product: item.items && item.items.length > 0 ? item.items.map((i: any) => i.product_details?.name || 'Bulk Pharma API').join(', ') : 'Bulk Pharma API',
              quantity: item.items && item.items.length > 0 ? `${item.items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)} KG` : '100 KG',
              items: item.items && item.items.length > 0 ? item.items.map((i: any) => ({
                name: i.product_details?.name || 'Bulk Pharma API',
                quantityKg: i.quantity || 0,
                unitPrice: i.requested_price || 0
              })) : [{ name: 'Bulk Pharma API', quantityKg: 100, unitPrice: 1500 }],
              requestedPrice: `₹${item.items && item.items.length > 0 ? item.items[0].requested_price : '1,500'} / KG`,
              offeredPrice: item.final_price ? `₹${item.final_price} / KG` : 'Pending Sales Review',
              status: item.status || 'Pending',
              salesAgent: item.sales_agent_details ? `${item.sales_agent_details.first_name} ${item.sales_agent_details.last_name}` : 'Unassigned',
              notes: item.customer_notes || 'Quotation submitted for review',
              finalPrice: item.final_price
            }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch backend quotes:', e);
      }

      const localQuotes = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
      const normalizedLocal = localQuotes.map((lq: any) => ({
        ...lq,
        items: getIndividualItems(lq)
      }));
      const combined = [...normalizedLocal];
      backendQuotes.forEach((bq: any) => {
        if (!combined.some(lq => lq.id === bq.id)) {
          combined.push(bq);
        }
      });
      setMyQuotes(combined);
    };

    const loadOrders = async () => {
      let backendOrders: any[] = [];
      try {
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/orders/orders/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              backendOrders = data.map((o: any) => ({
                id: o.order_number,
                date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                customerName: o.customer_name || `${user?.first_name} ${user?.last_name}`,
                phone: o.customer_phone || user?.mobile_number,
                email: o.customer_email || user?.email,
                deliveryAddress: o.delivery_address || 'Standard Delivery',
                paymentMethod: 'Razorpay (Verified)',
                paymentStatus: o.payment_status || 'PAID',
                deliveryStatus: o.status || 'Preparing in Stock',
                totalAmount: `₹${Number(o.total_amount).toLocaleString()}.00`,
                product: o.items_data?.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(', ') || 'Wholesale Order',
                amount: `₹${Number(o.total_amount).toLocaleString()}.00`,
                status: o.status || 'Preparing in Stock',
                isRetail: o.order_type === 'Retail',
                items: o.items_data || []
              }));
            }
          }
        }
      } catch (e) {
        console.error('Failed to load orders from backend:', e);
      }

      if (backendOrders.length > 0) {
        setOrders(backendOrders);
      } else {
        const retailOrders = JSON.parse(localStorage.getItem('madhav_retail_orders_list') || '[]');
        const formattedRetailOrders = retailOrders.map((ro: any) => ({
          ...ro,
          product: ro.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || 'Retail Products',
          amount: ro.totalAmount,
          status: ro.deliveryStatus || 'Processing',
          isRetail: true
        }));
        setOrders(formattedRetailOrders);
      }
    };

    loadQuotes();
    loadOrders();
  }, [token, activeTab]);

  useEffect(() => {
    if (activeTab === 'profile' && token) {
      const loadAddress = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/addresses/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              const defaultAddr = data.find((a: any) => a.is_default) || data[0];
              setAddressId(defaultAddr.id);
              setAddressData({
                address_line_1: defaultAddr.address_line_1 || '',
                city: defaultAddr.city || '',
                state: defaultAddr.state || '',
                postal_code: defaultAddr.postal_code || '',
                country: defaultAddr.country || 'India',
                is_default: defaultAddr.is_default
              });
            }
          }
        } catch (e) {
          console.error('Failed to load address', e);
        }
      };
      loadAddress();
    }
  }, [activeTab, token]);

  const handleSaveAddress = async () => {
    if (!token) return;
    setAddressLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com';
      const url = addressId ? `${baseUrl}/api/accounts/addresses/${addressId}/` : `${baseUrl}/api/accounts/addresses/`;
      const method = addressId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      if (res.ok) {
        const saved = await res.json();
        setAddressId(saved.id);
        setIsEditingAddress(false);
      }
    } catch (e) {
      console.error('Failed to save address', e);
    }
    setAddressLoading(false);
  };

  const updateQuoteStatusInStorage = (id: string, newStatus: string) => {
    const existing = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
    const updated = existing.map((q: any) => q.id === id ? { ...q, status: newStatus } : q);
    localStorage.setItem('madhav_quotes', JSON.stringify(updated));
  };

  const handleQuoteAction = (quoteId: string, action: 'accept' | 'reject' | 'revision') => {
    let newStatus = 'Pending';
    setMyQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        newStatus = q.status;
        if (action === 'accept') newStatus = 'Accepted by Customer';
        else if (action === 'reject') newStatus = 'Rejected by Customer';
        else if (action === 'revision') newStatus = 'Under Negotiation';
        return { ...q, status: newStatus };
      }
      return q;
    }));
    updateQuoteStatusInStorage(quoteId, newStatus);
  };

  const handlePayAndGenerateInvoice = (quote: any) => {
    setSelectedQuoteForPayment(quote);
    setB2bPaymentMethod('UPI');
    setIsB2bProcessing(false);
  };

  const confirmB2BPayment = () => {
    if (!selectedQuoteForPayment) return;
    setIsB2bProcessing(true);
    setTimeout(() => {
      const newOrder = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        product: selectedQuoteForPayment.products || selectedQuoteForPayment.product || 'Bulk API Order',
        amount: `${selectedQuoteForPayment.offeredPrice || selectedQuoteForPayment.requestedPrice || '₹5,00,000'}`,
        status: `Paid via ${b2bPaymentMethod} • Processing`,
        date: new Date().toISOString().split('T')[0],
        invoiceUrl: '#'
      };
      setOrders(prev => [newOrder, ...prev]);
      setMyQuotes(prev => prev.map(item => item.id === selectedQuoteForPayment.id ? { ...item, status: 'Paid / Invoice Generated' } : item));
      updateQuoteStatusInStorage(selectedQuoteForPayment.id, 'Paid / Invoice Generated');
      setIsB2bProcessing(false);
      setSelectedQuoteForPayment(null);
      setActiveTab('orders');
      alert(`B2B Deal payment successful via ${b2bPaymentMethod}! Invoice ${newOrder.id} has been generated and shared with Sales & Admin teams.`);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-neutral-50 font-display selection:bg-black/10 selection:text-black">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#d4a373] flex flex-col shadow-xl z-20">
        <button 
          onClick={() => setPortal('storefront')}
          className="p-6 border-b border-black/10 flex items-center gap-3 text-left hover:bg-black/5 transition-colors cursor-pointer focus:outline-none"
          title="Return to Storefront"
        >
          <img src="/images/favicon-circle.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-black font-extrabold leading-none font-serif">Madhav Pharma</h1>
            <p className="text-xs text-neutral-800 font-bold mt-1">Customer Portal</p>
          </div>
        </button>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {[
            { id: 'quotes', label: 'Price Requests', icon: FileText, badge: myQuotes.length > 0 ? myQuotes.length.toString() : undefined },
            { id: 'orders', label: 'My Invoices & Orders', icon: ShoppingBag, badge: orders.length > 0 ? orders.length.toString() : undefined },
            { id: 'products', label: 'Products & Minimum Orders', icon: Package },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="leading-tight">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-[#d4a373] text-black' : 'bg-black text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-black/10">
            <div className="mb-4 px-2">
              <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-wider mb-1">Logged In As</p>
              <p className="text-black font-semibold truncate text-sm">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-neutral-800 truncate">{user?.email}</p>
            </div>
            <button onClick={() => setPortal('storefront')} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black/20 text-black hover:bg-black/5 text-xs font-bold uppercase transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 overflow-y-auto relative text-black bg-neutral-50">
        {/* Lead Stage Notice Banner */}
        {!isCustomer && (
          <div className="bg-amber-100 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start sm:items-center gap-3">
              <div className="p-1.5 rounded-full bg-amber-200 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                Your account is pending verification. You can browse wholesale products, but quotes require approval. <a href="#profile" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }} className="underline font-bold text-amber-900 hover:text-amber-700">Complete your profile</a> to get verified faster!
              </p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900">
               {activeTab === 'orders' && 'Invoices & Orders'}
               {activeTab === 'quotes' && 'Price Requests'}
               {activeTab === 'products' && 'Product Catalog'}
               {activeTab === 'profile' && 'Profile'}
             </h2>
             {/* Luxury Stage Badge */}
             <div className="flex items-center gap-3">
               <span className={`text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                 isCustomer 
                   ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                   : 'bg-amber-100 text-amber-700 border border-amber-200'
               }`}>
                 <Sparkles className="w-3.5 h-3.5" />
                 <span>{isCustomer ? 'VERIFIED CUSTOMER' : 'NEW CUSTOMER'}</span>
               </span>
             </div>
          </div>

        {/* Tab 1: MY QUOTATION REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Price Requests & Offers</h3>
                <p className="text-sm text-neutral-500 mt-1">Review target prices from our sales team. Accept to proceed to order invoice.</p>
              </div>
            </div>

            <div className="space-y-4">
              {myQuotes.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-neutral-200 rounded-3xl bg-white shadow-sm">
                  <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-neutral-900">No Price Requests Found</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                    You haven't submitted any bulk price requests yet. Go to Products, add items to your floating cart, and click "Request Bulk Quote" to send your request to Sales!
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-[#d4a373] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#c29161] transition-colors"
                  >
                    Browse Pharma Products
                  </button>
                </div>
              ) : (
                myQuotes.map((q) => (
                  <div 
                    key={q.id} 
                    className="p-6 sm:p-8 rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 shadow-xl space-y-4"
                  >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#d4a373] text-base">{q.id}</span>
                        <span className="text-xs text-neutral-500">• {q.date}</span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {getIndividualItems(q).map((item: any, idx: number) => (
                          <div key={idx} className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base py-1 border-b border-neutral-100 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#d4a373] shrink-0" />
                              <span className="font-mono font-bold text-amber-200">{item.quantityKg} kg</span>
                              <span className="text-neutral-500">of</span>
                              <span className="font-bold text-neutral-900">{item.name}</span>
                            </div>
                            {item.expectedPrice ? (
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Expected: {item.expectedPrice}
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-500">
                                Standard: ₹{item.unitPrice}/kg
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-neutral-500">Requested Price: <span className="font-mono text-neutral-900">{q.requestedPrice}</span></div>
                      <div className="text-lg font-bold text-[#d4a373] mt-0.5">Offered Price: {q.offeredPrice}</div>
                      <div className="mt-2">
                        <div className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${
                          q.status === 'Accepted by Customer'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : q.status === 'Approved by Sales'
                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          {q.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {q.notes && (
                    <div className="p-3 rounded-xl bg-white/5 border border-neutral-100 text-xs text-neutral-600">
                      <span className="text-neutral-500 font-bold uppercase mr-1">Sales Team Note ({q.salesAgent}):</span>
                      <span>"{q.notes}"</span>
                    </div>
                  )}

                  {/* Negotiation One-Click Buttons */}
                  <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-neutral-500">
                      Assigned Agent: <strong className="text-neutral-900">{q.salesAgent}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      {q.status === 'Pending' || q.status === 'Pending Sales Review' ? (
                        <div className="px-4 py-2 rounded-xl bg-neutral-100/80 border border-neutral-700 text-neutral-500 text-xs font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Awaiting Sales Rep Offer & Review...</span>
                        </div>
                      ) : q.status === 'Rejected: Out of Stock' ? (
                        <div className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                          🔴 Quotation Closed - Out of Stock
                        </div>
                      ) : q.status === 'Rejected by Customer' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                            Rejected by You
                          </span>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'revision')}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-700 text-neutral-700 font-bold text-xs uppercase transition-all"
                          >
                            Make Counter-Offer
                          </button>
                        </div>
                      ) : q.status === 'Approved by Sales' || q.status === 'Accepted by Customer' ? (
                        <>
                          <button 
                            onClick={() => handlePayAndGenerateInvoice(q)}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xl"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Pay Now & Generate Invoice</span>
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'revision')}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-700 text-neutral-700 font-bold text-xs uppercase transition-all"
                          >
                            Request Revision
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'reject')}
                            className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-neutral-900 font-bold text-xs uppercase transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : q.status !== 'Paid / Invoice Generated' ? (
                        <>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'accept')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept Quote</span>
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'revision')}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-700 text-neutral-700 font-bold text-xs uppercase transition-all"
                          >
                            Request Revision
                          </button>
                          <button 
                            onClick={() => handleQuoteAction(q.id, 'reject')}
                            className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-neutral-900 font-bold text-xs uppercase transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Paid • Invoice Generated</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* Tab 2: MY ORDERS & INVOICES */}
        {activeTab === 'orders' && (
          <div className="p-8 rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900">My Order History & Invoices</h3>
              <p className="text-sm text-neutral-500 mt-1">
                {isCustomer 
                  ? 'View your active shipments and download GST-compliant tax invoices.'
                  : 'You have 0 completed orders. Accept a price offer and place your first order to unlock Verified Customer perks!'}
              </p>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
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
                      <React.Fragment key={ord.id}>
                        <tr 
                          onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                          className="hover:bg-neutral-100 text-black transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {expandedOrderId === ord.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                              <span className="font-bold text-[#d4a373]">{ord.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-neutral-900">{ord.product}</td>
                          <td className="py-4 px-4 font-mono text-neutral-900">{ord.amount}</td>
                          <td className="py-4 px-4">
                            <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs font-bold whitespace-nowrap shadow-sm">
                              {ord.status}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-neutral-500">{ord.date}</td>
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => {
                                if (ord.isRetail) {
                                  generateInvoicePDF(ord);
                                } else {
                                  alert(`Downloading GST Invoice ${ord.id}...`);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-black text-neutral-900 text-xs font-bold flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === ord.id && (
                          <tr>
                            <td colSpan={6} className="p-0 border-b border-neutral-100 bg-white shadow-sm">
                              <div className="p-6">
                                <div className="p-6 rounded-3xl bg-neutral-50 text-black/80 border border-neutral-200 space-y-6">
                                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                                    <span className="text-xs uppercase tracking-widest text-[#d4a373] font-bold">
                                      Live Delivery Status
                                    </span>
                                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" /> Express Dispatch
                                    </span>
                                  </div>

                                  <div className="flex flex-col sm:flex-row justify-between gap-6 relative">
                                    {/* Progress Line (hidden on mobile, visible on sm and up) */}
                                    <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-neutral-100 z-0">
                                      <div className="h-full bg-emerald-500 w-[50%] transition-all duration-1000" />
                                    </div>

                                    {/* Step 1 */}
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-2 flex-1">
                                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shadow-md">
                                        <Check className="w-5 h-5 stroke-[3]" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Order Confirmed</h4>
                                        <p className="text-[10px] sm:text-xs text-neutral-500">Payment received</p>
                                      </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-2 flex-1">
                                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shadow-md">
                                        <Check className="w-5 h-5 stroke-[3]" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Bottling & QC</h4>
                                        <p className="text-[10px] sm:text-xs text-neutral-500">Purity seal inspection</p>
                                      </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-2 flex-1">
                                      <div className="w-10 h-10 rounded-full bg-[#d4a373]/20 border-2 border-[#d4a373] text-[#d4a373] flex items-center justify-center font-bold">
                                        <Package className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Out for Delivery</h4>
                                        <p className="text-[10px] sm:text-xs text-neutral-500">In transit with courier</p>
                                      </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-2 flex-1 opacity-50">
                                      <div className="w-10 h-10 rounded-full bg-neutral-100 border-2 border-neutral-700 text-neutral-500 flex items-center justify-center font-bold">
                                        <MapPin className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-neutral-500">Delivered</h4>
                                        <p className="text-[10px] sm:text-xs text-neutral-500">To registered address</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-neutral-200 rounded-2xl">
                <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-neutral-900">No Orders Placed Yet</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  As a New Customer, accept one of your approved price offers to create your first order.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PHARMA PRODUCTS */}
        {activeTab === 'products' && (
          <div className="p-8 rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900">Madhav Pharma Products</h3>
              <p className="text-sm text-neutral-500 mt-1">100% steam distilled natural essential oils with GC-MS and COA certification.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Pure Cumin Seed Oil (Jeera Oil)', moq: '5 KG', grade: 'Pharmaceutical & Food Grade' },
                { name: 'Natural Fennel Seed Oil', moq: '10 KG', grade: 'High Aroma Steam Distilled' },
                { name: 'Pure Ajwain Seed Oil', moq: '5 KG', grade: 'Therapeutic & Wellness Grade' },
                { name: 'Organic Coriander Essential Oil', moq: '5 KG', grade: 'Standardized Aroma Profile' },
              ].map((p, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white shadow-sm border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">{p.name}</h4>
                    <p className="text-xs text-[#d4a373] mt-1">{p.grade}</p>
                  </div>

                  <button 
                    onClick={() => setPortal('storefront')}
                    className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#d4a373] hover:text-white text-xs font-bold uppercase transition-all"
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
          <div className="p-8 rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 shadow-xl space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-neutral-900">My Profile</h3>
              <p className="text-sm text-neutral-500 mt-1">Manage your name, phone number, and shipping address.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-sm border border-neutral-200 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-neutral-900">Account Details & Address</h4>
                  {!isEditingProfile && !isEditingAddress && (
                    <button onClick={() => { setIsEditingProfile(true); setIsEditingAddress(true); }} className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-900 transition-colors">
                      Edit
                    </button>
                  )}
                </div>
                
                {(isEditingProfile || isEditingAddress) ? (
                  <div className="space-y-5 pt-2">
                    {/* Name Fields */}
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Full Name</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} placeholder="First Name" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                        <input type="text" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} placeholder="Last Name" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Phone Number (can be used to login)</label>
                      <input type="text" value={profileData.mobile_number} onChange={e => setProfileData({...profileData, mobile_number: e.target.value})} placeholder="Phone Number" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                    </div>

                    {/* Address Fields */}
                    <div className="pt-3 border-t border-neutral-200">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Billing & Shipping Address</label>
                      <div className="space-y-3">
                        <input type="text" value={addressData.address_line_1} onChange={e => setAddressData({...addressData, address_line_1: e.target.value})} placeholder="Address Line 1" className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} placeholder="City" className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                          <input type="text" value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} placeholder="State" className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" value={addressData.postal_code} onChange={e => setAddressData({...addressData, postal_code: e.target.value})} placeholder="PIN Code" className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                          <input type="text" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} placeholder="Country" className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {profileError && (
                      <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                        {profileError}
                      </div>
                    )}

                    {/* Save / Cancel Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={async () => { await handleSaveProfile(); await handleSaveAddress(); }} 
                        disabled={profileLoading || addressLoading} 
                        className="flex-1 py-2.5 rounded-xl bg-[#d4a373] text-black font-bold text-xs uppercase hover:opacity-90"
                      >
                        {(profileLoading || addressLoading) ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button onClick={() => { setIsEditingProfile(false); setIsEditingAddress(false); setProfileError(''); }} className="px-6 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold uppercase text-black">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Read-only Account Info */}
                    <div className="space-y-3 text-sm text-neutral-600">
                      <div><span className="text-neutral-500 block text-xs">Email Address:</span> {user?.email}</div>
                      <div><span className="text-neutral-500 block text-xs">Full Name:</span> {user?.first_name} {user?.last_name}</div>
                      <div><span className="text-neutral-500 block text-xs">Phone Number:</span> {user?.mobile_number || 'Not provided'}</div>
                      <div><span className="text-neutral-500 block text-xs">Current Stage:</span> <strong className="text-[#d4a373]">{stage}</strong></div>
                    </div>

                    {/* Read-only Address */}
                    <div className="pt-3 border-t border-neutral-200">
                      <span className="text-neutral-500 block text-xs mb-1">Billing & Shipping Address:</span>
                      <p className="text-sm text-neutral-600">
                        {addressData.address_line_1 ? (
                          <>
                            <span className="block text-neutral-900 mb-1">{addressData.address_line_1}</span>
                            {addressData.city}, {addressData.state} {addressData.postal_code}<br />
                            {addressData.country}
                          </>
                        ) : (
                          'Primary Delivery: ' + (user?.address || 'Phase II, Industrial Park, Mumbai, Maharashtra 400013')
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        )}
      </div>

      {/* B2B Quotation Payment Modal */}
      {selectedQuoteForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-display">
          <div className="relative w-full max-w-lg bg-neutral-50 text-black border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-md">
                  <Lock className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 font-serif">Secure Bulk Payment</h3>
                  <p className="text-xs text-[#d4a373]">Quote Ref: {selectedQuoteForPayment.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuoteForPayment(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isB2bProcessing ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#d4a373] border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-lg font-bold text-neutral-900">Processing Payment...</h4>
                <p className="text-xs text-neutral-500">
                  Securing payment via {b2bPaymentMethod} and issuing GST Invoice.
                </p>
              </div>
            ) : (
              <>
                {/* 1. Address Summary */}
                <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#d4a373] font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Enterprise Billing &amp; Delivery</span>
                  </div>
                  <div className="text-neutral-600">
                    <span className="text-neutral-500">Customer: </span>
                    <strong className="text-neutral-900">{user?.first_name || 'Valued'} {user?.last_name || 'Partner'}</strong> ({user?.mobile_number || '9876543210'})
                  </div>
                  <div className="text-neutral-600">
                    <span className="text-neutral-500">Delivery Address: </span>
                    <span className="text-neutral-900 font-medium">{user?.address || 'Phase II, Industrial Park, Mumbai, Maharashtra 400013'}</span>
                  </div>
                </div>

                {/* 2. Payment Method Selector */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#d4a373] uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Select Payment Method (Card or UPI)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setB2bPaymentMethod('UPI')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        b2bPaymentMethod === 'UPI'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                          : 'bg-white shadow-sm border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-5 h-5 text-[#d4a373]" />
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">UPI Payment</span>
                          <span className="text-[10px] text-neutral-500">GPay / PhonePe</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        b2bPaymentMethod === 'UPI' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-700'
                      }`}>
                        {b2bPaymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setB2bPaymentMethod('Card')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        b2bPaymentMethod === 'Card'
                          ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                          : 'bg-white shadow-sm border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-5 h-5 text-[#d4a373]" />
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">Credit / Debit Card</span>
                          <span className="text-[10px] text-neutral-500">Visa / RuPay / Amex</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        b2bPaymentMethod === 'Card' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-700'
                      }`}>
                        {b2bPaymentMethod === 'Card' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Deal Summary */}
                <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Products / Deal:</span>
                    <strong className="text-neutral-900">{selectedQuoteForPayment.products || selectedQuoteForPayment.product || 'Bulk API Order'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 border-t border-neutral-800 pt-2">
                    <span className="font-bold">Total Deal Amount:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {selectedQuoteForPayment.offeredPrice || selectedQuoteForPayment.requestedPrice || '₹5,00,000'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={confirmB2BPayment}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4a373] via-[#e6bc92] to-[#c29161] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  CONFIRM BULK PAYMENT &amp; GENERATE INVOICE
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  </div>
  );
};
