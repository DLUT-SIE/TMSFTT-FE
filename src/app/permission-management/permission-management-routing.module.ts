import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPermissionComponent } from './components/account-permission/account-permission.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
    children: [
      {
        path: '',
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
