import type { User, Role } from '../types';
import { createStrategy } from './storageStrategies';
import type { StorageStrategy } from './storageStrategies';
import { STORAGE_KEYS } from '../constants/storage';

class UserService {
  private storage: StorageStrategy<User>;

  constructor() {
    this.storage = createStrategy<User>('users', STORAGE_KEYS.USERS);
  }

  async getAllUsers(): Promise<User[]> {
    return this.storage.getAll();
  }

  async saveUser(user: User): Promise<User> {
    await this.storage.upsert(user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const all = await this.getAllUsers();
    return all.find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const all = await this.getAllUsers();
    return all.find(u => u.email === email);
  }

  async updateUserRole(id: string, role: Role): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      await this.storage.upsert({ ...user, role });
    }
  }

  async setBlocked(id: string, blocked: boolean): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      await this.storage.upsert({ ...user, blocked });
    }
  }

  async getAssignableUsers(): Promise<User[]> {
    const all = await this.getAllUsers();
    return all.filter(u => (u.role === 'developer' || u.role === 'devops') && !u.blocked);
  }
}

export const userService = new UserService();
