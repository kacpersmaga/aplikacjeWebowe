import type { Project } from '../types';
import { LocalStorageStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';

class ProjectService {
  private storage: StorageStrategy;

  constructor(storage: StorageStrategy = new LocalStorageStrategy()) {
    this.storage = storage;
  }

  setStrategy(storage: StorageStrategy) {
    this.storage = storage;
  }

  getAll(): Project[] {
    return this.storage.getAll();
  }

  getById(id: string): Project | undefined {
    return this.getAll().find((p) => p.id === id);
  }

  create(project: Omit<Project, 'id'>): Project {
    const projects = this.getAll();
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
    };
    projects.push(newProject);
    this.storage.save(projects);
    return newProject;
  }

  update(id: string, updatedProject: Partial<Project>): Project | null {
    const projects = this.getAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updatedProject };
    this.storage.save(projects);
    return projects[index];
  }

  delete(id: string): void {
    const projects = this.getAll().filter((p) => p.id !== id);
    this.storage.save(projects);
  }
}

export const projectService = new ProjectService();
