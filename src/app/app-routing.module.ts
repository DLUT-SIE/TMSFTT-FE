import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './modules/layouts/admin-layout/admin-layout.component';
import { AdminGuard } from './guards/admin.guard';
import { UserLayoutComponent } from './modules/layouts/user-layout/user-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionDeniedComponent } from './components/permission-denied/permission-denied.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  // Load this module only if user is admin.
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: './modules/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      },
    ]
  },
  // Load this module if user is authenticated.
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './modules/layouts/user-layout/user-layout.module#UserLayoutModule'
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
        enableTracing: true,  // Debug ONLY
      },
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
