// Home Page: Technical Hero, Visual Pipeline, and Mathematical Foundations

import React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import type { NavTab } from '../components/common/Navbar';

interface HomePageProps {
  onNavigate: (tab: NavTab) => void;
  onLoadPreset: (r1: string, r2: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLoadPreset }) => {
  return (
    <div className="space-y-16 py-6 animate-in fade-in duration-300">
      {/* Technical Hero Section */}
      <div className="relative flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto pt-8">
        {/* Subtle Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>REGULAR LANGUAGE DIFFERENCE EVALUATOR</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 font-sans break-words">
          Calculate and Witness <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            L(R₁) − L(R₂)
          </span>{' '}
          in Realtime.
        </h1>

        {/* Concise Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          Given two regular expressions <code className="text-slate-200 font-mono">R₁</code> and <code className="text-slate-200 font-mono">R₂</code>, deterministically discover a minimal witness string <code className="text-sky-300 font-mono">w ∈ L(R₁)</code> such that <code className="text-rose-300 font-mono">w ∉ L(R₂)</code> using Thompson NFA, Subset Construction DFA, and Cross-Product Automata with BFS.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('evaluator')}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-xs sm:text-sm font-mono font-bold text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            aria-label="Launch Evaluator Workspace"
          >
            <span>Launch Evaluator Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('testcases')}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-mono font-medium text-slate-300 hover:text-slate-100 border border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            aria-label="Explore Academic Test Suite"
          >
            <span>Explore Academic Test Suite</span>
          </button>
        </div>
      </div>

      {/* Visual Set Theoretic Difference Demonstration */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0d1322] p-4 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
              Theoretical Foundation
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-sans text-slate-100">
              The Language Difference Problem
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Because regular languages are closed under complementation and intersection:
              <br />
              <strong className="text-indigo-300 font-bold">L(R₁) − L(R₂) = L(R₁) ∩ ¬L(R₂)</strong>
              <br />
              We construct total DFAs D₁ and D₂, complement D₂ to obtain ¬D₂, compute the product automaton D₁ × ¬D₂, and execute BFS for reachable accept states.
            </p>
          </div>

          {/* Modern Set Difference Interactive Card */}
          <div className="flex-1 w-full p-3 sm:p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* L(R1) Box */}
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">Set L(R₁)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                    Target
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Witness w ∈ L(R₁)</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  Must be accepted by R₁ Automaton
                </p>
              </div>

              {/* L(R2) Box */}
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">Set L(R₂)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                    Excluded
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px]">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Witness w ∉ L(R₂)</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  Must be rejected by R₂ Automaton
                </p>
              </div>
            </div>

            {/* Set Difference Result Badge */}
            <div className="p-2.5 rounded-lg bg-[#0d1726] border border-sky-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                <span className="text-slate-300 font-semibold">Relative Complement:</span>
              </div>
              <code className="text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60 self-start sm:self-auto">
                w ∈ L(R₁) \ L(R₂)
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithmic Pipeline Architecture */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-100 font-sans">
            End-to-End Computational Pipeline
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Guaranteed mathematical correctness with zero random brute-force generation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-200">AST Parser</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tokenizes and parses expressions into AST with precedence & explicit concatenation.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-200">Thompson NFA</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Constructs ε-NFAs recursively with linear state bounds for R₁ and R₂.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-200">Subset DFA</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Applies ε-closure & subset construction over unified alphabet Σ₁ ∪ Σ₂ with dead states.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-slate-200">Product Automaton</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Builds reachable states in D₁ × ¬D₂ with accept condition q₁ ∈ F₁ ∧ q₂ ∉ F₂.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-[#0d1322] border border-emerald-900/40 bg-gradient-to-b from-[#0d1322] to-emerald-950/20 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-bold text-emerald-300">BFS Witness</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Explores shortest path level-by-level to discover the minimal length witness string.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Example Preview Grid */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-sans">
              Quick Academic Demonstrations
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Click any example to instantly load and solve in the Evaluator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div
            onClick={() => {
              onLoadPreset('a(b|c)*', 'ab*');
              onNavigate('evaluator');
            }}
            className="p-4 rounded-xl bg-[#0d1322] hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 group-hover:text-indigo-300">Example 1</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800">
                Witness: &quot;ac&quot;
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              <div>R₁: <code className="text-slate-200">a(b|c)*</code></div>
              <div>R₂: <code className="text-slate-200">ab*</code></div>
            </div>
          </div>

          <div
            onClick={() => {
              onLoadPreset('a|b', 'a');
              onNavigate('evaluator');
            }}
            className="p-4 rounded-xl bg-[#0d1322] hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 group-hover:text-indigo-300">Example 2</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800">
                Witness: &quot;b&quot;
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              <div>R₁: <code className="text-slate-200">a|b</code></div>
              <div>R₂: <code className="text-slate-200">a</code></div>
            </div>
          </div>

          <div
            onClick={() => {
              onLoadPreset('a*', '(a)*');
              onNavigate('evaluator');
            }}
            className="p-4 rounded-xl bg-[#0d1322] hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 group-hover:text-indigo-300">Example 4</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">
                Diff = ∅
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              <div>R₁: <code className="text-slate-200">a*</code></div>
              <div>R₂: <code className="text-slate-200">(a)*</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
