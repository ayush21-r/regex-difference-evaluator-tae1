// Modal explaining how to install PWA on iOS / iPadOS Safari

import React, { useEffect } from 'react';
import { X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
    >
      <div
        className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          aria-label="Close Install Instructions"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-black bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              RDE
            </span>
          </div>
          <div>
            <h2 id="ios-install-title" className="text-base font-bold text-slate-100">
              Install on iPhone / iPad
            </h2>
            <p className="text-xs text-slate-400">
              Add Regex Difference Evaluator to your home screen
            </p>
          </div>
        </div>

        {/* Step-by-step guidance */}
        <div className="space-y-3 my-5 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-300 font-bold shrink-0">
              1
            </div>
            <div className="flex-1 leading-relaxed">
              <span>Tap the </span>
              <strong className="text-slate-100 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                <Share className="w-3.5 h-3.5 text-indigo-400 inline" /> Share
              </strong>
              <span> button in Safari's bottom or top toolbar.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-300 font-bold shrink-0">
              2
            </div>
            <div className="flex-1 leading-relaxed">
              <span>Scroll down and select </span>
              <strong className="text-slate-100 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                <PlusSquare className="w-3.5 h-3.5 text-sky-400 inline" /> Add to Home Screen
              </strong>
              <span>.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-300 font-bold shrink-0">
              3
            </div>
            <div className="flex-1 leading-relaxed">
              <span>Tap </span>
              <strong className="text-slate-100 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                Add
              </strong>
              <span> in the top right corner to install the standalone app.</span>
            </div>
          </div>
        </div>

        {/* Confirm / Close Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Got it</span>
        </button>
      </div>
    </div>
  );
};
