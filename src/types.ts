export interface Project {
  id: string;
  name: string;
  description: string;
}

export type Role = 'admin' | 'devops' | 'developer' | 'guest';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  blocked?: boolean;
  photoURL?: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'doing' | 'done';

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  projectId: string;
  createdAt: string;
  status: Status;
  ownerId: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedTime: number; // hours
  status: Status;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  assignedUserId?: string;
}

export type ISOString = string;
export type UserID = string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: ISOString;
  priority: Priority;
  isRead: boolean;
  recipientId: UserID;
}
