import { useState, useEffect, useCallback } from 'react';
import type { Story, Project } from '../types';
import { storyService } from '../services/storyService';
import { useProjects } from './useProjects';

export const useStories = () => {
  const { activeProjectId } = useProjects();
  const [stories, setStories] = useState<Story[]>([]);

  const loadStories = useCallback(() => {
    if (activeProjectId) {
      setStories(storyService.getByProject(activeProjectId));
    } else {
      setStories([]);
    }
  }, [activeProjectId]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const addStory = (story: Omit<Story, 'id' | 'createdAt'>) => {
    storyService.create(story);
    loadStories();
  };

  const updateStory = (id: string, story: Partial<Story>) => {
    storyService.update(id, story);
    loadStories();
  };

  const deleteStory = (id: string) => {
    storyService.delete(id);
    loadStories();
  };

  return {
    stories,
    addStory,
    updateStory,
    deleteStory,
  };
};
