import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-data-graph-echarts>',
})
export class AppDataGraphEchartsStub {
    @Input() option?: EChartOption;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { EChartOption } from 'echarts';

@NgModule({
  declarations: [
    AppDataGraphEchartsStub,
  ]
})
export class AppDataGraphEchartsStubModule {}
