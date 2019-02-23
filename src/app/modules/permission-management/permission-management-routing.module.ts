import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPermissionComponent } from './components/account-permission/account-permission.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          {
            path: 'account-permission',
            component: AccountPermissionComponent,
          },
          {
            path: '',
            component: MenuComponent,
          },
        ]
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionManagementRoutingModule { }
