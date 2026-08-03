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
