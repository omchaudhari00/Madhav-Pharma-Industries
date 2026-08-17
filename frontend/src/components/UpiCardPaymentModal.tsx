import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export interface PaymentSuccessDetails {
  method: string;
  status: 'Paid';
  referenceId: string;
  amountINR: number;
}

interface UpiCardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountINR: number;
  orderReference: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  onPaymentSuccess: (details: PaymentSuccessDetails) => void;
}



// Dynamically load Razorpay SDK
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const UpiCardPaymentModal: React.FC<UpiCardPaymentModalProps> = ({
  isOpen,
  onClose,
  amountINR,
  orderReference,
  customerName = 'Ananya Sharma',
  customerPhone = '9876543210',
  customerEmail = 'customer@example.com',
  onPaymentSuccess
}) => {
  const [isLaunchingRazorpay, setIsLaunchingRazorpay] = useState(false);

  const env = (import.meta as any).env || {};
  const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID_HERE';
  const razorpayCompanyName = env.VITE_RAZORPAY_COMPANY_NAME || 'Madhav Pharma Industries';
  const isRazorpayConfigured = razorpayKeyId && razorpayKeyId !== 'rzp_test_YOUR_KEY_ID_HERE';

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Launch Razorpay Automated Gateway
  const handleLaunchRazorpay = async () => {
    setIsLaunchingRazorpay(true);

    if (isRazorpayConfigured) {
      const loaded = await loadRazorpayScript();
      setIsLaunchingRazorpay(false);

      if (loaded && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: razorpayKeyId,
          amount: Math.round(amountINR * 100), // Razorpay expects paise
          currency: 'INR',
          name: razorpayCompanyName,
          description: `Order ${orderReference}`,
          image: '/vite.svg',
          handler: function (response: any) {
            onPaymentSuccess({
              method: 'Razorpay Gateway (UPI / Card / NetBanking)',
              status: 'Paid',
              referenceId: response.razorpay_payment_id,
              amountINR
            });
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          modal: {
            ondismiss: function () {
              setIsLaunchingRazorpay(false);
            }
          }
        });
        rzp.open();
        return;
      }
    }
    // Fail gracefully if not configured or script fails to load
    console.error("Razorpay is not configured or failed to load. Payment cannot proceed.");
    alert("Payment gateway is temporarily unavailable. Please try again later.");
    setIsLaunchingRazorpay(false);
  };


  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto font-display flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white z-10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-neutral-950 shadow-md">
              <ShieldCheck className="w-5 h-5 font-bold stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                100% Secure Payment Gateway
              </h2>
              <p className="text-xs text-neutral-400">
                {orderReference} • <span className="text-emerald-400 font-semibold">256-Bit SSL Encrypted</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-neutral-900/80 border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Total Payable Amount:
          </span>
          <span className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            ₹{amountINR.toLocaleString()}
          </span>
        </div>

        {/* Scrollable Modal Content — Razorpay Only */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-6 space-y-6">
          <div className="space-y-6 text-center">
            <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Official Razorpay Checkout
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                All Payment Options Included
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Pay instantly via <strong className="text-white">Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, NetBanking, or Wallets</strong> with automatic verification.
              </p>

              {/* Brand Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold">Google Pay</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-bold">PhonePe</span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">Paytm</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">RuPay</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">Visa/Mastercard</span>
              </div>
            </div>

            {/* Main Razorpay Launch Button */}
            <button
              type="button"
              onClick={handleLaunchRazorpay}
              disabled={isLaunchingRazorpay}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 disabled:opacity-60 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLaunchingRazorpay ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Launching Razorpay Window...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-neutral-950" />
                  <span>Pay ₹{amountINR.toLocaleString()} via Razorpay</span>
                </>
              )}
            </button>



            <p className="text-[11px] text-neutral-500">
              🔒 100% Automated verification. No UTR number or manual receipt typing required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
