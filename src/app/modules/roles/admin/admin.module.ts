import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { AdminRoutingModule } from './admin.routing';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';

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
    MatInputModule,
    MatFormFieldModule,
    AdminRoutingModule,
  ],
})

export class AdminModule {}
