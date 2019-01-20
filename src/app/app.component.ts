import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PlatformService } from './services/platform.service';
import { NotificationBoxComponent } from './notification/notification-box/notification-box.component';
import { AUTH_SERVICE, AuthService } from './services/auth/auth-service';
import { NotificationService } from './services/notification/notification.service';

/** Root component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    readonly platformService: PlatformService,
    readonly notificationService: NotificationService,
    @Inject(AUTH_SERVICE) readonly authService: AuthService,
    private readonly dialog: MatDialog,
    ) {}

  /** Open notification box. */
  openNotificationBox() {
    this.dialog.open(NotificationBoxComponent, {
      width: '400px',
      backdropClass: 'transparent-backdrop',
      position: {
        right: '20px',
        top: '50px',
      }
    });
  }
}
