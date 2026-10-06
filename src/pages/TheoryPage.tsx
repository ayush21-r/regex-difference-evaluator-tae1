// Theory & Documentation Page: Formal Mathematical Automata Foundations

import React from 'react';
import { BookOpen } from 'lucide-react';

export const TheoryPage: React.FC = () => {
  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto animate-in fade-in duration-300 font-sans text-slate-300">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ACADEMIC FOUNDATIONS & ALGORITHM SPECIFICATIONS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Theory of Computation & Automata
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Formal regular language decision algorithms, automata constructions, and language difference proofs
        </p>
      </div>

      {/* Section 1: Problem Formulation */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs">
            1
          </span>
          <span>The Regular Language Difference Problem</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3 text-xs font-mono leading-relaxed">
          <p>
            Given two regular expressions <code className="text-indigo-300">R₁</code> and <code className="text-emerald-300">R₂</code> with corresponding regular languages <code className="text-indigo-300">L(R₁)</code> and <code className="text-emerald-300">L(R₂)</code> over an alphabet <code className="text-amber-300">Σ</code>, the objective is to find a witness string <code className="text-sky-300">w</code> such that:
          </p>
          <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center text-xs sm:text-sm font-bold text-sky-400 overflow-x-auto">
            w ∈ L(R₁) − L(R₂) ⟺ w ∈ L(R₁) ∧ w ∉ L(R₂)
          </div>
          <p className="text-slate-400">
            If <code className="text-slate-200">L(R₁) − L(R₂) = ∅</code>, then no such witness exists, establishing that <code className="text-slate-200">L(R₁) ⊆ L(R₂)</code>.
          </p>
        </div>
      </section>

      {/* Section 2: Closure Properties */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs shrink-0">
            2
          </span>
          <span>Closure Properties & Set Theoretic Reduction</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-400">
          <p>
            Regular languages are closed under union, concatenation, Kleene star, complementation, and intersection:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
            <li><strong>Complementation:</strong> If L is regular, then ¬L = Σ* − L is regular.</li>
            <li><strong>Intersection:</strong> If L₁ and L₂ are regular, then L₁ ∩ L₂ is regular.</li>
            <li><strong>Relative Complement (Difference):</strong> L₁ − L₂ = L₁ ∩ ¬L₂ is therefore regular.</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Thompson's Construction */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs shrink-0">
            3
          </span>
          <span>Thompson&apos;s Construction (Regex → NFA)</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-400">
          <p>
            Thompson&apos;s construction inductively translates a regular expression syntax tree into an equivalent Non-deterministic Finite Automaton with ε-transitions (ε-NFA):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 overflow-x-auto">
              <strong className="text-indigo-300">Base Symbol (a):</strong>
              <div className="text-slate-400 mt-1 whitespace-nowrap">s₀ ──a──&gt; s₁ (2 states, 1 transition)</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 overflow-x-auto">
              <strong className="text-indigo-300">Concatenation (AB):</strong>
              <div className="text-slate-400 mt-1 whitespace-nowrap">Accept(A) ──ε──&gt; Start(B)</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 overflow-x-auto">
              <strong className="text-indigo-300">Alternation (A|B):</strong>
              <div className="text-slate-400 mt-1">s_in ──ε──&gt; Start(A), Start(B); Accept(A), Accept(B) ──ε──&gt; s_out</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 overflow-x-auto">
              <strong className="text-indigo-300">Kleene Star (A*):</strong>
              <div className="text-slate-400 mt-1">s_in ──ε──&gt; Start(A), s_out; Accept(A) ──ε──&gt; Start(A), s_out</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Subset Construction */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs">
            4
          </span>
          <span>Subset Construction & Total Transition Function</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-400">
          <p>
            An NFA is converted into a Deterministic Finite Automaton (DFA) where each DFA state corresponds to a subset of NFA states:
          </p>
          <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-[11px] space-y-1">
            <div>1. Start state: S₀ = ε-closure(&#123;start&#125;)</div>
            <div>2. For each symbol a ∈ Σ: δ_DFA(Q, a) = ε-closure(move(Q, a))</div>
            <div>3. Accepting states: F_DFA = &#123; Q | Q ∩ F_NFA ≠ ∅ &#125;</div>
            <div>4. <strong>Totalization:</strong> Missing transitions map to an explicit non-accepting dead state q_dead.</div>
          </div>
        </div>
      </section>

      {/* Section 5: Product Difference Automaton & BFS */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs">
            5
          </span>
          <span>Difference Product Automaton & BFS Shortest Path</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-400">
          <p>
            Given total DFAs D₁ = (Q₁, Σ, δ₁, q₀₁, F₁) and D₂ = (Q₂, Σ, δ₂, q₀₂, F₂):
          </p>
          <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-[11px] space-y-1">
            <div>• States: Q_diff ⊆ Q₁ × Q₂</div>
            <div>• Start state: (q₀₁, q₀₂)</div>
            <div>• Transitions: δ_diff((p, q), a) = (δ₁(p, a), δ₂(q, a))</div>
            <div>• Accepting states: F_diff = &#123; (p, q) | p ∈ F₁ ∧ q ∉ F₂ &#125;</div>
          </div>
          <p>
            Running Breadth-First Search (BFS) starting from (q₀₁, q₀₂) searches the state graph level-by-level (by string length), guaranteeing that the first accepting state encountered yields the <strong>minimal length witness string</strong>.
          </p>
        </div>
      </section>

      {/* Section 6: TAE1 Academic Context */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-mono text-xs">
            6
          </span>
          <span>TAE1 Project Based Learning Context</span>
        </h2>
        <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 space-y-2 text-xs font-mono text-slate-400">
          <div className="text-slate-200 font-bold">Course: Theory of Automata / Regular Languages</div>
          <div>Project Name: Regex Difference Evaluator</div>
          <div>Repository: regex-difference-evaluator</div>
          <div>Architecture: Pure client-side browser execution (Vite + React + TypeScript + Tailwind CSS)</div>
        </div>
      </section>
    </div>
  );
};
