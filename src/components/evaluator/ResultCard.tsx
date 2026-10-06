// Result Display and Witness Verification Card

import React, { useState } from 'react';
import type { EvaluationPipelineResult } from '../../algorithms/types';
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Clock,
  Compass,
} from 'lucide-react';

interface ResultCardProps {
  result: EvaluationPipelineResult;
  onJumpToAutomata: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onJumpToAutomata,
}) => {
  const [copied, setCopied] = useState(false);
  const { witnessResult, verification } = result;

  const handleCopy = () => {
    if (witnessResult.witness !== null) {
      navigator.clipboard.writeText(witnessResult.witness);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasDiff = witnessResult.hasDifference;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1322] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Banner Status */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b ${
          hasDiff
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
            : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {hasDiff ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
          )}

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
              {hasDiff ? 'DIFFERENCE FOUND — WITNESS GENERATED' : 'NO DIFFERENCE FOUND (EMPTY SET)'}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Algorithm: Thompson NFA → Subset DFA → Product D₁ × ¬D₂ → BFS Exploration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{result.stats.totalExecutionTimeMs} ms</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        {hasDiff ? (
          /* Case 1: Witness exists */
          <div className="space-y-4">
            {/* Minimal Witness Hero Box */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080d1a] border border-slate-800/80">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Minimal Witness String (w)
                </span>
                <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-wider break-all">
                    {witnessResult.witness === '' ? 'ε' : witnessResult.witness}
                  </span>
                  {witnessResult.witness === '' && (
                    <span className="text-xs font-mono text-slate-400 italic">
                      (Empty String)
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-500 shrink-0">
                    Length: |w| = {witnessResult.witness?.length ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-xs font-mono font-medium text-slate-200 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  title="Copy witness string"
                  aria-label="Copy minimal witness string"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy String</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onJumpToAutomata}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-mono font-medium text-indigo-300 border border-indigo-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  aria-label="Inspect witness path in automata visualizer"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Path</span>
                </button>
              </div>
            </div>

            {/* Formal Automata Acceptance Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* R1 Acceptance Verdict */}
              <div className="p-3.5 rounded-xl bg-[#090e1b] border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-300">
                    Language 1: L(R₁)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/50 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    ACCEPTS
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 break-all">
                  Expression: <code className="text-slate-200 font-bold">{result.regex1}</code>
                </div>
                <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1 break-words">
                  <span>✓</span>
                  <span>
                    String &quot;<span className="break-all">{witnessResult.witnessDisplay}</span>&quot; leads to accepting state{' '}
                    <code>{verification.r1Result.finalState}</code>
                  </span>
                </div>
              </div>

              {/* R2 Rejection Verdict */}
              <div className="p-3.5 rounded-xl bg-[#090e1b] border border-rose-950/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-300">
                    Language 2: L(R₂)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800/50 shrink-0">
                    <XCircle className="w-3 h-3" />
                    REJECTS
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 break-all">
                  Expression: <code className="text-slate-200 font-bold">{result.regex2}</code>
                </div>
                <div className="text-[11px] font-mono text-rose-300/90 flex items-center gap-1 break-words">
                  <span>✕</span>
                  <span>
                    String &quot;<span className="break-all">{witnessResult.witnessDisplay}</span>&quot; leads to non-accepting state{' '}
                    <code>{verification.r2Result.finalState}</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Set Theoretic Conclusion */}
            <div className="flex items-start sm:items-center gap-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs font-mono text-indigo-300 break-words">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Conclusion:</strong> <span className="break-all">{witnessResult.witnessDisplay}</span> ∈ L({result.regex1}) − L({result.regex2}). Language difference is non-empty.
              </span>
            </div>
          </div>
        ) : (
          /* Case 2: No difference exists (L(R1) ⊆ L(R2)) */
          <div className="p-5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-mono text-sm font-bold text-slate-200">
                  Language 1 is a subset of Language 2: L(R₁) ⊆ L(R₂)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The BFS search over the difference product automaton completed with zero reachable accepting states. Every string recognized by <code>{result.regex1}</code> is also accepted by <code>{result.regex2}</code>.
                </p>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
              <span>Set Difference Formulation:</span>
              <code className="text-amber-300 font-bold">L({result.regex1}) − L({result.regex2}) = ∅</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
