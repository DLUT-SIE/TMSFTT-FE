import { Injectable, Inject } from '@angular/core';
import { SiteTheme } from '../interfaces/theme';
import { Observable, ReplaySubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { WindowService } from './window.service';
import { ThemeStorage } from './theme-storage.service';
import { MatSnackBar } from '@angular/material';


/** Class for managing stylesheets. */
@Injectable({
  providedIn: 'root'
})
export class StyleManager {
  readonly themes: SiteTheme[] = [
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      name: 'indigo-pink',
    },
    {
      primary: '#673AB7',
      accent: '#FFC107',
      name: 'deeppurple-amber',
    },
    // {
    //   primary: '#E91E63',
    //   accent: '#607D8B',
    //   name: 'pink-bluegrey',
    //   isDark: true,
    // },
    // {
    //   primary: '#9C27B0',
    //   accent: '#4CAF50',
    //   name: 'purple-green',
    //   isDark: true,
    // },
  ];
  currentTheme: SiteTheme;

  themeChanged: Observable<SiteTheme>;

  private readonly themeChanged$ = new ReplaySubject<SiteTheme>();
  private readonly divsMap = new Map<string, HTMLDivElement>();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly windowService: WindowService,
    private readonly themeStorage: ThemeStorage,
    private readonly snackBar: MatSnackBar,
  ) {
    this.setTheme(this.themeStorage.getStoredThemeName());
    this.themeChanged = this.themeChanged$;
  }

  setTheme(themeName: string) {
    const theme = this.themes.find(currentTheme => currentTheme.name === themeName);
    if (!theme || (this.currentTheme && theme.name === this.currentTheme.name)) {
      return;
    }
    const isFirstSet = !this.currentTheme;
    this.currentTheme = theme;
    this.themeStorage.storeTheme(this.currentTheme);
    this.themeChanged$.next(theme);
    if (!isFirstSet) {
      /* istanbul ignore next */
      this.snackBar.open('主题变更成功!', '关闭', {duration: 1000});
    }
  }

  private getHelperDivForColor(colorName: string) {
    const id = `color-helper-${colorName}`;
    if (!this.divsMap.has(colorName)) {
      const container = this.document.getElementById('themeContainer');
      const div = this.document.createElement('div');
      div.setAttribute('id', id);
      div.setAttribute('class', `hidden color-${colorName}`);
      container.append(div);
      this.divsMap.set(colorName, this.document.getElementById(id) as HTMLDivElement);
    }
    return this.divsMap.get(colorName);
  }

  private getColor(colorName: string) {
    const div = this.getHelperDivForColor(colorName);
    if (!div) {
      /* istanbul ignore next */
      return this.currentTheme.primary;
    }
    return this.windowService.getComputedStyle(div).color;
  }

  get primaryColor() {
    return this.getColor('primary');
  }

  get accentColor() {
    return this.getColor('accent');
  }

  get warnColor() {
    return this.getColor('warn');
  }
}
