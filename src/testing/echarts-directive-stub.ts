import { Directive, Input } from '@angular/core';
import { EChartOption } from 'echarts';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '[echarts]',
})
export class EChartsDirectiveStub {
  @Input() options: EChartOption;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    EChartsDirectiveStub,
  ]
})
export class EChartsDirectiveStubModule {}
