import { Directive, Input } from '@angular/core';
import { RecordExportType } from 'src/app/shared/enums/record-export-type.enum';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-shared-record-export>',
})
export class AppSharedRecordExportDirectiveStub {
    @Input() recordExportType?: RecordExportType;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppSharedRecordExportDirectiveStub,
  ]
})
export class AppSharedRecordExportDirectiveStubModule {}
