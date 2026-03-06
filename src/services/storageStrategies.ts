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
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
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
