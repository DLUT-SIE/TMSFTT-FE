import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule,
} from '@angular/material';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationBoxComponent } from './components/notification-box/notification-box.component';
import { NotificationBoxCardComponent } from './components/notification-box-card/notification-box-card.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';

@NgModule({
  declarations: [
    NotificationCenterComponent,
    NotificationBoxComponent,
    NotificationBoxCardComponent,
    NotificationComponent,
    NotificationDetailComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,

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
