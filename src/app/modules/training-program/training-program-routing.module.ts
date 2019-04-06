import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramListComponent } from './components/programs/program-list.component';
import { ProgramFormComponent } from './components/program-form/program-form.component';
import { TrainingProgramComponent } from './training-program.component';
import { ProgramDetailComponent } from './components/program-detail/program-detail.component';
import { ProgramDetailResolverService } from './services/program-detail-resolver.service';

import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'programs',
    component: TrainingProgramComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'program-form',
        component: ProgramFormComponent,
      },
      {
        path: ':id',
        resolve: {
          program: ProgramDetailResolverService,
        },
        component: ProgramDetailComponent,
      },
      {
        path: '',
        component: ProgramListComponent,
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingProgramRoutingModule { }
