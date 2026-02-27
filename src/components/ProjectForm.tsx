import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Save } from 'lucide-react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';

interface ProjectFormProps {
  editProject?: Project | null;
  onCancel?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ editProject, onCancel }) => {
  const { addProject, updateProject } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
    }
  }, [editProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    if (editProject) {
      updateProject(editProject.id, { name, description });
      onCancel?.();
    } else {
      addProject({ name, description });
      setName('');
      setDescription('');
    }
  };

  return (
    <div className={`form-container ${editProject ? 'edit-mode' : ''}`}>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-header">
          {editProject ? <Pencil size={20} /> : <Plus size={20} />}
          <h2>{editProject ? 'Edit Project' : 'New Project'}</h2>
        </div>
        
        <div className="form-group">
          <label>Project Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Modern Web Dashboard"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="What's this project about?"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {editProject ? <Save size={18} /> : <Plus size={18} />}
            <span>{editProject ? 'Save Changes' : 'Create Project'}</span>
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="secondary-btn">
              <X size={18} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
