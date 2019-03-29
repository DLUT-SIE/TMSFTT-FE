import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AdminGuard } from 'src/app/guards/admin.guard';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          {
            path: 'permission-management',
            canLoad: [AdminGuard],
            loadChildren: 'src/app/modules/permission-management/permission-management.module#PermissionManagementModule',
          },
          {
            path: 'event-management',
            canLoad: [AdminGuard],
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
