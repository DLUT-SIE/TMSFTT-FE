import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-event-detail>',
})
export class AppEventDetailStub {
    @Input() eventDetailType?: EventDetailType;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { EventDetailType } from 'src/app/shared/enums/event-detaile-type.enum';

@NgModule({
  declarations: [
    AppEventDetailStub,
  ]
})
export class AppEventDetailStubModule {}
