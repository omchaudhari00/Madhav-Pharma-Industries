"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      {/* Editorial Header */}
      <section className={styles.headerSection}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">CORPORATE BIOGRAPHY</span>
            <span className="label-caps">GMP FACILITY CODE: MP-8820-IN</span>
          </div>

          <motion.h1 
            className="headline-lg max-w-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            A SWISS-MODERNIST FOUNDRY OF BOTANICAL PURITY & CHEMICAL EXACTITUDE.
          </motion.h1>

          <p className="text-xl text-[var(--ink-variant)] max-w-2xl">
            Madhav Pharma Industries is an analytical botanical extraction foundry situated in Ahmedabad, India, manufacturing standardized phytomedicines and essential oils for European and North American pharmacopeias.
          </p>
        </div>
      </section>

      {/* Editorial Grid: Our Principles */}
      <section className={styles.principlesSection}>
        <div className="container-max">
          <div className={styles.grid}>
            <div className={styles.col}>
              <span className="label-caps label-gold mb-2 block">01 / TRACEABILITY</span>
              <h2 className="text-2xl font-extrabold mb-4">SEED-TO-DRUM PROVENANCE</h2>
              <p className="text-[var(--ink-variant)]">
                Every botanical extract drum leaving our facility carries a lot-traceable ledger mapping directly to specific Indian farmer cooperatives, harvesting coordinates, and soil assay test certificates.
              </p>
            </div>
            <div className={styles.col}>
              <span className="label-caps label-gold mb-2 block">02 / ANALYTICAL RIGOR</span>
              <h2 className="text-2xl font-extrabold mb-4">HPLC & GC-MS VALIDATION</h2>
              <p className="text-[var(--ink-variant)]">
                  Our 45,000 sq. ft. WHO-GMP and ISO 9001:2015 certified manufacturing facility in Gujrat operates under strict pharmaceutical quality systems. Every raw botanical batch undergoes dual-stage HPLC and GC-MS profiling to guarantee standardized active concentrations and absence of heavy metals (&lt;0.05 ppm).
              </p>
            </div>
            <div className={styles.col}>
              <span className="label-caps label-gold mb-2 block">03 / EXPORT SPEED</span>
              <h2 className="text-2xl font-extrabold mb-4">ZERO-RATED COMMERCIAL LUT</h2>
              <p className="text-[var(--ink-variant)]">
                Our export documentation desk automates customs filing, phytosanitary certificates, and European REACH compliance for rapid air and ocean cargo clearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Table */}
      <section className={styles.tableSection}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">EXECUTIVE GOVERNANCE</span>
              <h2 className="headline-md mt-1">SCIENTIFIC ADVISORY BOARD</h2>
            </div>
          </div>

          <table className="foundry-table">
            <thead>
              <tr>
                <th>OFFICER NAME</th>
                <th>TECHNICAL ROLE</th>
                <th>QUALIFICATION</th>
                <th>DIVISION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dr. Madhavan Chaudhari</strong></td>
                <td>Chief Scientific Officer & Founder</td>
                <td>Ph.D. Pharmacognosy, ETH Zürich</td>
                <td><span className="status-badge in-stock">Executive Board</span></td>
              </tr>
              <tr>
                <td><strong>Dr. Ananya Sharma</strong></td>
                <td>Head of Analytical Quality Control</td>
                <td>M.Sc. Analytical Chemistry, IIT Bombay</td>
                <td><span className="status-badge">Laboratory QA</span></td>
              </tr>
              <tr>
                <td><strong>Vikramaditya Patel</strong></td>
                <td>VP Global Commercial Operations</td>
                <td>MBA International Trade, IIM Ahmedabad</td>
                <td><span className="status-badge">Export B2B</span></td>
              </tr>
            </tbody>
          </table>

          <div className="mt-12 flex justify-between items-center hairline-t pt-8">
            <span className="label-caps">WANT TO CONSULT OUR TECHNICAL DIRECTORS?</span>
            <Link href="/quote-cart" className="btn-primary">
              REQUEST TECHNICAL SPECIMEN CONSULTATION
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
