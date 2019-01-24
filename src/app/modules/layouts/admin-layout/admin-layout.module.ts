import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material';

import { AdminLayoutRoutingModule } from './admin-layout.routing';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { CommonLayoutModule } from 'src/app/modules/layouts/common-layout/common-layout.module';

@NgModule({
  declarations: [
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,
  ],
  imports: [
    MatFormFieldModule,
    CommonLayoutModule,
    AdminLayoutRoutingModule,
  ],
})

export class AdminLayoutModule {}
