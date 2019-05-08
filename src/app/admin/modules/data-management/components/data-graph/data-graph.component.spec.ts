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
import { DepartmentService } from 'src/app/shared/services/department.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Department } from 'src/app/shared/interfaces/department';

describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;
  let getOptions$: Subject<OptionType[]>;
  let getDepartments: jasmine.Spy;
  let getDepartments$: Subject<PaginatedResponse<Department>>;
  const options: OptionType[] = [{
    type: 0,
    name: '教职工人数统计',
    key: 'STAFF_STATISTICS',
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
    getDepartments = jasmine.createSpy().and.returnValue(getDepartments$);
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
            getCanvasOptions: () => getOptions$
          }
        },
        {
          provide: DepartmentService,
          useValue: {
            getDepartments,
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
    getOptions$.next(options);
    const limit = 100, offset = 0;
    expect(getDepartments).toHaveBeenCalledWith({offset, limit});
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

  it('should get selectedGraphValues', () => {
    getOptions$.next(options);
    component.SelectedParamChangingCheck();
    component.selectedGraph.patchValue({
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

    component.selectedGraph.patchValue({
      selectedStatisticsType: 0,
      selectedGroupType: 0,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues).toEqual(component.selectedGraph.value);
    expect(component.graphTypeName).toEqual(component.statisticsType[
      component.selectedGraphValues.selectedStatisticsType].name);
    expect(component.selectedDepartmentName).toEqual(component.departmentsList[
      component.selectedGraphValues.selectedDepartment].name);
    expect(component.isCoverageGraph).toBeFalsy();

    component.selectedGraph.patchValue({
      selectedStatisticsType: 2,
      selectedGroupType: 0,
      selectedStartYear: 2019,
      selectedEndYear: 2018,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues === component.selectedGraph.value).toBeFalsy();

    component.selectedGraph.patchValue({
      selectedStatisticsType: 2,
      selectedGroupType: null,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues === component.selectedGraph.value).toBeFalsy();

    component.selectedGraph.patchValue({
      selectedStatisticsType: 2,
      selectedGroupType: 0,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: 0
    });
    expect(component.selectedGraphValues === component.selectedGraph.value).toBeTruthy();
    expect(component.isCoverageGraph).toBeTruthy();
  });

  it('should get a FormGroup ValidationErrors', () => {
    component.selectedGraph.patchValue({selectedStartYear: 3, selectedEndYear: 1});
    expect(timeValidator(component.selectedGraph)).toEqual({ timeValidator: true } as ValidationErrors);
  });

  it('should hide the departmentSelector', () => {
    getOptions$.next(options);
    component.selectedGraph.patchValue({selectedStatisticsType: 1});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    component.selectedGraph.patchValue({selectedGroupType: 0});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);
  });

  it('should display the departmentSelector', () => {
    getOptions$.next(options);
    component.selectedGraph.patchValue({selectedStatisticsType: 0});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    component.selectedGraph.patchValue({
      selectedGroupType: 0
    });
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toEqual(0);

    component.selectedGraph.patchValue({selectedGroupType: 1});
    expect(component.showDepartmentSelector).toBeTruthy();
  });
});
