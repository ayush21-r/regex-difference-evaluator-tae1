import React, { useEffect } from 'react';
import { X, BookOpen, AlertTriangle } from 'lucide-react';

interface SyntaxCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyntaxCheatSheetModal: React.FC<SyntaxCheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="syntax-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700 bg-[#0d1322] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-800 bg-[#090d16]">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            <h2 id="syntax-modal-title" className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100 truncate">
              Supported Regular Expression Syntax
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none shrink-0"
            aria-label="Close syntax helper dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs font-mono text-slate-300">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">
              1. Basic Operators & Precedence (Highest to Lowest)
            </h3>
            <div className="rounded-xl border border-slate-800 bg-[#090d16] overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f172a] text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Operator</th>
                    <th className="py-2.5 px-3">Syntax</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Grouping</td>
                    <td className="py-2 px-3"><code>(R)</code></td>
                    <td className="py-2 px-3 text-slate-400">Explicit grouping and precedence override</td>
                    <td className="py-2 px-3 text-emerald-400"><code>(a|b)*</code></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Kleene Star</td>
                    <td className="py-2 px-3"><code>R*</code></td>
                    <td className="py-2 px-3 text-slate-400">0 or more repetitions</td>
                    <td className="py-2 px-3 text-emerald-400"><code>a*</code> (ε, a, aa...)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Plus</td>
                    <td className="py-2 px-3"><code>R+</code></td>
                    <td className="py-2 px-3 text-slate-400">1 or more repetitions (R R*)</td>
                    <td className="py-2 px-3 text-emerald-400"><code>a+</code> (a, aa, aaa...)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Optional</td>
                    <td className="py-2 px-3"><code>R?</code></td>
                    <td className="py-2 px-3 text-slate-400">0 or 1 occurrence (R | ε)</td>
                    <td className="py-2 px-3 text-emerald-400"><code>a?b</code> (b, ab)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Concatenation</td>
                    <td className="py-2 px-3"><code>AB</code></td>
                    <td className="py-2 px-3 text-slate-400">Sequential juxtaposition</td>
                    <td className="py-2 px-3 text-emerald-400"><code>ab</code></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Alternation (Union)</td>
                    <td className="py-2 px-3"><code>A|B</code></td>
                    <td className="py-2 px-3 text-slate-400">Matches A or B</td>
                    <td className="py-2 px-3 text-emerald-400"><code>a|b</code></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sky-400 font-bold">Epsilon (Empty)</td>
                    <td className="py-2 px-3"><code>ε</code>, <code>\e</code></td>
                    <td className="py-2 px-3 text-slate-400">Empty string language L = &#123;&quot;&quot;&#125;</td>
                    <td className="py-2 px-3 text-emerald-400"><code>a|ε</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              2. Supported Literals & Escape Sequences
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Any alphanumeric character (<code>a-z</code>, <code>A-Z</code>, <code>0-9</code>) or symbol (<code>_</code>, <code>-</code>, etc.) is treated as a literal symbol in the alphabet Σ. Special characters can be escaped with a backslash: <code>\*</code>, <code>\+</code>, <code>\|</code>, <code>\?</code>, <code>\(</code>, <code>\)</code>, <code>\\</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Academic Automata Scope (No Lookarounds / Backreferences)</span>
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed font-sans">
              This application builds true Thompson NFAs and Subset DFAs in the browser. Features outside pure regular languages (such as lookarounds, backreferences, and recursion) are intentionally not included because they exceed regular language power.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#090d16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-medium text-white transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
