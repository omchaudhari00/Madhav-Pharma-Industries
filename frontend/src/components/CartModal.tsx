"use client";

import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartModal: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart, openAuth, user, token, setPortal } = useApp();

  if (!isCartOpen) return null;

  const totalEstimatedUSD = cartItems.reduce((acc, item) => acc + item.quantityKg * item.unitPrice, 0);

  const handleRequestQuote = async () => {
    if (!user) {
      closeCart();
      openAuth('signin');
      return;
    }

    const newQuote = {
      id: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      product: cartItems.map(i => i.name).join(', '),
      quantity: `${cartItems.reduce((acc, i) => acc + i.quantityKg, 0)} KG`,
      items: cartItems.map(i => ({
        name: i.name,
        quantityKg: i.quantityKg,
        unitPrice: i.unitPrice
      })),
      requestedPrice: `₹${cartItems.length > 0 ? cartItems[0].unitPrice : '1,500'} / KG`,
      offeredPrice: 'Pending Sales Review',
      status: 'Pending',
      salesAgent: 'Unassigned',
      notes: 'Quotation submitted for review',
      customerAddress: user.address || '123 Pharma Estate, Ahmedabad, Gujarat',
      customer: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      phone: user.mobile_number || '9000000000',
      stage: user.customer_stage || 'Lead'
    };

    const existing = JSON.parse(localStorage.getItem('madhav_quotes') || '[]');
    localStorage.setItem('madhav_quotes', JSON.stringify([newQuote, ...existing]));

    try {
      await fetch('/api/quotations/quotations/create_from_cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ items: cartItems })
      });
    } catch (e) {
      console.error('Backend create_from_cart failed, quote saved locally:', e);
    }

    alert(`Quotation request sent for ${cartItems.length} product(s)! Our Sales team has received your request.`);
    clearCart();
    closeCart();
    setPortal('customer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 text-white shadow-2xl flex flex-col justify-between">
          {/* Top Header */}
          <div>
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-brand">Quotation Cart</h2>
                  <p className="text-xs text-neutral-400">B2B Steam Distilled Essential Oils</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-4 stroke-1" />
                  <p className="text-neutral-300 font-medium text-sm mb-1">Your quotation cart is empty</p>
                  <p className="text-neutral-500 text-xs mb-6">Add botanical oils to request instant bulk pricing.</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-xs font-bold uppercase tracking-wider text-white transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex space-x-4 relative group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-white truncate pr-6">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{item.grade}</p>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity controls in kg */}
                        <div className="flex items-center space-x-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantityKg - 5))}
                            className="p-1 text-neutral-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-white px-2">
                            {item.quantityKg} kg
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantityKg + 5)}
                            className="p-1 text-neutral-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-neutral-300">
                          ~${item.quantityKg * item.unitPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Quotation Checkout Panel */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-neutral-400">Total Bulk Quantity</span>
                <span className="font-bold text-white">
                  {cartItems.reduce((sum, item) => sum + item.quantityKg, 0)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-base mb-6">
                <span className="text-neutral-300 font-medium">Estimated Pricing</span>
                <span className="font-extrabold text-white text-lg">
                  ~${totalEstimatedUSD.toLocaleString()} USD
                </span>
              </div>

              <button
                onClick={handleRequestQuote}
                className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Request Bulk Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>ISO 9001:2015 &amp; GMP Certified Quality</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
