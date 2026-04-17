import type { Notification } from '../types';
import { STORAGE_KEYS } from '../constants/storage';

class NotificationService {
  getAll(): Notification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      console.error('[NotificationService] Failed to parse notifications. Resetting.');
      return [];
    }
  }

  getForUser(userId: string): Notification[] {
    return this.getAll().filter(n => n.recipientId === userId);
  }

  create(data: Omit<Notification, 'id' | 'date' | 'isRead'>): Notification {
    const all = this.getAll();
    const notification: Notification = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isRead: false,
    };
    all.unshift(notification);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error('[NotificationService] Failed to save notifications.', e);
    }
    return notification;
  }

  markAsRead(id: string): void {
    const all = this.getAll().map(n => (n.id === id ? { ...n, isRead: true } : n));
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error('[NotificationService] Failed to mark as read.', e);
    }
  }

  markAllAsRead(userId: string): void {
    const all = this.getAll().map(n =>
      n.recipientId === userId ? { ...n, isRead: true } : n
    );
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error('[NotificationService] Failed to mark all as read.', e);
    }
  }
}

export const notificationService = new NotificationService();
