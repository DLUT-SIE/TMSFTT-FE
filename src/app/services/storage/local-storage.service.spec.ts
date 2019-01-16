import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });

  it('should return value read from localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'saved value');

    const val = service.getItem('key');

    expect(val).toBe('saved value');
  });

  it('should return null from localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'saved value');

    const val = service.getItem('key2');

    expect(val).toBeNull();
  });

  it('should save item and return false if key is not in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);

    const existed = service.setItem('key', 'saved value');

    expect(existed).toBeFalsy();
    expect(localStorage.getItem('key')).toBe('saved value');
  });

  it('should save item and return true if key is in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'val');

    const existed = service.setItem('key', 'saved value');

    expect(existed).toBeTruthy();
    expect(localStorage.getItem('key')).toBe('saved value');
  });

  it('should return false if key is not in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);

    const removed = service.removeItem('key');

    expect(removed).toBeFalsy();
  });

  it('should remove item and return true if key is in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'value');

    const removed = service.removeItem('key');

    expect(removed).toBeTruthy();
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('should return key if key is in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'value');
    localStorage.setItem('key2', 'value');

    const key = service.key(1);

    expect(key).toBe('key2');
  });

  it('should return null if key is not in localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'value');

    const key = service.key(1);

    expect(key).toBeNull();
  });

  it('should clean the localStorage', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    localStorage.setItem('key', 'value');
    localStorage.setItem('key2', 'value');

    service.clear();

    expect(service.getItem('key')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });
});
