"use client";

import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Mail, MapPin, Building, Scale, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModals = () => {
  const { legalModalTab, closeLegalModal, openLegalModal } = useApp();

  useEffect(() => {
    if (legalModalTab) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [legalModalTab]);

  if (!legalModalTab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-display" data-lenis-prevent="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeLegalModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl text-white shadow-2xl z-10 overflow-hidden" data-lenis-prevent="true">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#d4a373]/10 text-[#d4a373] border border-[#d4a373]/20">
              {legalModalTab === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {legalModalTab === 'terms' && <FileText className="w-5 h-5" />}
              {legalModalTab === 'refund' && <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white leading-tight">
                {legalModalTab === 'privacy' && 'Privacy Policy & Data Protection (DPDP Act 2023)'}
                {legalModalTab === 'terms' && 'Terms of Service & E-Commerce Disclosures'}
                {legalModalTab === 'refund' && 'Return, Refund & Cancellation Policy'}
              </h2>
              <p className="text-xs text-neutral-400">Madhav Pharma Industries Private Limited</p>
            </div>
          </div>
          <button
            onClick={closeLegalModal}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-6 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'refund', label: 'Refund & Return Policy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => openLegalModal(tab.id)}
              className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                legalModalTab === tab.id
                  ? 'border-[#d4a373] text-[#d4a373]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-neutral-300 leading-relaxed font-sans-custom">
          
          {/* PRIVACY POLICY */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">1. Compliance with the DPDP Act, 2023</h3>
                <p>
                  Madhav Pharma Industries Private Limited ("Company", "we", "us", "our") is dedicated to safeguarding your personal data in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the Information Technology Act, 2000. This Privacy Policy governs the collection, processing, storage, and erasure of your data when using our website and B2B wholesale platform.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">2. Categories of Personal Data Collected</h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
                  <li><strong>Identity & Account Data:</strong> Full Name, Business Name, GSTIN number (for B2B quotes), Registered Email, Mobile Number, and Password (stored via one-way cryptographic hashing).</li>
                  <li><strong>Order & Fulfillment Data:</strong> Shipping & Billing Addresses, PIN Code, Delivery contact details, and purchased item history.</li>
                  <li><strong>Transaction Data:</strong> Razorpay payment identifiers, transaction references, invoice records, and timestamps. (We do not store full credit/debit card numbers or bank credentials).</li>
                  <li><strong>Technical & Log Data:</strong> IP address, device metadata, and interaction logs strictly used for security anomaly detection and fraud prevention.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">3. Purpose and Legal Basis of Data Processing</h3>
                <p>
                  Your personal data is processed solely for lawful purposes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300 mt-2">
                  <li>Processing, manufacturing, and dispatching pharmaceutical and essential oil orders.</li>
                  <li>Generating statutory GST tax invoices and regulatory batch documentation (GC-MS, Certificate of Analysis).</li>
                  <li>Sending automated order and dispatch updates via verified transactional email and WhatsApp notifications.</li>
                  <li>Authenticating user login sessions via Time-based One-Time Passwords (OTP).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">4. Data Principal Rights & Data Erasure</h3>
                <p>
                  Under the DPDP Act 2023, you hold the right to review, update, or request the complete deletion of your personal data from our systems upon closing your account. To exercise your rights, contact our Data Grievance Desk at <span className="text-[#d4a373] font-mono">privacy@madhavpharmaindustries.com</span>.
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {legalModalTab === 'terms' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">1. Statutory E-Commerce Seller Information</h3>
                <p>
                  In compliance with Rule 5 of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>:
                </p>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2"><Building className="w-4 h-4 text-[#d4a373]" /><span className="font-bold text-white">Entity Name:</span> Madhav Pharma Industries Private Limited</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#d4a373]" /><span className="font-bold text-white">Registered Office:</span> Phase IV, GIDC Industrial Estate, Gujarat - 382445, India</div>
                  <div className="flex items-center gap-2"><Scale className="w-4 h-4 text-[#d4a373]" /><span className="font-bold text-white">GSTIN:</span> 24AABCM1234F1Z9</div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#d4a373]" /><span className="font-bold text-white">Customer Support:</span> contact@madhavpharmaindustries.com</div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">2. Product Specifications & Pricing Transparency</h3>
                <p>
                  All essential oils, aromatherapy formulations, and pharmaceutical ingredients displayed on this website adhere to stringent pharmacopeial standards.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300 mt-2">
                  <li><strong>All-Inclusive Pricing:</strong> Prices displayed during retail and wholesale checkout are strictly all-inclusive of applicable Goods and Services Tax (GST) and express shipping fees. No hidden fees are assessed at dispatch.</li>
                  <li><strong>Bulk Quotations:</strong> B2B quotations are binding once formally approved by the Madhav Pharma Sales & Production desk.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">3. Limitation of Liability & Jurisdiction</h3>
                <p>
                  Any dispute, claim, or controversy arising out of or relating to website purchases or business quotations shall be subject to the exclusive territorial jurisdiction of the competent courts in Ahmedabad, Gujarat, India.
                </p>
              </div>
            </div>
          )}

          {/* REFUND & RETURN POLICY */}
          {legalModalTab === 'refund' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">1. 7-Day Quality Guarantee & Return Policy</h3>
                <p>
                  Madhav Pharma Industries stands behind the purity and standard of every bottle and drum dispatched from our manufacturing plant.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300 mt-2">
                  <li><strong>Eligibility for Return:</strong> You are entitled to a full replacement or refund within <strong>7 days</strong> of delivery if an item is received with a damaged tamper-evident seal, broken bottle packaging, or GC-MS assay variance from the published Certificate of Analysis.</li>
                  <li><strong>Intact Packaging:</strong> For non-defective retail orders, items must remain in their original unopened condition with protective seals intact.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">2. Refund Processing Timeline</h3>
                <p>
                  Once returned merchandise is received and verified at our quality control facility, approved refunds are credited back to the original source method (Razorpay Gateway / UPI / NetBanking) within <strong>5 to 7 business days</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif mb-2">3. Order Cancellation</h3>
                <p>
                  Orders may be cancelled without charge prior to package handover to the logistics partner. To cancel an active order, initiate a cancellation request directly from your Customer Dashboard or email our dispatch team.
                </p>
              </div>
            </div>
          )}

          {/* STATUTORY GRIEVANCE REDRESSAL OFFICER DISCLOSURE (MANDATORY FOR ALL TABS) */}
          <div className="pt-6 border-t border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a373] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Statutory Grievance Redressal Officer (Rule 5(5), Consumer Protection Rules 2020)
            </h4>
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 text-xs space-y-2 text-neutral-300">
              <div><strong className="text-white">Designated Grievance Officer:</strong> Sh. Rajesh Mehta (Head of Quality & Compliance)</div>
              <div><strong className="text-white">Office Address:</strong> Grievance Cell, Madhav Pharma Industries, Phase IV, GIDC Industrial Estate, Gujarat - 382445</div>
              <div><strong className="text-white">Official Email:</strong> <span className="text-[#d4a373] font-mono">grievance@madhavpharmaindustries.com</span></div>
              <div><strong className="text-white">Helpline:</strong> +91 90233 85917 (Mon-Sat, 9:30 AM – 6:30 PM IST)</div>
              <div className="text-neutral-400 pt-1">
                <strong>Statutory SLA:</strong> All complaints are formally acknowledged with a unique reference ticket within <strong>48 hours</strong> and redressed within <strong>30 days</strong> of receipt.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
          <button
            onClick={closeLegalModal}
            className="px-6 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
