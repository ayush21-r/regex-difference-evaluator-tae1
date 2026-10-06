// Thompson's Construction: AST -> NFA with ε-transitions

import type { ASTNode, NFA, NFATransition } from './types';

class ThompsonBuilder {
  private stateCounter = 0;
  private transitions: NFATransition[] = [];
  private alphabetSet = new Set<string>();

  private createState(): number {
    return this.stateCounter++;
  }

  public build(ast: ASTNode): NFA {
    this.stateCounter = 0;
    this.transitions = [];
    this.alphabetSet.clear();

    const { startState, acceptState } = this.construct(ast);

    // Collect all states
    const states: number[] = [];
    for (let i = 0; i < this.stateCounter; i++) {
      states.push(i);
    }

    return {
      startState,
      acceptState,
      states,
      transitions: this.transitions,
      alphabet: Array.from(this.alphabetSet).sort(),
    };
  }

  private construct(node: ASTNode): { startState: number; acceptState: number } {
    switch (node.type) {
      case 'literal': {
        const start = this.createState();
        const accept = this.createState();
        this.alphabetSet.add(node.char);
        this.transitions.push({
          from: start,
          to: accept,
          symbol: node.char,
        });
        return { startState: start, acceptState: accept };
      }

      case 'epsilon': {
        const start = this.createState();
        const accept = this.createState();
        this.transitions.push({
          from: start,
          to: accept,
          symbol: null,
        });
        return { startState: start, acceptState: accept };
      }

      case 'concat': {
        const left = this.construct(node.left);
        const right = this.construct(node.right);

        // Connect left's accept state to right's start state via epsilon
        this.transitions.push({
          from: left.acceptState,
          to: right.startState,
          symbol: null,
        });

        return {
          startState: left.startState,
          acceptState: right.acceptState,
        };
      }

      case 'union': {
        const left = this.construct(node.left);
        const right = this.construct(node.right);
        const start = this.createState();
        const accept = this.createState();

        // ε from start to both branches
        this.transitions.push({
          from: start,
          to: left.startState,
          symbol: null,
        });
        this.transitions.push({
          from: start,
          to: right.startState,
          symbol: null,
        });

        // ε from both branches to accept
        this.transitions.push({
          from: left.acceptState,
          to: accept,
          symbol: null,
        });
        this.transitions.push({
          from: right.acceptState,
          to: accept,
          symbol: null,
        });

        return { startState: start, acceptState: accept };
      }

      case 'star': {
        const inner = this.construct(node.expr);
        const start = this.createState();
        const accept = this.createState();

        // ε from start to inner start, and start to accept (zero repetitions)
        this.transitions.push({
          from: start,
          to: inner.startState,
          symbol: null,
        });
        this.transitions.push({
          from: start,
          to: accept,
          symbol: null,
        });

        // ε from inner accept back to inner start (repeat), and to accept (exit)
        this.transitions.push({
          from: inner.acceptState,
          to: inner.startState,
          symbol: null,
        });
        this.transitions.push({
          from: inner.acceptState,
          to: accept,
          symbol: null,
        });

        return { startState: start, acceptState: accept };
      }

      case 'plus': {
        const inner = this.construct(node.expr);
        const start = this.createState();
        const accept = this.createState();

        // Must enter inner at least once
        this.transitions.push({
          from: start,
          to: inner.startState,
          symbol: null,
        });

        // Loop back or exit
        this.transitions.push({
          from: inner.acceptState,
          to: inner.startState,
          symbol: null,
        });
        this.transitions.push({
          from: inner.acceptState,
          to: accept,
          symbol: null,
        });

        return { startState: start, acceptState: accept };
      }

      case 'question': {
        const inner = this.construct(node.expr);
        const start = this.createState();
        const accept = this.createState();

        // Either enter inner or bypass to accept (0 or 1 time)
        this.transitions.push({
          from: start,
          to: inner.startState,
          symbol: null,
        });
        this.transitions.push({
          from: start,
          to: accept,
          symbol: null,
        });
        this.transitions.push({
          from: inner.acceptState,
          to: accept,
          symbol: null,
        });

        return { startState: start, acceptState: accept };
      }
    }
  }
}

export function buildNFA(ast: ASTNode): NFA {
  const builder = new ThompsonBuilder();
  return builder.build(ast);
}
