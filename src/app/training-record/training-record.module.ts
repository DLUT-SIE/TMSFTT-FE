import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TrainingRecordRoutingModule } from './training-record-routing.module';
import { EntryModeComponent } from './entry-mode/entry-mode.component';
import { TrainingRecordComponent } from './training-record/training-record.component';
import { RecordFormComponent } from './record-form/record-form.component';
import { BatchSubmitComponent } from './batch-submit/batch-submit.component';

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
    MatCardModule,
    TrainingRecordRoutingModule
  ],
  bootstrap: [TrainingRecordComponent],
})
export class TrainingRecordModule { }
