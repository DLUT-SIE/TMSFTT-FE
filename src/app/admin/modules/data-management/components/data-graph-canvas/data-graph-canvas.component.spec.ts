import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { DataGraphCanvasComponent } from './data-graph-canvas.component';
import { AppDataGraphEchartsStub } from 'src/testing/app-data-graph-echarts-stub';
import { NgxEchartsModule } from 'ngx-echarts';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { CanvasData } from 'src/app/shared/interfaces/canvas-data';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { Department } from 'src/app/shared/interfaces/department';
import { Program } from 'src/app/shared/interfaces/programs-option';
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
      }]
  };

  beforeEach(async(() => {
    getCanvasData$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [
        DataGraphCanvasComponent,
        AppDataGraphEchartsStub
      ],
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

  it('should get a pieGraph', () => {
    const graphOptions: DataGraphConfiguration = {
      selectedStatisticsType: 2,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 2,
      selectedProgram: {id: 1, name: '名师讲堂'} as Program
    };
    component.graphTypeName = '1234';
    component.isCoverageGraph = true;
    component.graphOptions = graphOptions;
    getCanvasData$.next(canvasData);
    expect((component.pieChartOptionList[0].title as echarts.EChartTitleOption[])[0].text).toBe('专任教师占比');
    expect((component.barChartOptionList[0].title as echarts.EChartTitleOption[])[0].text).toBe('名师讲堂-2019-全校-1234');
    const graphOptionsUndefined: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: undefined,
      selectedEndYear: undefined,
      selectedGroupType: 2,
      selectedProgram: {id: 0, name: '全部项目'} as Program
    };
    component.isCoverageGraph = false;
    component.graphOptions = graphOptionsUndefined;
    getCanvasData$.next(canvasData);
    expect((component.barChartOptionList[0].title as echarts.EChartTitleOption[])[0].text).toBe('大连理工大学-1234-专任教师');
    const graphOptions2: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2015,
      selectedEndYear: 2019,
      selectedGroupType: 2
    };
    component.isCoverageGraph = false;
    component.graphOptions = graphOptions2;
    canvasData.group_by_data.push({
      seriesNum: 1,
      seriesName: '其他',
      data: [0, 0, 0, 0, 0, 0, 0, 0]
    });
    getCanvasData$.next(canvasData);
    expect(component.pieChartOptionList.length).toEqual(1);
    component.isCoverageGraph = true;
    const graphOptions3: DataGraphConfiguration = {
      selectedStatisticsType: 2,
      selectedDepartment: {id: 1, name: '大连理工大学'} as Department,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedGroupType: 2,
      selectedProgram: {id: 0, name: '全部项目'} as Program
    };
    component.graphOptions = graphOptions3;
    getCanvasData$.next(canvasData);
    expect((component.barChartOptionList[0].title as echarts.EChartTitleOption[])[0].text).toBe('大连理工大学全部项目-2019-全校-1234');
  });
});
