import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutingModule } from './admin-layout.routing';
import { DashboardComponent } from 'src/app/demo/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { TrainingRecordComponent } from 'src/app/modules/training-record/training-record.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    AdminLayoutRoutingModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,

    TrainingRecordComponent,
  ]
})

export class AdminLayoutModule {}
