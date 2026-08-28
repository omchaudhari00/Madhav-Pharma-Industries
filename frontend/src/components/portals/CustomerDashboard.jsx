import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ShoppingBag, User, Package, ArrowLeft, 
  CheckCircle, XCircle, RefreshCw, Award, Clock, 
  ExternalLink, Download, ShieldCheck, Sparkles, AlertCircle,
  CreditCard, Smartphone, Lock, X, MapPin, Truck, Check, ChevronDown, ChevronUp, LogOut, Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/InvoiceGenerator';

const getIndividualItems = (q) => {
  if (q.items && Array.isArray(q.items) && q.items.length > 0) {
    if (q.items.length === 1 && q.items[0].name && q.items[0].name.includes(',')) {
      const names = q.items[0].name.split(',').map((p) => p.trim()).filter(Boolean);
      const total = parseInt(String(q.items[0].quantityKg || q.quantity || 10));
      const perItem = Math.max(1, Math.round(total / names.length));
      return names.map((name) => ({
        name,
        quantityKg: perItem,
        unitPrice: q.items[0].unitPrice || 1500,
        expectedPrice: q.items[0].expectedPrice,
        standardPrice: q.items[0].standardPrice
      }));
    }
    return q.items.map((i) => ({
      name: i.name || i.product_details?.name || i.product || 'Bulk Pharma API',
      quantityKg: i.quantityKg || i.quantity || 5,
      unitPrice: i.unitPrice || i.requested_price || 1500,
      expectedPrice: i.expectedPrice,
      standardPrice: i.standardPrice
    }));
  }
  const names = (q.product || 'Bulk Pharma API').split(',').map((p) => p.trim()).filter(Boolean);
  const total = parseInt(String(q.quantity)) || names.length * 5;
  const perItem = Math.max(1, Math.round(total / names.length));
  return names.map((name) => ({
    name,
    quantityKg: perItem,
    unitPrice: parseInt(String(q.requestedPrice)?.replace(/[^0-9]/g, '')) || 1500
  }));
};

export const CustomerDashboard = () => {
  const { user, openCart, token, logout, login } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotes');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('-');
    if (parts.length > 1 && parts[0] === 'customer') {
      setActiveTab(parts[1]);
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

  const [myQuotes, setMyQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState(null);
  const [b2bPaymentMethod, setB2bPaymentMethod] = useState('UPI');
  const [isB2bProcessing, setIsB2bProcessing] = useState(false);

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressId, setAddressId] = useState(null);
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
      let backendQuotes = [];
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/quotations/quotations/`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            backendQuotes = data.map((item) => ({
              id: item.quotation_number || `QT-${item.id}`,
              rawId: item.id,
              date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              product: item.items && item.items.length > 0 ? item.items.map((i) => i.product_details?.name || 'Bulk Pharma API').join(', ') : 'Bulk Pharma API',
              quantity: item.items && item.items.length > 0 ? `${item.items.reduce((sum, i) => sum + (i.quantity || 0), 0)} KG` : '100 KG',
              items: item.items && item.items.length > 0 ? item.items.map((i) => ({
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
      const normalizedLocal = localQuotes.map((lq) => ({
        ...lq,
        items: getIndividualItems(lq)
      }));
      const combined = [...normalizedLocal];
      backendQuotes.forEach((bq) => {
        if (!combined.some(lq => lq.id === bq.id)) {
          combined.push(bq);
        }
      });
      setMyQuotes(combined);
    };

    const loadOrders = async () => {
      let backendOrders = [];
      try {
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/orders/orders/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              backendOrders = data.map((o) => ({
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
                product: o.items_data?.map((i) => `${i.quantity || 1}x ${i.name}`).join(', ') || 'Wholesale Order',
                amount: `₹${Number(o.total_amount).toLocaleString()}.00`,
                status: o.status || 'Preparing in Stock',
                isRetail: o.order_type === 'Retail',
                items: o.items_data || [],
                awb_code: o.awb_code,
                tracking_url: o.tracking_url
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
        const formattedRetailOrders = retailOrders.map((ro) => ({
          ...ro,
          product: ro.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Retail Products',
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
              const defaultAddr = data.find((a) => a.is_default) || data[0];
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

  const updateQuoteStatusInStorage = (id, newStatus) => {
    const existing = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
    const updated = existing.map((q) => q.id === id ? { ...q, status: newStatus } : q);
    localStorage.setItem('madhav_quotes', JSON.stringify(updated));
  };

  const handleQuoteAction = (quoteId, action) => {
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

  const handlePayAndGenerateInvoice = (quote) => {
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
    <div className="flex h-screen bg-neutral-50 font-display selection:bg-black/10 selection:text-black overflow-hidden relative">
      
      {/* MOBILE & IPAD BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* LEFT SIDEBAR - Responsive for Desktop, iPad, and Mobile */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 lg:w-64 bg-[#d4a373] flex flex-col shadow-2xl lg:shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
            title="Return to Storefront"
          >
            <img src="/images/favicon-circle.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            <div>
              <h1 className="text-black font-extrabold leading-none font-serif text-base sm:text-lg">Madhav Pharma</h1>
              <p className="text-[11px] sm:text-xs text-neutral-800 font-bold mt-1">Customer Portal</p>
            </div>
          </button>

          {/* Close button for Mobile / iPad */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-black hover:bg-black/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-3 sm:px-4 space-y-1">
          {[
            { id: 'quotes', label: 'Price Requests', icon: FileText, badge: myQuotes.length > 0 ? myQuotes.length.toString() : undefined },
            { id: 'orders', label: 'My Invoices & Orders', icon: ShoppingBag, badge: orders.length > 0 ? orders.length.toString() : undefined },
            { id: 'products', label: 'Products & Minimum Orders', icon: Package },
            { id: 'profile', label: 'Profile & Address', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
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
        
        <div className="p-3 sm:p-4 border-t border-black/10">
          <div className="mb-3 sm:mb-4 px-2">
            <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-wider mb-0.5">Logged In As</p>
            <p className="text-black font-semibold truncate text-xs sm:text-sm">{user?.first_name} {user?.last_name}</p>
            <p className="text-[11px] sm:text-xs text-neutral-800 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-black/20 text-black hover:bg-black/5 text-xs font-bold uppercase transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative text-black bg-neutral-50">
        
        {/* MOBILE & IPAD TOP NAVIGATION HEADER */}
        <div className="lg:hidden bg-[#d4a373] border-b border-black/10 px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Open portal navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-black font-extrabold text-sm sm:text-base leading-none font-serif">Madhav Pharma</h1>
              <p className="text-[10px] sm:text-xs text-neutral-800 font-bold mt-0.5">
                {activeTab === 'quotes' && 'Price Requests'}
                {activeTab === 'orders' && 'Invoices & Orders'}
                {activeTab === 'products' && 'Product Catalog'}
                {activeTab === 'profile' && 'Profile & Address'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-2.5 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-black text-[11px] font-bold uppercase flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
        </div>

        {/* Lead Stage Notice Banner */}
        {!isCustomer && (
          <div className="bg-amber-100 border-b border-amber-200 shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-start sm:items-center gap-2.5 sm:gap-3">
              <div className="p-1 sm:p-1.5 rounded-full bg-amber-200 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-amber-800 font-medium leading-normal">
                Your account is pending verification. You can browse wholesale products, but quotes require approval. <a href="#profile" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }} className="underline font-bold text-amber-900 hover:text-amber-700">Complete your profile</a> to get verified faster!
              </p>
            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT WRAPPER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Header with Title & Verified Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-neutral-200">
               <div>
                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-neutral-900 leading-tight">
                   {activeTab === 'orders' && 'Invoices & Orders'}
                   {activeTab === 'quotes' && 'Price Requests & Offers'}
                   {activeTab === 'products' && 'Product Catalog'}
                   {activeTab === 'profile' && 'My Profile & Address'}
                 </h2>
                 <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                   {activeTab === 'quotes' && 'Review target prices from our sales team. Accept to proceed to order invoice.'}
                   {activeTab === 'orders' && 'View your active shipments and download GST-compliant tax invoices.'}
                   {activeTab === 'products' && '100% steam distilled natural essential oils with GC-MS and COA certification.'}
                   {activeTab === 'profile' && 'Manage your name, phone number, and shipping address.'}
                 </p>
               </div>
               
               {/* Luxury Stage Badge */}
               <div className="flex items-center shrink-0">
                 <span className={`text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                   isCustomer 
                     ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                     : 'bg-amber-100 text-amber-700 border border-amber-200'
                 }`}>
                   <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                   <span>{isCustomer ? 'VERIFIED CUSTOMER' : 'NEW CUSTOMER'}</span>
                 </span>
               </div>
            </div>

            {/* Tab 1: MY QUOTATION REQUESTS */}
            {activeTab === 'quotes' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  {myQuotes.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center border border-dashed border-neutral-200 rounded-2xl sm:rounded-3xl bg-white shadow-sm">
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400 mx-auto mb-3" />
                      <h4 className="text-base sm:text-lg font-bold text-neutral-900">No Price Requests Found</h4>
                      <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                        You haven't submitted any bulk price requests yet. Go to Products, add items to your floating cart, and click "Request Bulk Quote" to send your request to Sales!
                      </p>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 rounded-xl bg-[#d4a373] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c29161] transition-colors cursor-pointer"
                      >
                        Browse Pharma Products
                      </button>
                    </div>
                  ) : (
                    myQuotes.map((q) => (
                      <div 
                        key={q.id} 
                        className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#d4a373] text-sm sm:text-base">{q.id}</span>
                              <span className="text-xs text-neutral-500">• {q.date}</span>
                            </div>
                            <div className="mt-2.5 space-y-1.5">
                              {getIndividualItems(q).map((item, idx) => (
                                <div key={idx} className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm md:text-base py-1 border-b border-neutral-100 last:border-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2 h-2 rounded-full bg-[#d4a373] shrink-0" />
                                    <span className="font-mono font-bold text-neutral-900">{item.quantityKg} kg</span>
                                    <span className="text-neutral-400 text-xs">of</span>
                                    <span className="font-bold text-neutral-900 truncate">{item.name}</span>
                                  </div>
                                  {item.expectedPrice ? (
                                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 border border-amber-500/30">
                                      Expected: {item.expectedPrice}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] sm:text-xs text-neutral-500">
                                      Standard: ₹{item.unitPrice}/kg
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex sm:flex-col justify-between sm:items-end items-center pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                            <div>
                              <div className="text-[11px] sm:text-xs text-neutral-500">Requested: <span className="font-mono text-neutral-900 font-bold">{q.requestedPrice}</span></div>
                              <div className="text-sm sm:text-lg font-bold text-[#d4a373] mt-0.5">Offered: {q.offeredPrice}</div>
                            </div>
                            <div className="mt-0 sm:mt-2">
                              <div className={`inline-flex items-center justify-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-sm ${
                                q.status === 'Accepted by Customer'
                                  ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                                  : q.status === 'Approved by Sales'
                                  ? 'bg-blue-500/15 text-blue-700 border-blue-500/30'
                                  : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                              }`}>
                                {q.status}
                              </div>
                            </div>
                          </div>
                        </div>

                        {q.notes && (
                          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                            <span className="text-neutral-500 font-bold uppercase mr-1">Sales Team Note ({q.salesAgent}):</span>
                            <span>"{q.notes}"</span>
                          </div>
                        )}

                        {/* Negotiation One-Click Buttons */}
                        <div className="pt-3.5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-[11px] sm:text-xs text-neutral-500">
                            Assigned Agent: <strong className="text-neutral-900">{q.salesAgent}</strong>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {q.status === 'Pending' || q.status === 'Pending Sales Review' ? (
                              <div className="px-3.5 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-600 text-xs font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span>Awaiting Sales Rep Review...</span>
                              </div>
                            ) : q.status === 'Rejected: Out of Stock' ? (
                              <div className="px-3.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 text-xs font-semibold">
                                Quotation Closed - Out of Stock
                              </div>
                            ) : q.status === 'Rejected by Customer' ? (
                              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <span className="px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 text-xs font-semibold">
                                  Rejected by You
                                </span>
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'revision')}
                                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs uppercase transition-all"
                                >
                                  Make Counter-Offer
                                </button>
                              </div>
                            ) : q.status === 'Approved by Sales' || q.status === 'Accepted by Customer' ? (
                              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <button 
                                  onClick={() => handlePayAndGenerateInvoice(q)}
                                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Pay Now &amp; Invoice</span>
                                </button>
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'revision')}
                                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase transition-all"
                                >
                                  Revision
                                </button>
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'reject')}
                                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : q.status !== 'Paid / Invoice Generated' ? (
                              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'accept')}
                                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Accept Quote</span>
                                </button>
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'revision')}
                                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase transition-all"
                                >
                                  Revision
                                </button>
                                <button 
                                  onClick={() => handleQuoteAction(q.id, 'reject')}
                                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs uppercase transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Paid • Invoice Generated</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: MY ORDERS & INVOICES */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">My Order History &amp; Invoices</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    {isCustomer 
                      ? 'View your active shipments and download GST-compliant tax invoices.'
                      : 'You have 0 completed orders. Accept a price offer and place your first order to unlock Verified Customer perks!'}
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                      <table className="min-w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500 text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
                            <th className="py-3 px-3 sm:px-4">Order Number</th>
                            <th className="py-3 px-3 sm:px-4">Product &amp; Quantity</th>
                            <th className="py-3 px-3 sm:px-4">Total Amount</th>
                            <th className="py-3 px-3 sm:px-4">Status</th>
                            <th className="py-3 px-3 sm:px-4">Date</th>
                            <th className="py-3 px-3 sm:px-4">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                          {orders.map((ord) => (
                            <React.Fragment key={ord.id}>
                              <tr 
                                onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                                className="hover:bg-neutral-50 text-black transition-colors cursor-pointer"
                              >
                                <td className="py-3.5 px-3 sm:px-4 font-bold text-[#d4a373]">
                                  <div className="flex items-center gap-1.5">
                                    {expandedOrderId === ord.id ? <ChevronUp className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
                                    <span>{ord.id}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 sm:px-4 font-semibold text-neutral-900">{ord.product}</td>
                                <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-neutral-900">{ord.amount}</td>
                                <td className="py-3.5 px-3 sm:px-4">
                                  <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                                    {ord.status}
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 sm:px-4 text-neutral-500 whitespace-nowrap">{ord.date}</td>
                                <td className="py-3.5 px-3 sm:px-4" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    {ord.tracking_url && (
                                      <a 
                                        href={ord.tracking_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-block text-center px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 text-[10px] font-extrabold uppercase transition-all"
                                      >
                                        Track
                                      </a>
                                    )}
                                    <button 
                                      onClick={() => {
                                        if (ord.isRetail) {
                                          generateInvoicePDF(ord);
                                        } else {
                                          alert(`Downloading GST Invoice ${ord.id}...`);
                                        }
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center gap-1 whitespace-nowrap cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">PDF</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expandedOrderId === ord.id && (
                                <tr>
                                  <td colSpan={6} className="p-0 border-b border-neutral-100 bg-neutral-50/50">
                                    <div className="p-4 sm:p-6">
                                      <div className="p-4 sm:p-6 rounded-2xl bg-white text-neutral-800 border border-neutral-200 space-y-4 sm:space-y-6">
                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                                          <span className="text-xs uppercase tracking-widest text-[#d4a373] font-bold">
                                            Live Delivery Tracker
                                          </span>
                                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> Express Dispatch
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                                          {/* Step 1 */}
                                          <div className="flex flex-col items-center text-center space-y-1.5">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                                              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                                            </div>
                                            <div>
                                              <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Confirmed</h4>
                                              <p className="text-[10px] text-neutral-500">Payment received</p>
                                            </div>
                                          </div>

                                          {/* Step 2 */}
                                          <div className="flex flex-col items-center text-center space-y-1.5">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                                              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                                            </div>
                                            <div>
                                              <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Bottling &amp; QC</h4>
                                              <p className="text-[10px] text-neutral-500">Purity seal OK</p>
                                            </div>
                                          </div>

                                          {/* Step 3 */}
                                          <div className="flex flex-col items-center text-center space-y-1.5">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#d4a373]/20 border-2 border-[#d4a373] text-[#d4a373] flex items-center justify-center font-bold">
                                              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div>
                                              <h4 className="text-xs sm:text-sm font-bold text-neutral-900">In Transit</h4>
                                              <p className="text-[10px] text-neutral-500">With courier</p>
                                            </div>
                                          </div>

                                          {/* Step 4 */}
                                          <div className="flex flex-col items-center text-center space-y-1.5 opacity-50">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 border-2 border-neutral-300 text-neutral-400 flex items-center justify-center font-bold">
                                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </div>
                                            <div>
                                              <h4 className="text-xs sm:text-sm font-bold text-neutral-500">Delivered</h4>
                                              <p className="text-[10px] text-neutral-500">To destination</p>
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
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center border border-dashed border-neutral-200 rounded-2xl sm:rounded-3xl">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400 mx-auto mb-3" />
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900">No Orders Placed Yet</h4>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                      Accept one of your approved price offers to create your first order and download your GST invoice.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: PHARMA PRODUCTS */}
            {activeTab === 'products' && (
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">Madhav Pharma Products</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">100% steam distilled natural essential oils with GC-MS and COA certification.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { name: 'Pure Cumin Seed Oil (Jeera Oil)', moq: '5 KG', grade: 'Pharmaceutical & Food Grade' },
                    { name: 'Natural Fennel Seed Oil', moq: '10 KG', grade: 'High Aroma Steam Distilled' },
                    { name: 'Pure Ajwain Seed Oil', moq: '5 KG', grade: 'Therapeutic & Wellness Grade' },
                    { name: 'Organic Coriander Essential Oil', moq: '5 KG', grade: 'Standardized Aroma Profile' },
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between hover:border-[#d4a373] transition-colors">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base">{p.name}</h4>
                        <p className="text-xs text-[#d4a373] mt-1 font-medium">{p.grade}</p>
                        <p className="text-[11px] text-neutral-500 mt-2">MOQ: <strong className="text-neutral-800">{p.moq}</strong></p>
                      </div>

                      <button 
                        onClick={() => navigate('/')}
                        className="mt-5 w-full py-2.5 rounded-xl bg-[#d4a373] text-black hover:bg-[#c29161] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
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
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-sm backdrop-blur-xl border border-neutral-200 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">My Profile &amp; Address</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage your name, phone number, and billing/shipping address.</p>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900">Account Details &amp; Address</h4>
                    {!isEditingProfile && !isEditingAddress && (
                      <button 
                        onClick={() => { setIsEditingProfile(true); setIsEditingAddress(true); }} 
                        className="px-3.5 py-1.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-xs font-bold text-black uppercase transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {(isEditingProfile || isEditingAddress) ? (
                    <div className="space-y-4 pt-2">
                      {/* Name Fields */}
                      <div>
                        <label className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} placeholder="First Name" className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                          <input type="text" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} placeholder="Last Name" className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Phone Number (Login ID)</label>
                        <input type="text" value={profileData.mobile_number} onChange={e => setProfileData({...profileData, mobile_number: e.target.value})} placeholder="Phone Number" className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373] text-black" />
                      </div>

                      {/* Address Fields */}
                      <div className="pt-3 border-t border-neutral-200 space-y-3">
                        <label className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider block">Billing &amp; Shipping Address</label>
                        <input type="text" value={addressData.address_line_1} onChange={e => setAddressData({...addressData, address_line_1: e.target.value})} placeholder="Address Line 1 / Street" className="w-full bg-white text-black border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} placeholder="City" className="w-full bg-white text-black border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                          <input type="text" value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} placeholder="State" className="w-full bg-white text-black border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={addressData.postal_code} onChange={e => setAddressData({...addressData, postal_code: e.target.value})} placeholder="PIN Code" className="w-full bg-white text-black border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                          <input type="text" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} placeholder="Country" className="w-full bg-white text-black border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#d4a373]" />
                        </div>
                      </div>

                      {/* Error Message */}
                      {profileError && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2">
                          {profileError}
                        </div>
                      )}

                      {/* Save / Cancel Buttons */}
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <button 
                          onClick={async () => { await handleSaveProfile(); await handleSaveAddress(); }} 
                          disabled={profileLoading || addressLoading} 
                          className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-[#d4a373] text-black font-bold text-xs uppercase hover:bg-[#c29161] transition-colors cursor-pointer"
                        >
                          {(profileLoading || addressLoading) ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                          onClick={() => { setIsEditingProfile(false); setIsEditingAddress(false); setProfileError(''); }} 
                          className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-xs font-bold uppercase text-neutral-800 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-xs sm:text-sm text-neutral-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><span className="text-neutral-400 block text-[11px] uppercase font-bold">Email Address:</span> <span className="font-semibold text-neutral-900 break-all">{user?.email}</span></div>
                        <div><span className="text-neutral-400 block text-[11px] uppercase font-bold">Full Name:</span> <span className="font-semibold text-neutral-900">{user?.first_name} {user?.last_name}</span></div>
                        <div><span className="text-neutral-400 block text-[11px] uppercase font-bold">Phone Number:</span> <span className="font-semibold text-neutral-900">{user?.mobile_number || 'Not provided'}</span></div>
                        <div><span className="text-neutral-400 block text-[11px] uppercase font-bold">Stage:</span> <strong className="text-[#d4a373]">{stage}</strong></div>
                      </div>

                      {/* Read-only Address */}
                      <div className="pt-3 border-t border-neutral-200">
                        <span className="text-neutral-400 block text-[11px] uppercase font-bold mb-1">Billing &amp; Shipping Address:</span>
                        <div className="text-neutral-800 leading-relaxed font-medium">
                          {addressData.address_line_1 ? (
                            <>
                              <span className="block text-neutral-900 font-bold">{addressData.address_line_1}</span>
                              {addressData.city}, {addressData.state} {addressData.postal_code}<br />
                              {addressData.country}
                            </>
                          ) : (
                            user?.address || 'Phase II, Industrial Park, Mumbai, Maharashtra 400013'
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* B2B Quotation Payment Modal */}
        {selectedQuoteForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-display overflow-y-auto">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white text-neutral-900 border border-neutral-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#d4a373] text-black shadow-sm">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">Secure Bulk Payment</h3>
                    <p className="text-xs text-[#d4a373] font-semibold">Quote Ref: {selectedQuoteForPayment.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuoteForPayment(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isB2bProcessing ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#d4a373] border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-base sm:text-lg font-bold text-neutral-900">Processing Payment...</h4>
                  <p className="text-xs text-neutral-500">
                    Securing payment via {b2bPaymentMethod} and issuing GST Invoice.
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Address Summary */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#d4a373] font-bold uppercase tracking-wider mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Delivery Details</span>
                    </div>
                    <div className="text-neutral-700">
                      <span className="text-neutral-500">Customer: </span>
                      <strong className="text-neutral-900">{user?.first_name || 'Valued'} {user?.last_name || 'Partner'}</strong> ({user?.mobile_number || '9876543210'})
                    </div>
                    <div className="text-neutral-700">
                      <span className="text-neutral-500">Address: </span>
                      <span className="text-neutral-900 font-medium">{user?.address || 'Phase II, Industrial Park, Mumbai, Maharashtra 400013'}</span>
                    </div>
                  </div>

                  {/* 2. Payment Method Selector */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#d4a373]" />
                      <span>Payment Method</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setB2bPaymentMethod('UPI')}
                        className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          b2bPaymentMethod === 'UPI'
                            ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">UPI Payment</span>
                            <span className="text-[10px] text-neutral-500">GPay / PhonePe</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          b2bPaymentMethod === 'UPI' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-300'
                        }`}>
                          {b2bPaymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>

                      <div
                        onClick={() => setB2bPaymentMethod('Card')}
                        className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          b2bPaymentMethod === 'Card'
                            ? 'bg-[#d4a373]/15 border-[#d4a373] ring-1 ring-[#d4a373]/30'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a373]" />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">Card</span>
                            <span className="text-[10px] text-neutral-500">Visa / RuPay</span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          b2bPaymentMethod === 'Card' ? 'border-[#d4a373] bg-[#d4a373]' : 'border-neutral-300'
                        }`}>
                          {b2bPaymentMethod === 'Card' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Deal Summary */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Products:</span>
                      <strong className="text-neutral-900 truncate max-w-[200px]">{selectedQuoteForPayment.products || selectedQuoteForPayment.product || 'Bulk Order'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 border-t border-neutral-200 pt-1.5">
                      <span className="font-bold text-neutral-900">Total Amount:</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-600">
                        {selectedQuoteForPayment.offeredPrice || selectedQuoteForPayment.requestedPrice || '₹5,00,000'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={confirmB2BPayment}
                    className="w-full py-3 sm:py-3.5 rounded-full bg-[#d4a373] hover:bg-[#c29161] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    CONFIRM PAYMENT &amp; GENERATE INVOICE
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
