import React, { useState } from 'react';
import type { Task, Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import { ListTodo, X } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TextField, TextAreaField, SelectField } from './ui/FormField';

interface TaskFormProps {
  onClose: () => void;
  taskToEdit?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, taskToEdit }) => {
  const { storyId, addTask, updateTask } = useTasks();

  const [formData, setFormData] = useState({
    name: taskToEdit?.name || '',
    description: taskToEdit?.description || '',
    priority: (taskToEdit?.priority || 'medium') as Priority,
    estimatedTime: taskToEdit?.estimatedTime || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) return;
    if (taskToEdit) {
      updateTask(taskToEdit.id, formData);
    } else {
      addTask({ ...formData, storyId, status: 'todo' });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <ListTodo size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-text-main">
              {taskToEdit ? 'Edytuj zadanie' : 'Nowe zadanie'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Zdefiniuj zadanie i oszacuj czas</p>
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
          label="Nazwa zadania"
          placeholder="Co trzeba zrobić?"
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

          <TextField
            id="estimatedTime"
            label="Czas (h)"
            type="number"
            min={0.5}
            step={0.5}
            value={formData.estimatedTime}
            onChange={(e) => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) })}
            required
          />
        </div>

        <TextAreaField
          id="description"
          label="Opis"
          placeholder="Opisz szczegółowo zadanie..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Anuluj</Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? 'Zapisz zmiany' : 'Dodaj zadanie'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
