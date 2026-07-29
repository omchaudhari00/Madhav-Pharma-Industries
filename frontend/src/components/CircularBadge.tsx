import React from 'react';

export const CircularBadge: React.FC = () => {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center select-none pointer-events-none">
      {/* Rotating SVG with curved text */}
      <svg
        className="w-full h-full animate-spin-slow text-amber-200/40 tracking-widest font-sans-custom"
        viewBox="0 0 160 160"
      >
        <defs>
          <path
            id="circlePath"
            d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
          />
        </defs>
        <text fontSize="10.5" fontWeight="400" fill="currentColor" letterSpacing="2.8">
          <textPath href="#circlePath" startOffset="0%">
            • INSPIRATION DESIGN FOR COFFEE WEBSITE
          </textPath>
        </text>
      </svg>
    </div>
  );
};
