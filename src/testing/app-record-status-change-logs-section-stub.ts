import { Directive, Input } from '@angular/core';
import { Record } from 'src/app/shared/interfaces/record';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-record-status-change-logs-section>',
})
export class AppRecordStatusChangeLogsSectionStub {
  @Input() record: Record;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
      AppRecordStatusChangeLogsSectionStub,
  ]
})
export class AppRecordStatusChangeLogsSectionStubModule {}
