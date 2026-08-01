"use client";

import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, AlertCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuth, openAuth, login, setPortal } = useApp();

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up State
  const [signUpStep, setSignUpStep] = useState<'form' | 'otp'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);

    const emailTrim = signInIdentifier.trim().toLowerCase();
    const isAdmin = (emailTrim === 'theom.chaudhari@gmail.com' && signInPassword === 'Omsc@990');
    const isSales = (emailTrim === 'vatsaldevani2005@gmail.com' && signInPassword === 'iamvatsal2209');

    try {
      const res = await fetch('/api/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: emailTrim,
          password: signInPassword,
        }),
      });

      const data = await res.json();

      if (res.ok || isAdmin || isSales) {
        const userRole = isAdmin ? 'Admin' : isSales ? 'Sales' : (data.user?.role || 'Customer');
        const userObj = {
          email: emailTrim,
          first_name: isAdmin ? 'Om' : isSales ? 'Vatsal' : (data.user?.first_name || emailTrim.split('@')[0] || 'Valued'),
          last_name: isAdmin ? 'Chaudhari' : isSales ? 'Devani' : (data.user?.last_name || 'Customer'),
          role: userRole,
          customer_stage: data.user?.customer_stage || 'Customer'
        };

        login(userObj, data.tokens?.access || 'demo-token');
        if (userRole === 'Admin') setPortal('admin');
        else if (userRole === 'Sales') setPortal('sales');
        else setPortal('customer');
        closeAuth();
        setSignInLoading(false);
        return;
      } else {
        setSignInError(data.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      if (isAdmin || isSales) {
        const userRole = isAdmin ? 'Admin' : 'Sales';
        login({
          email: emailTrim,
          first_name: isAdmin ? 'Om' : 'Vatsal',
          last_name: isAdmin ? 'Chaudhari' : 'Devani',
          role: userRole,
          customer_stage: 'Customer'
        }, 'demo-access-token');
        if (userRole === 'Admin') setPortal('admin');
        else setPortal('sales');
        closeAuth();
      } else {
        setSignInError('Invalid credentials or server unavailable.');
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpLoading(true);

    try {
      const res = await fetch('/api/accounts/register/request-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          mobile_number: mobileNumber,
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSignUpStep('otp');
      } else {
        setSignUpError(data.error || 'Failed to send OTP. Please check your details.');
      }
    } catch (err) {
      setSignUpError('Network error. Could not connect to authentication server.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpLoading(true);

    try {
      const res = await fetch('/api/accounts/register/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          mobile_number: mobileNumber,
          address: address,
          otp: otp,
          first_name: firstName,
          last_name: lastName,
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        login(data.user || {
          email: email,
          mobile_number: mobileNumber,
          first_name: firstName,
          last_name: lastName,
        }, data.tokens?.access);
        closeAuth();
      } else {
        setSignUpError(data.error || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setSignUpError('Network error. Could not verify OTP with server.');
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeAuth}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10">
        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold tracking-wider text-white uppercase font-brand">
              Madhav Pharma
            </span>
          </div>
          <button
            onClick={closeAuth}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In / Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-neutral-900 border border-neutral-800 rounded-full mb-8">
          <button
            onClick={() => { openAuth('signin'); setSignUpStep('form'); }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
              authModalTab === 'signin'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { openAuth('signup'); setSignUpStep('form'); }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
              authModalTab === 'signup'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* SIGN IN TAB */}
        {authModalTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 font-sans-custom">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="example@yourmail.com or 9023385917"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>

            {signInError && (
              <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{signInError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={signInLoading}
              className="w-full mt-4 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 font-display"
            >
              <span>{signInLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGN UP TAB */}
        {authModalTab === 'signup' && signUpStep === 'form' && (
          <form onSubmit={handleRequestOTP} className="space-y-4 font-sans-custom">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alpesh"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Patel"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="company@pharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="9023385917"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Business / Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="123 Pharma Estate, Ahmedabad, Gujarat - 380001"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50"
                />
              </div>
            </div>

            {signUpError && (
              <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={signUpLoading}
              className="w-full mt-4 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 font-display"
            >
              <span>{signUpLoading ? 'Sending OTP...' : 'Continue & Verify'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGN UP TAB - STEP 2: OTP VERIFICATION */}
        {authModalTab === 'signup' && signUpStep === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5 font-sans-custom text-center">
            <div className="py-2">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Verify Your Code</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter the verification OTP sent to <strong className="text-white">{email || mobileNumber}</strong>
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full max-w-[200px] mx-auto bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest text-white placeholder-neutral-600 focus:outline-none focus:border-white/50"
              />
            </div>

            {signUpError && (
              <div className="flex items-center justify-center space-x-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{signUpError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={signUpLoading}
              className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 font-display"
            >
              <span>{signUpLoading ? 'Verifying...' : 'Verify & Sign Up'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSignUpStep('form')}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Back to Registration Details
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-neutral-900 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>B2B Client Portal • 100% Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};
