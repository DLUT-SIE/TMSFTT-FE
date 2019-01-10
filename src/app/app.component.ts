import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { PlatformService } from './platform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(readonly platformService: PlatformService) {}
}
