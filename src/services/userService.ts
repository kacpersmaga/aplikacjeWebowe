import type { User, Role } from '../types';
import { STORAGE_KEYS } from '../constants/storage';

class UserService {
  getAllUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      console.error('[UserService] Failed to parse users. Resetting.');
      return [];
    }
  }

  private saveAll(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('[UserService] Failed to save users.', e);
    }
  }

  saveUser(user: User): User {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.saveAll(users);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.getAllUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find(u => u.email === email);
  }

  updateUserRole(id: string, role: Role): void {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      user.role = role;
      this.saveAll(users);
    }
  }

  setBlocked(id: string, blocked: boolean): void {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      user.blocked = blocked;
      this.saveAll(users);
    }
  }

  getAssignableUsers(): User[] {
    return this.getAllUsers().filter(
      u => (u.role === 'developer' || u.role === 'devops') && !u.blocked
    );
  }
}

export const userService = new UserService();
