"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvoices, InvoiceSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceSpecimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getInvoices();
      setInvoices(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Editorial Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">ENTERPRISE COMMERCIAL TAX LEDGER</span>
            <span className="label-caps">LUT REFERENCE: AD24072600123 (ZERO-RATED GST)</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-4">
            COMMERCIAL INVOICES & TAX RECORDS.
          </h1>
          <p className="text-lg text-[var(--ink-variant)] max-w-2xl">
            Access zero-rated export tax invoices, Letter of Credit bank payment receipts, and customs clearance receipts for audit verification.
          </p>
        </div>
      </section>

      {/* Invoices Table */}
      <section className={styles.tableSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">SETTLED COMMERCIAL TRANSACTIONS</span>
              <h2 className="headline-md mt-1">INVOICE LEDGER ({invoices.length})</h2>
            </div>
            <Link href="/orders" className="btn-secondary">
              VIEW ACTIVE SHIPMENTS →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <p className="label-caps">LOADING INVOICE RECORDS FROM ACCOUNTING DATABASE...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className={styles.loadingBox}>
              <h3 className="text-xl font-extrabold mb-2">NO COMMERCIAL INVOICES FOUND</h3>
              <p className="text-sm text-[var(--ink-variant)] mb-4">
                Your account has no issued tax invoices.
              </p>
              <Link href="/catalog" className="btn-primary">BROWSE SPECIMEN CATALOG</Link>
            </div>
          ) : (
            <table className="foundry-table">
              <thead>
                <tr>
                  <th>INVOICE NUMBER</th>
                  <th>LINKED ORDER</th>
                  <th>ISSUE DATE</th>
                  <th>TAX INFORMATION & EXPORT LUT</th>
                  <th>TOTAL VALUATION</th>
                  <th>SETTLEMENT STATUS</th>
                  <th>OFFICIAL RECEIPT</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <strong className="text-[var(--gold)]">{inv.invoice_number}</strong>
                    </td>
                    <td>
                      <strong className="text-sm font-bold">{inv.order_number}</strong>
                    </td>
                    <td>{inv.date}</td>
                    <td>
                      <span className="text-xs text-[var(--ink)] font-semibold">
                        {inv.tax_information}
                      </span>
                    </td>
                    <td>
                      <strong className="text-lg font-extrabold text-[var(--ink)]">
                        ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <span className="status-badge in-stock">{inv.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading zero-rated commercial export invoice receipt: ${inv.invoice_number}.pdf`)}
                        className="btn-secondary py-2 px-3 text-xs font-bold"
                      >
                        DOWNLOAD PDF RECEIPT →
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
