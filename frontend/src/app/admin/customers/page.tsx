"use client";

import React from 'react';
import styles from './page.module.css';

interface CustomerRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  country: string;
  credit_limit: number;
  status: 'GMP VERIFIED BUYER' | 'KYC REVIEW' | 'ENTERPRISE PARTNER';
  active_quotes: number;
  lifetime_spend: number;
}

const CUSTOMER_DATA: CustomerRecord[] = [
  {
    id: 'CUST-8810',
    name: 'Dr. Alistair Vance',
    company: 'Helios Pharmaceuticals Ltd',
    email: 'alistair@heliospharma.co.uk',
    country: 'United Kingdom (GB)',
    credit_limit: 150000,
    status: 'ENTERPRISE PARTNER',
    active_quotes: 2,
    lifetime_spend: 480500,
  },
  {
    id: 'CUST-8812',
    name: 'Elena Rostova',
    company: 'BioSynthetix GmbH',
    email: 'e.rostova@biosynthetix.de',
    country: 'Germany (DE)',
    credit_limit: 75000,
    status: 'GMP VERIFIED BUYER',
    active_quotes: 1,
    lifetime_spend: 125000,
  },
  {
    id: 'CUST-8815',
    name: 'Marcus Thorne',
    company: 'Vanguard Botanicals Corp.',
    email: 'mthorne@vanguardbotanicals.com',
    country: 'United States (US)',
    credit_limit: 100000,
    status: 'GMP VERIFIED BUYER',
    active_quotes: 0,
    lifetime_spend: 210000,
  },
  {
    id: 'CUST-8819',
    name: 'Yuki Takahashi',
    company: 'Nippon Fine Herbs K.K.',
    email: 'takahashi@nipponherbs.jp',
    country: 'Japan (JP)',
    credit_limit: 50000,
    status: 'KYC REVIEW',
    active_quotes: 1,
    lifetime_spend: 38000,
  }
];

export default function AdminCustomersPage() {
  return (
    <div className={styles.wrapper}>
      {/* Editorial Title */}
      <div className="flex justify-between items-center hairline-b pb-4 mb-8">
        <div>
          <span className="label-caps label-gold">ENTERPRISE KYC & CUSTOMER AUDIT</span>
          <h1 className="headline-md mt-1">B2B CLIENT DIRECTORY.</h1>
        </div>
        <button
          onClick={() => alert('Initiating corporate compliance KYC invitation email verification flow...')}
          className="btn-primary"
        >
          + INVITE NEW B2B CLIENT
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className={styles.tableBox}>
        <table className="foundry-table">
          <thead>
            <tr>
              <th>CLIENT ID</th>
              <th>AUTHORIZED REPRESENTATIVE</th>
              <th>CORPORATE ENTITY</th>
              <th>JURISDICTION</th>
              <th>KYC ACCREDITATION</th>
              <th>CREDIT LIMIT</th>
              <th>LIFETIME EXPORTS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMER_DATA.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <strong className="text-[var(--gold)]">{cust.id}</strong>
                </td>
                <td>
                  <p className="font-extrabold text-[var(--ink)]">{cust.name}</p>
                  <p className="text-xs text-[var(--ink-variant)]">{cust.email}</p>
                </td>
                <td>
                  <strong className="text-sm">{cust.company}</strong>
                </td>
                <td>{cust.country}</td>
                <td>
                  <span className={`status-badge ${cust.status === 'ENTERPRISE PARTNER' || cust.status === 'GMP VERIFIED BUYER' ? 'in-stock' : 'made-to-order'}`}>
                    {cust.status}
                  </span>
                </td>
                <td>
                  <strong className="text-base font-extrabold">
                    ${cust.credit_limit.toLocaleString()}
                  </strong>
                </td>
                <td>
                  <strong className="text-lg font-extrabold text-[var(--ink)]">
                    ${cust.lifetime_spend.toLocaleString()}
                  </strong>
                </td>
                <td>
                  <button
                    onClick={() => alert(`Opening KYC & LUT Zero-Rated Export DOSSIER for ${cust.company} (${cust.id})...`)}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold"
                  >
                    INSPECT KYC →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
