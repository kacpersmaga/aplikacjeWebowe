import type { Project } from '../types';
import { createStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class ProjectService {
  private storage: StorageStrategy<Project>;

  constructor() {
    this.storage = createStrategy<Project>('projects', STORAGE_KEYS.PROJECTS);
  }

  async getAll(): Promise<Project[]> {
    return this.storage.getAll();
  }

  async getById(id: string): Promise<Project | undefined> {
    const all = await this.getAll();
    return all.find(p => p.id === id);
  }

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = { ...project, id: crypto.randomUUID() };
    await this.storage.upsert(newProject);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const all = await this.getAll();
    const existing = all.find(p => p.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    await this.storage.upsert(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.storage.remove(id);
  }
}

export const projectService = new ProjectService();
