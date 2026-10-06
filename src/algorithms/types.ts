// Common Types for Regular Expression Automata Engine

export type ASTNodeType =
  | 'literal'
  | 'epsilon'
  | 'concat'
  | 'union'
  | 'star'
  | 'plus'
  | 'question';

export interface BaseASTNode {
  type: ASTNodeType;
}

export interface LiteralNode extends BaseASTNode {
  type: 'literal';
  char: string;
}

export interface EpsilonNode extends BaseASTNode {
  type: 'epsilon';
}

export interface ConcatNode extends BaseASTNode {
  type: 'concat';
  left: ASTNode;
  right: ASTNode;
}

export interface UnionNode extends BaseASTNode {
  type: 'union';
  left: ASTNode;
  right: ASTNode;
}

export interface StarNode extends BaseASTNode {
  type: 'star';
  expr: ASTNode;
}

export interface PlusNode extends BaseASTNode {
  type: 'plus';
  expr: ASTNode;
}

export interface QuestionNode extends BaseASTNode {
  type: 'question';
  expr: ASTNode;
}

export type ASTNode =
  | LiteralNode
  | EpsilonNode
  | ConcatNode
  | UnionNode
  | StarNode
  | PlusNode
  | QuestionNode;

// NFA Representation
export interface NFATransition {
  from: number;
  to: number;
  symbol: string | null; // null represents epsilon (ε)
}

export interface NFA {
  startState: number;
  acceptState: number;
  states: number[];
  transitions: NFATransition[];
  alphabet: string[];
}

// DFA Representation
export interface DFATransition {
  from: string; // state ID, e.g. "q0", "q1", "D0"
  to: string;
  symbol: string;
}

export interface DFAState {
  id: string;
  label: string;
  nfaStateSet: number[];
  isStart: boolean;
  isAccept: boolean;
  isSink?: boolean;
}

export interface DFA {
  startState: string;
  states: DFAState[];
  acceptStates: string[];
  transitions: DFATransition[];
  alphabet: string[];
}

// Product / Difference Automaton Representation
export interface ProductState {
  id: string; // e.g. "(q0, p1)"
  state1: string; // DFA 1 state ID
  state2: string; // DFA 2 state ID
  label: string;
  isStart: boolean;
  isAccept: boolean; // state1 ∈ F1 && state2 ∉ F2
  isD1Accept: boolean;
  isD2Accept: boolean;
}

export interface ProductTransition {
  from: string;
  to: string;
  symbol: string;
}

export interface DifferenceAutomaton {
  startState: string;
  states: ProductState[];
  acceptStates: string[];
  transitions: ProductTransition[];
  alphabet: string[];
}

// BFS Exploration Step
export interface BFSStep {
  stepNumber: number;
  currentState: string;
  inputSymbol: string;
  nextState: string;
  stringSoFar: string;
  isAccepting: boolean;
}

// Witness Evaluation Result
export interface WitnessPathStep {
  fromState: string;
  symbol: string;
  toState: string;
  d1From: string;
  d1To: string;
  d2From: string;
  d2To: string;
}

export interface WitnessResult {
  hasDifference: boolean;
  witness: string | null; // string or null if empty language
  witnessDisplay: string; // "ac" or "ε (empty string)" or "None"
  path: WitnessPathStep[];
  bfsExplorationSteps: BFSStep[];
  visitedStateCount: number;
  searchDurationMs: number;
  explanation: string;
}

// Verification Trace
export interface DFAVerificationStep {
  fromState: string;
  symbol: string;
  toState: string;
}

export interface VerificationTrace {
  string: string;
  r1Result: {
    accepted: boolean;
    finalState: string;
    path: DFAVerificationStep[];
  };
  r2Result: {
    accepted: boolean;
    finalState: string;
    path: DFAVerificationStep[];
  };
  isWitnessValid: boolean;
}

// Comprehensive Pipeline Result
export interface EvaluationPipelineResult {
  regex1: string;
  regex2: string;
  nfa1: NFA;
  dfa1: DFA;
  nfa2: NFA;
  dfa2: DFA;
  differenceAutomaton: DifferenceAutomaton;
  witnessResult: WitnessResult;
  verification: VerificationTrace;
  stats: {
    nfa1StateCount: number;
    dfa1StateCount: number;
    nfa2StateCount: number;
    dfa2StateCount: number;
    diffStateCount: number;
    diffTransitionCount: number;
    totalExecutionTimeMs: number;
  };
}

export interface ParseError {
  message: string;
  position?: number;
  suggestion?: string;
}
