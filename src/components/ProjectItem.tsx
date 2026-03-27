import React from 'react';
import { Trash2, Pencil, Calendar, CheckCircle2, ArrowRight, Circle } from 'lucide-react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { Button } from './ui/Button';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, onEdit }) => {
  const { deleteProject, activeProjectId, setActiveProjectId } = useProjects();
  const isActive = activeProjectId === project.id;

  return (
    <div
      className={`group relative flex flex-col gap-5 p-6 rounded-2xl border transition-all duration-200 animate-fade-in overflow-hidden
        ${isActive
          ? 'bg-bg-sidebar border-primary/40 shadow-lg shadow-primary/5'
          : 'bg-bg-sidebar border-border hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md hover:-translate-y-0.5'
        }`}
    >
      {/* Active glow */}
      {isActive && (
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider
          ${isActive
            ? 'bg-primary/15 text-primary'
            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {isActive
            ? <CheckCircle2 size={11} className="shrink-0" />
            : <Circle size={11} className="shrink-0 opacity-60" />
          }
          {isActive ? 'Aktywny projekt' : 'Dostępny'}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
          <Calendar size={11} className="opacity-60" />
          {new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className={`font-display text-xl font-bold leading-tight mb-2 transition-colors
          ${isActive ? 'text-text-main' : 'text-text-main group-hover:text-primary'}`}>
          {project.name}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border relative z-10">
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil size={13} />}
            onClick={() => onEdit(project)}
            title="Edytuj"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => deleteProject(project.id)}
            title="Usuń"
            className="hover:text-danger hover:bg-danger/10"
          />
        </div>

        <Button
          variant={isActive ? 'danger' : 'primary'}
          size="sm"
          icon={<ArrowRight size={13} className={isActive ? 'rotate-180' : ''} />}
          onClick={() => setActiveProjectId(isActive ? null : project.id)}
        >
          {isActive ? 'Odznacz' : 'Wybierz'}
        </Button>
      </div>
    </div>
  );
};
