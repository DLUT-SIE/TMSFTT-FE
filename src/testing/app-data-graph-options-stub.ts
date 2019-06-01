import { Directive, Output, EventEmitter } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-data-graph-options>',
})
export class AppDataGraphOptionsStub {
    @Output() getOptions = new EventEmitter();
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppDataGraphOptionsStub,
  ]
})
export class AppSharedCampusEventDetailStubModule {}
