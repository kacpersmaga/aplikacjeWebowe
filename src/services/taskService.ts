import type { Task } from '../types';
import { createStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class TaskService {
  private storage: StorageStrategy<Task>;

  constructor() {
    this.storage = createStrategy<Task>('tasks', STORAGE_KEYS.TASKS);
  }

  async getAll(): Promise<Task[]> {
    return this.storage.getAll();
  }

  async getByStory(storyId: string): Promise<Task[]> {
    const all = await this.getAll();
    return all.filter(t => t.storyId === storyId);
  }

  async getById(id: string): Promise<Task | undefined> {
    const all = await this.getAll();
    return all.find(t => t.id === id);
  }

  async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.storage.upsert(newTask);
    return newTask;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const all = await this.getAll();
    const existing = all.find(t => t.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    await this.storage.upsert(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.storage.remove(id);
  }

  async areAllDone(storyId: string): Promise<boolean> {
    const tasks = await this.getByStory(storyId);
    return tasks.length > 0 && tasks.every(t => t.status === 'done');
  }
}

export const taskService = new TaskService();
