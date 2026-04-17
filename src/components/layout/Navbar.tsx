import React from 'react';
import type { User } from '../../types';
import { NotificationBell } from '../notifications/NotificationBell';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';
import { Search, Sun, Moon } from 'lucide-react';

type View = 'projects' | 'stories' | 'tasks' | 'notifications' | 'users';

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface NavbarProps {
  currentUser: User;
  view: View;
  navItems: NavItem[];
  isDark: boolean;
  onToggleDark: () => void;
  onSetView: (v: View) => void;
  onNotificationsClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  view,
  navItems,
  isDark,
  onToggleDark,
  onSetView,
  onNotificationsClick,
}) => (
  <header className="sticky top-0 z-50 h-14 flex items-center gap-6 px-6 bg-bg-sidebar/90 backdrop-blur-xl border-b border-border">
    {/* Logo */}
    <div className="flex items-center gap-2.5 shrink-0">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center font-display font-black text-base text-white shadow-md shadow-primary/30">
        M
      </div>
      <span className="font-display font-bold text-base text-text-main tracking-tight">
        Manage<span className="text-primary">Me</span>
      </span>
    </div>

    <div className="h-5 w-px bg-border shrink-0" />

    {/* Nav items */}
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => !item.disabled && onSetView(item.id)}
          disabled={item.disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${view === item.id
              ? 'bg-primary/10 text-primary'
              : item.disabled
              ? 'text-text-muted/30 cursor-not-allowed'
              : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
            }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>

    {/* Right side */}
    <div className="ml-auto flex items-center gap-2">
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-bg-dark border border-border rounded-xl text-sm text-text-muted hover:border-primary/40 transition-colors cursor-pointer group">
        <Search size={13} className="group-hover:text-primary transition-colors" />
        <span className="font-sans text-xs">Szukaj...</span>
        <kbd className="ml-4 px-1.5 py-0.5 bg-border/60 rounded text-[10px] font-mono opacity-60">⌘K</kbd>
      </div>

      <button
        onClick={onToggleDark}
        title={isDark ? 'Tryb jasny' : 'Tryb ciemny'}
        className="p-2 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <NotificationBell onClick={onNotificationsClick} />

      <div className="flex items-center gap-2.5 pl-2 border-l border-border">
        <div className="hidden lg:block text-right">
          <p className="text-xs font-semibold text-text-main leading-none">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className={`text-[10px] font-mono mt-0.5 ${ROLE_COLORS[currentUser.role] ?? 'text-primary'}`}>
            {ROLE_LABELS[currentUser.role]}
          </p>
        </div>
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="avatar"
            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-lg flex items-center justify-center font-bold text-xs text-text-main shrink-0">
            {currentUser.firstName[0]}{currentUser.lastName[0]}
          </div>
        )}
      </div>
    </div>
  </header>
);
