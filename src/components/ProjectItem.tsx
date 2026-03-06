import React from 'react';
import { Trash2, Edit2, Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, onEdit }) => {
  const { deleteProject, activeProjectId, setActiveProjectId } = useProjects();
  const isActive = activeProjectId === project.id;

  return (
    <div 
      className={`group relative flex flex-col gap-6 p-7 bg-bg-sidebar border rounded-3xl transition-all duration-300 shadow-2xl overflow-hidden animate-fade-in
      ${isActive 
        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-primary/10' 
        : 'border-border hover:border-primary/50 hover:bg-white/5 hover:-translate-y-2'}`}
    >
      <div className="flex justify-between items-center relative z-10">
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors
          ${isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
            : 'bg-border text-text-muted group-hover:bg-slate-700'}`}
        >
          {isActive ? (
            <CheckCircle size={10} className="stroke-[4px]" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
          )}
          {isActive ? 'Aktualny Projekt' : 'Dostępny'}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
          <Calendar size={14} className="text-primary/60" />
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 relative z-10">
        <h3 className="text-2xl font-black text-text-main leading-none group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-text-muted leading-relaxed font-medium line-clamp-3">
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border mt-auto relative z-10">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(project)} 
            className="p-3 bg-bg-dark border border-border rounded-xl text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all shadow-sm"
            title="Edytuj Projekt"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => deleteProject(project.id)} 
            className="p-3 bg-bg-dark border border-border rounded-xl text-text-muted hover:text-danger hover:border-danger/50 hover:bg-danger/10 transition-all shadow-sm"
            title="Usuń Projekt"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <button 
          onClick={() => setActiveProjectId(isActive ? null : project.id)} 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg
          ${isActive 
            ? 'bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white hover:border-danger' 
            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:scale-105 active:scale-95'}`}
        >
          <span>{isActive ? 'Odznacz' : 'Wybierz'}</span>
          <ChevronRight size={18} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>

      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/20 blur-3xl rounded-full" />
      )}
    </div>
  );
};
