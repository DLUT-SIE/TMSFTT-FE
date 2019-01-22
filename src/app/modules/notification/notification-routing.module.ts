import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationCenterComponent } from './notification-center/notification-center.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotificationComponent } from './notification/notification.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { NotificationDetailResolverService } from 'src/app/services/notification/notification-detail-resolver.service';

const routes: Routes = [
  {
    path: 'notifications',
    component: NotificationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        resolve: {
          notification: NotificationDetailResolverService,
        },
        component: NotificationDetailComponent,
      },
      {
        path: '',
        component: NotificationCenterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
