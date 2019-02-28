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
  MatSnackBarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { TrainingEventRoutingModule } from './training-event-routing.module';
import { TableListComponent } from './components/table-list/table-list.component';
import { TrainingEventComponent } from './training-event.component';

@NgModule({
  declarations: [
    TrainingEventComponent,
    TableListComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,

    TrainingEventRoutingModule
  ],
})
export class TrainingEventModule { }
