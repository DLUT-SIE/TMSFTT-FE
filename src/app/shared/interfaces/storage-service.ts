import { InjectionToken } from '@angular/core';

/** A interface that defines what a storage should be like. */
export interface StorageService {
  /** When passed a key name, will return that key's value. */
  getItem(key: string): string|null;
  /**
   * When passed a key name and value, will add that key to storage, or
   * Update that key's value if it already exists. Return true if key is
   * not previouslly in the storage, return false otherwise.
   */
  setItem(key: string, val: string): boolean;
  /**
   * When passed a key name, will remove that key from the storage. Return
   * true if key is in the storage, return false otherwise.
   */
  removeItem(key: string): boolean;
  /**
   * When passed a number n, will return the name of the n-th key
   * in the storage.
   */
  key(index: number): string|null;
  /** When invoked, will empty all keys out of the storage. */
  clear(): void;
}

export const STORAGE_SERVICE = new InjectionToken<StorageService>('StorageService');
