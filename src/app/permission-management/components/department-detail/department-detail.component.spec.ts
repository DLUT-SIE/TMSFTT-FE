import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDetailComponent } from './department-detail.component';
import { MatProgressSpinnerModule, MatCheckboxModule, MatDividerModule } from '@angular/material';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Subject } from 'rxjs';
import { Department } from 'src/app/shared/interfaces/department';

describe('DepartmentDetailComponent', () => {
  let component: DepartmentDetailComponent;
  let fixture: ComponentFixture<DepartmentDetailComponent>;
  let getDepartment: jasmine.Spy;
  let getDepartment$: Subject<{}>;
  const departmentId = 5;

  beforeEach(async(() => {
    getDepartment$ = new Subject();
    getDepartment = jasmine.createSpy().and.returnValue(getDepartment$);
    TestBed.configureTestingModule({
      declarations: [DepartmentDetailComponent],
      imports: [
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatDividerModule,
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => `${departmentId}`,
              },
            },
          },
        },
        {
          provide: DepartmentService,
          useValue: {
            getDepartment,
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isLoading).toBeTruthy();
  });

  it('should get department', () => {
    const department = {id: 1, name: 'name'} as Department;
    getDepartment$.next(department);

    expect(getDepartment).toHaveBeenCalledWith(departmentId);
    expect(component.isLoading).toBeFalsy();
    expect(component.department).toEqual(department);
  });
});
