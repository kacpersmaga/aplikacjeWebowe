import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import { storyService } from '../services/storyService';
import { userService } from '../services/userService';
import { useNotifications } from './NotificationContext';

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
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(() => {
    if (storyId) {
      taskService.getByStory(storyId).then(setTasks);
    } else {
      setTasks([]);
    }
  }, [storyId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const syncStoryStatus = async (updatedStoryId: string) => {
    if (await taskService.areAllDone(updatedStoryId)) {
      await storyService.update(updatedStoryId, { status: 'done' });
    }
    onStoryStatusChange?.();
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    taskService.create(task).then(async created => {
      const story = await storyService.getById(created.storyId);
      if (story) {
        addNotification({
          title: 'Nowe zadanie',
          message: `Dodano zadanie „${created.name}" do historyjki „${story.name}".`,
          priority: 'medium',
          recipientId: story.ownerId,
        });
      }
      loadTasks();
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    taskService.update(id, updates).then(loadTasks);
  };

  const assignUser = (taskId: string, userId: string) => {
    taskService.getById(taskId).then(async task => {
      if (!task) return;

      await taskService.update(taskId, {
        assignedUserId: userId,
        status: 'doing',
        startDate: new Date().toISOString(),
      });

      const story = await storyService.getById(task.storyId);
      if (story && story.status === 'todo') {
        await storyService.update(task.storyId, { status: 'doing' });
        onStoryStatusChange?.();
      }

      const assignedUser = await userService.getUserById(userId);
      addNotification({
        title: 'Przypisano do zadania',
        message: `Zostałeś/aś przypisany/a do zadania „${task.name}"${story ? ` w historyjce „${story.name}"` : ''}.`,
        priority: 'high',
        recipientId: userId,
      });

      if (story && story.ownerId !== userId) {
        addNotification({
          title: 'Zmiana statusu zadania',
          message: `Zadanie „${task.name}" w historyjce „${story.name}" zmieniło status na: W trakcie.${assignedUser ? ` Przypisano: ${assignedUser.firstName} ${assignedUser.lastName}.` : ''}`,
          priority: 'low',
          recipientId: story.ownerId,
        });
      }

      loadTasks();
    });
  };

  const completeTask = (taskId: string) => {
    taskService.getById(taskId).then(async task => {
      if (!task) return;

      await taskService.update(taskId, {
        status: 'done',
        endDate: new Date().toISOString(),
      });

      const story = await storyService.getById(task.storyId);
      if (story) {
        addNotification({
          title: 'Zmiana statusu zadania',
          message: `Zadanie „${task.name}" w historyjce „${story.name}" zostało ukończone.`,
          priority: 'medium',
          recipientId: story.ownerId,
        });
      }

      await syncStoryStatus(task.storyId);
      loadTasks();
    });
  };

  const deleteTask = (id: string) => {
    taskService.getById(id).then(async task => {
      await taskService.delete(id);

      if (task) {
        const story = await storyService.getById(task.storyId);
        if (story) {
          addNotification({
            title: 'Usunięto zadanie',
            message: `Zadanie „${task.name}" zostało usunięte z historyjki „${story.name}".`,
            priority: 'medium',
            recipientId: story.ownerId,
          });
        }
        await syncStoryStatus(task.storyId);
      }
      loadTasks();
    });
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
