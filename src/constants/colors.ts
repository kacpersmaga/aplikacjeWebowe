import type { Priority } from '../types';

export const PRIORITY_ACCENT: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-zinc-300 dark:bg-zinc-600',
};
