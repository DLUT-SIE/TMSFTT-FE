import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from 'src/app/demo/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { TrainingRecordComponent } from 'src/app/modules/training-record/training-record.component';

export const adminLayoutRoutes: Routes = [
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
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'training-record',
    component: TrainingRecordComponent,
    children: [
      {
        path: '',
        loadChildren: 'src/app/modules/training-record/training-record.module#TrainingRecordModule',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminLayoutRoutes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
