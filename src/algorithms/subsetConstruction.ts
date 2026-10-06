// Subset Construction Algorithm: NFA -> Deterministic Finite Automaton (DFA)

import type { NFA, DFA, DFAState, DFATransition } from './types';

/**
 * Computes the ε-closure of a set of NFA states.
 */
export function epsilonClosure(states: number[], nfa: NFA): number[] {
  const closure = new Set<number>(states);
  const stack = [...states];

  while (stack.length > 0) {
    const current = stack.pop()!;

    for (const transition of nfa.transitions) {
      if (transition.from === current && transition.symbol === null) {
        if (!closure.has(transition.to)) {
          closure.add(transition.to);
          stack.push(transition.to);
        }
      }
    }
  }

  return Array.from(closure).sort((a, b) => a - b);
}

/**
 * Computes the set of states reachable on a specific symbol from a given set of states.
 */
function move(states: number[], symbol: string, nfa: NFA): number[] {
  const reachable = new Set<number>();

  for (const state of states) {
    for (const transition of nfa.transitions) {
      if (transition.from === state && transition.symbol === symbol) {
        reachable.add(transition.to);
      }
    }
  }

  return Array.from(reachable);
}

/**
 * Converts an array of state IDs into a canonical key string for map lookup.
 */
function stateSetToKey(states: number[]): string {
  return states.sort((a, b) => a - b).join(',');
}

/**
 * Converts an NFA to a DFA using Subset Construction.
 * @param nfa The input NFA.
 * @param alphabetOverride Optional unified alphabet (e.g. Σ1 ∪ Σ2).
 * @param makeTotal If true, adds a sink/dead state so transitions are defined for every symbol in Σ.
 */
export function nfaToDFA(
  nfa: NFA,
  alphabetOverride?: string[],
  makeTotal: boolean = true
): DFA {
  const alphabet = Array.from(
    new Set(alphabetOverride && alphabetOverride.length > 0 ? alphabetOverride : nfa.alphabet)
  ).sort();

  const startClosure = epsilonClosure([nfa.startState], nfa);
  const startKey = stateSetToKey(startClosure);

  const stateMap = new Map<string, { id: string; set: number[]; isStart: boolean; isAccept: boolean }>();
  const queue: number[][] = [startClosure];

  let stateIdCounter = 0;
  const getNextStateId = () => `q${stateIdCounter++}`;

  const startId = getNextStateId();
  stateMap.set(startKey, {
    id: startId,
    set: startClosure,
    isStart: true,
    isAccept: startClosure.includes(nfa.acceptState),
  });

  const rawTransitions: { from: string; symbol: string; to: string }[] = [];
  let needsSink = false;

  while (queue.length > 0) {
    const currentSet = queue.shift()!;
    const currentKey = stateSetToKey(currentSet);
    const currentInfo = stateMap.get(currentKey)!;

    for (const symbol of alphabet) {
      const moveStates = move(currentSet, symbol, nfa);
      const nextClosure = epsilonClosure(moveStates, nfa);

      if (nextClosure.length === 0) {
        if (makeTotal) {
          needsSink = true;
          rawTransitions.push({
            from: currentInfo.id,
            symbol,
            to: 'q_dead',
          });
        }
        continue;
      }

      const nextKey = stateSetToKey(nextClosure);
      if (!stateMap.has(nextKey)) {
        const newId = getNextStateId();
        stateMap.set(nextKey, {
          id: newId,
          set: nextClosure,
          isStart: false,
          isAccept: nextClosure.includes(nfa.acceptState),
        });
        queue.push(nextClosure);
      }

      const targetInfo = stateMap.get(nextKey)!;
      rawTransitions.push({
        from: currentInfo.id,
        symbol,
        to: targetInfo.id,
      });
    }
  }

  // If sink state is needed, add it
  const dfaStates: DFAState[] = [];
  const acceptStates: string[] = [];

  for (const info of stateMap.values()) {
    dfaStates.push({
      id: info.id,
      label: `{${info.set.join(',')}}`,
      nfaStateSet: info.set,
      isStart: info.isStart,
      isAccept: info.isAccept,
      isSink: false,
    });
    if (info.isAccept) {
      acceptStates.push(info.id);
    }
  }

  if (needsSink && makeTotal) {
    dfaStates.push({
      id: 'q_dead',
      label: '∅ (sink)',
      nfaStateSet: [],
      isStart: false,
      isAccept: false,
      isSink: true,
    });

    // Add self-loops on dead state for all alphabet symbols
    for (const symbol of alphabet) {
      rawTransitions.push({
        from: 'q_dead',
        symbol,
        to: 'q_dead',
      });
    }
  }

  const transitions: DFATransition[] = rawTransitions.map((t) => ({
    from: t.from,
    to: t.to,
    symbol: t.symbol,
  }));

  return {
    startState: startId,
    states: dfaStates,
    acceptStates,
    transitions,
    alphabet,
  };
}
