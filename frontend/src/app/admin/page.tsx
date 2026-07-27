"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQuotations, QuotationSpecimen, getProducts, ProductSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function AdminOverviewPage() {
  const [quotations, setQuotations] = useState<QuotationSpecimen[]>([]);
  const [products, setProducts] = useState<ProductSpecimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [qt, pr] = await Promise.all([getQuotations(), getProducts()]);
      setQuotations(qt);
      setProducts(pr);
      setLoading(false);
    }
    load();
  }, []);

  const pendingCount = quotations.filter((q) => q.status === 'In Negotiation' || q.status === 'Pending').length;
  const totalValuation = quotations.reduce((acc, q) => acc + q.total_amount, 0);

  return (
    <div className={styles.wrapper}>
      {/* Editorial Title */}
      <div className="flex justify-between items-center hairline-b pb-4 mb-8">
        <div>
          <span className="label-caps label-gold">EXECUTIVE OVERVIEW • B2B COMMERCIAL PORTAL</span>
          <h1 className="headline-md mt-1">EXECUTIVE GOVERNANCE DASHBOARD.</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/products" className="btn-secondary">
            + REGISTER NEW SPECIMEN
          </Link>
          <Link href="/quotations" className="btn-primary">
            INSPECT QUOTE QUEUE ({pendingCount})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className="label-caps label-gold">ACTIVE SPECIMEN ARCHIVE</span>
          <p className={styles.kpiValue}>{products.length}</p>
          <p className="text-xs text-[var(--ink-variant)] mt-1">
            HPLC & GC-MS Verified Pharma Botanicals
          </p>
        </div>

        <div className={styles.kpiCard}>
          <span className="label-caps label-gold">PENDING COMMERCIAL QUOTES</span>
          <p className={styles.kpiValue}>{pendingCount}</p>
          <p className="text-xs text-[var(--ink-variant)] mt-1">
            Requisitions awaiting counter-offer signature
          </p>
        </div>

        <div className={styles.kpiCard}>
          <span className="label-caps label-gold">ACTIVE DOSSIER VALUATION</span>
          <p className={styles.kpiValue}>
            ${totalValuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-[var(--ink-variant)] mt-1">
            Zero-rated LUT Export Pipeline (USD)
          </p>
        </div>

        <div className={styles.kpiCard}>
          <span className="label-caps label-gold">GMP FACTORY STATUS</span>
          <p className={styles.kpiValue}>99.8%</p>
          <p className="text-xs text-[var(--ink-variant)] mt-1">
            Analytical lot release pass rate
          </p>
        </div>
      </div>

      {/* Quotation Queue Section */}
      <section className={styles.sectionBox}>
        <div className="flex justify-between items-end hairline-b pb-4 mb-6">
          <div>
            <span className="label-caps label-gold">COMMERCIAL DESK ACTION QUEUE</span>
            <h2 className="text-2xl font-extrabold mt-1">RECENT REQUISITIONS & DOSSIERS</h2>
          </div>
          <Link href="/quotations" className="text-xs font-bold underline uppercase">
            VIEW ALL DOSSIERS →
          </Link>
        </div>

        {loading ? (
          <p className="label-caps py-12 text-center">LOADING COMMERCIAL QUEUE...</p>
        ) : (
          <table className="foundry-table">
            <thead>
              <tr>
                <th>REF NUMBER</th>
                <th>CLIENT & COMPANY</th>
                <th>ISSUED DATE</th>
                <th>VALUATION ($)</th>
                <th>STATUS</th>
                <th>ADMIN ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((qt) => (
                <tr key={qt.id}>
                  <td>
                    <strong className="text-[var(--gold)]">{qt.reference}</strong>
                  </td>
                  <td>
                    <p className="font-extrabold text-[var(--ink)]">{qt.customer_name}</p>
                    <p className="text-xs text-[var(--ink-variant)]">{qt.company_name}</p>
                  </td>
                  <td>{qt.date}</td>
                  <td>
                    <strong className="text-base font-extrabold">
                      ${qt.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td>
                    <span className={`status-badge ${qt.status === 'Approved' ? 'in-stock' : qt.status === 'In Negotiation' ? 'negotiating' : ''}`}>
                      {qt.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/quotations/${qt.id}`}
                        className="btn-secondary py-1.5 px-3 text-xs font-extrabold"
                      >
                        REVIEW →
                      </Link>
                      {qt.status === 'In Negotiation' && (
                        <button
                          onClick={() => alert(`Commercial quotation ${qt.reference} formally countersigned and approved!`)}
                          className="btn-primary py-1.5 px-3 text-xs font-extrabold"
                        >
                          APPROVE
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
