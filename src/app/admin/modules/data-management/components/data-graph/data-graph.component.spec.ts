import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { DataGraphComponent, timeValidator } from './data-graph.component';
import { DataGraphCanvasComponent } from '../data-graph-canvas/data-graph-canvas.component';
import { CanvasOptionsService } from 'src/app/shared/services/data/canvas-options.service';
import { OptionType } from 'src/app/shared/interfaces/option-type';

describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;
  let getOptions$: Subject<OptionType[]>;
  let judgeBy$: boolean;

  beforeEach(async(() => {
    getOptions$ = new Subject();
    judgeBy$ = true;
    TestBed.configureTestingModule({
      declarations: [ DataGraphComponent, DataGraphCanvasComponent ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CanvasOptionsService,
          useValue: {
            getCanvasOptions: () => getOptions$,
            isByDepartment: () => judgeBy$
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    getOptions$.next([
      {
          type: 0,
          option: {
              name: '教职工人数统计',
              subOption: [
                  {
                      type: 0,
                      name: '按学院'
                  },
                  {
                      type: 1,
                      name: '按人员类别'
                  },
                  {
                      type: 1,
                      name: '按职称'
                  },
                  {
                      type: 3,
                      name: '按最高学位'
                  },
                  {
                      type: 2,
                      name: '按年龄分布'
                  }
              ]
          }
      },
      {
          type: 1,
          option: {
              name: '培训人数统计',
              subOption: [
                  {
                      type: 0,
                      name: '按学院'
                  },
                  {
                      type: 1,
                      name: '按职称'
                  },
                  {
                      type: 2,
                      name: '按年龄分布'
                  }
              ]
          }
      },
      {
          type: 2,
          option: {
              name: '专任教师培训覆盖率统计',
              subOption: [
                  {
                      type: 0,
                      name: '按学院'
                  },
                  {
                      type: 1,
                      name: '按职称'
                  },
                  {
                      type: 2,
                      name: '按年龄分布'
                  }
              ]
          }
      },
      {
          type: 3,
          option: {
              name: '培训学时与工作量统计',
              subOption: [
                  {
                      type: 0,
                      name: '按总人数'
                  },
                  {
                      type: 1,
                      name: '按总培训学时'
                  },
                  {
                      type: 2,
                      name: '按人均培训学时'
                  },
                  {
                      type: 3,
                      name: '按总工作量'
                  },
                  {
                      type: 4,
                      name: '按人均工作量'
                  }
              ]
          }
      }
  ] as OptionType[]);
    expect(component).toBeTruthy();
  });

  it('should get null', () => {
      const testFormGroup = component.selectedGraph;
      expect(timeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({selectedStartYear: null, selectedEndYear: 1});
      expect(timeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({selectedStartYear: 1, selectedEndYear: null});
      expect(timeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({selectedStartYear: 1, selectedEndYear: 1});
      expect(timeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({selectedStartYear: 1, selectedEndYear: 3});
      expect(timeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({selectedStartYear: '', selectedEndYear: ''});
      expect(timeValidator(testFormGroup)).toBe(null);
  });

  it('should get a FormGroup ValidationErrors', () => {
    const testFormGroup = component.selectedGraph;
    testFormGroup.patchValue({selectedStartYear: 3, selectedEndYear: 1});
    expect(timeValidator(testFormGroup)).toEqual({ timeValidator: true } as ValidationErrors);
  });

  it('should hide the departmentSelector', () => {
    const testFormGroup = component.selectedGraph;
    component.SelectedParamChangingCheck();
    testFormGroup.patchValue({selectedStatisticsType: 3});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    testFormGroup.patchValue({selectedGroupType: 2});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    testFormGroup.patchValue({selectedStatisticsType: 2, selectedGroupType: 0});
    // TODO(wangyang): this test will be change after backend changed.
    // expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);
  });

  it('should display the departmentSelector', () => {
    component.selectedGraph.patchValue({selectedStatisticsType: 1});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    component.selectedGraph.patchValue({selectedGroupType: 1});
    // TODO(wangyang): this test will be change after backend changed.
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);
  });

  it('should get selectedGraphValues', () => {
    const testFormGroup = component.selectedGraph;
    testFormGroup.patchValue({
      selectedStatisticsType: null,
      selectedGroupType: null,
      selectedStartYear: null,
      selectedEndYear: null,
      selectedDepartment: null
    });
    expect(component.selectedGraphValues).toBe(null);
    expect(component.graphTypeName).toBe('');
    expect(component.selectedDepartmentName).toBe('');
    expect(component.isCoverageGraph).toBe(false);

    testFormGroup.patchValue({
      selectedStatisticsType: 0,
      selectedGroupType: 0,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues).toEqual(testFormGroup.value);
    // TODO(wangyang): this test will be change after backend changed.
    // expect(component.graphTypeName).toEqual(component.statisticsType[
      // component.selectedGraphValues.selectedStatisticsType].option.name);
    // expect(component.selectedDepartmentName).toEqual(component.departmentsList[
      // component.selectedGraphValues.selectedDepartment].name);
    // expect(component.isCoverageGraph).toBeTruthy();

    testFormGroup.patchValue({
      selectedStatisticsType: 1,
      selectedGroupType: 0,
      selectedStartYear: 2019,
      selectedEndYear: 2018,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      selectedStatisticsType: 1,
      selectedGroupType: null,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: 1
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      selectedStatisticsType: 3,
      selectedGroupType: 3,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: 1
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeTruthy();
  });
});
