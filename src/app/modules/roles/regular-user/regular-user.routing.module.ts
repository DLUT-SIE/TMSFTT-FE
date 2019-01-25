import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingRecordComponent } from 'src/app/modules/training-record/training-record.component';
import { DashboardComponent } from 'src/app/demo/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'training-record',
    component: TrainingRecordComponent,
    children: [
      {
        path: '',
        loadChildren: 'src/app/modules/training-record/training-record.module#TrainingRecordModule',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularUserRoutingModule { }
