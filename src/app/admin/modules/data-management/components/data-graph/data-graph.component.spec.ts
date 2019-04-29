import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphComponent, TimeValidator } from './data-graph.component';
import { DataGraphChildComponent } from './data-graph-child/data-graph-child.component';
import { ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGraphComponent, DataGraphChildComponent ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get null', () => {
      const testFormGroup = component.selectedGraph;
      expect(TimeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({'selectedStartYear': null, 'selectedEndYear': 1});
      expect(TimeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({'selectedStartYear': 1, 'selectedEndYear': null});
      expect(TimeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({'selectedStartYear': 1, 'selectedEndYear': 1});
      expect(TimeValidator(testFormGroup)).toBe(null);
      
      testFormGroup.patchValue({'selectedStartYear': 1, 'selectedEndYear': 3});
      expect(TimeValidator(testFormGroup)).toBe(null);

      testFormGroup.patchValue({'selectedStartYear': '', 'selectedEndYear': ''});
      expect(TimeValidator(testFormGroup)).toBe(null);
  });

  it('should get a FormGroup ValidationErrors', () => {
    const testFormGroup = component.selectedGraph;
    testFormGroup.patchValue({'selectedStartYear': 3, 'selectedEndYear': 1});
    expect(TimeValidator(testFormGroup)).toEqual(<ValidationErrors>{ 'TimeValidator': true });
  });

  it('should hide the department_selector', () =>{
    const testFormGroup = component.selectedGraph;
    component.Docheck();
    testFormGroup.patchValue({'selectedGraph_type': 3});
    expect(component.selectedGroupType.value).toBe(null);
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedDepartment.value).toBe('全校');

    testFormGroup.patchValue({'selectedGroupType': 2});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedDepartment.value).toBe('全校');

    testFormGroup.patchValue({'selectedGraph_type': 2, 'selectedGroupType': 0});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedDepartment.value).toBe('全校');
  });

  it('should display the department_selector', () =>{
    const testFormGroup = component.selectedGraph;
    component.Docheck();
    testFormGroup.patchValue({'selectedGraph_type': 2});
    expect(component.selectedGroupType.value).toBe(null);
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedDepartment.value).toBe('全校');

    testFormGroup.patchValue({'selectedGroupType': 2});
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedDepartment.value).toBe('全校');
  });

  it('should get selectedGraphValues', () =>{
    const testFormGroup = component.selectedGraph;
    component.Docheck();
    testFormGroup.patchValue({
      'selectedGraph_type': null,
      'selectedGroupType': null,
      'selectedStartYear': null,
      'selectedEndYear': null,
      'selectedDepartment': null
    });
    expect(component.selectedGraphValues).toBe(null);

    testFormGroup.patchValue({
      'selectedGraph_type': 1,
      'selectedGroupType': 2,
      'selectedStartYear': 2019,
      'selectedEndYear': 2019,
      'selectedDepartment': '创新创业学院'
    });
    expect(component.selectedGraphValues).toEqual(testFormGroup.value);

    testFormGroup.patchValue({
      'selectedGraph_type': 1,
      'selectedGroupType': 2,
      'selectedStartYear': 2019,
      'selectedEndYear': 2018,
      'selectedDepartment': '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      'selectedGraph_type': 1,
      'selectedGroupType': null,
      'selectedStartYear': 2014,
      'selectedEndYear': 2018,
      'selectedDepartment': '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      'selectedGraph_type': 3,
      'selectedGroupType': 3,
      'selectedStartYear': 2014,
      'selectedEndYear': 2018,
      'selectedDepartment': '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeTruthy();
  });
});
