import React, { useState } from 'react';
import type { Story, Status } from '../types';
import { useStories } from '../context/StoryContext';
import { StoryForm } from './StoryForm';
import { Edit2, Trash2, Plus, Calendar, Clock, ListTodo } from 'lucide-react';

interface StoryListProps {
  onSelectStory: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ onSelectStory }) => {
  const { stories, deleteStory } = useStories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState<Story | undefined>(undefined);

  const handleEdit = (story: Story) => {
    setStoryToEdit(story);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setStoryToEdit(undefined);
  };

  const storiesByStatus = (status: Status) => stories.filter(s => s.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger bg-danger/10 border-danger/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const renderStoryCard = (story: Story) => (
    <div 
      key={story.id} 
      className="group bg-bg-sidebar border border-border p-5 rounded-2xl transition-all duration-300 hover:border-primary/50 hover:bg-white/5 hover:translate-x-1 shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(story.priority)}`}>
          {story.priority}
        </span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onSelectStory(story.id)}
            className="p-1.5 text-text-muted hover:text-primary transition-colors"
            title="Zobacz zadania"
          >
            <ListTodo size={14} />
          </button>
          <button
            onClick={() => handleEdit(story)}
            className="p-1.5 text-text-muted hover:text-primary transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => deleteStory(story.id)}
            className="p-1.5 text-text-muted hover:text-danger transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <h3
        className="text-lg font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors cursor-pointer"
        onClick={() => onSelectStory(story.id)}
      >
        {story.name}
      </h3>
      <p className="text-text-muted text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
        {story.description}
      </p>

      <div className="flex items-center justify-between text-[11px] text-text-muted font-bold pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-primary/60" />
          {new Date(story.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-primary/60" />
          {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-10 animate-fade-in pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-text-main tracking-tight">Tablica Historyjek</h2>
          <p className="text-text-muted mt-1 font-medium italic">Wszystkie zadania dla aktualnie wybranego projektu</p>
        </div>
        <button 
          className="flex items-center gap-3 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all" 
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={24} className="stroke-[3px]" />
          Dodaj Zadanie
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(['todo', 'doing', 'done'] as Status[]).map((status) => (
          <div key={status} className="flex flex-col gap-5 bg-bg-sidebar/20 p-6 rounded-[2.5rem] border border-border/40 backdrop-blur-xl">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'todo' ? 'bg-slate-500' : status === 'doing' ? 'bg-amber-500' : 'bg-success'
                } shadow-lg ring-4 ring-opacity-20 ${
                  status === 'todo' ? 'ring-slate-500' : status === 'doing' ? 'ring-amber-500' : 'ring-success'
                }`} />
                <span className="text-sm font-black text-text-main uppercase tracking-[0.2em]">
                  {status === 'todo' ? 'Czekające' : status === 'doing' ? 'W trakcie' : 'Gotowe'}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-border/40 rounded-lg text-[10px] font-black text-text-muted">
                {storiesByStatus(status).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[300px]">
              {storiesByStatus(status).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-3xl opacity-30 p-10 text-center grayscale">
                  <Clock size={48} className="mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Pusta Kolumna</p>
                </div>
              ) : (
                storiesByStatus(status).map(renderStoryCard)
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <StoryForm 
          onClose={handleCloseForm} 
          storyToEdit={storyToEdit} 
        />
      )}
    </div>
  );
};
