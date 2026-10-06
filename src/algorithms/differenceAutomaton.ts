// Difference / Product Automaton: D_diff = D1 × ¬D2

import type { DFA, DifferenceAutomaton, ProductState, ProductTransition } from './types';

/**
 * Builds the reachable Product Automaton for L(D1) - L(D2) = L(D1) ∩ ¬L(D2).
 */
export function buildDifferenceAutomaton(
  dfa1: DFA,
  dfa2: DFA,
  alphabet: string[]
): DifferenceAutomaton {
  // Fast lookup for transitions in DFA1: map of `${state}:${symbol}` -> targetState
  const d1TransitionMap = new Map<string, string>();
  for (const t of dfa1.transitions) {
    d1TransitionMap.set(`${t.from}:${t.symbol}`, t.to);
  }

  // Fast lookup for transitions in DFA2
  const d2TransitionMap = new Map<string, string>();
  for (const t of dfa2.transitions) {
    d2TransitionMap.set(`${t.from}:${t.symbol}`, t.to);
  }

  const d1AcceptSet = new Set(dfa1.acceptStates);
  const d2AcceptSet = new Set(dfa2.acceptStates);

  const startPairId = `(${dfa1.startState},${dfa2.startState})`;

  const statesMap = new Map<string, ProductState>();
  const transitions: ProductTransition[] = [];
  const acceptStates: string[] = [];

  const queue: { s1: string; s2: string; id: string }[] = [];

  // Register start state
  const isStartAccept1 = d1AcceptSet.has(dfa1.startState);
  const isStartAccept2 = d2AcceptSet.has(dfa2.startState);
  const isStartDifferenceAccept = isStartAccept1 && !isStartAccept2;

  const startProductState: ProductState = {
    id: startPairId,
    state1: dfa1.startState,
    state2: dfa2.startState,
    label: `(${dfa1.startState}, ${dfa2.startState})`,
    isStart: true,
    isAccept: isStartDifferenceAccept,
    isD1Accept: isStartAccept1,
    isD2Accept: isStartAccept2,
  };

  statesMap.set(startPairId, startProductState);
  if (isStartDifferenceAccept) {
    acceptStates.push(startPairId);
  }

  queue.push({ s1: dfa1.startState, s2: dfa2.startState, id: startPairId });

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const symbol of alphabet) {
      // Find delta1(s1, symbol)
      const next1 = d1TransitionMap.get(`${current.s1}:${symbol}`) || 'q_dead';
      // Find delta2(s2, symbol)
      const next2 = d2TransitionMap.get(`${current.s2}:${symbol}`) || 'q_dead';

      const nextPairId = `(${next1},${next2})`;

      if (!statesMap.has(nextPairId)) {
        const isD1Accept = d1AcceptSet.has(next1);
        const isD2Accept = d2AcceptSet.has(next2);
        // Accepting condition: accepted by D1 AND rejected by D2
        const isDiffAccept = isD1Accept && !isD2Accept;

        const newState: ProductState = {
          id: nextPairId,
          state1: next1,
          state2: next2,
          label: `(${next1}, ${next2})`,
          isStart: false,
          isAccept: isDiffAccept,
          isD1Accept,
          isD2Accept,
        };

        statesMap.set(nextPairId, newState);
        if (isDiffAccept) {
          acceptStates.push(nextPairId);
        }

        queue.push({ s1: next1, s2: next2, id: nextPairId });
      }

      transitions.push({
        from: current.id,
        to: nextPairId,
        symbol,
      });
    }
  }

  return {
    startState: startPairId,
    states: Array.from(statesMap.values()),
    acceptStates,
    transitions,
    alphabet,
  };
}
