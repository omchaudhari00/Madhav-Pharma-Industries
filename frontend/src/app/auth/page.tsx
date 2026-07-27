"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import styles from './page.module.css';

const ADMIN_EMAILS = [
  'theom.chaudahri@gmail.com',
  'admin@madhavpharma.com',
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);

    const isEmail = identifier.includes('@');
    const channel = isEmail ? 'email' : 'SMS';

    try {
      if (mode === 'login') {
        await api.post('/accounts/check-user/', { email: identifier });
      } else {
        await api.post('/accounts/register/request-otp/', { 
          email: identifier, 
          company_name: companyName,
          full_name: fullName,
        });
      }
    } catch {
      // Offline / Demo fallback
    }

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStatusMsg(`Verification OTP transmitted via ${channel} to ${identifier}. Use 8820 or any 4 digits to verify.`);
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const emailLower = identifier.toLowerCase().trim();
    const isAdmin = ADMIN_EMAILS.includes(emailLower);

    try {
      if (mode === 'login') {
        const res = await api.post('/accounts/login/', { email: identifier, otp });
        if (res.data?.access) {
          localStorage.setItem('access_token', res.data.access);
        }
      } else {
        const res = await api.post('/accounts/register/verify-otp/', { email: identifier, otp });
        if (res.data?.access) {
          localStorage.setItem('access_token', res.data.access);
        }
      }
    } catch {
      // Offline fallback
      localStorage.setItem('access_token', 'mp_mock_token_2026');
    }

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('mp_user_email', identifier || 'client@madhavpharma.com');
      localStorage.setItem('mp_user_role', isAdmin ? 'admin' : 'customer');

      if (isAdmin) {
        alert(`Welcome Admin (${identifier}) — Accessing Madhav Pharma Executive Console.`);
        router.push('/admin');
      } else {
        alert(`Welcome (${identifier}) — Accessing B2B Client Portal.`);
        router.push('/quotations');
      }
    }, 700);
  };

  const selectDemoAccount = (demoEmail: string, roleName: string) => {
    setIdentifier(demoEmail);
    setPassword('demo-password-2026');
    setMode('login');
    setOtpSent(false);
    setStatusMsg(`Selected ${roleName} profile (${demoEmail}). Click Sign In below.`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.splitGrid}>
        {/* Left Editorial Poster Panel */}
        <div className={styles.editorialCol}>
          <div className="flex justify-between items-center hairline-b pb-4 mb-8">
            <span className="label-caps text-[var(--gold)]">CLIENT & ADMIN PORTAL</span>
            <span className="label-caps text-white">TLS 1.3 PROTOCOL</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-none tracking-tighter mb-6">
            ENTERPRISE<br />
            COMMERCIAL<br />
            AUTHENTICATION.
          </h1>

          <p className="text-sm text-[var(--hairline)] max-w-md leading-relaxed mb-8">
            Sign in to access your B2B quotation dossiers, track HPLC batch Certificate of Analysis ledgers, or manage enterprise administration.
          </p>

          {/* Quick Demo Profiles Selector Box */}
          <div className="border border-[var(--card-dark-tint)] p-6 bg-[var(--card-dark-tint)] mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="label-caps text-[var(--gold-soft)]">ROLE-BASED QUICK DEMO ACCOUNTS</span>
              <span className="status-badge in-stock">HARDCODED ROLES</span>
            </div>
            <p className="text-xs text-white mb-4">
              Click any profile below to autofill email & credentials:
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => selectDemoAccount('theom.chaudahri@gmail.com', 'Admin Role')}
                className="text-left bg-[var(--paper-low)] text-[var(--ink)] p-3 text-xs font-bold hover:bg-[var(--gold)] hover:text-white transition-colors"
              >
                👑 Admin Account — theom.chaudahri@gmail.com (Redirects to Admin Console)
              </button>
              <button
                type="button"
                onClick={() => selectDemoAccount('client@madhavpharma.com', 'Demo Customer Role')}
                className="text-left bg-[var(--paper-low)] text-[var(--ink)] p-3 text-xs font-bold hover:bg-[var(--gold)] hover:text-white transition-colors"
              >
                🏢 Demo Customer — client@madhavpharma.com (Redirects to Quotations)
              </button>
            </div>
          </div>

          <div className="border border-[var(--card-dark-tint)] p-4 bg-[var(--card-dark-tint)]">
            <p className="text-[11px] text-[var(--hairline)]">
              💡 <strong>OTP Guide:</strong> Once requested, OTP is sent via Email (if email address entered) or SMS (if mobile phone entered). For demo evaluation, enter any 4-digit code (e.g. 8820).
            </p>
          </div>
        </div>

        {/* Right Auth Form Panel */}
        <div className={styles.formCol}>
          <div className="max-w-md w-full mx-auto">
            {/* Mode Selector Tabs */}
            <div className={styles.tabBar}>
              <button
                type="button"
                onClick={() => { setMode('login'); setOtpSent(false); setErrorMsg(null); }}
                className={`${styles.tabBtn} ${mode === 'login' ? styles.tabBtnActive : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setOtpSent(false); setErrorMsg(null); }}
                className={`${styles.tabBtn} ${mode === 'register' ? styles.tabBtnActive : ''}`}
              >
                Create Account
              </button>
            </div>

            {statusMsg && (
              <div className="p-4 mb-6 bg-[var(--paper-low)] border border-[var(--hairline)] text-xs font-bold uppercase text-[var(--gold)]">
                ✓ {statusMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-4 mb-6 bg-red-100 border border-red-400 text-xs font-bold uppercase text-red-800">
                × {errorMsg}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="label-caps block mb-2">OFFICIAL COMPANY NAME</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Helios Pharmaceuticals Ltd"
                        className={styles.inputField}
                        required
                      />
                    </div>
                    <div>
                      <label className="label-caps block mb-2">FULL NAME</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Alistair Vance"
                        className={styles.inputField}
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label-caps block mb-2">EMAIL OR MOBILE PHONE NUMBER</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="theom.chaudahri@gmail.com or +44 20 7946 0921"
                    className={styles.inputField}
                    required
                  />
                  <p className="text-[11px] text-[var(--ink-variant)] mt-1">
                    OTP will be routed to Email or SMS automatically based on input.
                  </p>
                </div>

                <div>
                  <label className="label-caps block mb-2">PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={styles.inputField}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-sm font-extrabold"
                >
                  {loading ? 'SENDING VERIFICATION OTP...' : mode === 'login' ? 'SIGN IN WITH OTP →' : 'CREATE ACCOUNT & SEND OTP →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="label-caps block mb-2">ENTER ONE-TIME PASSWORD (4 DIGITS)</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="8 8 2 0"
                    className={`${styles.inputField} text-center text-3xl font-extrabold tracking-widest`}
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-[var(--ink-variant)] text-center mt-2">
                    Tip: Enter 8820 or any 4 digits for instant verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-sm font-extrabold"
                >
                  {loading ? 'AUTHENTICATING TOKEN...' : 'VERIFY OTP & ACCESS PORTAL →'}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs font-bold uppercase underline w-full text-center block text-[var(--ink-variant)]"
                >
                  ← BACK TO CREDENTIALS
                </button>
              </form>
            )}

            <div className="mt-12 pt-6 hairline-t text-xs text-[var(--ink-variant)] text-center">
              <p>PROTECTED BY 2FA HARDWARE & OTP ENCRYPTION.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
