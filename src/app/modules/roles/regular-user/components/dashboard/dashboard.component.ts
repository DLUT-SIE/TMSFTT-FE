import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1333, 1340, 1568, 1622, 1588],
      type: 'bar',
      itemStyle: {
        normal: {
          color: 'rgb(84,170,88)',
        },
      },
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx: number) => {
      return idx * 50;
    },
  };

  constructor() { }

  ngOnInit() { }
}
