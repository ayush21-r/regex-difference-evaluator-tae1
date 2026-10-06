// Interactive Custom String Sandbox & Dual Automata Simulator

import React, { useState } from 'react';
import type { EvaluationPipelineResult } from '../../algorithms/types';
import { simulateDFA } from '../../algorithms/witnessVerifier';
import { Play, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface ArbitraryStringTesterProps {
  result: EvaluationPipelineResult;
}

export const ArbitraryStringTester: React.FC<ArbitraryStringTesterProps> = ({ result }) => {
  const [customInput, setCustomInput] = useState(result.witnessResult.witness ?? 'a');

  const simR1 = simulateDFA(result.dfa1, customInput);
  const simR2 = simulateDFA(result.dfa2, customInput);

  const isInDifference = simR1.accepted && !simR2.accepted;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1322] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#090d16]/70">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-indigo-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Arbitrary String Simulator
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Live DFA 1 & DFA 2 Execution Trace
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="flex-1 flex items-center bg-[#090d16] rounded-xl border border-slate-800 px-3 py-2 cursor-text focus-within:border-slate-700">
            <span className="text-xs font-mono text-slate-500 mr-2 shrink-0">Test String (w):</span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type any test string, e.g. ac"
              aria-label="Arbitrary test string input"
              className="flex-1 bg-transparent font-mono text-sm font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none min-w-0"
            />
            {customInput === '' && (
              <span className="text-[11px] font-mono text-slate-500 italic shrink-0">ε (empty string)</span>
            )}
          </label>

          <div className="flex items-center gap-1.5 flex-wrap">
            {result.witnessResult.witness !== null && (
              <button
                type="button"
                onClick={() => setCustomInput(result.witnessResult.witness ?? '')}
                className="flex-1 sm:flex-initial px-2.5 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-xs font-mono text-indigo-300 border border-indigo-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                title="Test minimal witness"
                aria-label={`Load minimal witness string ${result.witnessResult.witness || 'ε'}`}
              >
                Load Witness &quot;{result.witnessResult.witness || 'ε'}&quot;
              </button>
            )}
            <button
              type="button"
              onClick={() => setCustomInput('')}
              className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              title="Test empty string"
              aria-label="Test empty string epsilon"
            >
              ε
            </button>
          </div>
        </div>

        {/* Live Simulation Trace Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* DFA 1 Trace */}
          <div className="p-3.5 rounded-xl bg-[#090e1b] border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-slate-300 truncate">
                DFA 1 (R₁: <span className="break-all">{result.regex1}</span>)
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                  simR1.accepted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                    : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                }`}
              >
                {simR1.accepted ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {simR1.accepted ? 'ACCEPTS' : 'REJECTS'}
              </span>
            </div>

            {/* Path Trace */}
            <div className="text-[11px] font-mono text-slate-400 bg-[#060a12] p-2.5 rounded-lg border border-slate-800/50 overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                State Transition Path:
              </div>
              {customInput.length === 0 ? (
                <div>
                  <span className="text-indigo-400 font-bold">{result.dfa1.startState}</span> (Start State)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
                  <span className="text-indigo-400 font-bold">{result.dfa1.startState}</span>
                  {simR1.path.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-600">→</span>
                      <span className="px-1 py-0.2 rounded bg-slate-800 text-sky-300 font-bold">
                        {step.symbol}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span
                        className={
                          idx === simR1.path.length - 1
                            ? simR1.accepted
                              ? 'text-emerald-400 font-bold'
                              : 'text-rose-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {step.toState}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DFA 2 Trace */}
          <div className="p-3.5 rounded-xl bg-[#090e1b] border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-slate-300 truncate">
                DFA 2 (R₂: <span className="break-all">{result.regex2}</span>)
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                  simR2.accepted
                    ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                }`}
              >
                {simR2.accepted ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                {simR2.accepted ? 'ACCEPTS (R2)' : 'REJECTS (R2)'}
              </span>
            </div>

            {/* Path Trace */}
            <div className="text-[11px] font-mono text-slate-400 bg-[#060a12] p-2.5 rounded-lg border border-slate-800/50 overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                State Transition Path:
              </div>
              {customInput.length === 0 ? (
                <div>
                  <span className="text-indigo-400 font-bold">{result.dfa2.startState}</span> (Start State)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
                  <span className="text-indigo-400 font-bold">{result.dfa2.startState}</span>
                  {simR2.path.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-600">→</span>
                      <span className="px-1 py-0.2 rounded bg-slate-800 text-sky-300 font-bold">
                        {step.symbol}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span
                        className={
                          idx === simR2.path.length - 1
                            ? simR2.accepted
                              ? 'text-rose-400 font-bold'
                              : 'text-emerald-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {step.toState}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Sandbox Verdict */}
        <div
          className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono break-words ${
            isInDifference
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              String &quot;<span className="break-all">{customInput || 'ε'}</span>&quot; membership test:
            </span>
          </div>

          <div className="min-w-0">
            {isInDifference ? (
              <span className="font-bold text-emerald-400">
                &quot;<span className="break-all">{customInput || 'ε'}</span>&quot; ∈ L(R₁) − L(R₂) [Valid Difference Member]
              </span>
            ) : (
              <span className="font-medium text-slate-400">
                &quot;<span className="break-all">{customInput || 'ε'}</span>&quot; ∉ L(R₁) − L(R₂) ({simR1.accepted ? 'Accepted by R2' : 'Not accepted by R1'})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
