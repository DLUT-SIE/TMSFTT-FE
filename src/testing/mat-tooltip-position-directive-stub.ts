import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '[matTooltipPosition]',
})
export class MatTooltipPositionDirectiveStub {
  @Input('matTooltipPosition') position: string;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    MatTooltipPositionDirectiveStub,
  ]
})
export class MatTooltipStubsModule {}
