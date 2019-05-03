import { Directive } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-theme-picker>',
})
export class AppThemePickerDirectiveStub {
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppThemePickerDirectiveStub,
  ]
})
export class AppThemePickerDirectiveStubModule {}
