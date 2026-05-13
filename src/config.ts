export const SUPER_ADMIN_EMAIL: string = import.meta.env.VITE_SUPER_ADMIN_EMAIL || '';

export type StorageBackend = 'localStorage' | 'firestore';

export const STORAGE_BACKEND: StorageBackend =
  (import.meta.env.VITE_STORAGE_BACKEND as StorageBackend) || 'localStorage';
