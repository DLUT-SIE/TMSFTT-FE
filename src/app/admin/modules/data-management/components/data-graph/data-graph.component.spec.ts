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
      const test_form_group = component.selected_graph;
      expect(TimeValidator(test_form_group)).toBe(null);

      test_form_group.patchValue({'selected_start_year':null, 'selected_end_year':1});
      expect(TimeValidator(test_form_group)).toBe(null);

      test_form_group.patchValue({'selected_start_year':1, 'selected_end_year':null});
      expect(TimeValidator(test_form_group)).toBe(null);

      test_form_group.patchValue({'selected_start_year':1, 'selected_end_year':1});
      expect(TimeValidator(test_form_group)).toBe(null);
      
      test_form_group.patchValue({'selected_start_year':1, 'selected_end_year':3});
      expect(TimeValidator(test_form_group)).toBe(null);

      test_form_group.patchValue({'selected_start_year':'', 'selected_end_year':''});
      expect(TimeValidator(test_form_group)).toBe(null);
  });

  it('should get a FormGroup ValidationErrors', () => {
    const test_form_group = component.selected_graph;
    test_form_group.patchValue({'selected_start_year':3, 'selected_end_year':1});
    expect(TimeValidator(test_form_group)).toEqual(<ValidationErrors>{ 'TimeValidator': true });
  });

  it('should hide the department_selector', () =>{
    const test_form_group = component.selected_graph;
    component.Docheck();
    test_form_group.patchValue({'selected_graph_type':3});
    expect(component.selected_group_type.value).toBe(null);
    expect(component.show_department_selector).toBeFalsy();
    expect(component.selected_department.value).toBe('全校');

    test_form_group.patchValue({'selected_group_type': 2});
    expect(component.show_department_selector).toBeFalsy();
    expect(component.selected_department.value).toBe('全校');

    test_form_group.patchValue({'selected_graph_type':2, 'selected_group_type': 0});
    expect(component.show_department_selector).toBeFalsy();
    expect(component.selected_department.value).toBe('全校');
  });

  it('should display the department_selector', () =>{
    const test_form_group = component.selected_graph;
    component.Docheck();
    test_form_group.patchValue({'selected_graph_type':2});
    expect(component.selected_group_type.value).toBe(null);
    expect(component.show_department_selector).toBeTruthy();
    expect(component.selected_department.value).toBe('全校');

    test_form_group.patchValue({'selected_group_type': 2});
    expect(component.show_department_selector).toBeTruthy();
    expect(component.selected_department.value).toBe('全校');
  });

  it('should get selected_graph_values', () =>{
    const test_form_group = component.selected_graph;
    component.Docheck();
    test_form_group.patchValue({
      'selected_graph_type':null,
      'selected_group_type':null,
      'selected_start_year':null,
      'selected_end_year':null,
      'selected_department':null
    });
    expect(component.selected_graph_values).toBe(null);

    test_form_group.patchValue({
      'selected_graph_type':1,
      'selected_group_type':2,
      'selected_start_year':2019,
      'selected_end_year':2019,
      'selected_department':'创新创业学院'
    });
    expect(component.selected_graph_values).toEqual(test_form_group.value);

    test_form_group.patchValue({
      'selected_graph_type':1,
      'selected_group_type':2,
      'selected_start_year':2019,
      'selected_end_year':2018,
      'selected_department':'创新创业学院'
    });
    expect(component.selected_graph_values === test_form_group.value).toBeFalsy();

    test_form_group.patchValue({
      'selected_graph_type':1,
      'selected_group_type':null,
      'selected_start_year':2014,
      'selected_end_year':2018,
      'selected_department':'创新创业学院'
    });
    expect(component.selected_graph_values === test_form_group.value).toBeFalsy();

    test_form_group.patchValue({
      'selected_graph_type':3,
      'selected_group_type':3,
      'selected_start_year':2014,
      'selected_end_year':2018,
      'selected_department':'创新创业学院'
    });
    expect(component.selected_graph_values === test_form_group.value).toBeTruthy();
  });
});
