import { Injectable } from '@angular/core';
import { SiteTheme } from '../interfaces/theme';
import { Observable, ReplaySubject } from 'rxjs';


/** Class for managing stylesheets. */
@Injectable({
  providedIn: 'root'
})
export class StyleManager {
  themeChanged: Observable<SiteTheme>;

  private readonly themeChanged$ = new ReplaySubject<SiteTheme>();

  constructor() {
    this.themeChanged = this.themeChanged$;
  }

  setTheme(theme: SiteTheme) {
    this.themeChanged$.next(theme);
  }
}
