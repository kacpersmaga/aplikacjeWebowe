import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { useNotifications } from './NotificationContext';

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { addNotification } = useNotifications();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(
    localStorage.getItem('manageme_active_project')
  );

  const loadProjects = useCallback(() => {
    setProjects(projectService.getAll());
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const setActiveProjectId = (id: string | null) => {
    setActiveProjectIdState(id);
    if (id) {
      localStorage.setItem('manageme_active_project', id);
    } else {
      localStorage.removeItem('manageme_active_project');
    }
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const created = projectService.create(project);
    // Notify all admins about the new project
    userService.getAllUsers()
      .filter(u => u.role === 'admin')
      .forEach(admin => {
        addNotification({
          title: 'Nowy projekt',
          message: `Utworzono nowy projekt: „${created.name}".`,
          priority: 'high',
          recipientId: admin.id,
        });
      });
    loadProjects();
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    projectService.update(id, project);
    loadProjects();
  };

  const deleteProject = (id: string) => {
    projectService.delete(id);
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
    loadProjects();
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      setActiveProjectId,
      addProject,
      updateProject,
      deleteProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
