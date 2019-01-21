import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { TrainingRecordRoutingModule } from './training-record-routing.module';
import { EntryModeComponent } from './entry-mode/entry-mode.component';
import { TrainingRecordComponent } from './training-record/training-record.component';
import { RecordFormComponent } from './record-form/record-form.component';
import { BatchSubmitComponent } from './batch-submit/batch-submit.component';
import { ServicesModule } from 'src/app/services/services.module';

@NgModule({
  declarations: [
    EntryModeComponent,
    TrainingRecordComponent,
    RecordFormComponent,
    BatchSubmitComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,

    ServicesModule,
    TrainingRecordRoutingModule
  ],
  bootstrap: [TrainingRecordComponent],
})
export class TrainingRecordModule { }
