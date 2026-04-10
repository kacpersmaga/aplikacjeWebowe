import type { Notification } from '../types';

const STORAGE_KEY = 'manageme_notifications';

class NotificationService {
  getAll(): Notification[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getForUser(userId: string): Notification[] {
    return this.getAll().filter(n => n.recipientId === userId);
  }

  create(data: Omit<Notification, 'id' | 'date' | 'isRead'>): Notification {
    const all = this.getAll();
    const notification: Notification = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    all.unshift(notification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return notification;
  }

  markAsRead(id: string): void {
    const all = this.getAll().map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  markAllAsRead(userId: string): void {
    const all = this.getAll().map(n =>
      n.recipientId === userId ? { ...n, isRead: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export const notificationService = new NotificationService();
