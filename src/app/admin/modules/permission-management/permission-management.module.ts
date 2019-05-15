import { NgModule } from '@angular/core';

import { PermissionManagementRoutingModule } from './permission-management-routing.module';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentGroupComponent } from './components/department-group/department-group.component';
import { DepartmentGroupDetailComponent } from './components/department-group-detail/department-group-detail.component';
import { DepartmentGroupUserComponent } from './components/department-group-user/department-group-user.component';
import { DepartmentGroupPermissionComponent } from './components/department-group-permission/department-group-permission.component';
import { AdduserDialogComponent } from './components/adduser-dialog/adduser-dialog.component';

@NgModule({
  declarations: [
    PermissionManagementComponent,
    UserManagementComponent,
    MenuComponent,
    DepartmentManagementComponent,
    DepartmentListComponent,
    DepartmentGroupComponent,
    DepartmentGroupDetailComponent,
    DepartmentGroupUserComponent,
    DepartmentGroupPermissionComponent,
    AdduserDialogComponent,
  ],
  imports: [
    SharedModule,
    PermissionManagementRoutingModule
  ],
  entryComponents: [
    AdduserDialogComponent,
  ]
})
export class PermissionManagementModule { }
