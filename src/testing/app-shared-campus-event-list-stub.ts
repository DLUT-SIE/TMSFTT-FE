import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-shared-campus-event-list>',
})
export class AppSharedCampusEventListStub {
    @Input() eventListType?: EventListType;
    @Input() program?: Program;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { EventListType } from 'src/app/shared/enums/event-list-type.enum';
import { Program } from 'src/app/shared/interfaces/program';

@NgModule({
  declarations: [
    AppSharedCampusEventListStub,
  ]
})
export class AppSharedCampusEventListStubModule {}
