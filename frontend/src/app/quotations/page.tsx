"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQuotations, QuotationSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function QuotationsListPage() {
  const [quotations, setQuotations] = useState<QuotationSpecimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getQuotations();
      setQuotations(data);
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
            <span className="label-caps label-gold">ENTERPRISE COMMERCIAL ARCHIVE</span>
            <span className="label-caps">ALL DOSSIERS PROTECTED BY TLS 1.3 AES-256</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-4">
            B2B QUOTE DOSSIERS & NEGOTIATIONS.
          </h1>
          <p className="text-lg text-[var(--ink-variant)] max-w-2xl">
            Review active quotations, inspect commercial counter-offers, and download digitally signed PDF export invoices for bank Letter of Credit compliance.
          </p>
        </div>
      </section>

      {/* Quotations Table */}
      <section className={styles.tableSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">CLIENT REQUISITION LEDGER</span>
              <h2 className="headline-md mt-1">ACTIVE COMMERCIAL QUOTES ({quotations.length})</h2>
            </div>
            <Link href="/quote-cart" className="btn-primary">
              + NEW REQUISITION
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <p className="label-caps">LOADING COMMERCIAL LEDGER FROM DATABASE...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className={styles.loadingBox}>
              <h3 className="text-xl font-extrabold mb-2">NO ACTIVE QUOTATIONS</h3>
              <p className="text-sm text-[var(--ink-variant)] mb-4">
                Your enterprise account has no active B2B quote dossiers.
              </p>
              <Link href="/catalog" className="btn-primary">BROWSE SPECIMEN CATALOG</Link>
            </div>
          ) : (
            <table className="foundry-table">
              <thead>
                <tr>
                  <th>DOSSIER REF</th>
                  <th>REQUISITION DATE</th>
                  <th>CLIENT / COMPANY</th>
                  <th>LINE ITEMS</th>
                  <th>TOTAL VALUATION</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((qt) => (
                  <tr key={qt.id}>
                    <td>
                      <strong className="text-[var(--gold)]">{qt.reference}</strong>
                    </td>
                    <td>{qt.date}</td>
                    <td>
                      <p className="font-extrabold text-[var(--ink)]">{qt.customer_name}</p>
                      <p className="text-xs text-[var(--ink-variant)]">{qt.company_name}</p>
                    </td>
                    <td>
                      <span className="font-extrabold">{qt.items.length} SPECIMEN(S)</span>
                      <p className="text-xs text-[var(--ink-variant)] truncate max-w-[200px]">
                        {qt.items.map((x) => x.product_name).join(', ')}
                      </p>
                    </td>
                    <td>
                      <strong className="text-lg font-extrabold text-[var(--ink)]">
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
                          className="btn-secondary py-2 px-3 text-xs font-extrabold"
                        >
                          INSPECT →
                        </Link>
                        {qt.status === 'In Negotiation' && (
                          <Link
                            href={`/quotations/${qt.id}/negotiate`}
                            className="btn-primary py-2 px-3 text-xs font-extrabold"
                          >
                            NEGOTIATE
                          </Link>
                        )}
                      </div>
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
