import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './components/user-management/user-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { DepartmentDetailComponent } from './components/department-detail/department-detail.component';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';
import { DepartmentGroupDetailComponent } from './components/department-group-detail/department-group-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionManagementComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'users',
            component: UserManagementComponent,
          },
          {
            path: 'departments',
            component: DepartmentManagementComponent,
          },
          {
            path: 'departments/:id',
            component: DepartmentDetailComponent,
          },
          {
            path: 'groups/:id',
            component: DepartmentGroupDetailComponent,
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
