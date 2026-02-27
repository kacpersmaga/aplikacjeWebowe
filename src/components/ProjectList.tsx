import React, { useState } from 'react';
import { ProjectItem } from './ProjectItem';
import { ProjectForm } from './ProjectForm';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types';
import { Search, FolderKanban } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const { projects } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <ProjectForm 
          editProject={editingProject} 
          onCancel={() => setEditingProject(null)} 
        />
      </aside>

      <main className="content">
        <header className="content-header">
          <div className="title-section">
            <FolderKanban size={32} className="text-primary" />
            <div>
              <h1>Projects Overview</h1>
              <p>Manage and track your active projects</p>
            </div>
          </div>

          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={64} opacity={0.2} />
            <p>{searchQuery ? 'No matches found' : 'No projects yet. Start by creating one!'}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectItem 
                key={project.id} 
                project={project} 
                onEdit={setEditingProject} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
