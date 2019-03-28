import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/guards/auth.guard';
import { RegularUserComponent } from './regular-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: RegularUserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'training-record',
            loadChildren: 'src/app/modules/training-record/training-record.module#TrainingRecordModule',
          },
          {
            path: 'training-program',
            loadChildren: 'src/app/modules/training-program/training-program.module#TrainingProgramModule',
          },
          {
            path: 'training-event',
            loadChildren: 'src/app/modules/training-event/training-event.module#TrainingEventModule',
          },
          {
            path: 'statistics',
            loadChildren: 'src/app/modules/statistics/statistics.module#StatisticsModule',
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularUserRoutingModule { }
