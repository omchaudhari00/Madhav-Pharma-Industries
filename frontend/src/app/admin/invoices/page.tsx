"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface AdminInvoiceRecord {
  id: string;
  invoice_number: string;
  order_number: string;
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  date: string;
  tax_information: string;
  total_amount: number;
  status: 'Completed' | 'Pending Payment' | 'Under Audit';
}

const ALL_INVOICES: AdminInvoiceRecord[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-9001-2026',
    order_number: 'ORD-5501-INT',
    customer_name: 'Dr. Alistair Vance',
    company_name: 'Helios Pharmaceuticals Ltd',
    email: 'alistair@heliospharma.co.uk',
    phone: '+44 20 7946 0921',
    date: '2026-07-27',
    tax_information: 'LUT Ref: AD24072600123 (Zero-Rated GST)',
    total_amount: 8200.00,
    status: 'Completed',
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-9002-2026',
    order_number: 'ORD-5502-INT',
    customer_name: 'Elena Rostova',
    company_name: 'BioSynthetix GmbH',
    email: 'e.rostova@biosynthetix.de',
    phone: '+49 30 8899 1234',
    date: '2026-07-20',
    tax_information: 'LUT Ref: AD24072600123 (Zero-Rated GST)',
    total_amount: 19500.00,
    status: 'Completed',
  },
  {
    id: 'inv-3',
    invoice_number: 'INV-8890-2025',
    order_number: 'ORD-5480-INT',
    customer_name: 'Marcus Thorne',
    company_name: 'Vanguard Botanicals Corp.',
    email: 'mthorne@vanguardbotanicals.com',
    phone: '+1 415 555 0192',
    date: '2025-11-15',
    tax_information: 'LUT Ref: AD24072600123 (Zero-Rated GST)',
    total_amount: 45000.00,
    status: 'Completed',
  },
  {
    id: 'inv-4',
    invoice_number: 'INV-8891-2025',
    order_number: 'ORD-5482-INT',
    customer_name: 'Theom Chaudhari',
    company_name: 'Madhav Pharma Industries (Internal Test)',
    email: 'theom.chaudahri@gmail.com',
    phone: '+91 98240 11223',
    date: '2025-08-01',
    tax_information: 'Internal Sample Lot (GST Zero)',
    total_amount: 1250.00,
    status: 'Completed',
  },
  {
    id: 'inv-5',
    invoice_number: 'INV-9005-2026',
    order_number: 'ORD-5505-INT',
    customer_name: 'Yuki Takahashi',
    company_name: 'Nippon Fine Herbs K.K.',
    email: 'takahashi@nipponherbs.jp',
    phone: '+81 3 5555 0143',
    date: '2026-07-25',
    tax_information: 'LUT Ref: AD24072600123 (Zero-Rated GST)',
    total_amount: 28400.00,
    status: 'Pending Payment',
  }
];

export default function AdminInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = ALL_INVOICES.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.customer_name.toLowerCase().includes(q) ||
      inv.email.toLowerCase().includes(q) ||
      inv.phone.toLowerCase().includes(q) ||
      inv.company_name.toLowerCase().includes(q) ||
      inv.order_number.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const totalValuation = filtered.reduce((acc, it) => acc + it.total_amount, 0);

  return (
    <div className={styles.wrapper}>
      {/* Title */}
      <div className="flex justify-between items-center hairline-b pb-4 mb-8">
        <div>
          <span className="label-caps label-gold">ENTERPRISE FINANCIAL LEDGER • ALL TIME RECORDS</span>
          <h1 className="headline-md mt-1">ALL COMMERCIAL INVOICES & ORDERS.</h1>
        </div>
        <button
          onClick={() => alert('Exporting complete CSV ledger for audit compliance...')}
          className="btn-secondary"
        >
          EXPORT CSV ARCHIVE
        </button>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className="material-symbols-outlined text-[var(--ink-variant)]">search</span>
          <input
            type="text"
            placeholder="Search by Invoice # (INV-9001), Customer Name, Email, Phone, or Order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold uppercase"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {['ALL', 'Completed', 'Pending Payment', 'Under Audit'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-bold ${statusFilter === status ? 'bg-[var(--ink)] text-white' : 'bg-[var(--paper)] text-[var(--ink)] border border-[var(--hairline)]'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Banner */}
      <div className={styles.summaryBar}>
        <div>
          <span className="label-caps text-[var(--ink-variant)]">SHOWING RESULTS</span>
          <p className="text-sm font-extrabold mt-1">
            {filtered.length} of {ALL_INVOICES.length} invoices found from start to today
          </p>
        </div>
        <div className="text-right">
          <span className="label-caps text-[var(--ink-variant)]">TOTAL INVOICED VALUATION</span>
          <p className="text-xl font-extrabold text-[var(--gold)]">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className={styles.tableBox}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="text-xl font-extrabold mb-2">NO INVOICES MATCHING QUERY</h3>
            <p className="text-sm text-[var(--ink-variant)] mb-4">
              We couldn&apos;t find any invoices matching &quot;{searchQuery}&quot;. Try searching by phone number, email, or invoice ref.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
              className="btn-primary"
            >
              RESET SEARCH
            </button>
          </div>
        ) : (
          <table className="foundry-table">
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>LINKED ORDER</th>
                <th>CUSTOMER NAME & COMPANY</th>
                <th>CONTACT (EMAIL / PHONE)</th>
                <th>ISSUE DATE</th>
                <th>TOTAL AMOUNT ($)</th>
                <th>STATUS</th>
                <th>RECEIPT ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong className="text-[var(--gold)]">{inv.invoice_number}</strong>
                  </td>
                  <td>
                    <strong className="text-sm">{inv.order_number}</strong>
                  </td>
                  <td>
                    <p className="font-extrabold text-[var(--ink)]">{inv.customer_name}</p>
                    <p className="text-xs text-[var(--ink-variant)]">{inv.company_name}</p>
                  </td>
                  <td>
                    <p className="text-xs font-semibold">{inv.email}</p>
                    <p className="text-xs text-[var(--ink-variant)]">{inv.phone}</p>
                  </td>
                  <td>{inv.date}</td>
                  <td>
                    <strong className="text-base font-extrabold text-[var(--ink)]">
                      ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td>
                    <span className={`status-badge ${inv.status === 'Completed' ? 'in-stock' : 'made-to-order'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Downloading signed zero-rated commercial export receipt for ${inv.invoice_number}.pdf`)}
                      className="btn-secondary py-1.5 px-3 text-xs font-bold"
                    >
                      DOWNLOAD PDF →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
