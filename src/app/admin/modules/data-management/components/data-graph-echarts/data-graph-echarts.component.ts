import { Component, OnInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { StyleManager } from 'src/app/shared/services/style-manager.service';

@Component({
  selector: 'app-data-graph-echarts',
  templateUrl: './data-graph-echarts.component.html',
  styleUrls: ['./data-graph-echarts.component.css']
})
export class DataGraphEchartsComponent implements OnInit {

  @Input() set option(val: EChartOption) {
    this.chartOption = val;
    this.chartOption.color = this.styleManager.getAllColors();
    if (val.yAxis) {
      this.componentHeight = Math.max(400, (val.yAxis as echarts.EChartOption.SeriesBar).data.length * 40);
    }
    if (this.echartsInstance) {
      this.echartsInstance.setOption(val);
    }
  }

  componentHeight = 400;
  chartOption: EChartOption = {};
  private echartsInstance: echarts.ECharts;

  onChartInit(ec: echarts.ECharts) {
    this.echartsInstance = ec;
    this.echartsInstance.setOption(this.chartOption);
  }

  constructor(
    private readonly styleManager: StyleManager,
  ) { }

  ngOnInit() {
  }

}
