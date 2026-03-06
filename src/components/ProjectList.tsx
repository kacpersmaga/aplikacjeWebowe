import React, { useState } from 'react';
import { ProjectItem } from './ProjectItem';
import { ProjectForm } from './ProjectForm';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types';
import { Search, FolderKanban, PlusCircle } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const { projects } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 animate-fade-in">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20">
            <FolderKanban size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-main">
              Twoje Projekty
            </h1>
            <p className="text-text-muted mt-1 font-medium">
              Zarządzaj swoją wizją i śledź każdy krok w jednym miejscu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Szukaj projektów..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-bg-sidebar border border-border rounded-2xl text-text-main placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner shadow-black/10"
            />
          </div>
          <button 
            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all whitespace-nowrap" 
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircle size={22} className="shrink-0" />
            <span>Dodaj Projekt</span>
          </button>
        </div>
      </header>

      {filteredProjects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-32 bg-bg-sidebar/30 border border-dashed border-border rounded-[32px] gap-6 text-center">
          <div className="p-8 bg-bg-sidebar rounded-full shadow-2xl">
            <FolderKanban size={80} className="text-border" />
          </div>
          <div className="space-y-2 max-w-sm">
            <p className="text-2xl font-bold text-text-main">
              {searchQuery ? 'Brak dopasowań' : 'Twój pulpit jest pusty'}
            </p>
            <p className="text-text-muted font-medium">
              {searchQuery 
                ? `Nie znaleźliśmy projektów pasujących do "${searchQuery}". Spróbuj inaczej!` 
                : 'Czas nadać Twoim pomysłom realne ramy. Stwórz swój pierwszy projekt już dziś.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
          {filteredProjects.map((project) => (
            <ProjectItem 
              key={project.id} 
              project={project} 
              onEdit={handleEdit} 
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
          <ProjectForm 
            editProject={editingProject || undefined} 
            onCancel={handleCloseForm} 
          />
        </div>
      )}
    </div>
  );
};
