import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './modules/roles/admin/admin.component';
import { RegularUserComponent } from './modules/roles/regular-user/regular-user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  // Load this module only if user is admin.
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: './modules/roles/admin/admin.module#AdminModule'
      },
    ]
  },
  // Load this module if user is authenticated.
  {
    path: '',
    component: RegularUserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './modules/roles/regular-user/regular-user.module#RegularUserModule'
      },
    ]
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
      },
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
