// Independent Automaton Simulation & Witness Verification Engine

import type { DFA, VerificationTrace, DFAVerificationStep } from './types';

/**
 * Simulates a DFA on an input string, recording each transition step.
 */
export function simulateDFA(
  dfa: DFA,
  input: string
): { accepted: boolean; finalState: string; path: DFAVerificationStep[] } {
  const transitionMap = new Map<string, string>();
  for (const t of dfa.transitions) {
    transitionMap.set(`${t.from}:${t.symbol}`, t.to);
  }

  const acceptSet = new Set(dfa.acceptStates);
  let currentState = dfa.startState;
  const path: DFAVerificationStep[] = [];

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const nextState = transitionMap.get(`${currentState}:${symbol}`) || 'q_dead';

    path.push({
      fromState: currentState,
      symbol,
      toState: nextState,
    });

    currentState = nextState;
  }

  const accepted = acceptSet.has(currentState);

  return {
    accepted,
    finalState: currentState,
    path,
  };
}

/**
 * Verifies a witness candidate against both DFAs.
 */
export function verifyWitness(
  witness: string | null,
  dfa1: DFA,
  dfa2: DFA
): VerificationTrace {
  const testString = witness ?? '';

  const r1Result = simulateDFA(dfa1, testString);
  const r2Result = simulateDFA(dfa2, testString);

  const isWitnessValid =
    witness !== null && r1Result.accepted === true && r2Result.accepted === false;

  return {
    string: testString,
    r1Result,
    r2Result,
    isWitnessValid,
  };
}
