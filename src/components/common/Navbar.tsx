import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Network,
  CheckSquare,
  BookOpen,
  HelpCircle,
  Home as HomeIcon,
  Menu,
  X,
  Download,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';

export type NavTab = 'home' | 'evaluator' | 'automata' | 'testcases' | 'theory';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSyntaxModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSyntaxModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isInstallable,
    promptInstall,
    isIOSModalOpen,
    setIsIOSModalOpen,
  } = usePWAInstall();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Descriptor (Left) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0 shrink"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
          aria-label="Regex Difference Evaluator - Go to Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/40 flex items-center justify-center group-hover:border-indigo-400/80 transition-all shadow-sm shrink-0">
            <span className="font-mono text-[11px] sm:text-xs font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              RDE
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold tracking-tight text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                Regex Difference Evaluator
              </span>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/50 shrink-0">
                TAE1 Automata
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden lg:inline whitespace-nowrap">
              L(R₁) − L(R₂) Regular Language Analyzer
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 text-xs font-mono shrink-0"
        >
          <button
            onClick={() => onSelectTab('home')}
            aria-current={currentTab === 'home' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              currentTab === 'home'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectTab('evaluator')}
            aria-current={currentTab === 'evaluator' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              currentTab === 'evaluator'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Evaluator</span>
          </button>

          <button
            onClick={() => onSelectTab('automata')}
            aria-current={currentTab === 'automata' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              currentTab === 'automata'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Automata Visualizer</span>
            <span className="xl:hidden">Automata</span>
          </button>

          <button
            onClick={() => onSelectTab('testcases')}
            aria-current={currentTab === 'testcases' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              currentTab === 'testcases'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Test Cases</span>
          </button>

          <button
            onClick={() => onSelectTab('theory')}
            aria-current={currentTab === 'theory' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              currentTab === 'theory'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory</span>
          </button>
        </nav>

        {/* Right Action (Desktop: Install App + Syntax Modal | Mobile: Install + Syntax + Menu Hamburger) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Subtle Install App Button (Visible only when installable) */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-300 hover:text-indigo-100 border border-indigo-700/60 text-xs font-mono transition-all shrink-0 shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              title="Install Regex Difference Evaluator as an app"
              aria-label="Install App"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}

          <button
            onClick={onOpenSyntaxModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 text-xs font-mono transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            title="View Regex Syntax Guide"
            aria-label="Open Regex Syntax Helper"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Syntax Helper</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-slate-800/80 bg-[#0b0f19] px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'home'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#090d16] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home Page</span>
            </button>

            <button
              onClick={() => handleNavClick('evaluator')}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'evaluator'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#090d16] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Evaluator Workspace</span>
            </button>

            <button
              onClick={() => handleNavClick('automata')}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'automata'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#090d16] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Automata Visualizer (NFA/DFA/Diff)</span>
            </button>

            <button
              onClick={() => handleNavClick('testcases')}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'testcases'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#090d16] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Test Cases & Diagnostics</span>
            </button>

            <button
              onClick={() => handleNavClick('theory')}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition-all ${
                currentTab === 'theory'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#090d16] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Theory & Documentation</span>
            </button>

            {/* Mobile Drawer Install App Button */}
            {isInstallable && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  promptInstall();
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-950/80 to-sky-950/80 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900/60 transition-all font-semibold mt-1"
                aria-label="Install Regex Difference Evaluator Application"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Install Application</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSyntaxModal();
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 hover:bg-indigo-900/50 transition-all mt-2"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Syntax Reference Helper</span>
            </button>
          </div>
        </nav>
      )}

      {/* iOS Safari Installation Guide Modal */}
      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
      />
    </header>
  );
};
