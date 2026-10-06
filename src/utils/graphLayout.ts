// Dagre Graph Layout Helper for React Flow Automata Visualization

import dagre from '@dagrejs/dagre';
import { MarkerType, type Node, type Edge } from '@xyflow/react';
import type { DFA, NFA, DifferenceAutomaton, WitnessPathStep } from '../algorithms/types';

const NODE_WIDTH = 130;
const NODE_HEIGHT = 80;

/**
 * Applies Dagre automated layout to nodes and edges.
 */
export function getLayoutedElements<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node<T>[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Converts an NFA into React Flow Nodes and Edges.
 */
export function nfaToFlow(
  nfa: NFA,
  title: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = nfa.states.map((stateId) => {
    const isStart = stateId === nfa.startState;
    const isAccept = stateId === nfa.acceptState;

    return {
      id: `s_${stateId}`,
      type: 'automataNode',
      data: {
        id: `s${stateId}`,
        label: `State ${stateId}`,
        subLabel: isStart && isAccept ? 'Start & Accept' : isStart ? 'Start State' : isAccept ? 'Accept State' : 'Intermediate',
        isStart,
        isAccept,
        isSink: false,
        kind: 'nfa',
        graphTitle: title,
      },
      position: { x: 0, y: 0 },
    };
  });

  // Group multiple transitions between same from-to into combined labels
  const edgeMap = new Map<string, { from: number; to: number; symbols: string[] }>();

  nfa.transitions.forEach((t) => {
    const key = `${t.from}->${t.to}`;
    const symbolText = t.symbol === null ? 'ε' : t.symbol;
    if (!edgeMap.has(key)) {
      edgeMap.set(key, { from: t.from, to: t.to, symbols: [symbolText] });
    } else {
      const entry = edgeMap.get(key)!;
      if (!entry.symbols.includes(symbolText)) {
        entry.symbols.push(symbolText);
      }
    }
  });

  const edges: Edge[] = Array.from(edgeMap.values()).map((e, index) => {
    const label = e.symbols.join(', ');
    const isSelfLoop = e.from === e.to;

    return {
      id: `e_${e.from}_${e.to}_${index}`,
      source: `s_${e.from}`,
      target: `s_${e.to}`,
      label,
      type: isSelfLoop ? 'default' : 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#818cf8',
        width: 16,
        height: 16,
      },
      style: {
        stroke: '#475569',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: '#f1f5f9',
        fontWeight: 600,
        fontSize: 12,
        fontFamily: 'monospace',
      },
      labelBgStyle: {
        fill: '#0f172a',
        fillOpacity: 0.9,
        stroke: '#334155',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [4, 6],
    };
  });

  return getLayoutedElements(nodes, edges);
}

/**
 * Converts a DFA into React Flow Nodes and Edges.
 */
export function dfaToFlow(
  dfa: DFA,
  title: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = dfa.states.map((state) => {
    return {
      id: `dfa_${state.id}`,
      type: 'automataNode',
      data: {
        id: state.id,
        label: state.id,
        subLabel: state.label,
        isStart: state.isStart,
        isAccept: state.isAccept,
        isSink: !!state.isSink,
        kind: 'dfa',
        graphTitle: title,
      },
      position: { x: 0, y: 0 },
    };
  });

  // Group transitions by from -> to
  const edgeMap = new Map<string, { from: string; to: string; symbols: string[] }>();

  dfa.transitions.forEach((t) => {
    const key = `${t.from}->${t.to}`;
    if (!edgeMap.has(key)) {
      edgeMap.set(key, { from: t.from, to: t.to, symbols: [t.symbol] });
    } else {
      const entry = edgeMap.get(key)!;
      if (!entry.symbols.includes(t.symbol)) {
        entry.symbols.push(t.symbol);
      }
    }
  });

  const edges: Edge[] = Array.from(edgeMap.values()).map((e, index) => {
    const isSelfLoop = e.from === e.to;
    return {
      id: `e_dfa_${e.from}_${e.to}_${index}`,
      source: `dfa_${e.from}`,
      target: `dfa_${e.to}`,
      label: e.symbols.join(', '),
      type: isSelfLoop ? 'default' : 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#818cf8',
        width: 16,
        height: 16,
      },
      style: {
        stroke: '#475569',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: '#f1f5f9',
        fontWeight: 600,
        fontSize: 12,
        fontFamily: 'monospace',
      },
      labelBgStyle: {
        fill: '#0f172a',
        fillOpacity: 0.9,
        stroke: '#334155',
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [4, 6],
    };
  });

  return getLayoutedElements(nodes, edges);
}

/**
 * Converts the Difference Automaton into React Flow Nodes and Edges, highlighting the witness path.
 */
export function differenceAutomatonToFlow(
  diff: DifferenceAutomaton,
  witnessPath: WitnessPathStep[]
): { nodes: Node[]; edges: Edge[] } {
  // Collect state IDs on the witness path
  const pathStateIds = new Set<string>();
  const pathEdgeKeys = new Set<string>();

  if (witnessPath.length > 0) {
    pathStateIds.add(witnessPath[0].fromState);
    witnessPath.forEach((step) => {
      pathStateIds.add(step.toState);
      pathEdgeKeys.add(`${step.fromState}->${step.toState}:${step.symbol}`);
    });
  } else if (diff.states.find((s) => s.id === diff.startState)?.isAccept) {
    // Epsilon witness
    pathStateIds.add(diff.startState);
  }

  const nodes: Node[] = diff.states.map((state) => {
    const isPath = pathStateIds.has(state.id);

    return {
      id: `diff_${state.id}`,
      type: 'automataNode',
      data: {
        id: state.id,
        label: state.label,
        subLabel: state.isAccept
          ? 'Diff Accept (R1 ∧ ¬R2)'
          : state.isD1Accept
          ? 'R1 Accept / R2 Accept'
          : 'Non-Accepting',
        isStart: state.isStart,
        isAccept: state.isAccept,
        isD1Accept: state.isD1Accept,
        isD2Accept: state.isD2Accept,
        isPath,
        kind: 'diff',
        graphTitle: 'Difference Automaton D1 × ¬D2',
      },
      position: { x: 0, y: 0 },
    };
  });

  // Group transitions by from -> to
  const edgeMap = new Map<
    string,
    { from: string; to: string; symbols: string[]; isWitnessEdge: boolean }
  >();

  diff.transitions.forEach((t) => {
    const key = `${t.from}->${t.to}`;
    const isStepOnWitness = pathEdgeKeys.has(`${t.from}->${t.to}:${t.symbol}`);

    if (!edgeMap.has(key)) {
      edgeMap.set(key, {
        from: t.from,
        to: t.to,
        symbols: [t.symbol],
        isWitnessEdge: isStepOnWitness,
      });
    } else {
      const entry = edgeMap.get(key)!;
      if (!entry.symbols.includes(t.symbol)) {
        entry.symbols.push(t.symbol);
      }
      if (isStepOnWitness) {
        entry.isWitnessEdge = true;
      }
    }
  });

  const edges: Edge[] = Array.from(edgeMap.values()).map((e, index) => {
    const isSelfLoop = e.from === e.to;
    const isWitness = e.isWitnessEdge;

    return {
      id: `e_diff_${e.from}_${e.to}_${index}`,
      source: `diff_${e.from}`,
      target: `diff_${e.to}`,
      label: e.symbols.join(', '),
      type: isSelfLoop ? 'default' : 'smoothstep',
      animated: isWitness,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isWitness ? '#38bdf8' : '#64748b',
        width: isWitness ? 20 : 16,
        height: isWitness ? 20 : 16,
      },
      style: {
        stroke: isWitness ? '#38bdf8' : '#475569',
        strokeWidth: isWitness ? 3 : 2,
      },
      labelStyle: {
        fill: isWitness ? '#38bdf8' : '#f1f5f9',
        fontWeight: isWitness ? 700 : 600,
        fontSize: isWitness ? 13 : 12,
        fontFamily: 'monospace',
      },
      labelBgStyle: {
        fill: isWitness ? '#082f49' : '#0f172a',
        fillOpacity: 0.95,
        stroke: isWitness ? '#0284c7' : '#334155',
        strokeWidth: isWitness ? 1.5 : 1,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [4, 6],
    };
  });

  return getLayoutedElements(nodes, edges);
}
