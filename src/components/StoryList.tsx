import React, { useState } from 'react';
import type { Story, Status } from '../types';
import { useStories } from '../context/StoryContext';
import { StoryForm } from './StoryForm';
import { KanbanColumn } from './KanbanColumn';
import { PriorityBadge } from './ui/Badge';
import { Button } from './ui/Button';
import { Edit2, Trash2, ListTodo, Calendar, LayoutList, Plus } from 'lucide-react';

const PRIORITY_ACCENT: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-zinc-300 dark:bg-zinc-600',
};

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

  const renderStoryCard = (story: Story) => (
    <div
      key={story.id}
      className="group relative bg-bg-sidebar border border-border rounded-xl overflow-hidden
        transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md"
    >
      {/* Priority accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${PRIORITY_ACCENT[story.priority]}`} />

      <div className="pl-4 pr-3 py-3.5">
        {/* Top: badge + actions */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <PriorityBadge priority={story.priority} />
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onSelectStory(story.id)}
              className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Zobacz zadania"
            >
              <ListTodo size={13} />
            </button>
            <button
              onClick={() => handleEdit(story)}
              className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => deleteStory(story.id)}
              className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-semibold text-text-main leading-snug mb-1.5 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onSelectStory(story.id)}
        >
          {story.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
          {story.description}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted/70">
          <Calendar size={10} />
          {new Date(story.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            <LayoutList size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-main tracking-tight">Historyjki</h2>
            <p className="text-sm text-text-muted mt-0.5">{stories.length} historyjek w projekcie</p>
          </div>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => setIsFormOpen(true)}>
          Dodaj historyjkę
        </Button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(['todo', 'doing', 'done'] as Status[]).map((status) => {
          const items = storiesByStatus(status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              count={items.length}
              emptyIcon={<LayoutList size={28} />}
              emptyText="Brak historyjek"
            >
              {items.map(renderStoryCard)}
            </KanbanColumn>
          );
        })}
      </div>

      {isFormOpen && <StoryForm onClose={handleCloseForm} storyToEdit={storyToEdit} />}
    </div>
  );
};
