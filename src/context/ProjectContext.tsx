import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types';
import { projectService } from '../services/projectService';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(() => {
    setProjects(projectService.getAll());
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    projectService.create(project);
    loadProjects();
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    projectService.update(id, project);
    loadProjects();
  };

  const deleteProject = (id: string) => {
    projectService.delete(id);
    loadProjects();
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
