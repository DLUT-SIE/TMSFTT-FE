import { NgModule } from '@angular/core';

import { TrainingRecordRoutingModule } from './training-record-routing.module';
import { EntryModeComponent } from './components/entry-mode/entry-mode.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { TrainingRecordComponent } from './training-record.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { RecordDetailComponent } from './components/record-detail/record-detail.component';
import { OffCampusEventRecordListComponent } from './components/off-campus-event-record-list/off-campus-event-record-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';

@NgModule({
  declarations: [
    TrainingRecordComponent,
    EntryModeComponent,
    RecordFormComponent,
    RecordListComponent,
    RecordDetailComponent,
    OffCampusEventRecordListComponent,
    FeedbackDialogComponent,

  ],
  imports: [
    TrainingRecordRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    FeedbackDialogComponent,
  ]
})
export class TrainingRecordModule { }
