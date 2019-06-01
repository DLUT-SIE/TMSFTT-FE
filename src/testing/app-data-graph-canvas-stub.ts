import { Directive, Input } from '@angular/core';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-data-graph-canvas>',
})
export class AppDataGraphCanvasStub {
    @Input() graphTypeName: string;
    @Input() isCoverageGraph: boolean;
    @Input() graphOptions: DataGraphConfiguration; 
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppDataGraphCanvasStub,
  ]
})
export class AppSharedCampusEventDetailStubModule {}
