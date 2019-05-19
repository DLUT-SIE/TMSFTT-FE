import { Component, OnInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-data-graph-echarts',
  templateUrl: './data-graph-echarts.component.html',
  styleUrls: ['./data-graph-echarts.component.css']
})
export class DataGraphEchartsComponent implements OnInit {

  @Input() set option(val: EChartOption) {
    this.chartOption = val;
    if (this.echartsInstance) {
      this.echartsInstance.setOption(val);
    }
  }

  chartOption: EChartOption = {};
  private echartsInstance: echarts.ECharts;

  onChartInit(ec: echarts.ECharts) {
    this.echartsInstance = ec;
    this.echartsInstance.setOption(this.chartOption);
  }

  constructor() { }

  ngOnInit() {
  }

}
