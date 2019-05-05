import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-shared-record-list>',
})
export class AppSharedRecordListDirectiveStub {
    @Input() recordListType?: RecordListType;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { RecordListType } from 'src/app/shared/enums/record-list-type.enum';

@NgModule({
  declarations: [
    AppSharedRecordListDirectiveStub,
  ]
})
export class AppSharedRecordListDirectiveStubModule {}
