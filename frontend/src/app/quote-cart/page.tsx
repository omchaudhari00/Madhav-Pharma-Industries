"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface CartItem {
  product_id: string;
  product_name: string;
  code: string;
  price_per_kg: number;
  quantity_kg: number;
  target_price_per_kg: number;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    product_id: 'mp-101',
    product_name: 'Cumin Seed Essential Oil (CSO-9901-IN)',
    code: 'CSO-9901-IN',
    price_per_kg: 84.50,
    quantity_kg: 100,
    target_price_per_kg: 82.00,
  },
  {
    product_id: 'mp-103',
    product_name: 'Ashwagandha Root Extract (ASH-8805-EX)',
    code: 'ASH-8805-EX',
    price_per_kg: 95.00,
    quantity_kg: 50,
    target_price_per_kg: 90.00,
  }
];

export default function QuoteCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [incoterm, setIncoterm] = useState('CIF Rotterdam Port (Sea Cargo)');
  const [packaging, setPackaging] = useState('Nitrogen-flushed 25kg Epoxy Aluminum Drum');
  const [clientNotes, setClientNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('mp_quote_cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      } catch {
        // use defaults
      }
    }
    setItems(DEFAULT_ITEMS);
  }, []);

  const updateQuantity = (idx: number, delta: number) => {
    const next = [...items];
    const newQty = Math.max(10, next[idx].quantity_kg + delta);
    next[idx].quantity_kg = newQty;
    setItems(next);
    localStorage.setItem('mp_quote_cart', JSON.stringify(next));
  };

  const updateTargetPrice = (idx: number, val: number) => {
    const next = [...items];
    next[idx].target_price_per_kg = val;
    setItems(next);
    localStorage.setItem('mp_quote_cart', JSON.stringify(next));
  };

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    localStorage.setItem('mp_quote_cart', JSON.stringify(next));
  };

  const totalIndicative = items.reduce((sum, it) => sum + it.price_per_kg * it.quantity_kg, 0);
  const totalTarget = items.reduce((sum, it) => sum + it.target_price_per_kg * it.quantity_kg, 0);

  const handleSubmitQuote = async () => {
    setSubmitting(true);
    // Simulate submission to Django /api/quotations/quotations/
    setTimeout(() => {
      setSubmitting(false);
      localStorage.removeItem('mp_quote_cart');
      router.push('/quotations/mp-8821');
    }, 1200);
  };

  return (
    <div className={styles.wrapper}>
      {/* Title Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">ENTERPRISE QUOTATION REQUISITION</span>
            <span className="label-caps">ZERO-RATED COMMERCIAL LUT EXPORT PROTOCOL</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-4">
            B2B QUOTE CART & TERMS CONFIGURATOR.
          </h1>
          <p className="text-lg text-[var(--ink-variant)] max-w-2xl">
            Configure drum lot quantities, declare target commercial rates, and select international shipping INCOTERMS. Our commercial desk responds within 4 business hours.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className={styles.cartSection}>
        <div className="container-max">
          <div className={styles.cartGrid}>
            {/* Items Column */}
            <div className={styles.itemsCol}>
              <div className="flex justify-between items-center hairline-b pb-4 mb-6">
                <div>
                  <span className="label-caps label-gold">SELECTED SPECIMENS</span>
                  <h2 className="headline-md mt-1">CART ITEMS ({items.length})</h2>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={() => {
                      setItems([]);
                      localStorage.removeItem('mp_quote_cart');
                    }}
                    className="btn-secondary py-2 px-4 text-xs font-bold uppercase tracking-wider"
                  >
                    CLEAR ALL ITEMS
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-12 text-center border border-[var(--hairline)] bg-[var(--paper-low)] rounded-[10px]">
                  <h3 className="text-xl font-extrabold mb-2">YOUR QUOTE CART IS EMPTY</h3>
                  <p className="text-sm text-[var(--ink-variant)] mb-6">
                    Add botanical extracts or essential oils from our specimen catalog.
                  </p>
                  <Link href="/catalog" className="btn-primary">
                    EXPLORE 240+ SPECIMENS
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((it, index) => (
                    <div key={index} className={styles.itemCard}>
                      <div className="flex justify-between items-start hairline-b pb-4 mb-6">
                        <div>
                          <span className="label-caps text-[var(--gold)]">{it.code}</span>
                          <h3 className="text-xl font-extrabold mt-1">{it.product_name}</h3>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="btn-secondary py-1.5 px-3 text-xs font-bold uppercase"
                        >
                          REMOVE ×
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 items-center p-4 border border-[var(--hairline)] bg-[var(--paper-low)] rounded-[10px]">
                        {/* Quantity Selector - no border on + and - */}
                        <div>
                          <label className="label-caps block mb-2 text-[var(--ink-variant)]">DRUM QUANTITY (KG)</label>
                          <div className="flex items-center bg-[var(--paper)] rounded-[10px] overflow-hidden px-2 py-1.5 border border-[var(--hairline)]">
                            <button
                              onClick={() => updateQuantity(index, -25)}
                              style={{ border: 'none', outline: 'none', background: 'transparent' }}
                              className="px-3 py-1 font-extrabold text-lg hover:text-[var(--gold)] transition-colors cursor-pointer"
                              title="Decrease quantity by 25kg"
                            >
                              −
                            </button>
                            <span className="flex-1 text-center font-extrabold text-sm sm:text-base py-1">
                              {it.quantity_kg} KG
                            </span>
                            <button
                              onClick={() => updateQuantity(index, 25)}
                              style={{ border: 'none', outline: 'none', background: 'transparent' }}
                              className="px-3 py-1 font-extrabold text-lg hover:text-[var(--gold)] transition-colors cursor-pointer"
                              title="Increase quantity by 25kg"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Target Price - styled identically to Proposed Drum Quantity input */}
                        <div>
                          <label className="label-caps block mb-2 text-[var(--ink-variant)]">TARGET RATE ($ / KG)</label>
                          <input
                            type="number"
                            value={it.target_price_per_kg}
                            onChange={(e) => updateTargetPrice(index, parseFloat(e.target.value) || 0)}
                            className={styles.formSelect}
                          />
                        </div>

                        {/* Total Calculation */}
                        <div className="text-left sm:text-right">
                          <span className="label-caps block mb-1 text-[var(--ink-variant)]">TARGET ITEM TOTAL</span>
                          <strong className="text-xl sm:text-2xl font-extrabold text-[var(--gold)]">
                            ${(it.target_price_per_kg * it.quantity_kg).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </strong>
                          <span className="block text-xs text-[var(--ink-variant)]">
                            Standard: ${(it.price_per_kg * it.quantity_kg).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Commercial Terms Form */}
              <div className="mt-12 pt-8 hairline-t">
                <span className="label-caps label-gold block mb-2">LOGISTICS & EXPORT PARAMETERS</span>
                <h3 className="headline-md mb-6">SHIPPING & PACKAGING SPECIFICATION</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label-caps block mb-2">INTERNATIONAL INCOTERM</label>
                    <select
                      value={incoterm}
                      onChange={(e) => setIncoterm(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option>CIF Rotterdam Port (Sea Cargo)</option>
                      <option>CIF Hamburg Port (Sea Cargo)</option>
                      <option>CIP London Heathrow (Air Cargo Priority)</option>
                      <option>CIP New York JFK (Air Cargo Priority)</option>
                      <option>FOB Nhava Sheva Mumbai Port (Sea Cargo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-caps block mb-2">PHARMACEUTICAL DRUM PACKAGING</label>
                    <select
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option>Nitrogen-flushed 25kg Epoxy Aluminum Drum</option>
                      <option>Nitrogen-flushed 50kg Virgin HDPE Drum</option>
                      <option>200kg Stainless Steel Pharma Drum (UN Certified)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-caps block mb-2">ADDITIONAL ANALYTICAL & PACKAGING NOTES</label>
                  <textarea
                    rows={4}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Specify target delivery schedule, REACH compliance docs, or custom Certificate of Analysis requirements..."
                    className={styles.formTextarea}
                  />
                </div>
              </div>
            </div>

            {/* Summary Sticky Box */}
            <div className={styles.summaryCol}>
              <div className={styles.summaryBox}>
                <div className="hairline-b pb-4 mb-6">
                  <span className="label-caps label-gold">REQUISITION SUMMARY</span>
                  <h3 className="text-2xl font-extrabold mt-1">COMMERCIAL TOTALS</h3>
                </div>

                <div className="space-y-4 hairline-b pb-6 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--ink-variant)]">TOTAL SPECIMENS</span>
                    <strong>{items.length} ITEMS</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--ink-variant)]">TOTAL BULK WEIGHT</span>
                    <strong>{items.reduce((sum, it) => sum + it.quantity_kg, 0)} KG</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--ink-variant)]">STANDARD TIER TOTAL</span>
                    <strong className="text-[var(--ink-variant)] line-through">
                      ${totalIndicative.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="label-caps text-[var(--gold)] block">YOUR TARGET QUOTE TOTAL</span>
                    <strong className="text-3xl font-extrabold text-[var(--ink)]">
                      ${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  {totalTarget < totalIndicative && (
                    <span className="status-badge">
                      {(100 - (totalTarget / totalIndicative) * 100).toFixed(1)}% DISCOUNT REQUESTED
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmitQuote}
                  disabled={submitting || items.length === 0}
                  className="btn-primary w-full py-5 text-sm font-extrabold tracking-wider"
                >
                  {submitting ? 'SUBMITTING TO COMMERCIAL DESK...' : 'SUBMIT FORMAL REQUISITION →'}
                </button>

                <p className="text-xs text-[var(--ink-variant)] text-center mt-4 leading-relaxed">
                  Submitting initiates a B2B negotiation dossier. No payment is required until commercial agreement is countersigned.
                </p>
              </div>

              <div className="mt-6 p-4 border border-[var(--hairline)] bg-[var(--paper-low)]">
                <span className="label-caps label-gold block">ZERO-RATED LUT EXPORT</span>
                <p className="text-xs text-[var(--ink-variant)] mt-1">
                  Export shipments are zero-rated for Indian GST under valid Letter of Undertaking (LUT Ref: AD24072600123).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
