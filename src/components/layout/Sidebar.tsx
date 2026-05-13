import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Users, LogOut, FolderKanban } from 'lucide-react';

type View = 'projects' | 'stories' | 'tasks' | 'notifications' | 'users';

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface SidebarProps {
  view: View;
  navItems: NavItem[];
  isAdmin: boolean;
  onSetView: (v: View) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  navItems,
  isAdmin,
  onSetView,
  onLogout,
}) => {
  const { projects, activeProjectId } = useProjects();
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-bg-sidebar flex flex-col py-5 overflow-y-auto">
      <div className="px-3 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
          Nawigacja
        </p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onSetView(item.id)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${view === item.id
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : item.disabled
                ? 'text-text-muted/30 cursor-not-allowed'
                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-6 px-3 space-y-0.5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
            Administracja
          </p>
          <button
            onClick={() => onSetView('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${view === 'users'
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Users size={17} />
            Użytkownicy
          </button>
        </div>
      )}

      <div className="flex-1" />

      {activeProject && (
        <div className="mx-3 p-3 rounded-xl bg-primary/8 border border-primary/20 mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 mb-1">
            Aktywny projekt
          </p>
          <p className="text-xs font-semibold text-text-main truncate flex items-center gap-1.5">
            <FolderKanban size={11} className="text-primary shrink-0" />
            {activeProject.name}
          </p>
        </div>
      )}

      <div className="px-3 mt-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition-all"
        >
          <LogOut size={17} />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
};
