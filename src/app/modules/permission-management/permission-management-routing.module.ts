import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPermissionComponent } from './components/account-permission/account-permission.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionManagementRoutingModule { }
