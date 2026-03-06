import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { PlusCircle, Save, X, Layout } from 'lucide-react';

interface ProjectFormProps {
  editProject?: Project;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ editProject, onCancel }) => {
  const { addProject, updateProject } = useProjects();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (editProject) {
      setFormData({
        name: editProject.name,
        description: editProject.description,
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      updateProject(editProject.id, formData);
    } else {
      addProject(formData);
    }
    onCancel();
  };

  return (
    <div className="w-full max-w-md bg-bg-sidebar p-8 rounded-2xl border border-border shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {editProject ? <Save size={24} /> : <Layout size={24} />}
        </div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight">
          {editProject ? 'Edytuj Projekt' : 'Nowy Projekt'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-text-muted px-1 block uppercase tracking-wider">
            Nazwa Projektu
          </label>
          <input
            id="name"
            type="text"
            placeholder="Wprowadź nazwę projektu..."
            className="w-full px-4 py-3 bg-bg-dark border border-border rounded-xl text-text-main placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-text-muted px-1 block uppercase tracking-wider">
            Opis
          </label>
          <textarea
            id="description"
            placeholder="Wprowadź szczegółowy opis projektu..."
            className="w-full px-4 py-3 bg-bg-dark border border-border rounded-xl text-text-main placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={5}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-8">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-muted font-semibold hover:bg-slate-800 hover:text-text-main transition-all duration-200"
          >
            <X size={18} />
            Anuluj
          </button>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition-all duration-200"
          >
            {editProject ? <Save size={18} /> : <PlusCircle size={18} />}
            {editProject ? 'Zapisz zmiany' : 'Stwórz projekt'}
          </button>
        </div>
      </form>
    </div>
  );
};
