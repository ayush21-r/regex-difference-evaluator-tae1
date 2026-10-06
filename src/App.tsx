// Main Application Container with Tab Routing and State Management

import { useState } from 'react';
import { Navbar, type NavTab } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SyntaxCheatSheetModal } from './components/common/SyntaxCheatSheetModal';
import { HomePage } from './pages/HomePage';
import { EvaluatorPage } from './pages/EvaluatorPage';
import { AutomataPage } from './pages/AutomataPage';
import { TestCasesPage } from './pages/TestCasesPage';
import { TheoryPage } from './pages/TheoryPage';
import type { EvaluationPipelineResult } from './algorithms/types';
import { evaluateRegexDifference } from './algorithms/evaluator';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isSyntaxModalOpen, setIsSyntaxModalOpen] = useState(false);

  // Global regular expression state
  const [regex1, setRegex1] = useState('a(b|c)*');
  const [regex2, setRegex2] = useState('ab*');
  const [result, setResult] = useState<EvaluationPipelineResult | null>(() => {
    try {
      return evaluateRegexDifference('a(b|c)*', 'ab*');
    } catch {
      return null;
    }
  });

  const handleLoadAndRun = (r1: string, r2: string) => {
    setRegex1(r1);
    setRegex2(r2);
    try {
      const res = evaluateRegexDifference(r1, r2);
      setResult(res);
    } catch {
      setResult(null);
    }
  };

  const handleLoadExample1 = () => {
    handleLoadAndRun('a(b|c)*', 'ab*');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSyntaxModal={() => setIsSyntaxModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={setCurrentTab}
            onLoadPreset={(r1, r2) => handleLoadAndRun(r1, r2)}
          />
        )}

        {currentTab === 'evaluator' && (
          <EvaluatorPage
            regex1={regex1}
            regex2={regex2}
            setRegex1={setRegex1}
            setRegex2={setRegex2}
            result={result}
            setResult={setResult}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'automata' && (
          <AutomataPage
            result={result}
            onNavigate={setCurrentTab}
            onLoadExample1={handleLoadExample1}
          />
        )}

        {currentTab === 'testcases' && (
          <TestCasesPage
            onLoadAndRun={handleLoadAndRun}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'theory' && <TheoryPage />}
      </main>

      {/* Global Syntax Guide Modal */}
      <SyntaxCheatSheetModal
        isOpen={isSyntaxModalOpen}
        onClose={() => setIsSyntaxModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
