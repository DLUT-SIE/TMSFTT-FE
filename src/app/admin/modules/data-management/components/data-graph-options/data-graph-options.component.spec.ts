import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { DataGraphOptionsComponent, timeValidator } from './data-graph-options.component';
import { DataGraphCanvasComponent } from '../data-graph-canvas/data-graph-canvas.component';
import { DataGraphEchartsComponent } from '../data-graph-echarts/data-graph-echarts.component';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';

describe('DataGraphOptionsComponent', () => {
  let component: DataGraphOptionsComponent;
  let fixture: ComponentFixture<DataGraphOptionsComponent>;
  let getOptions$: Subject<OptionType[]>;
  let getDepartments$: Subject<Department[]>;
  const options: OptionType[] = [{
    type: 0,
    name: '教职工人数统计',
    key: 'TEACHERS_STATISTICS',
    subOption: [{
      type: 0,
      name: '按学院',
      key: 'BY_DEPARTMENT'
    }, {
      type: 1,
      name: '按职称',
      key: 'BY_STAFF_TITLE'
    }]
  }, {
    type: 1,
    name: '培训学时与工作量统计',
    key: 'TRAINING_HOURS_WORKLOAD_STATISTICS',
    subOption: [{
      type: 0,
      name: '按总人数',
      key: 'BY_TOTAL_STAFF_NUM'
    }]
  }, {
    type: 2,
    name: '专任教师培训覆盖率统计',
    key: 'FULL_TIME_TEACHER_TRAINED_COVERAGE',
    subOption: [{
      type: 0,
      name: '按学院',
      key: 'BY_DEPARTMENT'
    }]
  }];

  beforeEach(async(() => {
    getOptions$ = new Subject();
    getDepartments$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [
        DataGraphOptionsComponent,
        DataGraphCanvasComponent,
        DataGraphEchartsComponent
      ],
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
          provide: CanvasService,
          useValue: {
            getCanvasOptions: () => getOptions$,
          }
        },
        {
          provide: DepartmentService,
          useValue: {
            getTopDepartments: () => getDepartments$
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    getOptions$.next(options);
    getDepartments$.next(
      [{id: 50,
        name: '建筑与艺术学院'
      } as Department]);
    const departmentResult = [{
      id: 0,
      name: '大连理工大学'
    }, {
      id: 50,
      name: '建筑与艺术学院'
    }];
    expect(component).toBeTruthy();
    expect(component.departmentsList).toEqual(departmentResult as Department[]);
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

      testFormGroup.get('selectedStartYear').disable();
      testFormGroup.get('selectedEndYear').disable();
      expect(timeValidator(testFormGroup)).toBe(null);
  });

  it('should get a FormGroup ValidationErrors', () => {
    component.selectedGraph.patchValue({selectedStartYear: 3, selectedEndYear: 1});
    expect(timeValidator(component.selectedGraph)).toEqual({ timeValidator: true } as ValidationErrors);
  });

  it('should hide the departmentSelector', () => {
    getOptions$.next(options);
    component.selectedGraph.patchValue({selectedStatisticsType: null});
    component.selectedGraph.patchValue({selectedStatisticsType: 1});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value.id).toEqual(0);

    component.selectedGraph.patchValue({selectedGroupType: 0});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value.id).toEqual(0);
  });

  it('should display the departmentSelector', () => {
    getOptions$.next(options);
    component.selectedGraph.patchValue({selectedStatisticsType: 0});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value.id).toEqual(0);

    component.selectedGraph.patchValue({
      selectedGroupType: 0
    });
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value.id).toEqual(0);

    component.selectedGraph.patchValue({selectedGroupType: 1});
    expect(component.showDepartmentSelector).toBeTruthy();
  });

  it('should disabled time selector', () => {
    getOptions$.next(options);
    component.selectedGraph.patchValue({selectedStatisticsType: 0});
    expect(component.selectedGraph.get('selectedStartYear').disabled).toBeTruthy();
    expect(component.selectedGraph.get('selectedEndYear').disabled).toBeTruthy();
    component.selectedGraph.patchValue({selectedStatisticsType: 1});
    expect(component.selectedGraph.get('selectedStartYear').enabled).toBeTruthy();
    expect(component.selectedGraph.get('selectedEndYear').enabled).toBeTruthy();
  });
});
