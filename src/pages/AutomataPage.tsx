// Dedicated Full Automata Visualizer Page

import React from 'react';
import { AutomataVisualizer } from '../components/automata/AutomataVisualizer';
import type { EvaluationPipelineResult } from '../algorithms/types';
import { Network } from 'lucide-react';
import type { NavTab } from '../components/common/Navbar';

interface AutomataPageProps {
  result: EvaluationPipelineResult | null;
  onNavigate: (tab: NavTab) => void;
  onLoadExample1: () => void;
}

export const AutomataPage: React.FC<AutomataPageProps> = ({
  result,
  onNavigate,
  onLoadExample1,
}) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Network className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-sans text-slate-100">
          No Automata Evaluated Yet
        </h2>
        <p className="text-xs font-mono text-slate-400 leading-relaxed">
          Please run an evaluation in the workspace or load a sample problem to inspect Thompson NFAs, Subset DFAs, and the Difference Product Automaton.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('evaluator')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white transition-all shadow-md shadow-indigo-600/20"
          >
            Open Evaluator
          </button>
          <button
            onClick={onLoadExample1}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 transition-colors"
          >
            Load Example 1: a(b|c)* vs ab*
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      {/* Page Title & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
            Automata Visualizer & State Inspector
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Interactive structural inspection of NFA 1, DFA 1, NFA 2, DFA 2, and Difference D₁ × ¬D₂
          </p>
        </div>

        {/* Expression Summary Badges */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          <div className="px-3 py-1 rounded-lg bg-[#0d1322] border border-slate-800 break-all">
            <span className="text-slate-500">R₁:</span>{' '}
            <span className="text-indigo-300 font-bold">{result.regex1}</span>
          </div>
          <span className="text-slate-600">vs</span>
          <div className="px-3 py-1 rounded-lg bg-[#0d1322] border border-slate-800 break-all">
            <span className="text-slate-500">R₂:</span>{' '}
            <span className="text-emerald-300 font-bold">{result.regex2}</span>
          </div>
        </div>
      </div>

      {/* Structural Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">R₁ Automata</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-slate-200">
              {result.stats.dfa1StateCount} DFA
            </span>
            <span className="text-slate-500 text-[11px]">({result.stats.nfa1StateCount} NFA states)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">R₂ Automata</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-slate-200">
              {result.stats.dfa2StateCount} DFA
            </span>
            <span className="text-slate-500 text-[11px]">({result.stats.nfa2StateCount} NFA states)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Product D₁ × ¬D₂</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-sky-400">
              {result.stats.diffStateCount} States
            </span>
            <span className="text-slate-500 text-[11px]">({result.stats.diffTransitionCount} transitions)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Minimal Witness</span>
          <div className="mt-1">
            <span
              className={`text-base font-bold ${
                result.witnessResult.hasDifference ? 'text-sky-400' : 'text-amber-400'
              }`}
            >
              {result.witnessResult.witnessDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph Component */}
      <AutomataVisualizer result={result} defaultTab="diff" />
    </div>
  );
};
