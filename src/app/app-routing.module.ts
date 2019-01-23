import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './modules/layouts/admin-layout/admin-layout.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // Load this module only when user is admin.
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: './modules/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }]
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
    path: '**',
    component: PageNotFoundComponent,
  },
];

/** Export routings. */
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
