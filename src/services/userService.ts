import type { User } from '../types';

class UserService {
  private currentUser: User = {
    id: 'user-1',
    firstName: 'Kacper',
    lastName: 'Smaga',
  };

  getCurrentUser(): User {
    return this.currentUser;
  }
}

export const userService = new UserService();
