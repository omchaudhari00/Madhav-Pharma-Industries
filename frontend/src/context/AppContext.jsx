import React, { createContext, useContext, useState, useEffect } from 'react';

export const DEFAULT_PRODUCTS = [
  {
    id: 'weight-loss-oil',
    name: 'Completely Natural Remedy for Weight Loss',
    categoryTitle: 'Weight Loss',
    categorySubtitle: 'Remedy',
    titleWhite: 'Weight Loss',
    titleGold: 'Remedy',
    badgeText: '100% Natural & Herbal',
    specs: ['Helps in Weight Loss', 'Boosts Metabolism', '100% Natural Ingredients', 'Improves Digestion', 'Detoxifies & Purifies'],
    cardImage: '/images/weight-loss-oil.jpg',
    heroImage: '/images/weight-loss-oil.jpg',
    unitPrice: 150,
    retailPrice: 349,
    grade: '100% Natural Herbal & Ayurvedic',
    availability: 'In Stock',
  },
  {
    id: 'cumin-seed-oil',
    name: 'Pure Cumin Seed Oil (Jeera Oil)',
    categoryTitle: 'Cumin',
    categorySubtitle: 'Seed',
    titleWhite: 'Cumin',
    titleGold: 'Seed',
    badgeText: 'Anti-inflammatory',
    specs: ['Digestive Aid', 'Immunity Booster', 'Skin Clarity', 'Warm & Spicy Aroma', 'Relieves Bloating'],
    cardImage: '/images/cumin_product.jpg',
    heroImage: '/images/cumin_hero.jpg',
    unitPrice: 2200,
    retailPrice: 299,
    grade: '100% Pure • Premium Therapeutic Grade',
    availability: 'In Stock',
  },
  {
    id: 'fennel-seed-oil',
    name: 'Natural Fennel Seed Oil',
    categoryTitle: 'Fennel',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Fennel',
    titleGold: 'Seed Oil',
    badgeText: 'POPULAR CHOICE',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Aromatic Essential Oil'],
    cardImage: '/images/fennel-oil.jpg',
    heroImage: '/images/fennel-oil.jpg',
    unitPrice: 85,
    retailPrice: 249,
    grade: '100% Steam Distilled • Food & Wellness Grade',
    availability: 'In Stock',
  },
  {
    id: 'ajwain-seed-oil',
    name: 'Pure Ajwain Seed Oil',
    categoryTitle: 'Ajwain',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Ajwain',
    titleGold: 'Seed Oil',
    badgeText: 'HIGH POTENCY',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Therapeutic Grade'],
    cardImage: '/images/ajwain-oil.png',
    heroImage: '/images/ajwain-oil.png',
    unitPrice: 95,
    retailPrice: 279,
    grade: '100% Steam Distilled • Pharma Grade',
    availability: 'In Stock',
  },
  {
    id: 'black-seed-oil',
    name: 'Pure Black Seed Oil (Kalonji Oil)',
    categoryTitle: 'Black Seed',
    categorySubtitle: 'Essential Oil',
    titleWhite: 'Black Seed',
    titleGold: 'Essential Oil',
    badgeText: 'PREMIUM CHOICE',
    specs: ['100% Pure & Cold Pressed/Distilled', 'Rich in Thymoquinone', 'Therapeutic Grade'],
    cardImage: '/images/all-oils.png',
    heroImage: '/images/all-oils.png',
    unitPrice: 150,
    retailPrice: 349,
    grade: '100% Steam Distilled • Pharma & Wellness Grade',
    availability: 'In Stock',
  },
];

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [viewingBulkProductId, setViewingBulkProductId] = useState(null);
  const [shopMode, setShopMode] = useState('retail');
  const [retailCartItems, setRetailCartItems] = useState([]);
  const [isRetailCheckoutOpen, setIsRetailCheckoutOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null);
  const [outOfStockProducts, setOutOfStockProducts] = useState({});
  const [productStatusMap, setProductStatusMap] = useState({});

  const openLegalModal = (tab = 'privacy') => setLegalModalTab(tab);

  const closeLegalModal = () => {
    setLegalModalTab(null);
    if (['#privacy', '#terms', '#refund'].includes(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('madhav_user');
      const storedToken = localStorage.getItem('madhav_token');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
      const storedCart = localStorage.getItem('madhav_cart');
      if (storedCart) setCartItems(JSON.parse(storedCart));
      const storedRetailCart = localStorage.getItem('madhav_retail_cart');
      if (storedRetailCart) setRetailCartItems(JSON.parse(storedRetailCart));
      const storedMode = localStorage.getItem('madhav_shop_mode');
      if (storedMode === 'retail' || storedMode === 'bulk') setShopMode(storedMode);
      const storedOos = localStorage.getItem('madhav_out_of_stock');
      if (storedOos) setOutOfStockProducts(JSON.parse(storedOos));
      const storedStatusMap = localStorage.getItem('madhav_product_status_map');
      if (storedStatusMap) setProductStatusMap(JSON.parse(storedStatusMap));
    } catch (e) {
      console.error('Error loading stored state', e);
    }
  }, []);

  useEffect(() => {
    const anyModalOpen = isAuthModalOpen || isCartOpen || isRetailCheckoutOpen || !!legalModalTab;
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    document.documentElement.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAuthModalOpen, isCartOpen, isRetailCheckoutOpen, legalModalTab]);

  const hasInitialized = React.useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setIsAuthModalOpen(false);
      setIsCartOpen(false);
      setIsRetailCheckoutOpen(false);
      if (hash === 'signin' || hash === 'signup') {
        setAuthModalTab(hash);
        setIsAuthModalOpen(true);
      } else if (hash === 'cart') {
        setIsCartOpen(true);
      } else if (hash === 'checkout') {
        setIsRetailCheckoutOpen(true);
      } else if (hash === 'privacy' || hash === 'terms' || hash === 'refund') {
        setLegalModalTab(hash);
      } else if (hash.startsWith('bulk-') || hash === 'bulk-products' || hash === 'bulk') {
        setViewingBulkProductId(hash.replace('bulk-', '') || 'cumin-seed-oil');
      }
    };
    handleHashChange();
    hasInitialized.current = true;
    window.addEventListener('hashchange', handleHashChange);
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) { originalPushState.apply(this, args); };
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) return;
    let newHash = '';
    if (legalModalTab) newHash = `#${legalModalTab}`;
    else if (isAuthModalOpen) newHash = authModalTab === 'signup' ? '#signup' : '#signin';
    else if (isCartOpen) newHash = '#cart';
    else if (isRetailCheckoutOpen) newHash = '#checkout';

    if (newHash === '') {
      if (window.location.hash !== '') window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      const currentBase = window.location.hash.replace('#', '').split('-')[0];
      const newBase = newHash.replace('#', '').split('-')[0];
      if (currentBase !== newBase) window.history.pushState(null, '', newHash);
    }
  }, [isAuthModalOpen, authModalTab, isCartOpen, isRetailCheckoutOpen]);

  const login = (userData, tokenStr) => {
    setUser(userData);
    localStorage.setItem('madhav_user', JSON.stringify(userData));
    if (tokenStr) {
      setToken(tokenStr);
      localStorage.setItem('madhav_token', tokenStr);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('madhav_user');
    localStorage.removeItem('madhav_token');
    setCartItems([]);
    localStorage.removeItem('madhav_cart');
    setRetailCartItems([]);
    localStorage.removeItem('madhav_retail_cart');
    localStorage.removeItem('madhav_retail_orders_list');
  };

  const openAuth = (tab = 'signin') => { setAuthModalTab(tab); setIsAuthModalOpen(true); };
  const closeAuth = () => setIsAuthModalOpen(false);
  const openCart = () => { setIsRetailCheckoutOpen(false); setIsCartOpen(true); };
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantityKg += quantity;
      } else {
        updated = [...prev, { ...item, quantityKg: quantity }];
      }
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
    setIsRetailCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id, quantityKg) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantityKg: isNaN(quantityKg) ? 0 : quantityKg } : i);
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => { setCartItems([]); localStorage.removeItem('madhav_cart'); };
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantityKg, 0);

  const handleSetShopMode = (mode) => { setShopMode(mode); localStorage.setItem('madhav_shop_mode', mode); };
  const openRetailCheckout = () => { setIsCartOpen(false); setIsRetailCheckoutOpen(true); };
  const closeRetailCheckout = () => setIsRetailCheckoutOpen(false);

  const addToRetailCart = (item, quantity = 1) => {
    setRetailCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += quantity;
      } else {
        updated = [...prev, { ...item, quantity }];
      }
      localStorage.setItem('madhav_retail_cart', JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(false);
    setIsRetailCheckoutOpen(true);
  };

  const removeFromRetailCart = (id) => {
    setRetailCartItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('madhav_retail_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateRetailQuantity = (id, quantity) => {
    setRetailCartItems(prev => {
      const updated = quantity <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity } : i);
      localStorage.setItem('madhav_retail_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRetailCart = () => { setRetailCartItems([]); localStorage.removeItem('madhav_retail_cart'); };
  const retailCartTotalCount = retailCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleProductStock = (productId) => {
    setOutOfStockProducts(prev => {
      const updated = { ...prev, [productId]: !prev[productId] };
      localStorage.setItem('madhav_out_of_stock', JSON.stringify(updated));
      return updated;
    });
  };

  const isProductOutOfStock = (productId) => !!outOfStockProducts[productId];

  const toggleRetailStock = (productId) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, retailOos: !current.retailOos } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
    toggleProductStock(productId);
  };

  const toggleB2BStock = (productId) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, b2bOos: !current.b2bOos } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDiscontinued = (productId) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, discontinued: !current.discontinued } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
  };

  const isRetailOutOfStock = (productId) => !!(productStatusMap[productId]?.retailOos || outOfStockProducts[productId]);
  const isB2BOutOfStock = (productId) => !!productStatusMap[productId]?.b2bOos;
  const isDiscontinued = (productId) => !!productStatusMap[productId]?.discontinued;

  const [allProducts, setAllProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('madhav_all_products');
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = false;
          if (parsed.find(p => p.id === 'cumin-seed-retail')) {
            parsed = parsed.filter(p => p.id !== 'cumin-seed-retail');
            updated = true;
          }
          DEFAULT_PRODUCTS.forEach(dp => {
            if (!parsed.find(p => p.id === dp.id)) { parsed.push(dp); updated = true; }
          });
          parsed.forEach(p => {
            if (p.customImages && p.customImages.length === 1 && p.customImages[0] === '/images/bulk_1l.jpg') {
              delete p.customImages; updated = true;
            }
          });
          parsed.sort((a, b) => {
            if (a.id === 'weight-loss-oil') return -1;
            if (b.id === 'weight-loss-oil') return 1;
            return 0;
          });
          if (updated || parsed[0]?.id !== 'weight-loss-oil') localStorage.setItem('madhav_all_products', JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage:', e);
    }
    return DEFAULT_PRODUCTS;
  });

  const addProduct = (newProduct) => {
    setAllProducts(prev => {
      const updated = [...prev, newProduct];
      try { localStorage.setItem('madhav_all_products', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const deleteProduct = (productId) => {
    setAllProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      try { localStorage.setItem('madhav_all_products', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const updateProductDetails = (id, b2bPrice, retailPrice, customImages, description) => {
    setAllProducts(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, unitPrice: b2bPrice, retailPrice, ...(customImages !== undefined && { customImages }), ...(description !== undefined && { description }) } : p
      );
      try { localStorage.setItem('madhav_all_products', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      user, token, login, logout,
      isAuthModalOpen, authModalTab, openAuth, closeAuth,
      isCartOpen, openCart, closeCart,
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotalCount,
      outOfStockProducts, toggleProductStock, isProductOutOfStock,
      productStatusMap, toggleRetailStock, toggleB2BStock, toggleDiscontinued,
      isRetailOutOfStock, isB2BOutOfStock, isDiscontinued,
      allProducts, addProduct, deleteProduct, updateProductDetails,
      shopMode, setShopMode: handleSetShopMode,
      retailCartItems, addToRetailCart, removeFromRetailCart, updateRetailQuantity, clearRetailCart, retailCartTotalCount,
      isRetailCheckoutOpen, openRetailCheckout, closeRetailCheckout,
      legalModalTab, openLegalModal, closeLegalModal,
      viewingBulkProductId, setViewingBulkProductId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
