import type { Notification } from '../types';
import { createStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class NotificationService {
  private storage: StorageStrategy<Notification>;

  constructor() {
    this.storage = createStrategy<Notification>('notifications', STORAGE_KEYS.NOTIFICATIONS);
  }

  async getAll(): Promise<Notification[]> {
    const all = await this.storage.getAll();
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getForUser(userId: string): Promise<Notification[]> {
    const all = await this.getAll();
    return all.filter(n => n.recipientId === userId);
  }

  async create(data: Omit<Notification, 'id' | 'date' | 'isRead'>): Promise<Notification> {
    const notification: Notification = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isRead: false,
    };
    await this.storage.upsert(notification);
    return notification;
  }

  async markAsRead(id: string): Promise<void> {
    const all = await this.storage.getAll();
    const notification = all.find(n => n.id === id);
    if (notification) {
      await this.storage.upsert({ ...notification, isRead: true });
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const all = await this.storage.getAll();
    const userNotifications = all.filter(n => n.recipientId === userId && !n.isRead);
    await Promise.all(
      userNotifications.map(n => this.storage.upsert({ ...n, isRead: true }))
    );
  }
}

export const notificationService = new NotificationService();
