// Interactive Multi-View Automata Graph Visualizer

import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import {
  nfaToFlow,
  dfaToFlow,
  differenceAutomatonToFlow,
  getLayoutedElements,
} from '../../utils/graphLayout';
import { AutomataNode } from './AutomataNode';
import type { EvaluationPipelineResult } from '../../algorithms/types';
import {
  Network,
  GitFork,
  Layers,
} from 'lucide-react';

interface AutomataVisualizerProps {
  result: EvaluationPipelineResult | null;
  defaultTab?: 'diff' | 'dfa1' | 'nfa1' | 'dfa2' | 'nfa2';
}

const nodeTypes = {
  automataNode: AutomataNode,
};

export const AutomataVisualizer: React.FC<AutomataVisualizerProps> = ({
  result,
  defaultTab = 'diff',
}) => {
  const [activeTab, setActiveTab] = useState<'diff' | 'dfa1' | 'nfa1' | 'dfa2' | 'nfa2'>(defaultTab);
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleTabChange = (tab: 'diff' | 'dfa1' | 'nfa1' | 'dfa2' | 'nfa2') => {
    setActiveTab(tab);
    setSelectedNode(null);
  };

  // Generate elements based on active tab and result
  const { initialNodes, initialEdges, meta } = useMemo(() => {
    if (!result) {
      return {
        initialNodes: [],
        initialEdges: [],
        meta: {
          title: 'No Automaton Loaded',
          stateCount: 0,
          transitionCount: 0,
          alphabet: [] as string[],
          startState: '-',
          acceptStates: [] as string[],
        },
      };
    }

    switch (activeTab) {
      case 'diff': {
        const flow = differenceAutomatonToFlow(
          result.differenceAutomaton,
          result.witnessResult.path
        );
        return {
          initialNodes: flow.nodes,
          initialEdges: flow.edges,
          meta: {
            title: 'Difference Automaton D1 × ¬D2',
            stateCount: result.differenceAutomaton.states.length,
            transitionCount: result.differenceAutomaton.transitions.length,
            alphabet: result.differenceAutomaton.alphabet,
            startState: result.differenceAutomaton.startState,
            acceptStates: result.differenceAutomaton.acceptStates,
          },
        };
      }
      case 'dfa1': {
        const flow = dfaToFlow(result.dfa1, 'DFA 1 (R1)');
        return {
          initialNodes: flow.nodes,
          initialEdges: flow.edges,
          meta: {
            title: `DFA 1 for R1: "${result.regex1}"`,
            stateCount: result.dfa1.states.length,
            transitionCount: result.dfa1.transitions.length,
            alphabet: result.dfa1.alphabet,
            startState: result.dfa1.startState,
            acceptStates: result.dfa1.acceptStates,
          },
        };
      }
      case 'nfa1': {
        const flow = nfaToFlow(result.nfa1, 'NFA 1 (R1)');
        return {
          initialNodes: flow.nodes,
          initialEdges: flow.edges,
          meta: {
            title: `Thompson NFA 1 for R1: "${result.regex1}"`,
            stateCount: result.nfa1.states.length,
            transitionCount: result.nfa1.transitions.length,
            alphabet: result.nfa1.alphabet,
            startState: `State ${result.nfa1.startState}`,
            acceptStates: [`State ${result.nfa1.acceptState}`],
          },
        };
      }
      case 'dfa2': {
        const flow = dfaToFlow(result.dfa2, 'DFA 2 (R2)');
        return {
          initialNodes: flow.nodes,
          initialEdges: flow.edges,
          meta: {
            title: `DFA 2 for R2: "${result.regex2}"`,
            stateCount: result.dfa2.states.length,
            transitionCount: result.dfa2.transitions.length,
            alphabet: result.dfa2.alphabet,
            startState: result.dfa2.startState,
            acceptStates: result.dfa2.acceptStates,
          },
        };
      }
      case 'nfa2': {
        const flow = nfaToFlow(result.nfa2, 'NFA 2 (R2)');
        return {
          initialNodes: flow.nodes,
          initialEdges: flow.edges,
          meta: {
            title: `Thompson NFA 2 for R2: "${result.regex2}"`,
            stateCount: result.nfa2.states.length,
            transitionCount: result.nfa2.transitions.length,
            alphabet: result.nfa2.alphabet,
            startState: `State ${result.nfa2.startState}`,
            acceptStates: [`State ${result.nfa2.acceptState}`],
          },
        };
      }
    }
  }, [result, activeTab]);

  // Handle nodes and edges states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever initial elements change
  React.useEffect(() => {
    const layouted = getLayoutedElements(initialNodes, initialEdges, direction);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [initialNodes, initialEdges, direction, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-slate-800 rounded-2xl bg-[#0b0f19] text-center min-h-[400px]">
        <Network className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No Automaton Loaded</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          Enter two regular expressions in the Evaluator to construct and interactively explore their NFAs, DFAs, and Difference Automaton.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0b0f19] overflow-hidden shadow-2xl">
      {/* Top Header & View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-[#090d16]/90">
        {/* Automata Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => handleTabChange('diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === 'diff'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-sky-400" />
            <span>D1 × ¬D2</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
              Diff
            </span>
          </button>

          <button
            onClick={() => handleTabChange('dfa1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === 'dfa1'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>DFA 1 (R1)</span>
          </button>

          <button
            onClick={() => handleTabChange('nfa1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === 'nfa1'
                ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>NFA 1 (R1)</span>
          </button>

          <button
            onClick={() => handleTabChange('dfa2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === 'dfa2'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>DFA 2 (R2)</span>
          </button>

          <button
            onClick={() => handleTabChange('nfa2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === 'nfa2'
                ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>NFA 2 (R2)</span>
          </button>
        </div>

        {/* Direction Toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDirection('LR')}
              className={`px-2 py-1 rounded font-mono ${
                direction === 'LR'
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Layout Left to Right"
            >
              LR →
            </button>
            <button
              onClick={() => setDirection('TB')}
              className={`px-2 py-1 rounded font-mono ${
                direction === 'TB'
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Layout Top to Bottom"
            >
              TB ↓
            </button>
          </div>
        </div>
      </div>

      {/* Meta Specs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-[#0d1322] border-b border-slate-800 text-[11px] sm:text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="font-semibold text-slate-200">{meta.title}</span>
          <span>
            |Q| = <strong className="text-indigo-400">{meta.stateCount}</strong>
          </span>
          <span>
            |δ| = <strong className="text-indigo-400">{meta.transitionCount}</strong>
          </span>
          <span>
            Σ = <strong className="text-amber-400">[{meta.alphabet.join(', ')}]</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span>
            q₀ = <code className="text-emerald-400">{meta.startState}</code>
          </span>
          <span>
            F = <code className="text-emerald-400">[{meta.acceptStates.join(', ')}]</code>
          </span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] bg-[#090d16]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange as OnNodesChange<Node>}
          onEdgesChange={onEdgesChange as OnEdgesChange<Edge>}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.2}
          maxZoom={2.5}
        >
          <Background color="#1e293b" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="hidden sm:flex absolute bottom-3 left-3 bg-[#0f172a]/95 backdrop-blur-sm border border-slate-800 p-2.5 rounded-xl shadow-xl text-[11px] font-mono flex-col gap-1.5 max-w-xs pointer-events-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Automata Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-indigo-500 bg-[#111827]" />
            <span className="text-slate-300">Start State (IN →)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-[#06241a]" />
            <span className="text-slate-300">Accepting State (F)</span>
          </div>
          {activeTab === 'diff' && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-sky-400 bg-[#032035]" />
              <span className="text-sky-300">Shortest Witness Path</span>
            </div>
          )}
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/80 p-3 sm:p-4 rounded-xl shadow-2xl text-xs font-mono max-w-[calc(100%-24px)] sm:max-w-xs w-72 pointer-events-auto animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>State Inspector</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                aria-label="Close state inspector"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div>
                <span className="text-slate-500">ID:</span>{' '}
                <span className="text-indigo-300 font-bold">{selectedNode.data.id}</span>
              </div>
              <div>
                <span className="text-slate-500">Label:</span>{' '}
                <span className="text-slate-200">{selectedNode.data.label}</span>
              </div>
              <div>
                <span className="text-slate-500">Type:</span>{' '}
                <span className="text-slate-200">{selectedNode.data.subLabel}</span>
              </div>
              <div>
                <span className="text-slate-500">Is Start:</span>{' '}
                <span className={selectedNode.data.isStart ? 'text-emerald-400' : 'text-slate-500'}>
                  {selectedNode.data.isStart ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Is Accept:</span>{' '}
                <span className={selectedNode.data.isAccept ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedNode.data.isAccept ? 'Yes (Accepting)' : 'No (Non-Accepting)'}
                </span>
              </div>
              {selectedNode.data.kind === 'diff' && (
                <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>R1 Acceptance:</span>
                    <strong className={selectedNode.data.isD1Accept ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedNode.data.isD1Accept ? 'Accepted' : 'Rejected'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>R2 Acceptance:</span>
                    <strong className={selectedNode.data.isD2Accept ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedNode.data.isD2Accept ? 'Accepted (Fails Diff)' : 'Rejected (Diff Match)'}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
