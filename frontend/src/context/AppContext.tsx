"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id?: number;
  email: string;
  mobile_number?: string;
  first_name: string;
  last_name?: string;
  role?: string;
  customer_stage?: 'Lead' | 'Customer';
  address?: string;
}

export interface CartItem {
  id: string;
  name: string;
  grade: string;
  quantityKg: number;
  unitPrice: number;
  imageUrl: string;
}

export interface RetailCartItem {
  id: string;
  name: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface ProductShowcaseItem {
  id: string;
  name: string;
  categoryTitle: string;
  categorySubtitle: string;
  titleWhite: string;
  titleGold: string;
  badgeText: string;
  specs: string[];
  cardImage: string;
  heroImage: string;
  unitPrice: number;
  retailPrice?: number;
  moq?: string;
  grade: string;
  availability?: 'In Stock' | 'Out of Stock';
}

export const DEFAULT_PRODUCTS: ProductShowcaseItem[] = [
  {
    id: 'cumin-seed-oil',
    name: 'Pure Cumin Seed Oil (Jeera Oil)',
    categoryTitle: 'Cumin',
    categorySubtitle: 'Seed Oil',
    titleWhite: 'Cumin',
    titleGold: 'Seed Oil',
    badgeText: 'BEST SELLER',
    specs: ['100% Pure & Natural', 'Steam Distilled', 'Essential Oil'],
    cardImage: '/images/cumin-seed-oil.png',
    heroImage: '/images/cumin-seed-oil.png',
    unitPrice: 120,
    retailPrice: 299,
    moq: '5 KG',
    grade: '100% Steam Distilled • Pharmaceutical Grade',
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
    moq: '10 KG',
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
    moq: '5 KG',
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
    moq: '5 KG',
    grade: '100% Steam Distilled • Pharma & Wellness Grade',
    availability: 'In Stock',
  },
];

interface AppContextType {
  shopMode: 'retail' | 'bulk';
  setShopMode: (mode: 'retail' | 'bulk') => void;
  retailCartItems: RetailCartItem[];
  addToRetailCart: (item: Omit<RetailCartItem, 'quantity'>, quantity?: number) => void;
  removeFromRetailCart: (id: string) => void;
  updateRetailQuantity: (id: string, quantity: number) => void;
  clearRetailCart: () => void;
  retailCartTotalCount: number;
  isRetailCheckoutOpen: boolean;
  openRetailCheckout: () => void;
  closeRetailCheckout: () => void;
  user: UserProfile | null;
  token: string | null;
  login: (userData: UserProfile, tokenStr?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  openAuth: (tab?: 'signin' | 'signup') => void;
  closeAuth: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantityKg'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantityKg: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  currentPortal: 'storefront' | 'admin' | 'sales' | 'customer';
  setPortal: (portal: 'storefront' | 'admin' | 'sales' | 'customer') => void;
  switchDemoRole: (role: 'Admin' | 'Sales' | 'Customer', stage?: 'Lead' | 'Customer') => void;
  outOfStockProducts: Record<string, boolean>;
  toggleProductStock: (productId: string) => void;
  isProductOutOfStock: (productId: string) => boolean;
  productStatusMap: Record<string, { retailOos?: boolean; b2bOos?: boolean; discontinued?: boolean }>;
  toggleRetailStock: (productId: string) => void;
  toggleB2BStock: (productId: string) => void;
  toggleDiscontinued: (productId: string) => void;
  isRetailOutOfStock: (productId: string) => boolean;
  isB2BOutOfStock: (productId: string) => boolean;
  isDiscontinued: (productId: string) => boolean;
  allProducts: ProductShowcaseItem[];
  addProduct: (product: ProductShowcaseItem) => void;
  deleteProduct: (id: string) => void;
  updateProductDetails: (id: string, b2bPrice: number, retailPrice: number, moq: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CART_ITEMS: CartItem[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [currentPortal, setPortal] = useState<'storefront' | 'admin' | 'sales' | 'customer'>('storefront');

  const [shopMode, setShopMode] = useState<'retail' | 'bulk'>('retail');
  const [retailCartItems, setRetailCartItems] = useState<RetailCartItem[]>([]);
  const [isRetailCheckoutOpen, setIsRetailCheckoutOpen] = useState(false);

  const switchDemoRole = (role: 'Admin' | 'Sales' | 'Customer', stage: 'Lead' | 'Customer' = 'Lead') => {
    const demoUser: UserProfile = {
      id: role === 'Admin' ? 1 : role === 'Sales' ? 2 : 3,
      email: `${role.toLowerCase()}@madhavpharma.com`,
      first_name: role === 'Admin' ? 'Rajesh' : role === 'Sales' ? 'Vikram' : 'Ananya',
      last_name: role === 'Admin' ? 'Madhav (Owner)' : role === 'Sales' ? 'Sharma (Sales)' : 'Patel (Buyer)',
      role: role,
      customer_stage: role === 'Customer' ? stage : undefined,
    };
    setUser(demoUser);
    localStorage.setItem('madhav_user', JSON.stringify(demoUser));
    setToken('demo-jwt-token');
    localStorage.setItem('madhav_token', 'demo-jwt-token');
    if (role === 'Admin') setPortal('admin');
    else if (role === 'Sales') setPortal('sales');
    else setPortal('customer');
  };

  const [outOfStockProducts, setOutOfStockProducts] = useState<Record<string, boolean>>({});
  const [productStatusMap, setProductStatusMap] = useState<Record<string, { retailOos?: boolean; b2bOos?: boolean; discontinued?: boolean }>>({});

  useEffect(() => {
    // Load stored auth on mount
    try {
      const storedUser = localStorage.getItem('madhav_user');
      const storedToken = localStorage.getItem('madhav_token');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
      const storedCart = localStorage.getItem('madhav_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedRetailCart = localStorage.getItem('madhav_retail_cart');
      if (storedRetailCart) {
        setRetailCartItems(JSON.parse(storedRetailCart));
      }
      const storedMode = localStorage.getItem('madhav_shop_mode');
      if (storedMode === 'retail' || storedMode === 'bulk') {
        setShopMode(storedMode);
      }
      const storedOos = localStorage.getItem('madhav_out_of_stock');
      if (storedOos) {
        setOutOfStockProducts(JSON.parse(storedOos));
      }
      const storedStatusMap = localStorage.getItem('madhav_product_status_map');
      if (storedStatusMap) {
        setProductStatusMap(JSON.parse(storedStatusMap));
      }
    } catch (e) {
      console.error('Error loading stored state', e);
    }
  }, []);

  // Lock background website scrolling whenever ANY modal or cart drawer is open
  useEffect(() => {
    const anyModalOpen = isAuthModalOpen || isCartOpen || isRetailCheckoutOpen;
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAuthModalOpen, isCartOpen, isRetailCheckoutOpen]);

    // Ref to prevent the State-to-URL effect from wiping the hash on initial mount
    const hasInitialized = React.useRef(false);

    // URL Hash Routing - Sync URL to State (on load and on browser back/forward)
    // This MUST run before the State-to-URL effect so it can read the hash first
    useEffect(() => {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        const basePortal = hash.split('-')[0];
        
        setIsAuthModalOpen(false);
        setIsCartOpen(false);
        setIsRetailCheckoutOpen(false);

        if (hash === 'signin' || hash === 'signup') {
          setAuthModalTab(hash as 'signin' | 'signup');
          setIsAuthModalOpen(true);
        } else if (hash === 'cart') {
          setIsCartOpen(true);
        } else if (hash === 'checkout') {
          setIsRetailCheckoutOpen(true);
        } else if (basePortal === 'admin' || basePortal === 'sales' || basePortal === 'customer') {
          try {
            const storedUser = localStorage.getItem('madhav_user');
            if (storedUser) {
              const u = JSON.parse(storedUser);
              if (basePortal === 'admin' && u.role === 'Admin') {
                setPortal('admin');
              } else if (basePortal === 'sales' && u.role === 'Sales') {
                setPortal('sales');
              } else if (basePortal === 'customer' && (u.role === 'Customer' || !u.role)) {
                setPortal('customer');
              } else {
                setPortal('storefront');
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            } else {
              // Not logged in, redirect to sign in
              setPortal('storefront');
              setAuthModalTab('signin');
              setIsAuthModalOpen(true);
              window.history.replaceState(null, '', '#signin');
            }
          } catch (e) {
            setPortal('storefront');
          }
        } else {
          setPortal('storefront');
        }
      };

      handleHashChange();
      // Mark as initialized AFTER we've read the hash
      hasInitialized.current = true;

      window.addEventListener('hashchange', handleHashChange);
      // Overriding pushState/replaceState so the component knows when the app itself changes the URL programmatically without a hashchange event
      const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      // Wait for React to process, though we handle State->URL in the other hook anyway
    };

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.history.pushState = originalPushState;
    };
  }, []);

    // URL Hash Routing - Sync State to URL (runs AFTER URL-to-State on subsequent changes only)
    useEffect(() => {
      // Skip the very first render — the URL-to-State effect above handles initial load
      if (!hasInitialized.current) return;

      let newHash = '';
      if (isAuthModalOpen) {
        newHash = authModalTab === 'signup' ? '#signup' : '#signin';
      } else if (isCartOpen) {
        newHash = '#cart';
      } else if (isRetailCheckoutOpen) {
        newHash = '#checkout';
      } else if (currentPortal !== 'storefront') {
        newHash = `#${currentPortal}`;
      }
      
      if (newHash === '') {
        if (window.location.hash !== '') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        const currentHash = window.location.hash;
        const currentBase = currentHash.replace('#', '').split('-')[0];
        const newBase = newHash.replace('#', '').split('-')[0];
        
        // Only update if we're switching to a different portal/modal entirely
        if (currentBase !== newBase) {
          window.history.pushState(null, '', newHash);
        }
      }
    }, [isAuthModalOpen, authModalTab, isCartOpen, isRetailCheckoutOpen, currentPortal]);

  const login = (userData: UserProfile, tokenStr?: string) => {
    setUser(userData);
    localStorage.setItem('madhav_user', JSON.stringify(userData));
    if (tokenStr) {
      setToken(tokenStr);
      localStorage.setItem('madhav_token', tokenStr);
    }
    if (userData.role === 'Admin') setPortal('admin');
    else if (userData.role === 'Sales') setPortal('sales');
    else setPortal('customer');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPortal('storefront');
    localStorage.removeItem('madhav_user');
    localStorage.removeItem('madhav_token');
  };

  const openAuth = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  const openCart = () => {
    setIsRetailCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = (item: Omit<CartItem, 'quantityKg'>, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      let updated: CartItem[];
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

  const removeFromCart = (id: string) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id: string, quantityKg: number) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantityKg: isNaN(quantityKg) ? 0 : quantityKg } : i);
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('madhav_cart');
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantityKg, 0);

  const handleSetShopMode = (mode: 'retail' | 'bulk') => {
    setShopMode(mode);
    localStorage.setItem('madhav_shop_mode', mode);
  };

  const openRetailCheckout = () => {
    setIsCartOpen(false);
    setIsRetailCheckoutOpen(true);
  };

  const closeRetailCheckout = () => {
    setIsRetailCheckoutOpen(false);
  };

  const addToRetailCart = (item: Omit<RetailCartItem, 'quantity'>, quantity = 1) => {
    setRetailCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === item.id);
      let updated: RetailCartItem[];
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

  const removeFromRetailCart = (id: string) => {
    setRetailCartItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('madhav_retail_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateRetailQuantity = (id: string, quantity: number) => {
    setRetailCartItems(prev => {
      let updated: RetailCartItem[];
      if (quantity <= 0) {
        updated = prev.filter(i => i.id !== id);
      } else {
        updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
      }
      localStorage.setItem('madhav_retail_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRetailCart = () => {
    setRetailCartItems([]);
    localStorage.removeItem('madhav_retail_cart');
  };

  const retailCartTotalCount = retailCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleProductStock = (productId: string) => {
    setOutOfStockProducts(prev => {
      const updated = { ...prev, [productId]: !prev[productId] };
      localStorage.setItem('madhav_out_of_stock', JSON.stringify(updated));
      return updated;
    });
  };

  const isProductOutOfStock = (productId: string) => {
    return !!outOfStockProducts[productId];
  };

  const toggleRetailStock = (productId: string) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, retailOos: !current.retailOos } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
    toggleProductStock(productId); // keep legacy synced
  };

  const toggleB2BStock = (productId: string) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, b2bOos: !current.b2bOos } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDiscontinued = (productId: string) => {
    setProductStatusMap(prev => {
      const current = prev[productId] || {};
      const updated = { ...prev, [productId]: { ...current, discontinued: !current.discontinued } };
      localStorage.setItem('madhav_product_status_map', JSON.stringify(updated));
      return updated;
    });
  };

  const isRetailOutOfStock = (productId: string) => {
    return !!(productStatusMap[productId]?.retailOos || outOfStockProducts[productId]);
  };

  const isB2BOutOfStock = (productId: string) => {
    return !!productStatusMap[productId]?.b2bOos;
  };

  const isDiscontinued = (productId: string) => {
    return !!productStatusMap[productId]?.discontinued;
  };

  const [allProducts, setAllProducts] = useState<ProductShowcaseItem[]>(() => {
    try {
      const stored = localStorage.getItem('madhav_all_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If we have saved products, use them (they contain price edits + custom products)
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage:', e);
    }
    return DEFAULT_PRODUCTS;
  });

  const addProduct = (newProduct: ProductShowcaseItem) => {
    setAllProducts(prev => {
      const updated = [...prev, newProduct];
      try {
        localStorage.setItem('madhav_all_products', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save product to localStorage:', e);
      }
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setAllProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      try {
        localStorage.setItem('madhav_all_products', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage after delete:', e);
      }
      return updated;
    });
  };

  const updateProductDetails = (id: string, b2bPrice: number, retailPrice: number, moq: string) => {
    setAllProducts(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, unitPrice: b2bPrice, retailPrice: retailPrice, moq: moq } : p
      );
      try {
        localStorage.setItem('madhav_all_products', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage after product edit:', e);
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuth,
        closeAuth,
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        currentPortal,
        setPortal,
        switchDemoRole,
        outOfStockProducts,
        toggleProductStock,
        isProductOutOfStock,
        productStatusMap,
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
        shopMode,
        setShopMode: handleSetShopMode,
        retailCartItems,
        addToRetailCart,
        removeFromRetailCart,
        updateRetailQuantity,
        clearRetailCart,
        retailCartTotalCount,
        isRetailCheckoutOpen,
        openRetailCheckout,
        closeRetailCheckout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
