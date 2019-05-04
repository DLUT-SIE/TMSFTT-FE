import { Component, OnInit, OnDestroy } from '@angular/core';
import { EChartOption, ECharts } from 'echarts';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
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
    animationDelayUpdate: /* istanbul ignore next */ (idx: number) => {
      return idx * 50;
    },
  };

  recordsGrowthChart: ECharts;
  private readonly destroyed = new Subject<void>();

  constructor(
    private readonly styleManager: StyleManager,
  ) { }

  ngOnInit() {
    this.styleManager.themeChanged.pipe(
      takeUntil(this.destroyed),
    ).subscribe(() => {
      this.updateChart();
    });
  }

  updateChart() {
    if (!this.recordsGrowthChart) {
      /* istanbul ignore next */
      return;
    }
    const series = this.chartOption.series;
    for (const s of series) {
      (s as EChartOption.SeriesBar).itemStyle.normal.color = this.styleManager.accentColor;
    }
    this.recordsGrowthChart.setOption(this.chartOption);
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  chartInit(chart: ECharts) {
    this.recordsGrowthChart = chart;
    this.updateChart();
  }
}
