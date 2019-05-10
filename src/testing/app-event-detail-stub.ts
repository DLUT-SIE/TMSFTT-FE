import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-event-detail>',
})
export class AppEventDetailStub {
    @Input() eventDetailType?: EventDetailType;
    @Input() event?: CampusEvent;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { EventDetailType } from 'src/app/shared/enums/event-detaile-type.enum';
import { CampusEvent } from 'src/app/shared/interfaces/event';

@NgModule({
  declarations: [
    AppEventDetailStub,
  ]
})
export class AppEventDetailStubModule {}
