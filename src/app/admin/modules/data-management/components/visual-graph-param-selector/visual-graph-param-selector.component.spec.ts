import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualGraphParamSelectorComponent, timeValidator } from './visual-graph-param-selector.component';
import { VisualGraphBuilderComponent } from '../visual-graph-builder/visual-graph-builder.component';
import { ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VisualGraphParamSelectorComponent', () => {
  let component: VisualGraphParamSelectorComponent;
  let fixture: ComponentFixture<VisualGraphParamSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualGraphParamSelectorComponent, VisualGraphBuilderComponent ],
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
    fixture = TestBed.createComponent(VisualGraphParamSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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
    expect(component.selectedGraph.get('selectedDepartment').value).toBe('全校');

    testFormGroup.patchValue({selectedGroupType: 2});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toBe('全校');

    testFormGroup.patchValue({selectedStatisticsType: 2, selectedGroupType: 0});
    expect(component.showDepartmentSelector).toBeFalsy();
    expect(component.selectedGraph.get('selectedDepartment').value).toBe('全校');
  });

  it('should display the departmentSelector', () => {
    const testFormGroup = component.selectedGraph;
    component.SelectedParamChangingCheck();
    testFormGroup.patchValue({selectedStatisticsType: 2});
    expect(component.selectedGraph.get('selectedGroupType').value).toBe(null);
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value).toBe('全校');

    testFormGroup.patchValue({selectedGroupType: 2});
    expect(component.showDepartmentSelector).toBeTruthy();
    expect(component.selectedGraph.get('selectedDepartment').value).toBe('全校');
  });

  it('should get selectedGraphValues', () => {
    const testFormGroup = component.selectedGraph;
    component.SelectedParamChangingCheck();
    testFormGroup.patchValue({
      selectedStatisticsType: null,
      selectedGroupType: null,
      selectedStartYear: null,
      selectedEndYear: null,
      selectedDepartment: null
    });
    expect(component.selectedGraphValues).toBe(null);

    testFormGroup.patchValue({
      selectedStatisticsType: 1,
      selectedGroupType: 2,
      selectedStartYear: 2019,
      selectedEndYear: 2019,
      selectedDepartment: '创新创业学院'
    });
    expect(component.selectedGraphValues).toEqual(testFormGroup.value);

    testFormGroup.patchValue({
      selectedStatisticsType: 1,
      selectedGroupType: 2,
      selectedStartYear: 2019,
      selectedEndYear: 2018,
      selectedDepartment: '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      selectedStatisticsType: 1,
      selectedGroupType: null,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeFalsy();

    testFormGroup.patchValue({
      selectedStatisticsType: 3,
      selectedGroupType: 3,
      selectedStartYear: 2014,
      selectedEndYear: 2018,
      selectedDepartment: '创新创业学院'
    });
    expect(component.selectedGraphValues === testFormGroup.value).toBeTruthy();
  });
});
