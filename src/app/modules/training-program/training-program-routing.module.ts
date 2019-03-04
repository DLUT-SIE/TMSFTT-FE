import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramsComponent } from './components/programs/programs.component';
import { TrainingProgramComponent } from './training-program.component';

import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'programs',
    component: TrainingProgramComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProgramsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingProgramRoutingModule { }
