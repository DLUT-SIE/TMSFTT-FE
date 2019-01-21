import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatProgressSpinnerModule,
} from '@angular/material';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationCenterComponent } from './notification-center/notification-center.component';
import { NotificationBoxComponent } from './notification-box/notification-box.component';
import { NotificationBoxCardComponent } from './notification-box-card/notification-box-card.component';

@NgModule({
  declarations: [NotificationCenterComponent, NotificationBoxComponent, NotificationBoxCardComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressSpinnerModule,

    NotificationRoutingModule
  ],
  exports: [
    NotificationBoxComponent,
  ],
  entryComponents: [
    NotificationBoxComponent,
  ]
})
export class NotificationModule { }
