import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAnalysisComponent } from './summary-analysis.component';
import { EChartsDirectiveStub } from 'src/testing/echarts-directive-stub';
import { MatCardModule, MatProgressBarModule } from '@angular/material';
import { StatisticsService } from '../../services/statistics.service';
import { Subject } from 'rxjs';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { EChartOption } from 'echarts';

describe('SummaryAnalysisComponent', () => {
  let component: SummaryAnalysisComponent;
  let fixture: ComponentFixture<SummaryAnalysisComponent>;
  let themeChanged: Subject<{}>;
  let getPersonalSummary$: Subject<{}>;
  const colors = ['black', 'red', 'yello'];

  beforeEach(async(() => {
    themeChanged = new Subject();
    getPersonalSummary$ = new Subject();
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatProgressBarModule,
      ],
      declarations: [
        SummaryAnalysisComponent,
        EChartsDirectiveStub,
      ],
      providers: [
        {
          provide: StatisticsService,
          useValue: {
            getPersonalSummary: () => getPersonalSummary$,
          },
        },
        {
          provide: StyleManager,
          useValue: {
            themeChanged,
            getAllColors: () => colors,
          },
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isLoadingResults).toBeTruthy();
  });

  it('should change theme', () => {
    const mockUpdatePieChart = spyOn(component, 'updateProgramsPieChart');
    const mockUpdateBarChart = spyOn(component, 'updateMonthlyAddedRecordsBarChart');

    themeChanged.next();
    expect(mockUpdatePieChart).toHaveBeenCalled();
    expect(mockUpdateBarChart).toHaveBeenCalled();
  });

  it('should set fields for personal summary', () => {
    const mockUpdatePieChart = spyOn(component, 'updateProgramsPieChart');
    const mockUpdateBarChart = spyOn(component, 'updateMonthlyAddedRecordsBarChart');

    const data = {
      programs_statistics: {
        timestamp: '2019-05-12T08:07:16.088408Z',
        data: [
          {
            name: '学校青年教师讲课竞赛',
            value: 3
          },
          {
            name: '课程技术服务',
            value: 2
          },
          {
            name: '名师讲坛',
            value: 1
          },
        ],
        programs: [
          '学校青年教师讲课竞赛',
          '课程技术服务',
          '名师讲坛',
        ]
      },
      events_statistics: {
        timestamp: '2019-05-12T08:07:16.138715Z',
        num_enrolled_events: 8,
        num_completed_events: 8,
        num_events_as_expert: 0
      },
      records_statistics: {
        timestamp: '2019-05-12T08:07:16.168137Z',
        num_campus_records: 8,
        num_off_campus_records: 0,
        campus_records_ratio: '100%',
        off_campus_records_ratio: '0%'
      },
      competition_award_info: {
        timestamp: '2019-05-12T08:07:16.204639Z',
        data: {
          competition: '授课竞赛',
          level: '省级',
          award: '二等奖'
        }
      },
      monthly_added_records: {
        timestamp: '2019-05-12T08:07:16.226354Z',
        months: [
          '2018年12月',
          '2019年01月',
          '2019年02月',
        ],
        campus_data: [
          5,
          8,
          9,
        ],
        off_campus_data: [
          9,
          6,
          5,
        ]
      },
      ranking_in_department: {
        timestamp: '2019-05-12T08:07:16.257455Z',
        ranking: '前 20%'
      },
      ranking_in_school: {
        timestamp: '2019-05-12T08:07:16.297161Z',
        ranking: '前 5%'
      }
    };

    getPersonalSummary$.next(data);

    expect(component.programsStatistics).toEqual(data.programs_statistics);
    expect(component.eventsStatistics).toEqual(data.events_statistics);
    expect(component.recordsStatistics).toEqual(data.records_statistics);
    expect(component.competitionAwardInfo).toEqual(data.competition_award_info);
    expect(component.monthlyAddedRecords).toEqual(data.monthly_added_records);
    expect(component.rankingInDepartment).toEqual(data.ranking_in_department);
    expect(component.rankingInSchool).toEqual(data.ranking_in_school);
    const pieChartOption = component.programsPieChartOption;
    expect((pieChartOption.legend as {data: string[]}).data).toEqual(
      component.programsStatistics.programs);
    expect((pieChartOption.series[0] as {data: Array<{}>}).data).toEqual(
      component.programsStatistics.data);
    const barChartOption = component.monthlyAddedRecordsBarChartOption;
    expect((barChartOption.xAxis as {data: string[]}).data).toEqual(
      component.monthlyAddedRecords.months);
    expect((barChartOption.series[0] as {data: Array<{}>}).data).toEqual(
      component.monthlyAddedRecords.campus_data);
    expect((barChartOption.series[1] as {data: Array<{}>}).data).toEqual(
      component.monthlyAddedRecords.off_campus_data);

    expect(mockUpdatePieChart).toHaveBeenCalled();
    expect(mockUpdateBarChart).toHaveBeenCalled();
    expect(component.isLoadingResults).toBeFalsy();
  });

  /* tslint:disable:no-any */
  it('should update pie chart', () => {
    const setOption = jasmine.createSpy();
    component.programsPieChart = {
      setOption
    } as any;

    component.updateProgramsPieChart();

    expect(component.programsPieChartOption.color).toEqual(colors);
    expect(setOption).toHaveBeenCalledWith(component.programsPieChartOption);
  });

  /* tslint:disable:no-any */
  it('should update pie chart', () => {
    const setOption = jasmine.createSpy();
    component.monthlyAddedRecordsBarChart = {
      setOption
    } as any;

    component.updateMonthlyAddedRecordsBarChart();

    const option = component.monthlyAddedRecordsBarChartOption;
    const series = option.series;
    for (let i = 0; i < series.length; i++) {
      expect((series[i] as EChartOption.SeriesBar).itemStyle.normal.color).toEqual(
        colors[i % colors.length]);
    }
    expect(setOption).toHaveBeenCalledWith(option);
  });


});
