import { Component } from '@angular/core';

import { StyleManager } from 'src/app/shared/services/style-manager.service';

@Component({
  selector: 'app-theme-picker',
  templateUrl: 'theme-picker.component.html',
  styleUrls: ['theme-picker.component.scss'],
})
export class ThemePickerComponent {

  constructor(
    readonly styleManager: StyleManager,
  ) {}
}
