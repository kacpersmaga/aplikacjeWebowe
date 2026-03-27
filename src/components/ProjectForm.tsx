import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { FolderKanban, X } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TextField, TextAreaField } from './ui/FormField';

interface ProjectFormProps {
  editProject?: Project;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ editProject, onCancel }) => {
  const { addProject, updateProject } = useProjects();
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    setFormData(editProject
      ? { name: editProject.name, description: editProject.description }
      : { name: '', description: '' }
    );
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
    <Modal onClose={onCancel} maxWidth="max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FolderKanban size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-text-main">
              {editProject ? 'Edytuj projekt' : 'Nowy projekt'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {editProject ? 'Zaktualizuj dane projektu' : 'Wypełnij poniższe pola'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <TextField
          id="name"
          label="Nazwa projektu"
          placeholder="np. Aplikacja e-commerce"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoFocus
        />
        <TextAreaField
          id="description"
          label="Opis"
          placeholder="Krótki opis projektu i jego celów..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Anuluj</Button>
          <Button type="submit" variant="primary">
            {editProject ? 'Zapisz zmiany' : 'Utwórz projekt'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
