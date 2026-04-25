import type { Story } from '../types';
import { createStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class StoryService {
  private storage: StorageStrategy<Story>;

  constructor() {
    this.storage = createStrategy<Story>('stories', STORAGE_KEYS.STORIES);
  }

  async getAll(): Promise<Story[]> {
    return this.storage.getAll();
  }

  async getByProject(projectId: string): Promise<Story[]> {
    const all = await this.getAll();
    return all.filter(s => s.projectId === projectId);
  }

  async getById(id: string): Promise<Story | undefined> {
    const all = await this.getAll();
    return all.find(s => s.id === id);
  }

  async create(story: Omit<Story, 'id' | 'createdAt'>): Promise<Story> {
    const newStory: Story = {
      ...story,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.storage.upsert(newStory);
    return newStory;
  }

  async update(id: string, updates: Partial<Story>): Promise<Story | null> {
    const all = await this.getAll();
    const existing = all.find(s => s.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    await this.storage.upsert(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.storage.remove(id);
  }
}

export const storyService = new StoryService();
