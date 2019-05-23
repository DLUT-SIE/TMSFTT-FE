import { Component, OnInit, OnDestroy } from '@angular/core';
import { EChartOption, ECharts } from 'echarts';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StatisticsService } from 'src/app/shared/services/statistics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  eventsStatistics: {
    timestamp: string,
    available_to_enroll: number,
  };
  recordsStatistics: {
    timestamp: string,
    num_records: number,
    num_records_added_in_current_month: number,
    num_average_records: number,
  };
  departmentRecords: {
    timestamp: string,
    data: Array<{
      department: string,
      num_users: number,
      num_records: number,
    }>,
  };
  monthlyAddedRecords: {
    timestamp: string,
    months: string[],
    records: number[],
  };
  monthlyAddedRecordsChartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: [],
      silent: false,
      splitLine: {
        show: false
      },
    },
    tooltip: {},
    yAxis: {},
    series: [{
      data: [],
      type: 'bar',
      itemStyle: {
        normal: {
          color: 'rgb(84,170,88)',
        },
      },
      label: {
        show: true,
        position: 'top'
      }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: /* istanbul ignore next */ (idx: number) => {
      return idx * 50;
    },
  };
  isLoadingResults = true;
  isError = false;
  showAll = false;

  monthlyAddedRecordsChart: ECharts;
  private readonly destroyed = new Subject<void>();

  constructor(
    private readonly styleManager: StyleManager,
    private readonly statistics: StatisticsService,
  ) { }

  ngOnInit() {
    this.styleManager.themeChanged.pipe(
      takeUntil(this.destroyed),
    ).subscribe(() => {
      this.updateChart();
    });

    this.statistics.getSchoolSummary().subscribe(data => {
      this.eventsStatistics = data['events_statistics'];
      this.recordsStatistics = data['records_statistics'];
      this.departmentRecords = data['department_records_statistics'];
      this.monthlyAddedRecords = data['monthly_added_records_statistics'];
      (this.monthlyAddedRecordsChartOption.xAxis as {data: string[]}).data = this.monthlyAddedRecords.months;
      (this.monthlyAddedRecordsChartOption.series[0] as {data: Array<{}>}).data = this.monthlyAddedRecords.records;
      this.updateChart();
      this.isLoadingResults = false;
    },
    () => {
      this.isError = true;
      this.isLoadingResults = false;
    });
  }

  get filteredDepartmentRecords() {
    if (!this.departmentRecords) {
      return [];
    }
    if (this.showAll) {
      return this.departmentRecords.data;
    }
    return this.departmentRecords.data.slice(0, 8);
  }

  updateChart() {
    if (!this.monthlyAddedRecordsChart) {
      /* istanbul ignore next */
      return;
    }
    const series = this.monthlyAddedRecordsChartOption.series;
    for (const s of series) {
      (s as EChartOption.SeriesBar).itemStyle.normal.color = this.styleManager.getColor('primary');
    }
    this.monthlyAddedRecordsChart.setOption(this.monthlyAddedRecordsChartOption);
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  chartInit(chart: ECharts) {
    this.monthlyAddedRecordsChart = chart;
    this.updateChart();
  }
}
