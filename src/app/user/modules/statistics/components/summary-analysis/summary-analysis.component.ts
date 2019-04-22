import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-summary-analysis',
  templateUrl: './summary-analysis.component.html',
  styleUrls: ['./summary-analysis.component.css']
})
export class SummaryAnalysisComponent implements OnInit {
  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      silent: false,
      splitLine: {
        show: false
      },
    },
    tooltip: {},
    yAxis: {},
    series: [{
      data: [3, 8, 6, 11, 2, 0, 5, 3, 2, 1, 1, 3],
      type: 'bar',
      itemStyle: {
        normal: {
          color: 'rgb(84,170,88)',
        },
      },
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: /* istanbul ignore next */ (idx: number) => {
      return idx * 50;
    },
  };

  constructor() { }

  ngOnInit() {
  }

}
