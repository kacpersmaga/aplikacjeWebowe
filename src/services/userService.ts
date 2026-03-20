import type { User } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    firstName: 'Kacper',
    lastName: 'Smaga',
    role: 'admin',
  },
  {
    id: 'user-2',
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: 'developer',
  },
  {
    id: 'user-3',
    firstName: 'Anna',
    lastName: 'Nowak',
    role: 'devops',
  },
  {
    id: 'user-4',
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    role: 'developer',
  },
];

class UserService {
  private currentUserId = 'user-1';

  getCurrentUser(): User {
    return MOCK_USERS.find(u => u.id === this.currentUserId)!;
  }

  getAllUsers(): User[] {
    return MOCK_USERS;
  }

  getAssignableUsers(): User[] {
    return MOCK_USERS.filter(u => u.role === 'developer' || u.role === 'devops');
  }

  getUserById(id: string): User | undefined {
    return MOCK_USERS.find(u => u.id === id);
  }
}

export const userService = new UserService();
