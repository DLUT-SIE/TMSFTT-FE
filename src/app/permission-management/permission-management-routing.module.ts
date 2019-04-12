import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './components/user-management/user-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'user-management',
            component: UserManagementComponent,
          },
          {
            path: 'department-management',
            component: DepartmentManagementComponent,
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
