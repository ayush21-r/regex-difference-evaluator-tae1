// Minimalist Professional Technical Footer

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070b14] py-8 mt-16 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Regex Difference Evaluator</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Theory of Computation & Automata</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-indigo-400">TAE1 Project Based Learning</span>
        </div>

        {/* Right meta */}
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span>Frontend-Only In-Browser Engine</span>
          <span>·</span>
          <span>Zero Server Dependencies</span>
          <span>·</span>
          <span>Deployable to Netlify</span>
        </div>
      </div>
    </footer>
  );
};
