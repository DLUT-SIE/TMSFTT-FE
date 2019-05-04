import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphCanvasComponent } from './data-graph-canvas.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { StatisticsType } from 'src/app/shared/enums/statistics-type.enum';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

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

  it('should get a pieGraph', () => {
    const graphParam: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedDepartment: '全校',
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    component.graphTypeName = '123';
    component.isPieGraph = true;
    component.graphParam = graphParam;
    expect(component.chartOption).toBe(component.pieChartOption);
  });

  it('should get a double bar graph', () => {
    component.isPieGraph = false;
    component.graphParam = {selectedStatisticsType: StatisticsType.STAFF_STATISTICS} as DataGraphConfiguration;
    expect(component.chartOption).toBe(component.doubleBarChartOption);
  });

  it('should get a bar graph', () => {
    component.isPieGraph = false;
    component.graphParam = {selectedStatisticsType: StatisticsType.TRAINEE_STATISTICS} as DataGraphConfiguration;
    expect(component.chartOption).toBe(component.barChartOption);
  });
});
