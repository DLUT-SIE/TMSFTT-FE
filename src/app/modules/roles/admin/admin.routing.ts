import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';

export const adminRoutes: Routes = [
  {
    path: 'demo',
    children: [
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'table-list',
        component: TableListComponent,
      },
      {
        path: 'typography',
        component: TypographyComponent,
      },
      {
        path: 'icons',
        component: IconsComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'upgrade',
        component: UpgradeComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
