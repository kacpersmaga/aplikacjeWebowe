import React from 'react';
import type { Status } from '../types';

const COLUMN_CONFIG: Record<Status, {
  label: string;
  topBorder: string;
  dot: string;
  countStyle: string;
}> = {
  todo: {
    label: 'Do zrobienia',
    topBorder: 'border-t-zinc-400 dark:border-t-zinc-600',
    dot: 'bg-zinc-400 dark:bg-zinc-600',
    countStyle: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  doing: {
    label: 'W trakcie',
    topBorder: 'border-t-amber-400',
    dot: 'bg-amber-400',
    countStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  done: {
    label: 'Gotowe',
    topBorder: 'border-t-emerald-500',
    dot: 'bg-emerald-500',
    countStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
};

interface KanbanColumnProps {
  status: Status;
  count: number;
  children: React.ReactNode;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  count,
  children,
  emptyIcon,
  emptyText = 'Pusta kolumna',
}) => {
  const cfg = COLUMN_CONFIG[status];

  return (
    <div className={`flex flex-col border border-border border-t-2 ${cfg.topBorder} rounded-xl bg-bg-dark/30 dark:bg-bg-sidebar/20 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-sidebar/40">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-xs font-semibold text-text-main uppercase tracking-widest">{cfg.label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${cfg.countStyle}`}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[160px] gap-3 opacity-25 select-none">
            {emptyIcon && <div className="text-text-muted">{emptyIcon}</div>}
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{emptyText}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
