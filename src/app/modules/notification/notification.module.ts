import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';

@NgModule({
  declarations: [
    NotificationCenterComponent,
    NotificationComponent,
    NotificationDetailComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,

    NotificationRoutingModule
  ],
})
export class NotificationModule { }
