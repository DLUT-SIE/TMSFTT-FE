import { Directive, Input, Output, EventEmitter } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
/* tslint:disable:no-any */
@Directive({
  selector: '<ckeditor>',
})
export class CKEditorDirectiveStub {
  @Input() editor: any;
  @Input() config: any;
  @Input() data: any;
  @Output() ready = new EventEmitter<{}>();
  @Output() change = new EventEmitter<{}>();
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    CKEditorDirectiveStub,
  ]
})
export class CKEditorDirectiveStubModule {}
