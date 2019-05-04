import {Injectable, EventEmitter} from '@angular/core';
import { SiteTheme } from 'src/app/shared/interfaces/theme';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ThemeStorage {
  static storageKey = 'theme-storage-current-name';

  onThemeUpdate: EventEmitter<SiteTheme> = new EventEmitter<SiteTheme>();

  constructor(
    private readonly storageService: LocalStorageService,
  ) {}

  storeTheme(theme: SiteTheme) {
    try {
      this.storageService.setItem(ThemeStorage.storageKey, theme.name);
    } catch { }

    this.onThemeUpdate.emit(theme);
  }

  getStoredThemeName(): string | null {
    try {
      return this.storageService.getItem(ThemeStorage.storageKey) || /* istanbul ignore next */ 'indigo-pink';
    } catch {
      /* istanbul ignore next */
      return 'indigo-pink';
    }
  }

  clearStorage() {
    try {
      this.storageService.removeItem(ThemeStorage.storageKey);
    } catch { }
  }
}

