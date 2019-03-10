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

import { TrainingRecordRoutingModule } from './training-record-routing.module';
import { EntryModeComponent } from './components/entry-mode/entry-mode.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { TrainingRecordComponent } from './training-record.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { RecordDetailComponent } from './components/record-detail/record-detail.component';
import { RecordStatusDisplayPipe } from 'src/app/pipes/record-status.pipe';

@NgModule({
  declarations: [
    TrainingRecordComponent,
    EntryModeComponent,
    RecordFormComponent,
    BatchSubmitComponent,
    RecordListComponent,

    RecordStatusDisplayPipe,

    RecordDetailComponent,
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

    TrainingRecordRoutingModule
  ],
})
export class TrainingRecordModule { }
