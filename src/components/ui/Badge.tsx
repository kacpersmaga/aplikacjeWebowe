import React from 'react';
import type { Priority, Status } from '../../types';

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  high: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Niski',
  medium: 'Średni',
  high: 'Wysoki',
};

const STATUS_STYLES: Record<Status, string> = {
  todo: 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-700/50 dark:text-zinc-400 dark:ring-zinc-600',
  doing: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  done: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
};

const STATUS_LABELS: Record<Status, string> = {
  todo: 'Do zrobienia',
  doing: 'W trakcie',
  done: 'Zakończone',
};

const base = 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider';

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span className={`${base} ${PRIORITY_STYLES[priority]}`}>{PRIORITY_LABELS[priority]}</span>
);

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => (
  <span className={`${base} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
);
