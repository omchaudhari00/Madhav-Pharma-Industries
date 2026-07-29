import React from 'react';
import { X, Play } from 'lucide-react';

interface MotionReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MotionReelModal: React.FC<MotionReelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-display">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-sm text-neutral-400 font-medium">coffee — Motion Reel</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Canvas */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-8 text-center group">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white transition-transform duration-300 group-hover:scale-110 cursor-pointer shadow-xl">
            <Play className="w-8 h-8 fill-current ml-1 text-white" />
          </div>

          <h3 className="text-2xl font-light text-white mb-2">
            Crafted for Coffee Lovers
          </h3>
          <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
            Experience our artisanal roasting process, single-origin bean selection, and carefully curated blends in 4K motion graphics.
          </p>

          <div className="mt-8 flex items-center space-x-4 text-xs text-neutral-500">
            <span>Duration: 01:45</span>
            <span>•</span>
            <span>4K HDR</span>
            <span>•</span>
            <span>Website Inspiration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
