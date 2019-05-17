import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { DataGraphCanvasComponent } from './data-graph-canvas.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { CanvasData } from 'src/app/shared/interfaces/canvas_data';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { Department } from 'src/app/shared/interfaces/department';
import * as echarts from 'echarts';

describe('DataGraphCanvasComponent', () => {
  let getCanvasData$: Subject<CanvasData>;
  let component: DataGraphCanvasComponent;
  let fixture: ComponentFixture<DataGraphCanvasComponent>;
  const canvasData = {
    label: [
        '建筑与艺术学院',
        '机械工程学院',
        '能源与动力学院',
        '材料科学与工程学院',
        '化工学院',
        '外国语学院',
        '马克思主义学院',
        '开发区校区'
    ],
    group_by_data: [{
        seriesNum: 0,
        seriesName: '专任教师',
        data: [22, 35, 28, 10, 20, 14, 47, 8]
      }, {
        seriesNum: 1,
        seriesName: '其他',
        data: [22, 35, 28, 10, 20, 14, 47, 8]
    }]
  };

  beforeEach(async(() => {
    getCanvasData$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [ DataGraphCanvasComponent ],
      imports: [
        NgxEchartsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: CanvasService,
          useValue: {
            getCanvasData: () => getCanvasData$
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    getCanvasData$.next(canvasData);
    expect(component).toBeTruthy();
  });

  it('should get null', () => {
    getCanvasData$.next(canvasData);
    expect(component.graphOptions = null).toBe(null);
  });

  it('should get a pieEchartsInstance and call the setOption function', () => {
    getCanvasData$.next(canvasData);
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.onPieChartInit(chart);
    expect(component.pieEchartsInstance).toBe(chart);
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
  });

  it('should get a barEchartsInstance and call the setOption function', () => {
    getCanvasData$.next(canvasData);
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.onBarChartInit(chart);
    expect(component.barEchartsInstance).toBe(chart);
    expect(component.barEchartsInstance.setOption).toHaveBeenCalled();
  });

  it('should get a pieGraph', () => {
    const graphOptions: DataGraphConfiguration = {
      selectedStatisticsType: 2,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    const setOption = jasmine.createSpy();
    const clear = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    chart.clear = clear;
    component.graphTypeName = '1234';
    component.hidePieGraph = true;
    component.barEchartsInstance = chart;
    component.graphOptions = graphOptions;
    getCanvasData$.next(canvasData);
    expect(component.barEchartsInstance.setOption).toHaveBeenCalled();
    expect(component.pieChartOption).toBe(component.basePieChartOption);
    expect(component.barChartOption).toBe(component.baseCoverageBarChartOption);
    expect((component.pieChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('专任教师占比');
    expect((component.barChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('2019-大连理工大学-1234');
    const graphOptions2: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2015,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    component.hidePieGraph = false;
    component.pieEchartsInstance = chart;
    component.graphOptions = graphOptions2;
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
    expect(component.pieEchartsInstance.clear).toHaveBeenCalled();
    canvasData.group_by_data.push({
      seriesNum: 1,
      seriesName: '其他',
      data: [22, 35, 28, 10, 20, 14, 47, 8]
    });
    getCanvasData$.next(canvasData);
    canvasData.group_by_data.pop();
    getCanvasData$.next(canvasData);
  });

  it('should hide second series pie echarts', () => {
    const setOption = jasmine.createSpy();
    const clear = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    chart.clear = clear;
    component.pieEchartsInstance = chart;
    const graphOptions: DataGraphConfiguration = {
      selectedStatisticsType: 1,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 0
    };
    component.graphOptions = graphOptions;
    getCanvasData$.next(canvasData);
    component.onPieSecondSeriesDisplay();
    expect(component.seriesData.length).toEqual(1);
    expect(component.pieEchartsInstance.clear).toHaveBeenCalled();
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
    component.onPieSecondSeriesDisplay();
    expect(component.seriesData.length).toEqual(2);
    expect(component.pieEchartsInstance.clear).toHaveBeenCalled();
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
  });
});
