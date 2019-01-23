import { Directive } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<mat-form-field>',
})
export class MatFormFieldDirectiveStub {
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    MatFormFieldDirectiveStub,
  ]
})
export class MatTooltipStubsModule {}
