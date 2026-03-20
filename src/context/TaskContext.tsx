import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import { storyService } from '../services/storyService';

interface TaskContextType {
  tasks: Task[];
  storyId: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignUser: (taskId: string, userId: string) => void;
  completeTask: (taskId: string) => void;
  loadTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
  storyId: string | null;
  onStoryStatusChange?: () => void;
}

export const TaskProvider = ({ children, storyId, onStoryStatusChange }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(() => {
    if (storyId) {
      setTasks(taskService.getByStory(storyId));
    } else {
      setTasks([]);
    }
  }, [storyId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const syncStoryStatus = (updatedStoryId: string) => {
    if (taskService.areAllDone(updatedStoryId)) {
      storyService.update(updatedStoryId, { status: 'done' });
    }
    onStoryStatusChange?.();
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    taskService.create(task);
    loadTasks();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    taskService.update(id, updates);
    loadTasks();
  };

  const assignUser = (taskId: string, userId: string) => {
    const task = taskService.getById(taskId);
    if (!task) return;

    taskService.update(taskId, {
      assignedUserId: userId,
      status: 'doing',
      startDate: new Date().toISOString(),
    });

    const story = storyService.getAll().find(s => s.id === task.storyId);
    if (story && story.status === 'todo') {
      storyService.update(task.storyId, { status: 'doing' });
      onStoryStatusChange?.();
    }

    loadTasks();
  };

  const completeTask = (taskId: string) => {
    const task = taskService.getById(taskId);
    if (!task) return;

    taskService.update(taskId, {
      status: 'done',
      endDate: new Date().toISOString(),
    });

    syncStoryStatus(task.storyId);
    loadTasks();
  };

  const deleteTask = (id: string) => {
    const task = taskService.getById(id);
    taskService.delete(id);
    if (task) syncStoryStatus(task.storyId);
    loadTasks();
  };

  return (
    <TaskContext.Provider value={{ tasks, storyId, addTask, updateTask, deleteTask, assignUser, completeTask, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
