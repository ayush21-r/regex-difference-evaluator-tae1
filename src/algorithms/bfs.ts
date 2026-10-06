// BFS Shortest Witness Search on the Difference Automaton

import type { DifferenceAutomaton, WitnessResult, WitnessPathStep, BFSStep } from './types';

/**
 * Executes a Breadth-First Search on the Difference Automaton to find the shortest witness string.
 */
export function findShortestWitness(diffAutomaton: DifferenceAutomaton): WitnessResult {
  const startTime = performance.now();

  const startStateObj = diffAutomaton.states.find((s) => s.id === diffAutomaton.startState);
  if (!startStateObj) {
    return {
      hasDifference: false,
      witness: null,
      witnessDisplay: 'None',
      path: [],
      bfsExplorationSteps: [],
      visitedStateCount: 0,
      searchDurationMs: 0,
      explanation: 'Start state could not be resolved.',
    };
  }

  // Pre-index transitions by `fromState` for fast BFS
  const transitionMap = new Map<string, { symbol: string; to: string }[]>();
  for (const t of diffAutomaton.transitions) {
    if (!transitionMap.has(t.from)) {
      transitionMap.set(t.from, []);
    }
    transitionMap.get(t.from)!.push({ symbol: t.symbol, to: t.to });
  }

  // Fast map to get state details
  const stateLookup = new Map<string, typeof startStateObj>();
  for (const s of diffAutomaton.states) {
    stateLookup.set(s.id, s);
  }

  const bfsExplorationSteps: BFSStep[] = [];
  let stepCounter = 1;

  // Case 1: Start state itself is accepting (witness is epsilon / empty string)
  if (startStateObj.isAccept) {
    const elapsed = performance.now() - startTime;
    return {
      hasDifference: true,
      witness: '',
      witnessDisplay: 'ε (empty string)',
      path: [],
      bfsExplorationSteps: [
        {
          stepNumber: 1,
          currentState: startStateObj.id,
          inputSymbol: 'ε',
          nextState: startStateObj.id,
          stringSoFar: 'ε',
          isAccepting: true,
        },
      ],
      visitedStateCount: 1,
      searchDurationMs: Number(elapsed.toFixed(3)),
      explanation:
        'The start state is already an accepting state in the difference automaton. Thus, the empty string ε is in L(R1) and not in L(R2).',
    };
  }

  // BFS Queue
  interface QueueItem {
    stateId: string;
    str: string;
    path: WitnessPathStep[];
  }

  const queue: QueueItem[] = [{ stateId: diffAutomaton.startState, str: '', path: [] }];
  const visited = new Set<string>([diffAutomaton.startState]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const transitions = transitionMap.get(current.stateId) || [];

    // Sort transitions alphabetically by symbol for deterministic canonical witness
    transitions.sort((a, b) => a.symbol.localeCompare(b.symbol));

    for (const t of transitions) {
      const nextStateObj = stateLookup.get(t.to);
      const isAccept = !!nextStateObj?.isAccept;
      const nextStr = current.str + t.symbol;

      const curObj = stateLookup.get(current.stateId);
      const nextObj = stateLookup.get(t.to);

      const pathStep: WitnessPathStep = {
        fromState: current.stateId,
        symbol: t.symbol,
        toState: t.to,
        d1From: curObj?.state1 || '?',
        d1To: nextObj?.state1 || '?',
        d2From: curObj?.state2 || '?',
        d2To: nextObj?.state2 || '?',
      };

      const newPath = [...current.path, pathStep];

      bfsExplorationSteps.push({
        stepNumber: stepCounter++,
        currentState: current.stateId,
        inputSymbol: t.symbol,
        nextState: t.to,
        stringSoFar: nextStr,
        isAccepting: isAccept,
      });

      if (isAccept) {
        const elapsed = performance.now() - startTime;
        return {
          hasDifference: true,
          witness: nextStr,
          witnessDisplay: nextStr,
          path: newPath,
          bfsExplorationSteps,
          visitedStateCount: visited.size,
          searchDurationMs: Number(elapsed.toFixed(3)),
          explanation: `Minimal witness "${nextStr}" discovered at level ${nextStr.length} of the difference automaton. Accepted by R1 and rejected by R2.`,
        };
      }

      if (!visited.has(t.to)) {
        visited.add(t.to);
        queue.push({
          stateId: t.to,
          str: nextStr,
          path: newPath,
        });
      }
    }
  }

  const elapsed = performance.now() - startTime;
  return {
    hasDifference: false,
    witness: null,
    witnessDisplay: 'None (L(R1) ⊆ L(R2))',
    path: [],
    bfsExplorationSteps,
    visitedStateCount: visited.size,
    searchDurationMs: Number(elapsed.toFixed(3)),
    explanation:
      'BFS search completed. No accepting state is reachable in the difference automaton. Every string in L(R1) is also accepted by L(R2). Therefore, L(R1) − L(R2) = ∅.',
  };
}
