"use client";

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartModal: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart, openAuth, user, token, setPortal, openRetailCheckout, retailCartTotalCount, cartTotalCount } = useApp();
  const [expectedPrices, setExpectedPrices] = useState<Record<string, string>>({});
  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const totalEstimatedINR = cartItems.reduce((acc, item) => acc + item.quantityKg * item.unitPrice, 0);

  const handleRequestQuote = async () => {
    const invalidItem = cartItems.find(i => !i.quantityKg || i.quantityKg <= 0);
    if (invalidItem) {
      alert(`Please increase quantity above 0 kg for "${invalidItem.name}".`);
      return;
    }

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
      items: cartItems.map(i => {
        const expected = expectedPrices[i.id] ? parseInt(expectedPrices[i.id]) : undefined;
        return {
          name: i.name,
          quantityKg: i.quantityKg,
          unitPrice: expected || i.unitPrice,
          expectedPrice: expected ? `₹${expected}/kg` : undefined,
          standardPrice: `₹${i.unitPrice}/kg`
        };
      }),
      requestedPrice: `₹${cartItems.length > 0 ? (expectedPrices[cartItems[0].id] ? expectedPrices[cartItems[0].id] : cartItems[0].unitPrice) : '1,500'} / KG`,
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
      await fetch(`${import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com'}/api/quotations/quotations/create_from_cart/`, {
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
    <div className="fixed inset-0 z-50 overflow-hidden font-display" data-lenis-prevent="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div 
          className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 text-white shadow-2xl flex flex-col h-full max-h-screen overflow-hidden"
          data-lenis-prevent="true"
        >
          {/* Top Header */}
          <div className="shrink-0">
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

            {/* Cart Switcher Tabs */}
            <div className="flex items-center p-1 bg-neutral-900 border-b border-neutral-800 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => { closeCart(); openRetailCheckout(); }}
                className="flex-1 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>50ml Retail Cart ({retailCartTotalCount})</span>
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg bg-blue-500 text-white font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>B2B Quote Cart ({cartTotalCount})</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4 min-h-0" data-lenis-prevent="true">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-4 stroke-1" />
                  <p className="text-neutral-300 font-medium text-sm mb-1">Your quotation cart is empty</p>
                  <p className="text-neutral-500 text-xs mb-6">Add botanical oils to request instant bulk pricing.</p>
                  <button
                    onClick={() => {
                      closeCart();
                      setTimeout(() => {
                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
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
                        {/* Writable Decimal Quantity input in kg with - / + buttons */}
                        <div className="flex flex-col items-start">
                          <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1 focus-within:border-amber-500/50">
                            <button
                              onClick={() => {
                                const current = item.quantityKg || 1;
                                const nextVal = Math.max(0.1, Number((current - 1).toFixed(2)));
                                updateQuantity(item.id, nextVal);
                                setQtyInputs(prev => ({ ...prev, [item.id]: String(nextVal) }));
                              }}
                              className="p-1 text-neutral-400 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center px-1">
                              <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0.0"
                                value={qtyInputs[item.id] !== undefined ? qtyInputs[item.id] : (item.quantityKg === 0 ? '' : String(item.quantityKg))}
                                onChange={(e) => {
                                  const rawStr = e.target.value;
                                  setQtyInputs(prev => ({ ...prev, [item.id]: rawStr }));
                                  const val = parseFloat(rawStr);
                                  updateQuantity(item.id, isNaN(val) ? 0 : val);
                                }}
                                className="w-12 bg-transparent text-center text-xs font-bold text-white placeholder-neutral-600 focus:outline-none font-mono"
                              />
                              <span className="text-xs font-bold text-neutral-400 pr-0.5">kg</span>
                            </div>
                            <button
                              onClick={() => {
                                const current = item.quantityKg || 0;
                                const nextVal = Number((current + 1).toFixed(2));
                                updateQuantity(item.id, nextVal);
                                setQtyInputs(prev => ({ ...prev, [item.id]: String(nextVal) }));
                              }}
                              className="p-1 text-neutral-400 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {(!item.quantityKg || item.quantityKg <= 0) && (
                            <span className="text-[10px] text-red-400 font-bold mt-1">
                              [!] Increase quantity (&gt; 0 kg)
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-neutral-300">
                          ₹{(item.quantityKg * (expectedPrices[item.id] ? parseInt(expectedPrices[item.id]) || item.unitPrice : item.unitPrice)).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400 font-medium">Expected Price (Optional):</span>
                        <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 w-32 focus-within:border-amber-500/50">
                          <span className="text-xs text-neutral-500 mr-1">₹</span>
                          <input
                            type="number"
                            placeholder={`e.g. ${item.unitPrice}`}
                            value={expectedPrices[item.id] || ''}
                            onChange={(e) => setExpectedPrices(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-full bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none font-mono"
                          />
                          <span className="text-[10px] text-neutral-500 ml-1">/kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                  ~₹{totalEstimatedINR.toLocaleString()}
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




