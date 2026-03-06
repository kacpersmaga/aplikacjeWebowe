import React, { useState } from 'react';
import type { Story, Priority, Status } from '../types';
import { useStories } from '../hooks/useStories';
import { useProjects } from '../hooks/useProjects';
import { userService } from '../services/userService';
import { X, CheckCircle, PlusCircle, Save } from 'lucide-react';

interface StoryFormProps {
  onClose: () => void;
  storyToEdit?: Story;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onClose, storyToEdit }) => {
  const { activeProjectId } = useProjects();
  const { addStory, updateStory } = useStories();
  const user = userService.getCurrentUser();

  const [formData, setFormData] = useState({
    name: storyToEdit?.name || '',
    description: storyToEdit?.description || '',
    priority: storyToEdit?.priority || 'medium' as Priority,
    status: storyToEdit?.status || 'todo' as Status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId) return;

    if (storyToEdit) {
      updateStory(storyToEdit.id, formData);
    } else {
      addStory({
        ...formData,
        projectId: activeProjectId,
        ownerId: user.id,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-bg-sidebar p-8 rounded-[2rem] border border-border shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-text-muted hover:text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20">
            {storyToEdit ? <Save size={28} /> : <PlusCircle size={28} />}
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-main tracking-tight">
              {storyToEdit ? 'Edytuj Historyjkę' : 'Nowa Historyjka'}
            </h2>
            <p className="text-text-muted font-medium">Zdefiniuj funkcjonalność i określ jej priorytet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-text-muted px-1 block uppercase tracking-widest">
                  Tytuł Zadania
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Co trzeba zrobić?"
                  className="w-full px-4 py-3.5 bg-bg-dark border border-border rounded-xl text-text-main placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-bold text-text-muted px-1 block uppercase tracking-widest">
                    Priorytet
                  </label>
                  <select
                    id="priority"
                    className="w-full px-4 py-3.5 bg-bg-dark border border-border rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-bold text-text-muted px-1 block uppercase tracking-widest">
                    Stan
                  </label>
                  <select
                    id="status"
                    className="w-full px-4 py-3.5 bg-bg-dark border border-border rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                  >
                    <option value="todo">Do zrobienia</option>
                    <option value="doing">W trakcie</option>
                    <option value="done">Zakończone</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold text-text-muted px-1 block uppercase tracking-widest">
                Opis Szczegółowy
              </label>
              <textarea
                id="description"
                placeholder="Napisz coś więcej o tym zadaniu..."
                className="w-full h-full px-4 py-4 bg-bg-dark border border-border rounded-xl text-text-main placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border mt-10">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl border border-border text-text-muted font-bold hover:bg-slate-800 hover:text-white transition-all shadow-lg"
            >
              Anuluj
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-3 px-10 py-3 bg-primary hover:bg-primary-hover text-white font-black rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              <CheckCircle size={20} className="stroke-[3px]" />
              <span>{storyToEdit ? 'Zapisz Zmiany' : 'Dodaj do Tablicy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
