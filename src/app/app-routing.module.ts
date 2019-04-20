import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { PermissionDeniedComponent } from './core/permission-denied/permission-denied.component';
import { LoginComponent } from './core/login/login.component';

import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { NotificationComponent } from './core/notification/notification.component';
import { NotificationDetailResolverService } from './core/notification-detail/notification-detail-resolver.service';
import { NotificationDetailComponent } from './core/notification-detail/notification-detail.component';
import { NotificationListComponent } from './core/notification-list/notification-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'permission-denied',
    component: PermissionDeniedComponent,
  },
  // Load this module only if user is admin.
  {
    path: 'admin',
    canLoad: [AdminGuard],
    loadChildren: './roles/admin-user/admin-user.module#AdminUserModule'
  },
  // Load this module if user is authenticated.
  {
    path: 'user',
    canLoad: [AuthGuard],
    loadChildren: './roles/regular-user/regular-user.module#RegularUserModule'
  },
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
  },
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
    path: '**',
    component: PageNotFoundComponent,
  },
];

/** Export routings. */
@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        enableTracing: false,  // TODO(youchen): Debug ONLY
        preloadingStrategy: PreloadAllModules,
      },
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
