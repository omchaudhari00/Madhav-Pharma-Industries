"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

interface CertificationDoc {
  code: string;
  name: string;
  authority: string;
  issue_date: string;
  expiry_date: string;
  status: 'VERIFIED ACTIVE' | 'ANNUAL REVIEW';
  scope: string;
}

const CERT_DOCS: CertificationDoc[] = [
  {
    code: 'CERT-GMP-8820',
    name: 'WHO-GMP Standard Pharmaceutical Factory License',
    authority: 'World Health Organization & State Food & Drug Admin',
    issue_date: '2025-01-15',
    expiry_date: '2028-01-14',
    status: 'VERIFIED ACTIVE',
    scope: 'Manufacturing of botanical extracts, essential oils, and standardized oleoresin active pharmaceutical ingredients (APIs).'
  },
  {
    code: 'CERT-ISO-9001',
    name: 'ISO 9001:2015 Quality Management System',
    authority: 'TÜV SÜD South Asia Private Ltd.',
    issue_date: '2024-11-01',
    expiry_date: '2027-10-31',
    status: 'VERIFIED ACTIVE',
    scope: 'Quality governance, raw material traceability, lot serialization, and customer quotation/export fulfillment.'
  },
  {
    code: 'CERT-FDA-US',
    name: 'United States FDA Drug Establishment Registration',
    authority: 'U.S. Food & Drug Administration (FEI #301988214)',
    issue_date: '2026-01-01',
    expiry_date: '2026-12-31',
    status: 'VERIFIED ACTIVE',
    scope: 'Registered foreign facility for manufacturing dietary ingredients and pharmaceutical botanical extracts.'
  },
  {
    code: 'CERT-ISO-22000',
    name: 'ISO 22000 Food Safety Management & HACCP',
    authority: 'Bureau Veritas Certification',
    issue_date: '2025-03-10',
    expiry_date: '2028-03-09',
    status: 'VERIFIED ACTIVE',
    scope: 'Nutraceutical softgel excipients, food-grade essential oils, and allergen-free packaging protocols.'
  },
  {
    code: 'CERT-ORG-EU',
    name: 'EU & USDA Organic Agricultural Certification',
    authority: 'Control Union Certifications India',
    issue_date: '2025-06-01',
    expiry_date: '2026-05-31',
    status: 'ANNUAL REVIEW',
    scope: 'Certified organic farming cooperative procurement of Cuminum cyminum, Mentha piperita, and Withania somnifera.'
  }
];

export default function QualityPage() {
  return (
    <div className={styles.wrapper}>
      {/* Title Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">REGULATORY COMPLIANCE ARCHIVE</span>
            <span className="label-caps">ALL CERTIFICATES AVAILABLE IN ZERO-RATED EXPORT DOSSIERS</span>
          </div>

          <motion.h1 
            className="headline-lg max-w-4xl mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            VERIFIED REGULATORY ACCREDITATIONS & GMP COMPLIANCE.
          </motion.h1>

          <p className="text-xl text-[var(--ink-variant)] max-w-2xl">
            We maintain an open regulatory ledger. Download our official GMP, ISO, and US FDA factory certificates directly for your corporate supplier qualification audit.
          </p>
        </div>
      </section>

      {/* Certifications Table */}
      <section className={styles.certSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">SWISS-MODERNIST ACCREDITATION LEDGER</span>
              <h2 className="headline-md mt-1">OFFICIAL LICENSES & CERTIFICATES</h2>
            </div>
            <span className="label-caps text-[var(--gold)]">5 ACTIVE CERTIFICATES ON FILE</span>
          </div>

          <table className="foundry-table">
            <thead>
              <tr>
                <th>CERTIFICATE CODE</th>
                <th>LICENSING ACCREDITATION</th>
                <th>ISSUING REGULATORY AUTHORITY</th>
                <th>EXPIRY DATE</th>
                <th>STATUS</th>
                <th>SPECIMEN DOCUMENT</th>
              </tr>
            </thead>
            <tbody>
              {CERT_DOCS.map((cert) => (
                <tr key={cert.code}>
                  <td>
                    <strong className="text-[var(--gold)]">{cert.code}</strong>
                  </td>
                  <td>
                    <p className="font-extrabold text-[var(--ink)]">{cert.name}</p>
                    <p className="text-xs text-[var(--ink-variant)] mt-1 max-w-sm">{cert.scope}</p>
                  </td>
                  <td>{cert.authority}</td>
                  <td>{cert.expiry_date}</td>
                  <td>
                    <span className="status-badge in-stock">{cert.status}</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => alert(`Downloading signed specimen copy: ${cert.code}.pdf (AES-256 Verified)`)}
                      className="btn-secondary py-2 px-4 text-xs font-bold"
                    >
                      DOWNLOAD PDF →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytical Lab CTA */}
      <section className={styles.labCta}>
        <div className="container-max">
          <div className={styles.ctaBox}>
            <div>
              <span className="label-caps label-gold">SPECIMEN TESTING PROTOCOL</span>
              <h2 className="text-2xl font-extrabold mt-1 mb-3">NEED BATCH-SPECIFIC COA & HPLC SPECTRA?</h2>
              <p className="text-[var(--ink-variant)] max-w-xl">
                Every shipment is accompanied by a unique HPLC chromatogram, GC-MS fingerprint, and heavy metal ICP-MS certificate.
              </p>
            </div>
            <Link href="/catalog" className="btn-primary">
              BROWSE SPECIMEN SHEETS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
