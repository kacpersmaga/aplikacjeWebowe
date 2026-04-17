import type { User, Role } from '../types';

const USERS_KEY = 'manageme_users';

class UserService {
  getAllUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveAll(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
