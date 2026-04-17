import type { Role } from '../types';

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  developer: 'Developer',
  devops: 'DevOps',
  guest: 'Gość',
};

export const ROLE_COLORS: Record<Role, string> = {
  admin: 'text-violet-500',
  developer: 'text-sky-500',
  devops: 'text-emerald-500',
  guest: 'text-amber-500',
};

export const ROLE_BADGE_COLORS: Record<Role, string> = {
  admin: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  developer: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  devops: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  guest: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};
