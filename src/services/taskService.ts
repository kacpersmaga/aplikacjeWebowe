import type { Task } from '../types';
import { LocalStorageStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class TaskService {
  private storage: StorageStrategy<Task>;

  constructor(storage: StorageStrategy<Task> = new LocalStorageStrategy<Task>(STORAGE_KEYS.TASKS)) {
    this.storage = storage;
  }

  setStrategy(storage: StorageStrategy<Task>) {
    this.storage = storage;
  }

  getAll(): Task[] {
    return this.storage.getAll();
  }

  getByStory(storyId: string): Task[] {
    return this.getAll().filter(t => t.storyId === storyId);
  }

  getById(id: string): Task | undefined {
    return this.getAll().find(t => t.id === id);
  }

  create(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getAll();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    this.storage.save(tasks);
    return newTask;
  }

  update(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    this.storage.save(tasks);
    return tasks[index];
  }

  delete(id: string): void {
    const tasks = this.getAll().filter(t => t.id !== id);
    this.storage.save(tasks);
  }

  areAllDone(storyId: string): boolean {
    const tasks = this.getByStory(storyId);
    return tasks.length > 0 && tasks.every(t => t.status === 'done');
  }
}

export const taskService = new TaskService();
