import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (data: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dialogQueue: Notification[];
  dismissDialog: () => void;
  loadNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dialogQueue, setDialogQueue] = useState<Notification[]>([]);

  const loadNotifications = useCallback(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    notificationService.getForUser(currentUser.id).then(setNotifications);
  }, [currentUser?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const addNotification = useCallback(
    (data: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
      notificationService.create(data).then(created => {
        if (currentUser && created.recipientId === currentUser.id) {
          loadNotifications();
          if (created.priority === 'medium' || created.priority === 'high') {
            setDialogQueue(prev => [...prev, created]);
          }
        }
      });
    },
    [currentUser?.id, loadNotifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      notificationService.markAsRead(id).then(loadNotifications);
    },
    [loadNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    notificationService.markAllAsRead(currentUser.id).then(loadNotifications);
  }, [currentUser?.id, loadNotifications]);

  const dismissDialog = useCallback(() => {
    setDialogQueue(prev => prev.slice(1));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dialogQueue,
        dismissDialog,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
