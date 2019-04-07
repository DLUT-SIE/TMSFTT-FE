import { NgModule } from '@angular/core';

import { TrainingProgramRoutingModule } from './training-program-routing.module';
import { ProgramListComponent } from './components/programs/program-list.component';
import { ProgramDetailComponent } from './components/program-detail/program-detail.component';
import { TrainingProgramComponent } from './training-program.component';
import { ProgramFormComponent } from './components/program-form/program-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ProgramListComponent,
    ProgramDetailComponent,
    TrainingProgramComponent,
    ProgramFormComponent,
  ],
  imports: [
    TrainingProgramRoutingModule,
    SharedModule,

  ],
  providers: [
  ]
})
export class TrainingProgramModule { }
