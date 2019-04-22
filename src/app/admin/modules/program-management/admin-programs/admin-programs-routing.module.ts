import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProgramListComponent } from './components/admin-program-list/admin-program-list.component';
import { AdminProgramFormComponent } from './components/admin-program-form/admin-program-form.component';
import { AdminProgramDetailComponent } from './components/admin-program-detail/admin-program-detail.component';
import { AdminProgramsComponent } from './admin-programs.component';
import { ProgramDetailResolverService } from './services/program-detail-resolver.service';

const routes: Routes = [
  {
    path: 'programs',
    component: AdminProgramsComponent,
    children: [
      {
        path: 'form',
        component: AdminProgramFormComponent,
      },
      {
        path: ':id',
        resolve: {
          program: ProgramDetailResolverService,
        },
        component: AdminProgramDetailComponent,
      },
      {
        path: '',
        component: AdminProgramListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProgramsRoutingModule { }
