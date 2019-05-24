import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-off-campus-record-detail>',
})
export class AppOffCampusRecordDetailStub {
  @Input() record: {};
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppOffCampusRecordDetailStub,
  ]
})
export class AppOffCampusRecordDetailStubModule {}
