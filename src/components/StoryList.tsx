import React, { useState, useMemo, useCallback } from 'react';
import type { Story, Status } from '../types';
import { useStories } from '../context/StoryContext';
import { PRIORITY_ACCENT } from '../constants/colors';
import { StoryForm } from './StoryForm';
import { KanbanColumn } from './KanbanColumn';
import { PriorityBadge } from './ui/Badge';
import { Button } from './ui/Button';
import { Edit2, Trash2, ListTodo, Calendar, LayoutList, Plus } from 'lucide-react';

interface StoryListProps {
  onSelectStory: (storyId: string) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ onSelectStory }) => {
  const { stories, deleteStory } = useStories();
  const [storyToEdit, setStoryToEdit] = useState<Story | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const storiesByStatus = useMemo(() => {
    const map: Record<Status, Story[]> = { todo: [], doing: [], done: [] };
    stories.forEach(s => map[s.status].push(s));
    return map;
  }, [stories]);

  const handleEdit = useCallback((story: Story) => {
    setStoryToEdit(story);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setStoryToEdit(undefined);
  }, []);

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
        {(['todo', 'doing', 'done'] as Status[]).map(status => (
          <KanbanColumn
            key={status}
            status={status}
            count={storiesByStatus[status].length}
            emptyIcon={<LayoutList size={28} />}
            emptyText="Brak historyjek"
          >
            {storiesByStatus[status].map(story => (
              <StoryCard
                key={story.id}
                story={story}
                onSelect={onSelectStory}
                onEdit={handleEdit}
                onDelete={deleteStory}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>

      {isFormOpen && <StoryForm onClose={handleCloseForm} storyToEdit={storyToEdit} />}
    </div>
  );
};

interface StoryCardProps {
  story: Story;
  onSelect: (id: string) => void;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect, onEdit, onDelete }) => (
  <div className="group relative bg-bg-sidebar border border-border rounded-xl overflow-hidden transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md">
    <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${PRIORITY_ACCENT[story.priority]}`} />

    <div className="pl-4 pr-3 py-3.5">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <PriorityBadge priority={story.priority} />
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onSelect(story.id)}
            className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Zobacz zadania"
          >
            <ListTodo size={13} />
          </button>
          <button
            onClick={() => onEdit(story)}
            className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(story.id)}
            className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3
        className="text-sm font-semibold text-text-main leading-snug mb-1.5 cursor-pointer hover:text-primary transition-colors"
        onClick={() => onSelect(story.id)}
      >
        {story.name}
      </h3>

      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">{story.description}</p>

      <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted/70">
        <Calendar size={10} />
        {new Date(story.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })}
      </div>
    </div>
  </div>
);
