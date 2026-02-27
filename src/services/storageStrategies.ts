import type { Project } from '../types';

export interface StorageStrategy {
  getAll(): Project[];
  save(projects: Project[]): void;
}

export class LocalStorageStrategy implements StorageStrategy {
  private readonly key = 'manageme_projects';

  getAll(): Project[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(projects: Project[]): void {
    localStorage.setItem(this.key, JSON.stringify(projects));
  }
}

export class MemoryStorageStrategy implements StorageStrategy {
  private projects: Project[] = [];

  getAll(): Project[] {
    return [...this.projects];
  }

  save(projects: Project[]): void {
    this.projects = [...projects];
  }
}
