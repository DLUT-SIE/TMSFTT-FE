import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../shared/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    // TODO(youchen): Only super-admin has access to this module.
    path: 'permissions',
    canLoad: [AdminGuard],
    loadChildren: 'src/app/admin/modules/permission-management/permission-management.module#PermissionManagementModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
