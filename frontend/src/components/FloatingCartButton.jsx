import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingCartButton = () => {
  const { openRetailCheckout, retailCartTotalCount, isRetailCheckoutOpen } = useApp();

  if (isRetailCheckoutOpen) return null;

  return (
    <button
      onClick={openRetailCheckout}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-4 rounded-full bg-[#d4a373] hover:bg-[#c29161] text-neutral-950 shadow-[0_10px_40px_rgba(212,163,115,0.4)] hover:shadow-[0_15px_50px_rgba(212,163,115,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group border-2 border-[#d4a373]"
      aria-label="View Cart"
    >
      <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-950 group-hover:scale-110 transition-transform" />
      {retailCartTotalCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[24px] h-[24px] px-1.5 rounded-full bg-neutral-950 text-[#d4a373] text-xs font-extrabold flex items-center justify-center shadow-xl border-2 border-[#d4a373]">
          {retailCartTotalCount}
        </span>
      )}
    </button>
  );
};
