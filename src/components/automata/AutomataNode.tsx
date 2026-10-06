// Custom Automata Node for React Flow

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export interface AutomataNodeData {
  id: string;
  label: string;
  subLabel?: string;
  isStart?: boolean;
  isAccept?: boolean;
  isD1Accept?: boolean;
  isD2Accept?: boolean;
  isSink?: boolean;
  isPath?: boolean;
  kind: 'nfa' | 'dfa' | 'diff';
  graphTitle?: string;
}

export const AutomataNode = memo(({ data }: { data: AutomataNodeData }) => {
  const isStart = !!data.isStart;
  const isAccept = !!data.isAccept;
  const isPath = !!data.isPath;
  const isSink = !!data.isSink;

  // Determine styling based on node semantics
  let bgClass = 'bg-[#0f172a]';
  let borderClass = 'border-[#334155]';
  let textClass = 'text-slate-200';

  if (isPath) {
    borderClass = 'border-sky-400 ring-2 ring-sky-500/30';
    bgClass = 'bg-[#032035]';
    textClass = 'text-sky-200';
  } else if (isAccept) {
    borderClass = 'border-emerald-500';
    bgClass = 'bg-[#06241a]';
    textClass = 'text-emerald-200';
  } else if (isSink) {
    borderClass = 'border-slate-800 border-dashed';
    bgClass = 'bg-[#090d16]';
    textClass = 'text-slate-500';
  } else if (isStart) {
    borderClass = 'border-indigo-500';
    bgClass = 'bg-[#111827]';
  }

  return (
    <div className="relative group">
      {/* Start State Indicator Arrow */}
      {isStart && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center text-indigo-400">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider -rotate-90 origin-center mr-0.5">
            IN
          </span>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
      )}

      {/* Target Handle (Left & Top) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-500 !w-2 !h-2 !border-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-500 !w-2 !h-2 !border-none opacity-0"
      />

      {/* Outer Accept Ring (Formal Automata Notation for F) */}
      <div
        className={`relative flex flex-col items-center justify-center min-w-[120px] px-3 py-2 rounded-xl border-2 transition-all duration-200 shadow-md ${borderClass} ${bgClass} ${
          isAccept ? 'p-[3px] ring-2 ring-emerald-500/20' : ''
        }`}
      >
        {isAccept && (
          <div className="absolute inset-1 rounded-lg border border-emerald-500/40 pointer-events-none" />
        )}

        {/* State Label */}
        <div className="flex items-center gap-1.5">
          <span className={`font-mono text-sm font-bold tracking-tight ${textClass}`}>
            {data.label}
          </span>

          {isPath && (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              WITNESS
            </span>
          )}
        </div>

        {/* Sub-label / Set contents */}
        {data.subLabel && (
          <div className="mt-1 text-[10px] font-mono text-slate-400 max-w-[110px] truncate text-center">
            {data.subLabel}
          </div>
        )}

        {/* Diff breakdown badges */}
        {data.kind === 'diff' && (
          <div className="flex items-center gap-1 mt-1.5 text-[9px] font-mono">
            <span
              className={`px-1 py-0.5 rounded ${
                data.isD1Accept
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              R1:{data.isD1Accept ? '✓' : '✗'}
            </span>
            <span
              className={`px-1 py-0.5 rounded ${
                !data.isD2Accept
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
              }`}
            >
              R2:{data.isD2Accept ? '✓' : '✗'}
            </span>
          </div>
        )}
      </div>

      {/* Source Handle (Right & Bottom) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-500 !w-2 !h-2 !border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-500 !w-2 !h-2 !border-none opacity-0"
      />
    </div>
  );
});

AutomataNode.displayName = 'AutomataNode';
