import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'training-record',
            loadChildren: 'src/app/training-record/training-record.module#TrainingRecordModule',
          },
          {
            path: 'training-event',
            loadChildren: 'src/app/training-event/training-event.module#TrainingEventModule',
          },
          {
            path: 'statistics',
            loadChildren: 'src/app/statistics/statistics.module#StatisticsModule',
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
export class UserRoutingModule { }
