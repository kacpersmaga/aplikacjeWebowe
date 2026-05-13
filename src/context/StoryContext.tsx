import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Story } from '../types';
import { storyService } from '../services/storyService';
import { useProjects } from '../hooks/useProjects';

interface StoryContextType {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  loadStories: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const { activeProjectId } = useProjects();
  const [stories, setStories] = useState<Story[]>([]);

  const loadStories = useCallback(() => {
    if (activeProjectId) {
      storyService.getByProject(activeProjectId).then(setStories);
    } else {
      setStories([]);
    }
  }, [activeProjectId]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const addStory = (story: Omit<Story, 'id' | 'createdAt'>) => {
    storyService.create(story).then(loadStories);
  };

  const updateStory = (id: string, story: Partial<Story>) => {
    storyService.update(id, story).then(loadStories);
  };

  const deleteStory = (id: string) => {
    storyService.delete(id).then(loadStories);
  };

  return (
    <StoryContext.Provider value={{ stories, addStory, updateStory, deleteStory, loadStories }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within a StoryProvider');
  }
  return context;
};
