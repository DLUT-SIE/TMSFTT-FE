import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableListComponent } from './components/table-list/table-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TrainingEventComponent } from './training-event.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'table-list',
        children: [
          {
            path: '',
            component: TableListComponent,
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
export class TrainingEventRoutingModule { }
