import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TrainingEventComponent } from './training-event.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'events',
        children: [
          {
            path: '',
            component: CampusEventListComponent,
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
