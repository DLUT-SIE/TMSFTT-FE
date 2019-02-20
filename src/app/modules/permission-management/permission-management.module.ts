import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
} from '@angular/material';

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
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,

    PermissionManagementRoutingModule
  ]
})
export class PermissionManagementModule { }
