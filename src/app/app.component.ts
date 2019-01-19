import { Component } from '@angular/core';

import { PlatformService } from './services/platform.service';

/** Root component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(readonly platformService: PlatformService) {}
}
