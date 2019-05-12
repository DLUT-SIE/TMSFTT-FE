import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartOption } from 'echarts';
import { StatisticsService } from '../../services/statistics.service';
import { Subject } from 'rxjs';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-summary-analysis',
  templateUrl: './summary-analysis.component.html',
  styleUrls: ['./summary-analysis.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryAnalysisComponent implements OnInit {
  isLoadingResults = true;
  programsStatistics: {
    timestamp: string,
    data: Array<{
      name: string,
      value: number,
    }>,
    programs: string[],
  };
  eventsStatistics: {
    timestamp: string,
    num_enrolled_events: number,
    num_completed_events: number,
    num_events_as_expert: number,
  };
  recordsStatistics: {
    timestamp: string,
    num_campus_records: number,
    num_off_campus_records: number,
    campus_records_ratio: string,
    off_campus_records_ratio: string,
  };
  competitionAwardInfo: {
    timestamp: string,
    data: {
      competition: string,
      level: string,
      award: string,
    },
  };
  monthlyAddedRecords: {
    timestamp: string,
    months: string[],
    campus_data: number[],
    off_campus_data: number[],
  };
  rankingInDepartment: {
    timestamp: string;
    ranking: string,
  };
  rankingInSchool: {
    timestamp: string,
    ranking: string,
  };

  programsPieChart: echarts.ECharts;
  programsPieChartOption: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      data: [],
    },
    series: [
      {
        name: '培训项目',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: [],
        itemStyle: {
          normal: {},
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    toolbox: {
        feature: {
            saveAsImage: {
              name: '参与不同培训项目情况'
            }
        }
    },
  };

  monthlyAddedRecordsBarChart: echarts.ECharts;
  monthlyAddedRecordsBarChartOption: EChartOption = {
    legend: {
      data: ['校内培训', '校外培训'],
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
        type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
        {
          type: 'bar',
          name: '校内培训',
          stack: '培训记录',
          data: [],
          itemStyle: {
            normal: {},
          },
        },
        {
          type: 'bar',
          name: '校外培训',
          stack: '培训记录',
          data: [],
          itemStyle: {
            normal: {},
          },
        },
    ],
    toolbox: {
        feature: {
            saveAsImage: {
              name: '个人月度培训记录新增情况',
            }
        }
    },
  };

  private readonly destroyed = new Subject<void>();

  constructor(
    private readonly statistics: StatisticsService,
    private readonly changeDetection: ChangeDetectorRef,
    private readonly styleManager: StyleManager,
  ) { }

  ngOnInit() {
    this.styleManager.themeChanged.pipe(
      takeUntil(this.destroyed),
    ).subscribe(() => {
      this.updateProgramsPieChart();
      this.updateMonthlyAddedRecordsBarChart();
    });

    this.statistics.getPersonalSummary().subscribe(data => {
      this.programsStatistics = data['programs_statistics'];
      this.eventsStatistics = data['events_statistics'];
      this.recordsStatistics = data['records_statistics'];
      this.competitionAwardInfo = data['competition_award_info'];
      this.monthlyAddedRecords = data['monthly_added_records'];
      this.rankingInDepartment = data['ranking_in_department'];
      this.rankingInSchool = data['ranking_in_school'];
      (this.programsPieChartOption.legend as {data: string[]}).data = this.programsStatistics.programs;
      (this.programsPieChartOption.series[0] as {data: Array<{}>}).data = this.programsStatistics.data;
      const barChartOption = this.monthlyAddedRecordsBarChartOption;
      (barChartOption.xAxis as {data: string[]}).data = this.monthlyAddedRecords.months;
      (barChartOption.series[0] as {data: Array<{}>}).data = this.monthlyAddedRecords.campus_data;
      (barChartOption.series[1] as {data: Array<{}>}).data = this.monthlyAddedRecords.off_campus_data;
      this.updateProgramsPieChart();
      this.updateMonthlyAddedRecordsBarChart();
      this.isLoadingResults = false;
      this.changeDetection.detectChanges();
    });
  }

  updateProgramsPieChart() {
    const colors = this.styleManager.getAllColors();
    this.programsPieChartOption.color = colors;
    /* istanbul ignore else */
    if (this.programsPieChart) {
      this.programsPieChart.setOption(this.programsPieChartOption);
    }
  }

  updateMonthlyAddedRecordsBarChart() {
    const colors = this.styleManager.getAllColors();
    const series = this.monthlyAddedRecordsBarChartOption.series;
    for (let i = 0; i < series.length; i++) {
      (series[i] as EChartOption.SeriesBar).itemStyle.normal.color = colors[i % colors.length];
    }
    if (this.monthlyAddedRecordsBarChart) {
      this.monthlyAddedRecordsBarChart.setOption(this.monthlyAddedRecordsBarChartOption);
    }
  }

}
