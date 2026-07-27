"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getProductById, ProductSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<ProductSpecimen | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<number>(25);
  const [targetRate, setTargetRate] = useState<number>(0);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
          setQty(data.moq_kg || 25);
          setTargetRate(data.price_per_kg);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="label-caps">LOADING SPECIMEN SHEET FROM FOUNDRY DATABASE...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="headline-md">SPECIMEN NOT FOUND</h1>
        <Link href="/catalog" className="btn-primary">RETURN TO CATALOG DIRECTORY</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingStr = localStorage.getItem('mp_quote_cart');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    const foundIdx = existing.findIndex((item: any) => item.product_id === product.id);
    if (foundIdx > -1) {
      existing[foundIdx].quantity_kg += qty;
      existing[foundIdx].target_price_per_kg = targetRate;
    } else {
      existing.push({
        product_id: product.id,
        product_name: product.name,
        code: product.code,
        price_per_kg: product.price_per_kg,
        quantity_kg: qty,
        target_price_per_kg: targetRate,
      });
    }
    localStorage.setItem('mp_quote_cart', JSON.stringify(existing));
    setAddedMessage(`Added ${qty} KG drum(s) of ${product.name} to your Quote Cart!`);
  };

  return (
    <div className={styles.wrapper}>
      {/* Specimen Header */}
      <section className={styles.headerSection}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <div className="flex items-center gap-2">
              <Link href="/catalog" className="label-caps hover:underline">
                ← SPECIMEN ARCHIVE
              </Link>
              <span className="text-[var(--hairline)]">/</span>
              <span className="label-caps label-gold">{product.code}</span>
            </div>
            <span className="status-badge in-stock">{product.availability_status}</span>
          </div>

          <div className={styles.heroGrid}>
            <div>
              <span className="label-caps label-gold mb-2 block">
                CAS REGISTERED: {product.cas_number || '8014-13-9'} • {product.category}
              </span>
              <h1 className="display-lg mb-4">{product.name}</h1>
              <p className="text-2xl text-[var(--gold)] italic font-semibold mb-6">
                {product.botanical_name || 'Botanical standard'}
              </p>
              <p className="text-lg text-[var(--ink-variant)] max-w-2xl leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* B2B Quotation Builder Box */}
            <div className={styles.quoteBox}>
              <div className="hairline-b pb-4 mb-6">
                <span className="label-caps label-gold">ENTERPRISE QUOTE CONFIGURATOR</span>
                <h3 className="text-2xl font-extrabold mt-1">CONFIG & ADD TO CART</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="label-caps block mb-2">SELECT DRUM QUANTITY (KG)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 250].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setQty(tier)}
                        className={`py-3 text-xs font-bold border ${qty === tier ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--hairline)]'}`}
                      >
                        {tier} KG
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-caps block mb-2">TARGET B2B RATE ($ / KG)</label>
                  <div className="flex items-center border border-[var(--hairline)] bg-white px-4 py-3">
                    <span className="font-extrabold text-[var(--ink)] mr-2">$</span>
                    <input
                      type="number"
                      value={targetRate}
                      onChange={(e) => setTargetRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-extrabold outline-none text-lg text-[var(--ink)]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[var(--paper-low)] border border-[var(--hairline)] flex justify-between items-center">
                  <span className="label-caps">ESTIMATED LOT TOTAL</span>
                  <strong className="text-xl font-extrabold text-[var(--gold)]">
                    ${(qty * targetRate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary w-full py-4 text-sm font-extrabold"
              >
                + ADD TO B2B QUOTE CART ({qty} KG DRUM)
              </button>

              {addedMessage && (
                <div className="mt-4 p-3 bg-[var(--gold)] text-white text-xs font-bold uppercase text-center">
                  ✓ {addedMessage}{' '}
                  <Link href="/quote-cart" className="underline font-extrabold ml-1">
                    GO TO CART →
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-4 hairline-t flex justify-between items-center text-xs text-[var(--ink-variant)]">
                <span>PACKAGING: NITROGEN PURGED</span>
                <span>MOQ: {product.moq_kg} KG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specimen Specifications Table */}
      <section className={styles.specsSection}>
        <div className="container-max">
          <div className={styles.specsGrid}>
            {/* Analytical Specifications */}
            <div className={styles.specsCol}>
              <div className="hairline-b pb-4 mb-6">
                <span className="label-caps label-gold">ANALYTICAL ASSAY PROTOCOL</span>
                <h2 className="headline-md mt-1">PHYSICOCHEMICAL SPECIFICATIONS</h2>
              </div>

              <table className="foundry-table">
                <thead>
                  <tr>
                    <th>PARAMETER</th>
                    <th>TARGET VALUE / TOLERANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>ASSAY PURITY</strong></td>
                    <td><span className="status-badge in-stock">{product.purity}</span></td>
                  </tr>
                  {product.specifications?.map((spec, i) => (
                    <tr key={i}>
                      <td><strong>{spec.key}</strong></td>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>HEAVY METALS (ICP-MS)</strong></td>
                    <td>&lt; 0.05 ppm total Pb, As, Cd, Hg</td>
                  </tr>
                  <tr>
                    <td><strong>RESIDUAL SOLVENT</strong></td>
                    <td>Zero Supercritical CO2 / &lt;20 ppm ethanol</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => alert(`Downloading signed COA batch dossier for ${product.code}.pdf`)}
                  className="btn-secondary"
                >
                  DOWNLOAD COA BATCH DOSSIER PDF →
                </button>
                <button
                  onClick={() => alert(`Downloading MSDS Safety Sheet for ${product.code}.pdf`)}
                  className="btn-secondary"
                >
                  DOWNLOAD MSDS SHEET →
                </button>
              </div>
            </div>

            {/* Applications & Certifications */}
            <div className={styles.appsCol}>
              <div className="hairline-b pb-4 mb-6">
                <span className="label-caps label-gold">FORMULATION FIT</span>
                <h2 className="headline-md mt-1">APPLICATIONS & COMPLIANCE</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="label-caps text-[var(--ink)] mb-3">RECOMMENDED PHARMA APPLICATIONS</h4>
                  <ul className="space-y-2">
                    {product.applications?.map((app, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-[var(--ink-variant)]">
                        <span className="text-[var(--gold)] font-extrabold">✓</span>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 hairline-t">
                  <h4 className="label-caps text-[var(--ink)] mb-3">REGULATORY CERTIFICATIONS</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications?.map((cert, idx) => (
                      <span key={idx} className="status-badge">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[var(--paper-low)] border border-[var(--hairline)]">
                  <span className="label-caps label-gold">STORAGE & STABILITY</span>
                  <p className="text-xs text-[var(--ink-variant)] mt-2 leading-relaxed">
                    Store in original nitrogen-flushed amber HDPE or epoxy aluminum container below 25°C. Retest period is 36 months from manufacture date under sealed conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
