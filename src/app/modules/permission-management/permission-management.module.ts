import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionManagementRoutingModule } from './permission-management-routing.module';
import { AccountPermissionComponent } from './components/account-permission/account-permission.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AccountPermissionComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    PermissionManagementRoutingModule
  ]
})
export class PermissionManagementModule { }
