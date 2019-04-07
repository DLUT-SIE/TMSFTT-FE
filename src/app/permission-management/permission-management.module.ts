import { NgModule } from '@angular/core';

import { PermissionManagementRoutingModule } from './permission-management-routing.module';
import { AccountPermissionComponent } from './components/account-permission/account-permission.component';
import { MenuComponent } from './components/menu/menu.component';
import { PermissionManagementComponent } from './permission-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PermissionManagementComponent,
    AccountPermissionComponent,
    MenuComponent,
  ],
  imports: [
    SharedModule,
    PermissionManagementRoutingModule,
  ]
})
export class PermissionManagementModule { }
