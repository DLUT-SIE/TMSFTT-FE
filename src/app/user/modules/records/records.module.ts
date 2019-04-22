import { NgModule } from '@angular/core';

import { RecordsRoutingModule } from './records-routing.module';
import { EntryModeComponent } from './components/entry-mode/entry-mode.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { RecordsComponent } from './records.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { RecordDetailComponent } from './components/record-detail/record-detail.component';
import { OffCampusEventRecordListComponent } from './components/off-campus-event-record-list/off-campus-event-record-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';

@NgModule({
  declarations: [
    RecordsComponent,
    EntryModeComponent,
    RecordFormComponent,
    RecordListComponent,
    RecordDetailComponent,
    OffCampusEventRecordListComponent,
    FeedbackDialogComponent,
  ],
  imports: [
    RecordsRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    FeedbackDialogComponent,
  ]
})
export class RecordsModule { }
