import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';

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
            loadChildren: 'src/app/permission-management/permission-management.module#PermissionManagementModule',
          },
          {
            path: 'data-management',
            loadChildren: 'src/app/data-management/data-management.module#DataManagementModule',
          },
          {
            path: 'event-management',
            children: [
              {
                path: 'programs',
                loadChildren: 'src/app/training-program/training-program.module#TrainingProgramModule',
                children: [
                  {
                    path: 'events',
                    loadChildren: 'src/app/training-event/training-event.module#AdminEventModule',
                  },
                  {
                    path: '',
                    loadChildren: 'src/app/training-program/training-program.module#TrainingProgramModule'
                  }
                ]
              }
            ],
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
