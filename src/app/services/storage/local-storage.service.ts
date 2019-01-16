import { Injectable } from '@angular/core';

import { StorageService } from './storage-service';


/** LocalStorageService implements StorageService with localStorage. */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageService {
  constructor() { }

  getItem(key: string): string|null {
    return localStorage.getItem(key);
  }

  setItem(key: string, val: string): boolean {
    let exist = false;
    if (localStorage.getItem(key)) exist = true;
    localStorage.setItem(key, val);
    return exist;
  }

  removeItem(key: string): boolean {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  key(index: number): string|null {
    return localStorage.key(index);
  }

  clear() {
    localStorage.clear();
  }
}

