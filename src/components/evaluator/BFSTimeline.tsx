// BFS Exploration Step-by-Step Inspector & Educational Visualizer

import React, { useState } from 'react';
import type { WitnessResult } from '../../algorithms/types';
import { ChevronDown, ChevronUp, CheckCircle, Search } from 'lucide-react';

interface BFSTimelineProps {
  witnessResult: WitnessResult;
}

export const BFSTimeline: React.FC<BFSTimelineProps> = ({ witnessResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const steps = witnessResult.bfsExplorationSteps;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl overflow-hidden">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-[#090d16]/70 hover:bg-slate-900/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-sky-400" />
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              BFS State Space Exploration Trace
            </h3>
            <p className="text-[11px] font-mono text-slate-500">
              {steps.length} exploration transitions recorded · Visited {witnessResult.visitedStateCount} product states
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {isExpanded ? 'Hide Trace' : 'View Exploration Table'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable Trace Table */}
      {isExpanded && (
        <div className="p-4 space-y-3 animate-in fade-in duration-200">
          <div className="p-3 rounded-xl bg-[#090e1b] border border-slate-800/80 text-xs font-mono text-slate-300">
            <p>
              💡 <strong>BFS Property:</strong> Breadth-First Search systematically evaluates string lengths 0, 1, 2, ... guaranteeing that the first accepting state discovered corresponds to a <strong>minimal-length witness string</strong>.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090d16]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0f172a] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Step #</th>
                  <th className="py-2.5 px-3">Current State (q₁, q₂)</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Next State (q&apos;₁, q&apos;₂)</th>
                  <th className="py-2.5 px-3">Prefix String</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {steps.slice(0, 50).map((step) => (
                  <tr
                    key={step.stepNumber}
                    className={
                      step.isAccepting
                        ? 'bg-emerald-950/30 font-semibold text-emerald-300'
                        : 'hover:bg-slate-900/50'
                    }
                  >
                    <td className="py-2 px-3 text-slate-500">{step.stepNumber}</td>
                    <td className="py-2 px-3 text-indigo-300">{step.currentState}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-bold border border-slate-700/60">
                        {step.inputSymbol}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-200">{step.nextState}</td>
                    <td className="py-2 px-3 text-slate-300">
                      &quot;{step.stringSoFar}&quot;
                    </td>
                    <td className="py-2 px-3">
                      {step.isAccepting ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                          <CheckCircle className="w-3 h-3" />
                          ACCEPT (WITNESS FOUND)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Exploring</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {steps.length > 50 && (
            <p className="text-[11px] font-mono text-slate-500 text-center">
              Showing first 50 of {steps.length} exploration transitions.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
