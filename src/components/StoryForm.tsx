import React, { useState } from 'react';
import type { Story, Priority, Status } from '../types';
import { useStories } from '../context/StoryContext';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import { LayoutList, X } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TextField, TextAreaField, SelectField } from './ui/FormField';

interface StoryFormProps {
  onClose: () => void;
  storyToEdit?: Story;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onClose, storyToEdit }) => {
  const { activeProjectId } = useProjects();
  const { addStory, updateStory } = useStories();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: storyToEdit?.name || '',
    description: storyToEdit?.description || '',
    priority: (storyToEdit?.priority || 'medium') as Priority,
    status: (storyToEdit?.status || 'todo') as Status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) return;
    if (storyToEdit) {
      updateStory(storyToEdit.id, formData);
    } else {
      addStory({ ...formData, projectId: activeProjectId, ownerId: currentUser?.id ?? '' });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <LayoutList size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-text-main">
              {storyToEdit ? 'Edytuj historyjkę' : 'Nowa historyjka'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Zdefiniuj funkcjonalność i jej priorytet</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <TextField
          id="name"
          label="Tytuł"
          placeholder="Co trzeba zbudować?"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="priority"
            label="Priorytet"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </SelectField>

          <SelectField
            id="status"
            label="Stan"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
          >
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zakończone</option>
          </SelectField>
        </div>

        <TextAreaField
          id="description"
          label="Opis"
          placeholder="Opisz cel tej historyjki..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Anuluj</Button>
          <Button type="submit" variant="primary">
            {storyToEdit ? 'Zapisz zmiany' : 'Dodaj historyjkę'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
