import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ECharts, EChartOption } from 'echarts';

import { DashboardComponent } from './dashboard.component';
import { MatTooltipPositionDirectiveStub } from 'src/testing/mat-tooltip-position-directive-stub';
import { EChartsDirectiveStub } from 'src/testing/echarts-directive-stub';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { SiteTheme } from 'src/app/shared/interfaces/theme';
import { Subject } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let themeChanged: Subject<SiteTheme>;
  let getColor: jasmine.Spy;

  beforeEach(async(() => {
    themeChanged = new Subject();
    getColor = jasmine.createSpy();
    TestBed.configureTestingModule({
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
        }
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
    component.recordsGrowthChart = chart;
    const color = 'rgb(1, 2, 3)';
    getColor.and.returnValue(color);
    themeChanged.next({primary: 'primary', accent: 'accent', name: 'name'});

    const newColor = (component.chartOption.series[0] as EChartOption.SeriesBar).itemStyle.normal.color;
    expect(newColor).toEqual(color);
    expect(setOption).toHaveBeenCalledWith(component.chartOption);
  });

  it('should updateChart when init.', () => {
    const chart = {} as ECharts;
    const updateChart = spyOn(component, 'updateChart');

    component.chartInit(chart);

    expect(updateChart).toHaveBeenCalled();
  });
});
