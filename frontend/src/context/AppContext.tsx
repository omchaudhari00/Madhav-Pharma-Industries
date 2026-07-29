"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id?: number;
  email: string;
  mobile_number?: string;
  first_name: string;
  last_name?: string;
  role?: string;
}

export interface CartItem {
  id: string;
  name: string;
  grade: string;
  quantityKg: number;
  unitPrice: number;
  imageUrl: string;
}

interface AppContextType {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cumin-seed-oil',
    name: 'Pure Cumin Seed Oil (Jeera Oil)',
    grade: '100% Steam Distilled • Pharmaceutical Grade',
    quantityKg: 10,
    unitPrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'fennel-oil',
    name: 'Natural Fennel Essential Oil',
    grade: 'High Aroma • Food & Wellness Grade',
    quantityKg: 5,
    unitPrice: 85,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

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
    } catch (e) {
      console.error('Error loading stored state', e);
    }
  }, []);

  const login = (userData: UserProfile, tokenStr?: string) => {
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
  };

  const openAuth = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = (item: Omit<CartItem, 'quantityKg'>, quantity = 5) => {
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
    if (quantityKg <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantityKg } : i);
      localStorage.setItem('madhav_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('madhav_cart');
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantityKg, 0);

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
