import React from 'react';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';

interface ProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, onEdit }) => {
  const { deleteProject } = useProjects();

  return (
    <div className="project-card animate-fade-in">
      <div className="project-card-header">
        <div className="project-badge">Active</div>
        <div className="project-date">
          <Calendar size={14} />
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="project-content">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>

      <div className="project-actions">
        <button 
          onClick={() => onEdit(project)} 
          className="icon-btn edit-btn"
          title="Edit Project"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => deleteProject(project.id)} 
          className="icon-btn delete-btn"
          title="Delete Project"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
