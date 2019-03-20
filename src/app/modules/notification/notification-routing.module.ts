import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { NotificationDetailResolverService } from './services/notification-detail-resolver.service';

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
        component: NotificationListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
