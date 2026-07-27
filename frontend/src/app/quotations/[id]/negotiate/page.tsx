"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getQuotations, QuotationSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function NegotiateQuotationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [quotation, setQuotation] = useState<QuotationSpecimen | null>(null);
  const [loading, setLoading] = useState(true);

  const [counterPrice, setCounterPrice] = useState<number>(80.0);
  const [counterQty, setCounterQty] = useState<number>(100);
  const [requestSampleKit, setRequestSampleKit] = useState<boolean>(true);
  const [justification, setJustification] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getQuotations();
      const found = all.find((x) => x.id === id || x.reference.toLowerCase().includes(String(id).toLowerCase()));
      if (found) {
        setQuotation(found);
        if (found.items[0]) {
          setCounterPrice(found.items[0].target_price_per_kg - 2);
          setCounterQty(found.items[0].quantity_kg);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="label-caps">LOADING NEGOTIATION DOSSIER...</p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="headline-md">DOSSIER NOT FOUND</h1>
        <Link href="/quotations" className="btn-primary">RETURN TO COMMERCIAL ARCHIVE</Link>
      </div>
    );
  }

  const handleSendCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert(`Counter-offer submitted to Madhav Pharma commercial desk for ${quotation.reference}!`);
      router.push(`/quotations/${quotation.id}`);
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      {/* Editorial Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <div className="flex items-center gap-2">
              <Link href={`/quotations/${quotation.id}`} className="label-caps hover:underline">
                ← DOSSIER {quotation.reference}
              </Link>
              <span className="text-[var(--hairline)]">/</span>
              <span className="label-caps label-gold">COUNTER-OFFER PORTAL</span>
            </div>
            <span className="status-badge negotiating">IN NEGOTIATION</span>
          </div>

          <h1 className="headline-lg max-w-4xl mb-4">
            NEGOTIATE COMMERCIAL TERMS.
          </h1>
          <p className="text-lg text-[var(--ink-variant)] max-w-2xl">
            Propose revised unit pricing tiers, adjust delivery schedules, or request an analytical sample test kit before bulk contract execution.
          </p>
        </div>
      </section>

      {/* Negotiation Form */}
      <section className={styles.formSection}>
        <div className="container-max">
          <div className={styles.grid}>
            {/* Left: Current Requisition Snapshot */}
            <div className={styles.snapshotCol}>
              <div className="hairline-b pb-4 mb-6">
                <span className="label-caps label-gold">CURRENT DOSSIER SNAPSHOT</span>
                <h3 className="text-2xl font-extrabold mt-1">{quotation.reference}</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-[var(--hairline)] bg-[var(--paper-low)]">
                  <span className="label-caps text-[var(--ink-variant)] block">CLIENT ACCOUNT</span>
                  <strong className="text-base font-extrabold">{quotation.customer_name}</strong>
                  <p className="text-xs text-[var(--ink-variant)]">{quotation.company_name}</p>
                </div>

                <div className="p-4 border border-[var(--hairline)] bg-[var(--paper-low)]">
                  <span className="label-caps text-[var(--ink-variant)] block">CURRENT QUOTED RATE</span>
                  <strong className="text-xl font-extrabold text-[var(--gold)]">
                    ${quotation.items[0]?.target_price_per_kg.toFixed(2)} / KG
                  </strong>
                  <span className="block text-xs text-[var(--ink-variant)] mt-1">
                    Total Valuation: ${quotation.total_amount.toLocaleString()}
                  </span>
                </div>

                <div className="p-4 border border-[var(--hairline)] bg-[var(--paper-low)]">
                  <span className="label-caps text-[var(--ink-variant)] block">INCOTERMS & PACKAGING</span>
                  <p className="text-xs text-[var(--ink)] mt-1">
                    CIF Rotterdam Port • Nitrogen-flushed 25kg Epoxy Aluminum Drum
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Counter-Offer Form */}
            <form onSubmit={handleSendCounterOffer} className={styles.formCol}>
              <div className="hairline-b pb-4 mb-6">
                <span className="label-caps label-gold">YOUR COUNTER-OFFER PROPOSAL</span>
                <h3 className="text-2xl font-extrabold mt-1">PROPOSE REVISED COMMERCIAL TERMS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label-caps block mb-2">REVISED TARGET RATE ($ / KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div>
                  <label className="label-caps block mb-2">PROPOSED DRUM QUANTITY (KG)</label>
                  <input
                    type="number"
                    value={counterQty}
                    onChange={(e) => setCounterQty(parseInt(e.target.value) || 0)}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              {/* Sample Analysis Kit Checkbox */}
              <div className="mb-6 p-4 border border-[var(--hairline)] bg-[var(--paper-low)] flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sampleKit"
                  checked={requestSampleKit}
                  onChange={(e) => setRequestSampleKit(e.target.checked)}
                  className="w-5 h-5 accent-[var(--ink)]"
                />
                <label htmlFor="sampleKit" className="text-sm font-extrabold cursor-pointer">
                  REQUEST 100g PRE-SHIPMENT HPLC ANALYTICAL SAMPLE KIT (VIA DHL EXPRESS)
                </label>
              </div>

              <div className="mb-8">
                <label className="label-caps block mb-2">JUSTIFICATION OR CONTRACT TIMELINE NOTES</label>
                <textarea
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="E.g., We are committing to an annual 1,000kg call-off contract. Requesting $80.00/kg rate for the first 100kg tranche..."
                  className={styles.formTextarea}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 py-4 text-sm font-extrabold"
                >
                  {submitting ? 'TRANSMITTING COUNTER-OFFER...' : 'SUBMIT COUNTER-OFFER PROPOSAL →'}
                </button>
                <Link
                  href={`/quotations/${quotation.id}`}
                  className="btn-secondary px-6"
                >
                  CANCEL
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
