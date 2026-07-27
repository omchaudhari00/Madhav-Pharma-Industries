"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuotations, QuotationSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [quotation, setQuotation] = useState<QuotationSpecimen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getQuotations();
      const found = all.find((x) => x.id === id || x.reference.toLowerCase().includes(String(id).toLowerCase()));
      setQuotation(found || all[0]);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="label-caps">LOADING QUOTATION DOSSIER FROM ARCHIVE...</p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="headline-md">QUOTATION DOSSIER NOT FOUND</h1>
        <Link href="/quotations" className="btn-primary">RETURN TO COMMERCIAL ARCHIVE</Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Editorial Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <div className="flex items-center gap-2">
              <Link href="/quotations" className="label-caps hover:underline">
                ← COMMERCIAL LEDGER
              </Link>
              <span className="text-[var(--hairline)]">/</span>
              <span className="label-caps label-gold">{quotation.reference}</span>
            </div>
            <span className={`status-badge ${quotation.status === 'Approved' ? 'in-stock' : quotation.status === 'In Negotiation' ? 'negotiating' : ''}`}>
              {quotation.status}
            </span>
          </div>

          <div className="flex justify-between items-end flex-wrap gap-6">
            <div>
              <span className="label-caps label-gold mb-2 block">
                ISSUED: {quotation.date} • COMMERCIAL DESK
              </span>
              <h1 className="display-lg mb-2">{quotation.reference}</h1>
              <p className="text-xl text-[var(--ink-variant)]">
                Prepared for <strong>{quotation.customer_name}</strong> ({quotation.company_name})
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => alert(`Downloading formally signed PDF invoice for ${quotation.reference}.pdf`)}
                className="btn-secondary"
              >
                DOWNLOAD SIGNED PDF DOSSIER
              </button>
              <Link
                href={`/quotations/${quotation.id}/negotiate`}
                className="btn-primary"
              >
                OPEN COUNTER-OFFER NEGOTIATION →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quotation Line Items Table */}
      <section className={styles.itemsSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="label-caps label-gold">SPECIMEN REQUISITION BREAKDOWN</span>
              <h2 className="headline-md mt-1">LINE ITEMS & PRICING TIERS</h2>
            </div>
          </div>

          <table className="foundry-table">
            <thead>
              <tr>
                <th>SPECIMEN NAME / CODE</th>
                <th>DRUM QUANTITY</th>
                <th>TARGET RATE ($ / KG)</th>
                <th>LINE TOTAL ($)</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong className="text-lg font-extrabold text-[var(--ink)]">
                      {item.product_name}
                    </strong>
                  </td>
                  <td>
                    <span className="font-extrabold">{item.quantity_kg} KG DRUM</span>
                  </td>
                  <td>
                    <strong className="text-[var(--gold)]">
                      ${item.target_price_per_kg.toFixed(2)} / KG
                    </strong>
                  </td>
                  <td>
                    <strong className="text-lg font-extrabold">
                      ${item.total_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Quotation Notes Box */}
          {quotation.notes && (
            <div className="mt-8 p-6 bg-[var(--paper-low)] border border-[var(--hairline)]">
              <span className="label-caps label-gold block mb-1">CLIENT COMMERCIAL NOTES</span>
              <p className="text-sm text-[var(--ink)] leading-relaxed">
                {quotation.notes}
              </p>
            </div>
          )}

          {/* Totals Summary Card */}
          <div className={styles.totalsCard}>
            <div className="flex justify-between items-center hairline-b pb-4 mb-4">
              <span className="label-caps">COMMERCIAL QUOTATION VALUATION</span>
              <span className="label-caps label-gold">VALID FOR 30 DAYS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-extrabold">NET COMMODITY VALUATION (USD)</span>
              <strong className="text-4xl font-extrabold text-[var(--ink)]">
                ${quotation.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <p className="text-xs text-[var(--ink-variant)] mt-4">
              * Exports are zero-rated for GST under valid LUT. Packaging includes Nitrogen purge & COA analytical report.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
