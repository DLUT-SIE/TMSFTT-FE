import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrainingProgramRoutingModule } from './training-program-routing.module';
import { ProgramListComponent } from './components/programs/program-list.component';
import { ProgramDetailComponent } from './components/program-detail/program-detail.component';
import { TrainingProgramComponent } from './training-program.component';
import { ProgramFormComponent } from './components/program-form/program-form.component';

@NgModule({
  declarations: [
    ProgramListComponent,
    ProgramDetailComponent,
    TrainingProgramComponent,
    ProgramFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,

    TrainingProgramRoutingModule
  ],
  providers: [
  ]
})
export class TrainingProgramModule { }
