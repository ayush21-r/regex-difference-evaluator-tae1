// Professional Code-Editor Styled Regular Expression Input

import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface RegexEditorProps {
  id: string;
  label: string;
  subLabel: string;
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
  error?: string | null;
  suggestion?: string | null;
  badgeColor?: 'indigo' | 'emerald';
}

export const RegexEditor: React.FC<RegexEditorProps> = ({
  id,
  label,
  subLabel,
  value,
  onChange,
  onClear,
  placeholder = 'e.g. a(b|c)*',
  error,
  suggestion,
  badgeColor = 'indigo',
}) => {
  const insertToken = (token: string) => {
    onChange(value + token);
  };

  const isIndigo = badgeColor === 'indigo';

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0d1322] shadow-md transition-all focus-within:border-slate-700">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b border-slate-800/80 bg-[#090d16]/70 rounded-t-xl">
        <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isIndigo ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
            }`}
          />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            {label}
          </span>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            {subLabel}
          </span>
        </label>

        {/* Quick Operator Insert Tokens */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 mr-1 hidden md:inline">Insert:</span>
          {['ε', '|', '*', '+', '?', '()'].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => insertToken(op === '()' ? '()' : op)}
              className="px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-slate-100 border border-slate-700/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              title={`Insert ${op}`}
              aria-label={`Insert regex symbol ${op}`}
            >
              {op}
            </button>
          ))}
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="ml-1 p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              title="Clear input"
              aria-label="Clear regex input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Main Text Area */}
      <div className="relative p-3">
        <div className="flex items-center">
          <span className="font-mono text-xs text-slate-600 select-none mr-2 font-semibold">
            /
          </span>
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent font-mono text-base font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-none tracking-wide"
          />
          <span className="font-mono text-xs text-slate-600 select-none ml-2 font-semibold">
            /
          </span>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              {suggestion && (
                <p className="mt-1 text-[11px] text-rose-300/80 font-mono">
                  💡 {suggestion}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
