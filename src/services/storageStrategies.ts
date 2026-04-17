export interface StorageStrategy<T> {
  getAll(): T[];
  save(items: T[]): void;
}

export class LocalStorageStrategy<T> implements StorageStrategy<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch {
      console.error(`[Storage] Failed to parse data for key: "${this.key}". Resetting to empty.`);
      return [];
    }
  }

  save(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (e) {
      console.error(`[Storage] Failed to save data for key: "${this.key}".`, e);
    }
  }
}

export class MemoryStorageStrategy<T> implements StorageStrategy<T> {
  private items: T[] = [];

  getAll(): T[] {
    return [...this.items];
  }

  save(items: T[]): void {
    this.items = [...items];
  }
}
