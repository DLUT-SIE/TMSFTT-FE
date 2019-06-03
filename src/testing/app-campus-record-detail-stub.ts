import { Directive, Input } from '@angular/core';
import { Record } from 'src/app/shared/interfaces/record';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-campus-record-detail>',
})
export class AppCampusRecordDetailStub {
  @Input() record: Record;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppCampusRecordDetailStub,
  ]
})
export class AppCampusRecordDetailStubModule {}
