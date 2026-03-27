import React, { useState } from 'react';
import { ProjectItem } from './ProjectItem';
import { ProjectForm } from './ProjectForm';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types';
import { Search, FolderKanban, Plus } from 'lucide-react';
import { Button } from './ui/Button';

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
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-main tracking-tight">Twoje Projekty</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {projects.length} {projects.length === 1 ? 'projekt' : 'projektów'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72 group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Szukaj projektów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-sidebar border border-border rounded-xl text-sm text-text-main
                placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                transition-all"
            />
          </div>
          <Button
            variant="primary"
            icon={<Plus size={15} />}
            onClick={() => setIsFormOpen(true)}
          >
            Nowy projekt
          </Button>
        </div>
      </div>

      {/* Grid or empty state */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="p-6 bg-bg-sidebar border border-border rounded-2xl text-text-muted opacity-40">
            <FolderKanban size={48} />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <p className="font-display text-lg font-bold text-text-main">
              {searchQuery ? 'Brak wyników' : 'Brak projektów'}
            </p>
            <p className="text-sm text-text-muted">
              {searchQuery
                ? `Nie znaleziono projektów dla „${searchQuery}"`
                : 'Stwórz swój pierwszy projekt, aby zacząć.'}
            </p>
          </div>
          {!searchQuery && (
            <Button variant="primary" icon={<Plus size={14} />} onClick={() => setIsFormOpen(true)}>
              Utwórz projekt
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
          {filteredProjects.map((project) => (
            <ProjectItem key={project.id} project={project} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {isFormOpen && (
        <ProjectForm editProject={editingProject || undefined} onCancel={handleCloseForm} />
      )}
    </div>
  );
};
