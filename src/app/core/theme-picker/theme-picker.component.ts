import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {StyleManager} from 'src/app/shared/services/style-manager.service';
import { SiteTheme } from 'src/app/shared/interfaces/theme';
import { ThemeStorage } from './theme-storage.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-theme-picker',
  templateUrl: 'theme-picker.component.html',
  styleUrls: ['theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ThemePickerComponent {
  currentTheme: SiteTheme;

  readonly themes: SiteTheme[] = [
    {
      primary: '#673AB7',
      accent: '#FFC107',
      name: 'deeppurple-amber',
    },
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      name: 'indigo-pink',
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

  constructor(
    readonly styleManager: StyleManager,
    private readonly snackBar: MatSnackBar,
    private readonly themeStorage: ThemeStorage,
  ) {
    this.installTheme(this.themeStorage.getStoredThemeName(), true);
  }

  installTheme(themeName: string, disableNotify?: boolean) {
    const theme = this.themes.find(currentTheme => currentTheme.name === themeName);

    if (!theme) {
      /* istanbul ignore next */
      return;
    }

    this.currentTheme = theme;
    this.styleManager.setTheme(theme);

    if (this.currentTheme) {
      this.themeStorage.storeTheme(this.currentTheme);
    }

    /* istanbul ignore next */
    if (!disableNotify) {
      this.snackBar.open('主题变更成功!', '关闭', {duration: 1500});
    }
  }
}
