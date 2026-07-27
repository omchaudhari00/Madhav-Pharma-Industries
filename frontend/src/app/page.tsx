"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProducts, ProductSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function HomePage() {
  const [products, setProducts] = useState<ProductSpecimen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Framer motion variants for stagger reveal
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className={styles.homeWrapper}>
      {/* 1. HERO SECTION (SWISS-MODERNIST TYPOGRAPHY SPECIMEN) */}
      <section className={styles.heroSection}>
        <div className="container-max">
          <motion.div
            className={styles.heroContent}
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className={styles.metaRow}>
              <span className="label-caps label-gold">SWISS-MODERNIST PHARMACEUTICAL EXTRACT FOUNDRY</span>
              <span className="label-caps">AHMEDABAD • GUJARAT • INDIA</span>
            </motion.div>

            <motion.h1 variants={itemVars} className="display-lg">
              PRECISION<br />
              <span className="text-[var(--gold)]">BOTANICAL</span><br />
              ESSENTIALS.
            </motion.h1>

            <motion.div variants={itemVars} className={styles.heroBottomBar}>
              <p className={styles.heroDesc}>
                Manufacturing high-purity botanical extracts, essential oils, and standardized oleoresins for global pharmaceutical, nutraceutical, and clinical research institutions since 1988.
              </p>
              <div className={styles.heroActions}>
                <Link href="/catalog" className="btn-primary">
                  EXPLORE 240+ SPECIMENS
                </Link>
                <Link href="/quote-cart" className="btn-secondary">
                  REQUEST B2B QUOTATION
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. INFINITE SWISS-MODERNIST MARQUEE BANNER */}
      <div className={styles.marqueeSection}>
        <motion.div
          className={styles.marqueeTrack}
          animate={{ x: [0, -1400] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <span>GMP CERTIFIED FOUNDRY • HPLC & GC-MS VERIFIED PURITY • ZERO-RATED EXPORT DOCUMENTATION • ISO 9001:2015 • CERTIFICATE OF ANALYSIS BATCH ANALYZED • </span>
          <span>GMP CERTIFIED FOUNDRY • HPLC & GC-MS VERIFIED PURITY • ZERO-RATED EXPORT DOCUMENTATION • ISO 9001:2015 • CERTIFICATE OF ANALYSIS BATCH ANALYZED • </span>
        </motion.div>
      </div>

      {/* 3. FOUNDRY MODERNIST STATS GRID (HAIRLINE BORDERS) */}
      <section className={styles.statsSection}>
        <div className="container-max">
          <div className={styles.statsGrid}>
            <div className={styles.statCell}>
              <span className="label-caps label-gold">FOUNDED</span>
              <p className={styles.statValue}>1988</p>
              <p className={styles.statDesc}>38 years of botanical extraction expertise and clinical compliance.</p>
            </div>
            <div className={styles.statCell}>
              <span className="label-caps label-gold">SPECIMEN ARCHIVE</span>
              <p className={styles.statValue}>240+</p>
              <p className={styles.statDesc}>Standardized extracts, essential oils, oleoresins, and active powders.</p>
            </div>
            <div className={styles.statCell}>
              <span className="label-caps label-gold">PURITY PROTOCOL</span>
              <p className={styles.statValue}>99.8%</p>
              <p className={styles.statDesc}>Batch-tested via HPLC and GC-MS with downloadable COA certificates.</p>
            </div>
            <div className={styles.statCell}>
              <span className="label-caps label-gold">GLOBAL PRESENCE</span>
              <p className={styles.statValue}>50+</p>
              <p className={styles.statDesc}>Exporting to UK, EU, USA, and Southeast Asia pharmaceutical giants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SPECIMENS ARCHIVE (CARD DARK #122019) */}
      <section className={styles.specimensSection}>
        <div className="container-max">
          <div className={styles.sectionHeader}>
            <div>
              <span className="label-caps label-gold">PRODUCT SPECIMENS • SERIES 2026</span>
              <h2 className="headline-lg mt-2">FEATURED BOTANICALS</h2>
            </div>
            <Link href="/catalog" className="btn-secondary">
              OPEN CATALOG DIRECTORY →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <p className="label-caps">LOADING PHARMACEUTICAL SPECIMEN ARCHIVE...</p>
            </div>
          ) : (
            <div className={styles.specimenGrid}>
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="specimen-card flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="label-caps text-[var(--gold-soft)]">
                        CAS {product.cas_number || 'N/A'}
                      </span>
                      <span className={`status-badge ${product.availability_status === 'In Stock' ? 'in-stock' : 'made-to-order'}`}>
                        {product.availability_status}
                      </span>
                    </div>

                    <p className="label-caps text-[var(--ink-variant)] mb-1">
                      {product.code} • {product.category}
                    </p>
                    <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--gold-soft)] italic mb-4">
                      {product.botanical_name}
                    </p>
                    <p className="text-sm text-[var(--hairline)] mb-6 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Specifications preview table */}
                    <div className={styles.specMiniTable}>
                      <div className={styles.specRow}>
                        <span>PURITY ASSAY</span>
                        <strong>{product.purity}</strong>
                      </div>
                      <div className={styles.specRow}>
                        <span>MINIMUM ORDER</span>
                        <strong>{product.moq_kg} KG DRUM</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--card-dark-tint)] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--ink-variant)] uppercase block">INDICATIVE TIER</span>
                      <span className="text-xl font-extrabold text-[var(--gold-container)]">
                        ${product.price_per_kg.toFixed(2)} / KG
                      </span>
                    </div>
                    <Link
                      href={`/catalog/${product.id}`}
                      className="bg-white text-[var(--ink)] px-5 py-3 text-xs font-extrabold uppercase hover:bg-[var(--gold)] hover:text-white transition-colors"
                    >
                      SPECIMEN SHEET →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. EDITORIAL B2B WORKFLOW TIMELINE */}
      <section className={styles.workflowSection}>
        <div className="container-max">
          <div className={styles.sectionHeader}>
            <div>
              <span className="label-caps label-gold">ENTERPRISE PROTOCOL</span>
              <h2 className="headline-lg mt-2">HOW B2B CLIENTS WORK WITH US</h2>
            </div>
            <Link href="/process" className="btn-secondary">
              DETAILED EXTRACTION PROCESS →
            </Link>
          </div>

          <div className={styles.workflowGrid}>
            <div className={styles.stepBox}>
              <span className={styles.stepNum}>01</span>
              <h3 className={styles.stepTitle}>SELECT & SPECIFY</h3>
              <p className={styles.stepDesc}>
                Browse our 240+ botanical extracts and essential oils. Download HPLC/GC-MS Certificate of Analysis and configure drum quantities.
              </p>
            </div>
            <div className={styles.stepBox}>
              <span className={styles.stepNum}>02</span>
              <h3 className={styles.stepTitle}>REQUEST QUOTATION</h3>
              <p className={styles.stepDesc}>
                Submit your Quote Cart. Our commercial desk responds within 4 business hours with bulk pricing tiers and freight estimates.
              </p>
            </div>
            <div className={styles.stepBox}>
              <span className={styles.stepNum}>03</span>
              <h3 className={styles.stepTitle}>NEGOTIATE & CONFIRM</h3>
              <p className={styles.stepDesc}>
                Use our interactive portal to negotiate target rates or request sample analysis kits before bulk production commitment.
              </p>
            </div>
            <div className={styles.stepBox}>
              <span className={styles.stepNum}>04</span>
              <h3 className={styles.stepTitle}>GLOBAL EXPORT SHIPMENT</h3>
              <p className={styles.stepDesc}>
                Track live order status, customs export LUT documentation, and zero-rated invoices directly from your client dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BLOCK */}
      <section className={styles.ctaSection}>
        <div className="container-max">
          <div className={styles.ctaBox}>
            <div>
              <span className="label-caps label-gold">CLIENT CERTIFIED PARTNERSHIPS</span>
              <h2 className="headline-lg mt-2 mb-4">READY TO SECURE BOTANICAL PURITY?</h2>
              <p className="text-[var(--ink-variant)] max-w-xl mb-8">
                Join 180+ pharmaceutical manufacturers relying on Madhav Pharma Industries for standardized, traceable botanical extracts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/quote-cart" className="btn-primary">
                  OPEN ACTIVE QUOTE CART
                </Link>
                <Link href="/auth" className="btn-secondary">
                  LOGIN TO ENTERPRISE PORTAL
                </Link>
              </div>
            </div>
            <div className={styles.ctaBadge}>
              <span className="material-symbols-outlined text-4xl text-[var(--gold)]">verified</span>
              <span className="label-caps text-center mt-2">ISO 9001:2015 & FDA VERIFIED</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
