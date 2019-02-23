import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { LoginComponent } from './components/login/login.component';

import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    loadChildren: './modules/roles/admin/admin.module#AdminModule'
  },
  // Load this module if user is authenticated.
  {
    path: '',
    canLoad: [AuthGuard],
    loadChildren: './modules/roles/regular-user/regular-user.module#RegularUserModule'
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
