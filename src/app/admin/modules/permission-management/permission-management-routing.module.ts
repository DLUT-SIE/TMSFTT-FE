import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './components/user-management/user-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';
import { DepartmentGroupDetailComponent } from './components/department-group-detail/department-group-detail.component';
import { GroupResolverService } from 'src/app/admin/modules/permission-management/services/group-resolver.service';

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
            path: 'groups/:id',
            resolve: {
              group: GroupResolverService,
            },
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
