"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  duration: string;
  specification: string;
  details: string[];
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'BOTANICAL SOURCING & HARVEST LOGISTICS',
    subtitle: 'COOPERATIVE AGRONOMY WITH FIELD MOISTURE & PESTICIDE SCREENING',
    duration: 'STEP 01 • FIELD LEVEL PROTOCOL',
    specification: 'AFLATOXIN < 2 PPB • ORGANOPESTICIDE SCREEN 250+ COMPOUNDS',
    details: [
      'Raw botanical materials are sourced exclusively from contracted organic farmer cooperatives across Gujarat, Madhya Pradesh, and Rajasthan.',
      'Pre-shipment moisture content is strictly capped below 8.5% to prevent Aspergillus fungal spore contamination.',
      'Every batch receives a field lot barcode registered into our Enterprise Quality Control ERP before entering raw storage.'
    ]
  },
  {
    number: '02',
    title: 'SUPERCRITICAL CO2 & STEAM DISTILLATION',
    subtitle: 'ZERO RESIDUAL SOLVENT EXTRACTION USING GERMAN PRESSURE VESSELS',
    duration: 'STEP 02 • LOW-TEMPERATURE EXTRACTION',
    specification: 'RESIDUAL SOLVENT: ZERO (CO2) OR < 20 PPM (ETHANOL)',
    details: [
      'We utilize low-temperature supercritical CO2 extraction at 250 bar pressure to extract delicate sesquiterpenes without thermal degradation.',
      'For essential oils (Cumin, Peppermint, Spearmint), triple steam distillation is performed in SS-316L pharma-grade stainless steel vessels.',
      'Active biomarker yields are monitored continuously via in-line spectrophotometry.'
    ]
  },
  {
    number: '03',
    title: 'CHROMATOGRAPHIC & HPLC STANDARDIZATION',
    subtitle: 'EXACT BIOMARKER CONCENTRATION TARGETING PHARMACOPEIA SPECIFICATIONS',
    duration: 'STEP 03 • ANALYTICAL STANDARDIZATION',
    specification: 'HPLC WITHANOLIDES ≥ 5.0% • CURCUMINOIDS ≥ 95.0%',
    details: [
      'Extracts are standardized to precise pharmacopeial biomarker ratios (e.g. 95% Curcuminoids by HPLC, 5% Withanolides by HPLC).',
      'Shimadzu HPLC-UV and Agilent GC-MS systems perform automated quantification of both target active principles and residual impurities.',
      'Certificates of Analysis (COA) are digitally signed by our Quality Control director.'
    ]
  },
  {
    number: '04',
    title: 'NITROGEN-FLUSHED PHARMA DRUM PACKAGING',
    subtitle: 'HERMETIC SEALING UNDER INERT NITROGEN ATMOSPHERE',
    duration: 'STEP 04 • CONTAINERIZATION & EXPORT',
    specification: 'OXYGEN PARTIAL PRESSURE < 0.1% • HDPE / ALUMINUM 25KG DRUMS',
    details: [
      'Finished extracts are packed in clean-room Class 10,000 ISO environments into virgin HDPE drums or epoxy-lined aluminum containers.',
      'Every drum is purged with 99.999% pure Nitrogen gas before induction sealing to guarantee zero oxidative rancidity during maritime transit.',
      'Unique QR lot codes enable clients to scan and download full laboratory batch dossiers instantly.'
    ]
  }
];

export default function ProcessPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className={styles.wrapper}>
      {/* Title Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps label-gold">ANALYTICAL EXTRACTION METHODOLOGY</span>
            <span className="label-caps">GMP CODEX COMPLIANT • ISO 9001:2015</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-6">
            THE SCIENTIFIC PROTOCOL OF BOTANICAL EXTRACTION.
          </h1>
          <p className="text-xl text-[var(--ink-variant)] max-w-2xl">
            How raw phytobiological specimens are transformed into standardized, high-potency active pharmaceutical ingredients with zero contamination.
          </p>
        </div>
      </section>

      {/* Interactive Hairline Step Explorer */}
      <section className={styles.interactiveSection}>
        <div className="container-max">
          <div className={styles.explorerGrid}>
            {/* Step Selection Drawer */}
            <div className={styles.stepList}>
              <span className="label-caps label-gold mb-4 block">SELECT STAGE OF MANUFACTURING</span>
              {STEPS.map((step, idx) => (
                <button
                  key={step.number}
                  onClick={() => setActiveTab(idx)}
                  className={`${styles.stepButton} ${activeTab === idx ? styles.activeStepButton : ''}`}
                >
                  <span className={styles.stepBadge}>{step.number}</span>
                  <span className="font-extrabold text-left">{step.title}</span>
                  <span className="material-symbols-outlined ml-auto">
                    {activeTab === idx ? 'arrow_forward' : 'chevron_right'}
                  </span>
                </button>
              ))}
            </div>

            {/* Specimen Stage Presentation Sheet */}
            <div className={styles.stepDetailPanel}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className={styles.specimenSheet}
                >
                  <div className="flex justify-between items-center hairline-b pb-4 mb-6">
                    <span className="label-caps label-gold">{STEPS[activeTab].duration}</span>
                    <span className="status-badge in-stock">GMP VERIFIED STAGE</span>
                  </div>

                  <h2 className="headline-md mb-2">{STEPS[activeTab].title}</h2>
                  <p className="text-sm text-[var(--gold)] font-semibold uppercase tracking-wider mb-6">
                    {STEPS[activeTab].subtitle}
                  </p>

                  <div className={styles.specBox}>
                    <span className="label-caps text-[var(--ink-variant)]">TECHNICAL SPECIFICATION LIMIT</span>
                    <p className="text-lg font-extrabold mt-1 text-[var(--ink)]">
                      {STEPS[activeTab].specification}
                    </p>
                  </div>

                  <div className="space-y-4 mt-6">
                    {STEPS[activeTab].details.map((para, pIdx) => (
                      <div key={pIdx} className="flex gap-4 items-start">
                        <span className="text-[var(--gold)] font-bold">0{pIdx + 1}.</span>
                        <p className="text-[var(--ink-variant)] leading-relaxed">{para}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Summary Table */}
      <section className={styles.qualitySummary}>
        <div className="container-max">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="label-caps label-gold">ANALYTICAL TOLERANCES</span>
              <h2 className="headline-md mt-1">STANDARD TEST PROTOCOL</h2>
            </div>
          </div>

          <table className="foundry-table">
            <thead>
              <tr>
                <th>TEST PARAMETER</th>
                <th>ANALYTICAL INSTRUMENT</th>
                <th>PHARMA SPECIFICATION</th>
                <th>RELEASE STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Heavy Metal Screen (Pb, Cd, As, Hg)</strong></td>
                <td>ICP-MS (Inductively Coupled Plasma Mass Spec)</td>
                <td>&lt; 0.05 ppm total heavy metals</td>
                <td><span className="status-badge in-stock">PASS (COA VERIFIED)</span></td>
              </tr>
              <tr>
                <td><strong>Residual Organopesticides</strong></td>
                <td>GC-MS/MS Triple Quadrupole</td>
                <td>Zero detection across 250+ pesticides</td>
                <td><span className="status-badge in-stock">PASS (COA VERIFIED)</span></td>
              </tr>
              <tr>
                <td><strong>Microbial Load & Pathogens</strong></td>
                <td>USP &lt;2021&gt; / &lt;2022&gt; Automated Culture</td>
                <td>E. coli / Salmonella / S. aureus ABSENT</td>
                <td><span className="status-badge in-stock">STERILE CERTIFIED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
