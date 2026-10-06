// Evaluator Workspace Page: Core Interactive Environment

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RegexEditor } from '../components/evaluator/RegexEditor';
import { ResultCard } from '../components/evaluator/ResultCard';
import { ArbitraryStringTester } from '../components/evaluator/ArbitraryStringTester';
import { BFSTimeline } from '../components/evaluator/BFSTimeline';
import { AutomataVisualizer } from '../components/automata/AutomataVisualizer';
import { PRESET_EXAMPLES } from '../data/presets';
import { evaluateRegexDifference } from '../algorithms/evaluator';
import type { EvaluationPipelineResult } from '../algorithms/types';
import {
  ArrowRightLeft,
  Trash2,
  Play,
  Bookmark,
  Network,
} from 'lucide-react';
import type { NavTab } from '../components/common/Navbar';

interface EvaluatorPageProps {
  regex1: string;
  regex2: string;
  setRegex1: (val: string) => void;
  setRegex2: (val: string) => void;
  result: EvaluationPipelineResult | null;
  setResult: (res: EvaluationPipelineResult | null) => void;
  onNavigate: (tab: NavTab) => void;
}

export const EvaluatorPage: React.FC<EvaluatorPageProps> = ({
  regex1,
  regex2,
  setRegex1,
  setRegex2,
  result,
  setResult,
  onNavigate,
}) => {
  const [error1, setError1] = useState<string | null>(null);
  const [suggestion1, setSuggestion1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [suggestion2, setSuggestion2] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Perform calculation
  const handleEvaluate = () => {
    setError1(null);
    setSuggestion1(null);
    setError2(null);
    setSuggestion2(null);

    let hasError = false;

    if (!regex1.trim()) {
      setError1('Please enter Regular Expression 1.');
      setSuggestion1('e.g. "a(b|c)*" or "a|b"');
      hasError = true;
    }

    if (!regex2.trim()) {
      setError2('Please enter Regular Expression 2.');
      setSuggestion2('e.g. "ab*" or "a"');
      hasError = true;
    }

    if (hasError) return;

    setIsEvaluating(true);

    try {
      const evaluation = evaluateRegexDifference(regex1, regex2);
      setResult(evaluation);

      // Trigger subtle celebration if difference found
      if (evaluation.witnessResult.hasDifference) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#818cf8', '#34d399'],
        });
      }
    } catch (err: any) {
      if (err.name === 'ParseError' || err.name === 'TokenizerError') {
        // Determine which regex likely caused it
        try {
          evaluateRegexDifference(regex1, 'a');
        } catch (e1: any) {
          setError1(e1.message);
          setSuggestion1(e1.suggestion);
          return;
        }

        try {
          evaluateRegexDifference('a', regex2);
        } catch (e2: any) {
          setError2(e2.message);
          setSuggestion2(e2.suggestion);
          return;
        }

        setError1(err.message);
        setSuggestion1(err.suggestion);
      } else {
        setError1(err.message || 'An unexpected evaluation error occurred.');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSwap = () => {
    const temp = regex1;
    setRegex1(regex2);
    setRegex2(temp);
    setError1(null);
    setError2(null);
  };

  const handleClear = () => {
    setRegex1('');
    setRegex2('');
    setResult(null);
    setError1(null);
    setError2(null);
  };

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    const found = PRESET_EXAMPLES.find((p) => p.id === presetId);
    if (found) {
      setRegex1(found.r1);
      setRegex2(found.r2);
      setError1(null);
      setError2(null);
      try {
        const res = evaluateRegexDifference(found.r1, found.r2);
        setResult(res);
      } catch {
        // Ignore parsing errors during preset selection
      }
    }
  };

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-300">
      {/* Workspace Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
            Regex Difference Workspace
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Evaluate L(R₁) − L(R₂) · Thompson NFA → Subset DFA → Product Automaton
          </p>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="preset-select" className="sr-only">
            Select Academic Preset
          </label>
          <Bookmark className="w-4 h-4 text-indigo-400 shrink-0" />
          <select
            id="preset-select"
            onChange={handleSelectPreset}
            defaultValue=""
            aria-label="Select Academic Preset Regular Expressions"
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-[#0d1322] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="" disabled>
              Select Academic Preset...
            </option>
            {PRESET_EXAMPLES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Main Regex Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <RegexEditor
          id="regex1-input"
          label="REGULAR EXPRESSION 01 (R₁)"
          subLabel="Language to sample from: L(R₁)"
          value={regex1}
          onChange={setRegex1}
          onClear={() => setRegex1('')}
          placeholder="e.g. a(b|c)*"
          error={error1}
          suggestion={suggestion1}
          badgeColor="indigo"
        />

        <RegexEditor
          id="regex2-input"
          label="REGULAR EXPRESSION 02 (R₂)"
          subLabel="Language to exclude: L(R₂)"
          value={regex2}
          onChange={setRegex2}
          onClear={() => setRegex2('')}
          placeholder="e.g. ab*"
          error={error2}
          suggestion={suggestion2}
          badgeColor="emerald"
        />
      </div>

      {/* Central Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0d1322] border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-slate-100 border border-slate-700/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            title="Swap R1 and R2"
            aria-label="Swap Regular Expression 1 and 2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>Swap (R₁ ↔ R₂)</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            title="Clear expressions"
            aria-label="Clear both regular expressions"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Primary Evaluate CTA */}
        <button
          type="button"
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-xs font-mono font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          aria-label="Evaluate Regular Language Difference"
        >
          {isEvaluating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Computing Product Automaton...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Evaluate Difference</span>
            </>
          )}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-6">
          <ResultCard
            result={result}
            onJumpToAutomata={() => onNavigate('automata')}
          />

          {/* Arbitrary String Sandbox */}
          <ArbitraryStringTester result={result} />

          {/* BFS Exploration Timeline */}
          <BFSTimeline witnessResult={result.witnessResult} />

          {/* Embedded Mini Graph View with CTA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Interactive Difference Automaton Preview
                </h3>
              </div>

              <button
                onClick={() => onNavigate('automata')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Full Automata Visualizer (NFA/DFA/Diff)</span>
                <span>→</span>
              </button>
            </div>

            <AutomataVisualizer result={result} defaultTab="diff" />
          </div>
        </div>
      )}
    </div>
  );
};
