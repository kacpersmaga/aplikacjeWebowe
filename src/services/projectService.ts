import type { Project } from '../types';

const STORAGE_KEY = 'manageme_projects';

class ProjectService {
  getAll(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
    this.save(projects);
    return newProject;
  }

  update(id: string, updatedProject: Partial<Project>): Project | null {
    const projects = this.getAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updatedProject };
    this.save(projects);
    return projects[index];
  }

  delete(id: string): void {
    const projects = this.getAll().filter((p) => p.id !== id);
    this.save(projects);
  }

  private save(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}

export const projectService = new ProjectService();
