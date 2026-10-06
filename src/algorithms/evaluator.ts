// Main Evaluator Pipeline for Language Difference L(R1) - L(R2)

import { parseRegex } from './parser';
import { buildNFA } from './thompson';
import { nfaToDFA } from './subsetConstruction';
import { buildDifferenceAutomaton } from './differenceAutomaton';
import { findShortestWitness } from './bfs';
import { verifyWitness } from './witnessVerifier';
import type { EvaluationPipelineResult } from './types';

export function evaluateRegexDifference(regex1: string, regex2: string): EvaluationPipelineResult {
  const t0 = performance.now();

  // Step 1: Parse ASTs
  const ast1 = parseRegex(regex1);
  const ast2 = parseRegex(regex2);

  // Step 2: Build NFAs via Thompson's Construction
  const nfa1 = buildNFA(ast1);
  const nfa2 = buildNFA(ast2);

  // Step 3: Compute unified alphabet Σ = Σ1 ∪ Σ2
  const unifiedAlphabetSet = new Set<string>([...nfa1.alphabet, ...nfa2.alphabet]);
  const unifiedAlphabet = Array.from(unifiedAlphabetSet).sort();

  // Step 4: Convert NFAs to DFAs with total transitions over unified alphabet
  const dfa1 = nfaToDFA(nfa1, unifiedAlphabet, true);
  const dfa2 = nfaToDFA(nfa2, unifiedAlphabet, true);

  // Step 5: Construct Product / Difference Automaton D1 × ¬D2
  const differenceAutomaton = buildDifferenceAutomaton(dfa1, dfa2, unifiedAlphabet);

  // Step 6: BFS Witness Search
  const witnessResult = findShortestWitness(differenceAutomaton);

  // Step 7: Independent Witness Verification
  const verification = verifyWitness(witnessResult.witness, dfa1, dfa2);

  const totalTime = performance.now() - t0;

  return {
    regex1,
    regex2,
    nfa1,
    dfa1,
    nfa2,
    dfa2,
    differenceAutomaton,
    witnessResult,
    verification,
    stats: {
      nfa1StateCount: nfa1.states.length,
      dfa1StateCount: dfa1.states.length,
      nfa2StateCount: nfa2.states.length,
      dfa2StateCount: dfa2.states.length,
      diffStateCount: differenceAutomaton.states.length,
      diffTransitionCount: differenceAutomaton.transitions.length,
      totalExecutionTimeMs: Number(totalTime.toFixed(2)),
    },
  };
}
