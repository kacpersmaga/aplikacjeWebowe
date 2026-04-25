import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { STORAGE_BACKEND } from '../config';

export interface StorageStrategy<T extends { id: string }> {
  getAll(): Promise<T[]>;
  upsert(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}

export class LocalStorageStrategy<T extends { id: string }> implements StorageStrategy<T> {
  constructor(private readonly key: string) {}

  async getAll(): Promise<T[]> {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch {
      console.error(`[Storage] Failed to parse data for key: "${this.key}". Resetting to empty.`);
      return [];
    }
  }

  async upsert(item: T): Promise<void> {
    const items = await this.getAll();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  async remove(id: string): Promise<void> {
    const items = (await this.getAll()).filter(i => i.id !== id);
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}

export class FirestoreStrategy<T extends { id: string }> implements StorageStrategy<T> {
  constructor(private readonly collectionName: string) {}

  async getAll(): Promise<T[]> {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map(d => d.data() as T);
  }

  async upsert(item: T): Promise<void> {
    await setDoc(doc(db, this.collectionName, item.id), item);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }
}

export function createStrategy<T extends { id: string }>(
  collectionName: string,
  storageKey: string,
): StorageStrategy<T> {
  if (STORAGE_BACKEND === 'firestore') {
    return new FirestoreStrategy<T>(collectionName);
  }
  return new LocalStorageStrategy<T>(storageKey);
}
