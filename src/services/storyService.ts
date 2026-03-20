import type { Story } from '../types';
import { LocalStorageStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';

class StoryService {
  private storage: StorageStrategy<Story>;

  constructor(storage: StorageStrategy<Story> = new LocalStorageStrategy<Story>('manageme_stories')) {
    this.storage = storage;
  }

  setStrategy(storage: StorageStrategy<Story>) {
    this.storage = storage;
  }

  getAll(): Story[] {
    return this.storage.getAll();
  }

  getByProject(projectId: string): Story[] {
    return this.getAll().filter((s) => s.projectId === projectId);
  }

  create(story: Omit<Story, 'id' | 'createdAt'>): Story {
    const stories = this.getAll();
    const newStory: Story = {
      ...story,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    stories.push(newStory);
    this.storage.save(stories);
    return newStory;
  }

  update(id: string, updatedStory: Partial<Story>): Story | null {
    const stories = this.getAll();
    const index = stories.findIndex((s) => s.id === id);
    if (index === -1) return null;

    stories[index] = { ...stories[index], ...updatedStory };
    this.storage.save(stories);
    return stories[index];
  }

  delete(id: string): void {
    const stories = this.getAll().filter((s) => s.id !== id);
    this.storage.save(stories);
  }
}

export const storyService = new StoryService();
