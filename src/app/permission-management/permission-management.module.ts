import { NgModule } from '@angular/core';

import { PermissionManagementRoutingModule } from './permission-management-routing.module';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentManagementComponent } from './components/department-management/department-management.component';

@NgModule({
  declarations: [
    PermissionManagementComponent,
    UserManagementComponent,
    MenuComponent,
    DepartmentManagementComponent,
  ],
  imports: [
    SharedModule,
    PermissionManagementRoutingModule,
  ]
})
export class PermissionManagementModule { }
