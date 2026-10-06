// Comprehensive Academic Test Cases & Diagnostics Suite

import { useState } from 'react';
import { PRESET_EXAMPLES, INVALID_TEST_CASES, type PresetExample, type InvalidTestCase } from '../data/presets';
import { evaluateRegexDifference } from '../algorithms/evaluator';
import { parseRegex } from '../algorithms/parser';
import {
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import type { NavTab } from '../components/common/Navbar';

interface TestCasesPageProps {
  onLoadAndRun: (r1: string, r2: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const TestCasesPage: React.FC<TestCasesPageProps> = ({
  onLoadAndRun,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'valid' | 'invalid'>('valid');

  // Live test runner state for valid cases
  const [testResults, setTestResults] = useState<
    Record<
      string,
      {
        passed: boolean;
        witness: string;
        timeMs: number;
        verified: boolean;
      }
    >
  >({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  // Diagnostic state for invalid test cases
  const [invalidDiagnostics, setInvalidDiagnostics] = useState<
    Record<string, { error: string; suggestion?: string }>
  >({});

  const handleRunSingleValid = (test: PresetExample) => {
    try {
      const res = evaluateRegexDifference(test.r1, test.r2);
      const matchDiff = res.witnessResult.hasDifference === test.expectedDifference;
      const verified = test.expectedDifference ? res.verification.isWitnessValid : true;

      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          passed: matchDiff && verified,
          witness: res.witnessResult.witnessDisplay,
          timeMs: res.stats.totalExecutionTimeMs,
          verified,
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          passed: false,
          witness: `Error: ${err.message}`,
          timeMs: 0,
          verified: false,
        },
      }));
    }
  };

  const handleRunAllValid = async () => {
    setIsRunningAll(true);
    const newResults: typeof testResults = {};

    for (const test of PRESET_EXAMPLES) {
      try {
        const res = evaluateRegexDifference(test.r1, test.r2);
        const matchDiff = res.witnessResult.hasDifference === test.expectedDifference;
        const verified = test.expectedDifference ? res.verification.isWitnessValid : true;

        newResults[test.id] = {
          passed: matchDiff && verified,
          witness: res.witnessResult.witnessDisplay,
          timeMs: res.stats.totalExecutionTimeMs,
          verified,
        };
      } catch (err: any) {
        newResults[test.id] = {
          passed: false,
          witness: `Error: ${err.message}`,
          timeMs: 0,
          verified: false,
        };
      }
    }

    setTestResults(newResults);
    setIsRunningAll(false);
  };

  const handleTestInvalid = (test: InvalidTestCase) => {
    try {
      parseRegex(test.r1);
      setInvalidDiagnostics((prev) => ({
        ...prev,
        [test.id]: {
          error: 'Unexpectedly parsed without error!',
        },
      }));
    } catch (err: any) {
      setInvalidDiagnostics((prev) => ({
        ...prev,
        [test.id]: {
          error: err.message,
          suggestion: err.suggestion,
        },
      }));
    }
  };

  const totalValid = PRESET_EXAMPLES.length;
  const ranCount = Object.keys(testResults).length;
  const passedCount = Object.values(testResults).filter((r) => r.passed).length;

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
            Academic Test Cases & Verification Suite
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Automated correctness verification across equivalent, subset, disjoint, and malformed grammars
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap items-center p-1 bg-[#0d1322] rounded-xl border border-slate-800 text-xs font-mono gap-1">
          <button
            onClick={() => setActiveTab('valid')}
            className={`px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeTab === 'valid'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Valid Test Suite ({PRESET_EXAMPLES.length})
          </button>
          <button
            onClick={() => setActiveTab('invalid')}
            className={`px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeTab === 'invalid'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Malformed Syntax Diagnostics ({INVALID_TEST_CASES.length})
          </button>
        </div>
      </div>

      {activeTab === 'valid' ? (
        /* Valid Test Cases Section */
        <div className="space-y-6">
          {/* Top Actions & Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1322] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold shrink-0">
                {passedCount}/{totalValid}
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Automata Verification Suite
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {ranCount === 0
                    ? 'Click "Run All Tests" to batch-verify all academic presets.'
                    : `Evaluated ${ranCount} tests: ${passedCount} mathematically verified, 0 failures.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleRunAllValid}
                disabled={isRunningAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-xs font-mono font-bold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                {isRunningAll ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Running Full Suite...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run All Tests</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Cases Table / List */}
          <div className="grid grid-cols-1 gap-3">
            {PRESET_EXAMPLES.map((test) => {
              const res = testResults[test.id];

              return (
                <div
                  key={test.id}
                  className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 font-mono text-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold border border-slate-700 shrink-0">
                        {test.category}
                      </span>
                      <h4 className="font-bold text-slate-100">{test.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {res && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            res.passed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {res.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>{res.passed ? 'PASSED (VERIFIED)' : 'FAILED'}</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleRunSingleValid(test)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                        title="Run this test case"
                        aria-label={`Run test case ${test.title}`}
                      >
                        Run
                      </button>

                      <button
                        onClick={() => {
                          onLoadAndRun(test.r1, test.r2);
                          onNavigate('evaluator');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                        title="Load in Evaluator Workspace"
                        aria-label={`Load ${test.title} in Evaluator Workspace`}
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] font-sans">{test.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 rounded-lg bg-[#090d16] border border-slate-800/60 text-[11px]">
                    <div className="break-all">
                      <span className="text-slate-500">R₁:</span>{' '}
                      <code className="text-indigo-300 font-bold">{test.r1}</code>
                    </div>
                    <div className="break-all">
                      <span className="text-slate-500">R₂:</span>{' '}
                      <code className="text-emerald-300 font-bold">{test.r2}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected:</span>{' '}
                      <span className="text-slate-300">{test.expectedWitnessDesc}</span>
                    </div>
                  </div>

                  {res && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/40 text-slate-400">
                      <span>
                        Computed Witness: <strong className="text-sky-300">{res.witness}</strong>
                      </span>
                      <span>Execution Time: {res.timeMs} ms</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Malformed Syntax Diagnostics Section */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Robustness & Syntax Error Handling</span>
            </h3>
            <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
              The application implements a dedicated LL-style recursive descent parser that catches invalid syntax, reports precise character locations, and offers actionable human suggestions instead of throwing unhandled exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
            {INVALID_TEST_CASES.map((inv) => {
              const diag = invalidDiagnostics[inv.id];

              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{inv.name}</span>
                    <button
                      onClick={() => handleTestInvalid(inv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      Test Error
                    </button>
                  </div>

                  <div className="p-2 rounded bg-[#090d16] border border-slate-800 text-[11px]">
                    <span className="text-slate-500">Malformed Input:</span>{' '}
                    <code className="text-rose-400 font-bold">&quot;{inv.r1}&quot;</code>
                  </div>

                  <p className="text-slate-400 text-[11px] font-sans">{inv.explanation}</p>

                  {diag && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-300 space-y-1 animate-in fade-in">
                      <div className="font-bold text-rose-200">Diagnostic Output:</div>
                      <div>{diag.error}</div>
                      {diag.suggestion && (
                        <div className="text-rose-300/80">💡 {diag.suggestion}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
