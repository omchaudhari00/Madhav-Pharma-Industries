"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders, OrderSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSpecimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Title Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">ENTERPRISE LOGISTICS LEDGER</span>
            <span className="label-caps">AIR & OCEAN CARGO DHL EXPRESS MONITORING</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-4">
            B2B ORDER MANAGEMENT & TRACKING.
          </h1>
          <p className="text-lg text-[var(--ink-variant)] max-w-2xl">
            Monitor active production batches, inspect real-time DHL air freight airway bills, and download customs zero-rated shipping manifests.
          </p>
        </div>
      </section>

      {/* Orders Table */}
      <section className={styles.tableSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">COMMERCIAL CONTRACT SHIPMENTS</span>
              <h2 className="headline-md mt-1">REGISTERED ORDERS ({orders.length})</h2>
            </div>
            <Link href="/quote-cart" className="btn-secondary">
              OPEN QUOTE CART →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <p className="label-caps">LOADING SHIPMENT ARCHIVE...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.loadingBox}>
              <h3 className="text-xl font-extrabold mb-2">NO ACTIVE ORDERS</h3>
              <p className="text-sm text-[var(--ink-variant)] mb-4">
                Your enterprise account has no active or completed B2B shipments.
              </p>
              <Link href="/catalog" className="btn-primary">BROWSE SPECIMEN CATALOG</Link>
            </div>
          ) : (
            <table className="foundry-table">
              <thead>
                <tr>
                  <th>ORDER NUMBER</th>
                  <th>DISPATCH DATE</th>
                  <th>CONSIGNEE ACCOUNT</th>
                  <th>CARGO TRACKING REF</th>
                  <th>COMMERCIAL TOTAL</th>
                  <th>LOGISTICS STATUS</th>
                  <th>SHIPPING DOSSIER</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong className="text-[var(--gold)]">{ord.order_number}</strong>
                    </td>
                    <td>{ord.date}</td>
                    <td>
                      <strong className="text-base font-extrabold">{ord.customer_name}</strong>
                    </td>
                    <td>
                      <span className="font-mono text-xs bg-[var(--paper-highest)] px-2 py-1">
                        {ord.tracking_reference || 'AWAITING AIRWAY BILL'}
                      </span>
                    </td>
                    <td>
                      <strong className="text-lg font-extrabold text-[var(--ink)]">
                        ${ord.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <span className="status-badge in-stock">{ord.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading Airway Bill & Custom LUT export manifest for ${ord.order_number}.pdf`)}
                        className="btn-secondary py-2 px-3 text-xs font-bold"
                      >
                        EXPORT DOSSIER PDF →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
