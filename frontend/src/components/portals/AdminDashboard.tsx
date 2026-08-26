import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Users, Package, FileText, Briefcase,
  ShoppingBag, Settings as SettingsIcon, TrendingUp,
  CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Edit3,
  Trash2, Plus, ArrowLeft, UserPlus, Star, IndianRupee,
  RefreshCw, Lock, LogOut, X, PenLine, UserCheck, CheckSquare, Square
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/InvoiceGenerator';

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

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // compress to JPEG 70%
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject('Image load error');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject('File read error');
    reader.readAsDataURL(file);
  });
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
    updateProductDetails,
    token,
    logout,
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'customers' | 'products' | 'sales' | 'orders' | 'settings' | 'logs'
  >('overview');

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage] = useState('/images/all-oils.png');
  const [newProductUnitPrice, setNewProductUnitPrice] = useState<number | ''>(100);
  const [newProductRetailPrice, setNewProductRetailPrice] = useState<number | ''>(279);
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
    setNewProductRetailPrice('299');
    setNewProductGrade('100% Steam Distilled • Pharmaceutical Grade');
  };

  // Empty arrays for real data
  const [customers, setCustomers] = useState<any[]>([]);

  const loadCustomers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/users/?role=Customer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.map((user: any) => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.company_name || user.email?.split('@')[0] || 'Individual Customer',
          email: user.email,
          phone: user.mobile_number,
          stage: user.customer_stage || (user.orders_count > 0 ? 'Customer' : 'Lead'),
          ordersCount: user.orders_count || 0,
          totalSpent: user.total_spent ? `₹${Number(user.total_spent).toLocaleString()}` : '₹0',
          status: user.is_active ? 'Active' : 'Deactivated',
          assigned_sales_person: user.assigned_sales_person,
          assigned_sales_person_name: user.assigned_sales_person_name
        })));
      }
    } catch (e) {
      console.error('Failed to load customers', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'customers') {
      loadCustomers();
    }
  }, [activeTab, token]);



  const [stats, setStats] = useState({
    total_revenue: 0,
    total_transactions: 0,
    total_orders: 0,
    active_orders: 0,
    pending_quotes: 0,
    conversion_rate: 0,
    leads_count: 0,
    customers_count: 0,
    sales_count: 0
  });

  const loadStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/admin/stats/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to load dashboard stats', e);
    }
  };

  const loadOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/orders/orders/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data.map((o: any) => ({
            id: o.order_number,
            pk: o.id,
            customer: o.customer_name || (o.customer_details ? `${o.customer_details.first_name} ${o.customer_details.last_name}`.trim() : 'Direct Customer'),
            phone: o.customer_phone || o.customer_details?.mobile_number || '',
            email: o.customer_email || o.customer_details?.email || '',
            deliveryAddress: o.delivery_address || (o.shipping_address_details?.address_line_1 || 'Standard Delivery'),
            amount: `₹${Number(o.total_amount).toLocaleString()}`,
            rawAmount: Number(o.total_amount) || 0,
            status: o.status,
            payment: o.payment_status || 'Completed',
            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            items: o.items_data || [],
            shiprocket_order_id: o.shiprocket_order_id,
            awb_code: o.awb_code,
            tracking_url: o.tracking_url
          })));
        }
      }
    } catch (e) {
      console.error('Failed to fetch backend orders:', e);
    }
  };

  const [quotes, setQuotes] = useState<any[]>([]);

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
              customer: item.customer_details ? `${item.customer_details.first_name} ${item.customer_details.last_name}` : (item.snapshot_customer_name || 'Enterprise Client'),
              product: item.items && item.items.length > 0 ? item.items.map((i: any) => i.product_details?.name || 'Bulk Pharma API').join(', ') : 'Bulk Pharma API',
              quantity: item.items && item.items.length > 0 ? item.items.map((i: any) => `${i.quantityKg || i.quantity || 50} KG`).join(', ') : '50 KG',
              requestedPrice: item.final_price ? `₹${item.final_price}` : `₹${item.items && item.items.length > 0 ? item.items[0].requested_price || item.items[0].target_price || '1,500' : '1,500'}`,
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
            requestedPrice: lq.offeredPrice || lq.requestedPrice || '₹1,500/KG',
            quantity: lq.quantity || '50 KG',
          });
        }
      });
      setQuotes(combined);
    };
    loadQuotes();
    loadStats();
    loadOrders();
  }, [activeTab, token]);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editSizeTab, setEditSizeTab] = useState<'1l' | '5l'>('1l');
  const [editForm1L, setEditForm1L] = useState({ price: '', description: '', images: [] as string[] });
  const [editForm5L, setEditForm5L] = useState({ price: '', description: '', images: [] as string[] });

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setProducts(allProducts.map((p, i) => ({
        id: i + 1,
        codeId: p.id,
        name: p.name,
        retailPrice: p.retailPrice?.toString() || '299',
        price: `₹${p.unitPrice}/KG`,
        availability: p.availability || 'In Stock',
        active: true
      })));
    }
  }, [allProducts]);

  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [isAddingSalesPerson, setIsAddingSalesPerson] = useState(false);
  const [newSalesPerson, setNewSalesPerson] = useState({ email: '', phone: '', password: '', confirmPassword: '' });
  const [showSalesPassword, setShowSalesPassword] = useState(false);
  const [showSalesConfirmPassword, setShowSalesConfirmPassword] = useState(false);

  // Customer Assignment Modal State
  const [assigningSalesPerson, setAssigningSalesPerson] = useState<any | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  const loadSalesUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/users/?role=Sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSalesUsers(data.map((user: any) => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          email: user.email,
          phone: user.mobile_number,
          activeQuotes: user.active_quotes_count || 0,
          closedDeals: user.closed_deals_count || 0,
          assignedCustomersCount: user.assigned_customers_count || 0,
          isActive: user.is_active !== false
        })));
      }
    } catch (e) {
      console.error('Failed to load sales users', e);
    }
  };

  const openAssignModal = async (salesUser: any) => {
    setAssigningSalesPerson(salesUser);
    await loadCustomers();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/users/?role=Customer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const preselected = data
          .filter((c: any) => c.assigned_sales_person === salesUser.id)
          .map((c: any) => c.id);
        setSelectedCustomerIds(preselected);
      }
    } catch (e) {
      console.error(e);
    }
    setIsAssignModalOpen(true);
  };

  const handleToggleCustomerSelection = (customerId: number) => {
    setSelectedCustomerIds(prev => 
      prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]
    );
  };

  const handleSaveAssignment = async () => {
    if (!assigningSalesPerson || !token) return;
    setIsSavingAssignment(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/sales-users/${assigningSalesPerson.id}/assign/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customer_ids: selectedCustomerIds })
      });
      if (res.ok) {
        alert(`Customers successfully assigned to ${assigningSalesPerson.name}!`);
        setIsAssignModalOpen(false);
        setAssigningSalesPerson(null);
        loadSalesUsers();
        loadCustomers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save customer assignments');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating customer assignments.');
    } finally {
      setIsSavingAssignment(false);
    }
  };

  const handleToggleSalesAccess = async (salesUser: any) => {
    if (!token) return;
    const actionName = salesUser.isActive ? 'revoke' : 'restore';
    if (!confirm(`Are you sure you want to ${actionName} portal access for ${salesUser.name}?`)) {
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/sales-users/${salesUser.id}/toggle-status/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || `Access status updated successfully.`);
        loadSalesUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update access status.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating access status.');
    }
  };

  useEffect(() => {
    if (activeTab === 'sales') {
      loadSalesUsers();
      loadCustomers();
    }
  }, [activeTab, token]);

  const handleCreateSalesPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSalesPerson.password !== newSalesPerson.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/accounts/sales-users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newSalesPerson.email,
          mobile_number: newSalesPerson.phone,
          password: newSalesPerson.password,
          first_name: newSalesPerson.email.split('@')[0],
          last_name: ''
        })
      });
      if (res.ok) {
        alert("Sales person created successfully!");
        setIsAddingSalesPerson(false);
        setNewSalesPerson({ email: '', phone: '', password: '', confirmPassword: '' });
        loadSalesUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create sales person");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [logs, setLogs] = useState<any[]>([]);

  const loadLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/interactions/logs/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Failed to load logs', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs();
    }
  }, [activeTab, token]);

  
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('-');
    if (parts.length > 1 && parts[0] === 'admin') {
      setActiveTab(parts[1] as any);
    }
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    const parts = currentHash.split('-');
    if (parts[0] === 'admin' && parts[1] !== activeTab) {
      window.history.replaceState(null, '', `#${parts[0]}-${activeTab}`);
    } else if (currentHash === 'admin') {
      window.history.replaceState(null, '', `#${currentHash}-${activeTab}`);
    }
  }, [activeTab]);

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

  const handleGenerateShipment = async (orderPk: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/orders/orders/${orderPk}/create-shipment/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Shipment generated successfully via Shiprocket!");
        loadOrders();
      } else {
        const error = await res.json();
        alert(`Failed to generate shipment: ${error.error || error.detail || 'Unknown error'}`);
      }
    } catch (e) {
      alert("Error generating shipment");
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-white font-display text-neutral-900 selection:bg-[#d4a373]/30">
      
      
      
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#d4a373] flex flex-col shadow-xl z-20">
        <button 
          onClick={() => navigate('/')}
          className="p-6 border-b border-black/10 flex items-center gap-3 text-left hover:bg-black/5 transition-colors cursor-pointer focus:outline-none"
          title="Return to Storefront"
        >
          <img src="/images/favicon-circle.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-black font-extrabold leading-none font-serif">Madhav Pharma</h1>
            <p className="text-xs text-neutral-800 font-bold mt-1">Admin Portal</p>
          </div>
        </button>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'quotes', label: 'Quotes & Pricing', icon: FileText, badge: quotes.length > 0 ? quotes.length.toString() : undefined },
            { id: 'customers', label: 'Customers & Leads', icon: Users, badge: customers.length > 0 ? customers.length.toString() : undefined },
            { id: 'products', label: 'Products & Pricing', icon: Package },
            { id: 'sales', label: 'Sales Team', icon: Briefcase },
            { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag },
            { id: 'settings', label: 'Company & GST Settings', icon: SettingsIcon },
            { id: 'logs', label: 'Logs', icon: AlertCircle },
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
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black/20 text-black hover:bg-black/5 text-xs font-bold uppercase transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


          {/* Tab 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Unified Enterprise System Status Panel (Everything in One Box, All Numbers Zero) */}
              <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-md border border-neutral-200 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6 mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
                      <span>System Status</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold">LIVE</span>
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">Real-time overview of orders and revenue</p>
                  </div>
                  <div className="text-right text-xs text-neutral-600">
                    <span className="block font-mono text-neutral-700">System Status: Optimal</span>
                    <span className="text-[#d4a373] font-bold">0 Active Alerts</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Total Revenue</span>
                      <IndianRupee className="w-4 h-4 text-[#d4a373]" />
                    </div>
                    <div className="text-3xl font-serif font-extrabold text-neutral-900">₹{stats.total_revenue.toLocaleString()}</div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {stats.total_transactions} verified transactions
                    </p>
                  </div>

                  <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Leads vs Customers</span>
                      <Users className="w-4 h-4 text-[#d4a373]" />
                    </div>
                    <div className="text-3xl font-serif font-extrabold text-neutral-900">
                      {stats.leads_count} <span className="text-sm text-neutral-600 font-sans">Leads</span> / {stats.customers_count} <span className="text-sm text-[#d4a373] font-sans">Customers</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {stats.conversion_rate}% conversion rate
                    </p>
                  </div>

                  <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Pending Quotes</span>
                      <FileText className="w-4 h-4 text-[#d4a373]" />
                    </div>
                    <div className="text-3xl font-serif font-extrabold text-neutral-900">{stats.pending_quotes || quotes.filter(q => q.status === 'Pending').length}</div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {quotes.filter(q => q.salesAgent === 'Unassigned').length} require sales agent assignment
                    </p>
                  </div>

                  <div className="px-4 py-3 sm:py-0 first:pl-0 last:pr-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Active Orders</span>
                      <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                    </div>
                    <div className="text-3xl font-serif font-extrabold text-neutral-900">{stats.active_orders || orders.length}</div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {orders.filter(o => o.status === 'Processing' || o.status === 'Preparing in Stock').length} in processing • {orders.filter(o => o.status === 'Shipped').length} shipped
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Activity Table */}
              <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200">
                <h3 className="text-xl font-serif font-bold text-neutral-900">Recent Price Requests & New Customers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
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
                        <tr key={q.id} className="hover:bg-neutral-100 transition-colors">
                          <td className="py-4 px-4 font-bold text-[#d4a373]">{q.id}</td>
                          <td className="py-4 px-4 font-semibold text-neutral-900">{q.customer}</td>
                          <td className="py-4 px-4">
                            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-extrabold tracking-wide uppercase whitespace-nowrap shadow-sm ${q.customer === 'Vedic Herbs Bio' || q.customer === 'Sanjivani Naturals'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              }`}>
                              {q.customer === 'Vedic Herbs Bio' || q.customer === 'Sanjivani Naturals' ? 'New Customer' : 'Customer'}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-neutral-700">{q.product} ({q.quantity})</td>
                          <td className="py-4 px-4 text-neutral-900 font-mono">{q.requestedPrice}</td>
                          <td className="py-4 px-4 text-neutral-700">{q.salesAgent}</td>
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
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-neutral-900">All Price Requests</h3>
                  <p className="text-sm text-neutral-600 mt-1">Assign requests to sales team, approve target prices, or manage offers.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
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
                      <tr key={q.id} className="hover:bg-neutral-100 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#d4a373]">{q.id}</td>
                        <td className="py-4 px-4 font-semibold text-neutral-900">{q.customer}</td>
                        <td className="py-4 px-4 text-neutral-700">{q.product} • {q.quantity}</td>
                        <td className="py-4 px-4 font-mono text-neutral-900">{q.requestedPrice}</td>
                        <td className="py-4 px-4">
                          <select
                            value={q.salesAgent}
                            onChange={(e) => handleAssignQuote(q.id, e.target.value)}
                            className="bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-900 focus:outline-none focus:border-[#d4a373]"
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
                          <button className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-700 text-neutral-700" title="Edit Quote">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-neutral-900" title="Delete Quote">
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
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-neutral-900">Customer Directory</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    New users start as <span className="text-amber-300 font-bold">NEW CUSTOMER</span> and automatically upgrade to <span className="text-emerald-400 font-bold">VERIFIED CUSTOMER</span> after their first completed order.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Contact Details</th>
                      <th className="py-3 px-4">Stage Badge</th>
                      <th className="py-3 px-4">Assigned Sales Rep</th>
                      <th className="py-3 px-4">Orders Placed</th>
                      <th className="py-3 px-4">Total Revenue</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4">Admin Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-100 transition-colors">
                        <td className="py-4 px-4 font-mono text-neutral-600">#{c.id}</td>
                        <td className="py-4 px-4 font-bold text-neutral-900">{c.name}</td>
                        <td className="py-4 px-4">
                          <div className="text-neutral-900 font-medium">{c.email}</div>
                          <div className="text-xs text-neutral-600">{c.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-extrabold uppercase tracking-wide whitespace-nowrap shadow-sm ${c.stage === 'Lead'
                              ? 'bg-amber-500/15 text-amber-700 border-amber-500/40'
                              : 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40'
                            }`}>
                            {c.stage === 'Lead' ? 'New Customer' : 'Customer'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {c.assigned_sales_person_name ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{c.assigned_sales_person_name}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono text-neutral-900">{c.ordersCount} orders</td>
                        <td className="py-4 px-4 font-bold text-[#b5835a]">{c.totalSpent}</td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${c.status === 'Active' ? 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30' : 'text-red-700 bg-red-500/15 border-red-500/30'
                            }`}>
                            {c.status}
                          </div>
                        </td>
                        <td className="py-4 px-4 flex items-center gap-2">
                          <button
                            onClick={() => handleDeactivateCustomer(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer"
                          >
                            {c.status === 'Active' ? 'Deactivate' : 'Activate'}
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
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-neutral-900">Product Catalog & Pricing</h3>
                  <p className="text-sm text-neutral-600 mt-1">Admin has full control to edit products, prices, upload certificates, and toggle availability.</p>
                </div>
              </div>



              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Product Name</th>
                      {/* removed MOQ column */}
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
                        <tr key={p.id} className="hover:bg-neutral-100 transition-colors">
                          <td className="py-4 px-4 font-mono text-neutral-600">#{p.id}</td>
                          <td className="py-4 px-4 font-bold text-neutral-900">{p.name}</td>
                          {/* removed MOQ cell */}
                          <td className="py-4 px-4 font-mono text-neutral-900">{p.price}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${retailOos
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              }`}>
                              {retailOos ? 'Out of Stock (Retail)' : 'In Stock (Retail)'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${b2bOos
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              }`}>
                              {b2bOos ? 'Out of Stock (B2B)' : 'In Stock (B2B)'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${discontinued
                                ? 'bg-neutral-100 text-neutral-600 border-neutral-600'
                                : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              }`}>
                              {discontinued ? 'Discontinued (Hidden)' : 'Active (Visible)'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => toggleRetailStock(p.codeId)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${retailOos
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-black'
                                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-white/20 hover:text-neutral-900'
                                  }`}
                              >
                                {retailOos ? 'Restore Retail' : 'OOS Retail'}
                              </button>
                              <button
                                onClick={() => toggleB2BStock(p.codeId)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${b2bOos
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-black'
                                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-white/20 hover:text-neutral-900'
                                  }`}
                              >
                                {b2bOos ? 'Restore B2B' : 'OOS B2B'}
                              </button>
                              <button
                                onClick={() => toggleDiscontinued(p.codeId)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${discontinued
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500 hover:text-black'
                                    : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-700 hover:text-neutral-900'
                                  }`}
                              >
                                {discontinued ? 'Restore Display' : 'Discontinue'}
                              </button>
                              <button
                                onClick={() => {
                                  const targetProduct = allProducts.find(ap => ap.id === p.codeId);
                                  const parsedPrice1L = targetProduct?.unitPrice?.toString() || p.price.replace(/[^0-9]/g, '');
                                  const parsedPrice5L = targetProduct?.price5L ? targetProduct.price5L.toString() : (targetProduct?.unitPrice ? (targetProduct.unitPrice * 5).toString() : '');

                                  let initImages1L: string[] = [];
                                  if (targetProduct?.customImages !== undefined && targetProduct.customImages.length > 0) {
                                    initImages1L = targetProduct.customImages;
                                  } else if (targetProduct?.heroImage) {
                                    initImages1L = [targetProduct.heroImage];
                                  } else if (targetProduct?.cardImage) {
                                    initImages1L = [targetProduct.cardImage];
                                  } else {
                                    initImages1L = ['/images/bulk_1l.jpg'];
                                  }

                                  let initImages5L: string[] = [];
                                  if (targetProduct?.customImages5L !== undefined && targetProduct.customImages5L.length > 0) {
                                    initImages5L = targetProduct.customImages5L;
                                  } else {
                                    initImages5L = ['/images/bulk_5l.jpg'];
                                  }

                                  setEditingProduct(p);
                                  setEditSizeTab('1l');
                                  setEditForm1L({
                                    price: parsedPrice1L,
                                    description: targetProduct?.description || '',
                                    images: initImages1L
                                  });
                                  setEditForm5L({
                                    price: parsedPrice5L,
                                    description: targetProduct?.description5L || targetProduct?.description || '',
                                    images: initImages5L
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#d4a373]/20 hover:bg-[#d4a373] text-[#d4a373] hover:text-black border border-[#d4a373]/40 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                title="Edit Product Pricing"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                                <span>Edit Price</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    setProducts(prev => prev.filter(prod => prod.id !== p.id));
                                  }
                                }}
                                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-neutral-900 border border-red-500/40 transition-colors cursor-pointer"
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
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-neutral-900">Sales Team & Assignees</h3>
                  <p className="text-sm text-neutral-600 mt-1">Create sales users, assign them to leads/quotes, or reset their credentials.</p>
                </div>
                <button onClick={() => setIsAddingSalesPerson(true)} className="px-4 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Sales User</span>
                </button>
              </div>

              {isAddingSalesPerson && (
                <div className="p-6 rounded-2xl bg-white/60 border border-[#d4a373]/30 space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-neutral-900">Add New Sales Person</h4>
                    <button onClick={() => setIsAddingSalesPerson(false)} className="text-neutral-600 hover:text-neutral-900"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleCreateSalesPerson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" required placeholder="Email (Username)" value={newSalesPerson.email} onChange={e => setNewSalesPerson({ ...newSalesPerson, email: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-[#d4a373]" />
                    <input type="text" required placeholder="Phone Number" value={newSalesPerson.phone} onChange={e => setNewSalesPerson({ ...newSalesPerson, phone: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-[#d4a373]" />
                    <div className="relative">
                      <input type={showSalesPassword ? "text" : "password"} required placeholder="Password" value={newSalesPerson.password} onChange={e => setNewSalesPerson({ ...newSalesPerson, password: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-[#d4a373] pr-10" />
                      <button type="button" onClick={() => setShowSalesPassword(!showSalesPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors">
                        {showSalesPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showSalesConfirmPassword ? "text" : "password"} required placeholder="Confirm Password" value={newSalesPerson.confirmPassword} onChange={e => setNewSalesPerson({ ...newSalesPerson, confirmPassword: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-[#d4a373] pr-10" />
                      <button type="button" onClick={() => setShowSalesConfirmPassword(!showSalesConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 transition-colors">
                        {showSalesConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 font-extrabold text-xs uppercase tracking-wider">
                        Save Sales Person
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salesUsers.map(s => (
                  <div key={s.id} className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between shadow-sm space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-neutral-900">{s.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                          {s.isActive ? 'Active' : 'Access Revoked'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-1">{s.email} • {s.phone}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
                        <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          {s.assignedCustomersCount || 0} Assigned Customers
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {s.closedDeals || 0} Deals Closed
                        </span>
                        <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {s.activeQuotes || 0} Active Quotes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                      <button 
                        onClick={() => openAssignModal(s)}
                        className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white shadow-sm transition-all cursor-pointer text-center"
                      >
                        Assign Customers
                      </button>
                      <button 
                        onClick={() => handleToggleSalesAccess(s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${s.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`}
                      >
                        {s.isActive ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: ORDERS & INVOICES */}
          {activeTab === 'orders' && (
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Orders & Invoice Management</h3>
                <p className="text-sm text-neutral-600 mt-1">Admin can view all orders, update shipping status, view payments, and generate tax invoices.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & Address</th>
                      <th className="py-3 px-4">Items / Products</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Logistics & Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-[#b5835a] font-mono">{ord.id}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">{ord.date}</div>
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-neutral-900">{ord.customer}</div>
                          {ord.phone && <div className="text-xs text-neutral-600 font-mono">{ord.phone}</div>}
                          {ord.email && <div className="text-xs text-neutral-500 truncate max-w-[200px]">{ord.email}</div>}
                          {ord.deliveryAddress && (
                            <div className="text-xs text-neutral-500 mt-1 max-w-[220px] line-clamp-2" title={ord.deliveryAddress}>
                              📍 {ord.deliveryAddress}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-1 max-w-[220px]">
                            {ord.items && ord.items.length > 0 ? (
                              ord.items.map((it: any, idx: number) => (
                                <div key={idx} className="text-xs text-neutral-800 bg-neutral-100 px-2 py-1 rounded-lg">
                                  <span className="font-bold text-neutral-900">{it.quantity}x</span> {it.name}
                                  <span className="text-neutral-500 block text-[10px]">({it.sizeLabel || '50ml Bottle'})</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-neutral-500 italic">Standard Order</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top font-mono font-bold text-neutral-900">{ord.amount}</td>
                        <td className="py-4 px-4 align-top">
                          {renderStatusBadge(ord.status)}
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shadow-sm ${ord.payment.includes('PAID') || ord.payment === 'Completed' ? 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30' : 'text-amber-700 bg-amber-500/15 border-amber-500/30'
                            }`}>
                            {ord.payment}
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top flex flex-col gap-2">
                          {ord.tracking_url ? (
                            <a href={ord.tracking_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 text-[10px] font-extrabold uppercase transition-all text-center">
                              Track: {ord.awb_code}
                            </a>
                          ) : (ord.status === 'Preparing in Stock' || ord.status === 'Processing' || ord.status === 'Shipped') ? (
                            <button onClick={() => handleGenerateShipment(ord.pk)} className="px-3 py-1.5 rounded-lg bg-[#d4a373] text-black hover:bg-[#c29161] text-[10px] font-extrabold uppercase transition-all shadow-sm cursor-pointer">
                              Ship via Shiprocket
                            </button>
                          ) : null}
                          <button
                            onClick={() => generateInvoicePDF({
                              id: ord.id,
                              date: ord.date,
                              customerName: ord.customer,
                              phone: ord.phone || '+91 9023385917',
                              deliveryAddress: ord.deliveryAddress || 'Phase IV, GIDC Industrial Estate, Gujarat',
                              items: ord.items && ord.items.length > 0 ? ord.items : [
                                { name: '100% Pure Therapeutic Grade Essential Oil', sizeLabel: '50ml Bottle', quantity: 1, unitPrice: ord.rawAmount || 299 }
                              ]
                            })}
                            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-extrabold uppercase transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            Tax Invoice
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
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Company, GST & Review Approvals</h3>
                <p className="text-sm text-neutral-600 mt-1">Configure Madhav Pharma enterprise settings and approve customer product reviews.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-neutral-900">Company & Bank Details</h4>
                    <button
                      onClick={() => {
                        if (window.confirm('This will delete all test orders and price requests from local storage. Continue?')) {
                          localStorage.removeItem('madhav_retail_orders_list');
                          localStorage.removeItem('madhav_quotes');
                          window.location.reload();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-neutral-900 border border-red-500/30 text-xs font-bold uppercase transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Wipe Test Orders
                    </button>
                  </div>
                  <div className="space-y-3 text-xs text-neutral-700">
                    <div><span className="text-neutral-500 block">Legal Entity Name:</span> Madhav Pharma Industries Private Limited</div>
                    <div><span className="text-neutral-500 block">GSTIN Number:</span> 24AGPPC9524J2Z5</div>
                    <div><span className="text-neutral-500 block">Registered Office:</span> Phase IV, GIDC Industrial Estate, Gujarat</div>
                    <div><span className="text-neutral-500 block">Official Contact:</span> +91 9023385917 • info@madhavpharmaindustries.com</div>
                    <div><span className="text-neutral-500 block">Bank Account:</span> Axis Bank (AC: 923020039126687 • IFSC: UTIB0003165)</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                  <h4 className="text-lg font-bold text-neutral-900">Pending Review Approvals</h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-100/60 border border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-amber-300 font-bold">5★ - Pure Cumin Oil</span>
                        <p className="text-neutral-700 mt-0.5">"Excellent aroma and GC-MS purity verified." - Apex Remedies</p>
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
              <div className="bg-white border border-neutral-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-neutral-900 shadow-md border border-neutral-200 space-y-6 relative max-h-[90vh] overflow-y-auto font-display">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-[#d4a373] text-neutral-950 rounded-xl shadow-md">
                      <Plus className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-serif text-neutral-900">Add New Product</h3>
                      <p className="text-xs text-neutral-600">Add essential oil product to Admin &amp; Storefront catalog</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white text-neutral-600 hover:text-neutral-900 transition-colors"
                    aria-label="Close modal"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Peppermint Essential Oil"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Category / Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Peppermint"
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        {/* removed MOQ add input */}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        B2B Bulk Price (₹/KG) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 110"
                        value={newProductUnitPrice}
                        onChange={(e) => setNewProductUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Retail Price (₹/50ml) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 279"
                        value={newProductRetailPrice}
                        onChange={(e) => setNewProductRetailPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Product Image Asset Path or URL
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /images/all-oils.png or https://..."
                      value={newProductImage}
                      onChange={(e) => setNewProductImage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none font-mono"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[11px] text-neutral-600 self-center">Presets:</span>
                      {['/images/cumin-seed-oil.png', '/images/fennel-oil.jpg', '/images/ajwain-oil.png', '/images/all-oils.png'].map((img) => (
                        <button
                          type="button"
                          key={img}
                          onClick={() => setNewProductImage(img)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${newProductImage === img ? 'bg-[#d4a373] text-black border-[#d4a373] font-bold' : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-900'}`}
                        >
                          {img.split('/').pop()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Grade &amp; Purity Description
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100% Steam Distilled • Pharmaceutical Grade"
                      value={newProductGrade}
                      onChange={(e) => setNewProductGrade(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Initial Availability State
                    </label>
                    <select
                      value={newProductAvailability}
                      onChange={(e) => setNewProductAvailability(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:border-[#d4a373] focus:outline-none cursor-pointer"
                    >
                      <option value="In Stock">In Stock (Available)</option>
                      <option value="Out of Stock">Out of Stock (OOS)</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-700 text-neutral-700 text-xs font-bold uppercase transition-colors"
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

          {/* Tab 8: LOGS */}
          {activeTab === 'logs' && (
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-neutral-900">Activity Logs</h3>
                <p className="text-sm text-neutral-600 mt-1">Track history of status updates by sales agents and admins.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Sales Person</th>
                      <th className="py-3 px-4">Order / Quote ID</th>
                      <th className="py-3 px-4">Action Description</th>
                      <th className="py-3 px-4">New Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {logs.length > 0 ? logs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-neutral-100 transition-colors">
                        <td className="py-4 px-4 text-neutral-700 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#d4a373]">
                          {log.sales_person_name}
                        </td>
                        <td className="py-4 px-4 text-neutral-900 font-mono">{log.order_id}</td>
                        <td className="py-4 px-4 text-neutral-700">{log.description}</td>
                        <td className="py-4 px-4">
                          {renderStatusBadge(log.status)}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-500">No activity logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Pricing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4a373] flex items-center justify-center shadow-lg shrink-0">
                  <PenLine className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Edit Product &amp; Pricing</h3>
                  <p className="text-sm text-neutral-400 mt-0.5">{editingProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-500 hover:text-white transition-colors mt-1 cursor-pointer">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* 1L / 5L Size Selector Tabs for Bulk Products */}
            {editingProduct.codeId !== 'weight-loss-oil' && (
              <div className="flex items-center gap-3 p-1.5 bg-neutral-900/80 rounded-2xl border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => setEditSizeTab('1l')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    editSizeTab === '1l'
                      ? 'bg-[#d4a373] text-neutral-950 shadow-md font-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>1 Litre (1L Bottle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditSizeTab('5l')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    editSizeTab === '5l'
                      ? 'bg-[#d4a373] text-neutral-950 shadow-md font-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>5 Litre (5L Drum)</span>
                </button>
              </div>
            )}

            {/* Form Section */}
            <div className="space-y-6">
              {editSizeTab === '1l' || editingProduct.codeId === 'weight-loss-oil' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {editingProduct.codeId === 'weight-loss-oil' ? 'Product Price (₹ per 50ml Bottle)' : 'Product Price (₹ per 1 Litre Bottle)'}
                    </label>
                    <input 
                      type="text" 
                      value={editForm1L.price}
                      onChange={(e) => setEditForm1L({ ...editForm1L, price: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all font-mono"
                      placeholder="e.g. 150"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {editingProduct.codeId === 'weight-loss-oil' ? 'Product Description' : '1 Litre Product Description'}
                    </label>
                    <textarea 
                      value={editForm1L.description}
                      onChange={(e) => setEditForm1L({ ...editForm1L, description: e.target.value })}
                      rows={4}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                      placeholder="Enter description..."
                    />
                  </div>
                  
                  <div className="border-t border-white/10 pt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {editingProduct.codeId === 'weight-loss-oil' ? 'Product Images (Max 3)' : '1 Litre Product Images (Max 3)'}
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {editForm1L.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden group">
                          <img src={img} alt={`1L Preview ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setEditForm1L(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-6 h-6 text-red-400" />
                          </button>
                        </div>
                      ))}
                      {editForm1L.images.length < 3 && (
                        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#d4a373] hover:bg-[#d4a373]/10 flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <Plus className="w-6 h-6 text-neutral-400" />
                          <span className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedBase64 = await compressImage(file);
                                  setEditForm1L(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
                                } catch(err) {
                                  console.error("Compression failed", err);
                                  alert("Failed to compress image");
                                }
                              }
                              e.target.value = '';
                            }} 
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
                      First image is the primary cover for 1L variant.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Product Price (₹ per 5 Litre Industrial Drum)
                    </label>
                    <input 
                      type="text" 
                      value={editForm5L.price}
                      onChange={(e) => setEditForm5L({ ...editForm5L, price: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all font-mono"
                      placeholder="e.g. 11000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      5 Litre Product Description
                    </label>
                    <textarea 
                      value={editForm5L.description}
                      onChange={(e) => setEditForm5L({ ...editForm5L, description: e.target.value })}
                      rows={4}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                      placeholder="Enter 5L bulk drum description..."
                    />
                  </div>
                  
                  <div className="border-t border-white/10 pt-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      5 Litre Drum Images (Max 3)
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {editForm5L.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden group">
                          <img src={img} alt={`5L Preview ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setEditForm5L(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-6 h-6 text-red-400" />
                          </button>
                        </div>
                      ))}
                      {editForm5L.images.length < 3 && (
                        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#d4a373] hover:bg-[#d4a373]/10 flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <Plus className="w-6 h-6 text-neutral-400" />
                          <span className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedBase64 = await compressImage(file);
                                  setEditForm5L(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
                                } catch(err) {
                                  console.error("Compression failed", err);
                                  alert("Failed to compress image");
                                }
                              }
                              e.target.value = '';
                            }} 
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
                      First image is the primary cover for 5L drum variant.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
              <button 
                type="button"
                onClick={() => setEditingProduct(null)} 
                className="flex-1 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                    const parsedPrice1L = Number(editForm1L.price) || 100;
                    const parsedPrice5L = editForm5L.price ? Number(editForm5L.price) : parsedPrice1L * 5;
                    
                    // Update Admin UI state
                    setProducts(prev => prev.map(prod => prod.id === editingProduct.id ? { 
                      ...prod, 
                      price: `₹${editForm1L.price}/KG`,
                      retailPrice: parsedPrice1L
                    } : prod));
                    
                    // Update global AppContext state and backend DB
                    updateProductDetails(
                      editingProduct.codeId,
                      parsedPrice1L,
                      parsedPrice1L,
                      editForm1L.images,
                      editForm1L.description,
                      parsedPrice5L,
                      editForm5L.images,
                      editForm5L.description
                    );
                    
                    setEditingProduct(null);
                  }}
                className="flex-1 py-3.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-black text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer font-black"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Assignment Modal */}
      {isAssignModalOpen && assigningSalesPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 font-serif">Assign Customers to Sales Representative</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Representative: <span className="font-bold text-neutral-900">{assigningSalesPerson.name}</span> ({assigningSalesPerson.email})
                </p>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-600 pb-2 border-b border-neutral-100">
                <span>Select customers to assign ({selectedCustomerIds.length} selected)</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedCustomerIds(customers.map(c => c.id))}
                    className="text-[#b5835a] hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span>•</span>
                  <button 
                    type="button"
                    onClick={() => setSelectedCustomerIds([])}
                    className="text-neutral-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {customers.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  No customers found in database.
                </div>
              ) : (
                customers.map((cust) => {
                  const isSelected = selectedCustomerIds.includes(cust.id);
                  const isAssignedToOther = cust.assigned_sales_person && cust.assigned_sales_person !== assigningSalesPerson.id;

                  return (
                    <div 
                      key={cust.id}
                      onClick={() => handleToggleCustomerSelection(cust.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#d4a373]/10 border-[#d4a373] text-neutral-900 shadow-sm' 
                          : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#d4a373] border-[#d4a373] text-black' : 'border-neutral-400 bg-white'
                        }`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                            <span>{cust.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              cust.stage === 'Customer' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {cust.stage}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {cust.email} • {cust.phone || 'No phone'} • {cust.ordersCount} Orders ({cust.totalSpent})
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        {cust.assigned_sales_person === assigningSalesPerson.id ? (
                          <span className="text-emerald-600 font-bold">Currently Assigned</span>
                        ) : isAssignedToOther ? (
                          <span className="text-amber-600 font-medium">Assigned to: {cust.assigned_sales_person_name}</span>
                        ) : (
                          <span className="text-neutral-400 italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAssignment}
                disabled={isSavingAssignment}
                className="px-6 py-2.5 rounded-xl bg-[#d4a373] hover:bg-[#c29161] text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSavingAssignment ? 'Saving Assignments...' : `Save Assignments (${selectedCustomerIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




