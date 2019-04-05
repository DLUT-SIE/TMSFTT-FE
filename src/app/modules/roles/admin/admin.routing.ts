import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminGuard } from 'src/app/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'permission-management',
            // TODO(youchen): Only super-admin has access to this module.
            canLoad: [AdminGuard],
            loadChildren: 'src/app/modules/permission-management/permission-management.module#PermissionManagementModule',
          },
          {
            path: 'data-management',
            loadChildren: 'src/app/modules/data-management/data-management.module#DataManagementModule',
          },
          {
            path: 'event-management',
            loadChildren: 'src/app/modules/training-program/training-program.module#TrainingProgramModule',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
