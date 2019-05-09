import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphCanvasComponent } from './data-graph-canvas.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import * as echarts from 'echarts';

describe('DataGraphCanvasComponent', () => {
  let component: DataGraphCanvasComponent;
  let fixture: ComponentFixture<DataGraphCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGraphCanvasComponent ],
      imports: [ NgxEchartsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get null', () => {
    expect(component.graphParam = null).toBe(null);
  });

  it('should get a pieEchartsInstance and call the setOption function', () => {
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.onPieChartInit(chart);
    expect(component.pieEchartsInstance).toBe(chart);
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
  });

  it('should get a barEchartsInstance and call the setOption function', () => {
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.onBarChartInit(chart);
    expect(component.barEchartsInstance).toBe(chart);
    expect(component.barEchartsInstance.setOption).toHaveBeenCalled();
  });

  it('should get a pieGraph', () => {
    const graphParam: DataGraphConfiguration = {
      selectedStatisticsType: 2,
      selectedDepartment: 0,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.graphTypeName = '1234';
    component.hidePieGraph = true;
    component.barEchartsInstance = chart;
    component.selectedDepartmentName = '全校';
    component.graphParam = graphParam;
    expect(component.barEchartsInstance.setOption).toHaveBeenCalled();
    expect(component.pieChartOption).toBe(component.basePieChartOption);
    expect(component.barChartOption).toBe(component.baseCoverageBarChartOption);
    expect((component.pieChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('2019-全校-1234-专任教师');
    expect((component.pieChartOption.title as echarts.EChartTitleOption[])[1].text).toBe('2019-全校-1234-其他');
    expect((component.barChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('2019-全校-1234');
    const graphParam2: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedDepartment: 0,
      selectedStartYear: 2015,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    component.hidePieGraph = false;
    component.pieEchartsInstance = chart;
    component.graphParam = graphParam2;
    expect(component.pieEchartsInstance.setOption).toHaveBeenCalled();
    expect(component.barChartOption).toBe(component.baseDoubleBarChartOption);
    expect((component.pieChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('2015~2019-全校-1234-专任教师');
    expect((component.pieChartOption.title as echarts.EChartTitleOption[])[1].text).toBe('2015~2019-全校-1234-其他');
    expect((component.barChartOption.title as echarts.EChartTitleOption[])[0].text).toBe('2015~2019-全校-1234');
  });
});
