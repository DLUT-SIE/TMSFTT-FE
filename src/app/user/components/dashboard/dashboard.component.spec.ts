import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ECharts, EChartOption } from 'echarts';

import { DashboardComponent } from './dashboard.component';
import { MatTooltipPositionDirectiveStub } from 'src/testing/mat-tooltip-position-directive-stub';
import { EChartsDirectiveStub } from 'src/testing/echarts-directive-stub';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { SiteTheme } from 'src/app/shared/interfaces/theme';
import { Subject } from 'rxjs';
import { StatisticsService } from 'src/app/shared/services/statistics.service';
import { MatCardModule, MatProgressBarModule } from '@angular/material';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let themeChanged: Subject<SiteTheme>;
  let getColor: jasmine.Spy;
  let getSchoolalSummary$: Subject<{}>;

  beforeEach(async(() => {
    themeChanged = new Subject();
    getColor = jasmine.createSpy();
    getSchoolalSummary$ = new Subject();
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatProgressBarModule,
      ],
      declarations: [
        DashboardComponent,
        MatTooltipPositionDirectiveStub,
        EChartsDirectiveStub,
      ],
      providers: [
        {
          provide: StyleManager,
          useValue: {
            themeChanged,
            getColor,
          }
        },
        {
          provide: StatisticsService,
          useValue: {
            getSchoolSummary: () => getSchoolalSummary$,
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update series when theme changed', () => {
    const setOption = jasmine.createSpy();
    const chart = {} as ECharts;
    chart.setOption = setOption;
    component.monthlyAddedRecordsChart = chart;
    const color = 'rgb(1, 2, 3)';
    getColor.and.returnValue(color);
    themeChanged.next({primary: 'primary', accent: 'accent', name: 'name'});

    const newColor = (component.monthlyAddedRecordsChartOption.series[0] as EChartOption.SeriesBar).itemStyle.normal.color;
    expect(newColor).toEqual(color);
    expect(setOption).toHaveBeenCalledWith(component.monthlyAddedRecordsChartOption);
  });

  it('should updateChart when init.', () => {
    const chart = {} as ECharts;
    const updateChart = spyOn(component, 'updateChart');

    component.chartInit(chart);

    expect(updateChart).toHaveBeenCalled();
  });

  it('should set error', () => {
    getSchoolalSummary$.error({});
    expect(component.isError).toBeTruthy();
    expect(component.isLoadingResults).toBeFalsy();
  });

  it('should filter records', () => {
    const length = 20;
    expect(component.filteredDepartmentRecords.length).toBe(0);

    component.departmentRecords = {
      timestamp: '',
      data: Array(length).fill(0).map(() => {
        return {department: '', num_users: 10, num_records: 10};
      }),
    };

    expect(component.filteredDepartmentRecords.length).toBe(8);

    component.showAll = true;
    expect(component.filteredDepartmentRecords.length).toBe(length);
  });

  it('should set fields for school summary', () => {
    const updateChart = spyOn(component, 'updateChart');

    const data = {
      events_statistics: {
        timestamp: '2019-05-12T08:07:16.088408Z',
        available_to_enroll: 10,
      },
      records_statistics: {
        timestamp: '2019-05-12T08:07:16.088408Z',
        num_records: 10,
        num_records_added_in_current_month: 20,
        num_average_records: 2,
      },
      department_records_statistics: {
        timestamp: '2019-05-12T08:07:16.088408Z',
        data: [{department: 'a', num_users: 10, num_records: 10}],
      },
      monthly_added_records_statistics: {
        timestamp: '2019-05-12T08:07:16.088408Z',
        months: ['a', 'b', 'c'],
        records: [1, 2, 3],
      }
    };

    getSchoolalSummary$.next(data);

    expect(component.eventsStatistics).toEqual(data.events_statistics);
    expect(component.recordsStatistics).toEqual(data.records_statistics);
    expect(component.departmentRecords).toEqual(data.department_records_statistics);
    expect(component.monthlyAddedRecords).toEqual(data.monthly_added_records_statistics);
    const option = component.monthlyAddedRecordsChartOption;
    expect((option.xAxis as {data: string[]}).data).toEqual(data.monthly_added_records_statistics.months);
    expect((option.series[0] as {data: Array<{}>}).data).toEqual(data.monthly_added_records_statistics.records);
    expect(updateChart).toHaveBeenCalled();
    expect(component.isLoadingResults).toBeFalsy();
  });
});
