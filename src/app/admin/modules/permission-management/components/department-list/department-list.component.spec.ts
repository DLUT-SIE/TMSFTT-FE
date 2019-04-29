import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Department } from 'src/app/shared/interfaces/department';
import { Subject } from 'rxjs';
import { DepartmentListComponent } from './department-list.component';

describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;
  let getDepartments: jasmine.Spy;
  let getDepartments$: Subject<PaginatedResponse<Department>>;

  beforeEach(async(() => {
    getDepartments$ = new Subject();
    getDepartments = jasmine.createSpy().and.returnValue(getDepartments$);
    TestBed.configureTestingModule({
      declarations: [ DepartmentListComponent ],
      imports: [
        MatPaginatorModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: DepartmentService,
          useValue: {
            getDepartments,
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get results', () => {
    const limit = 10, offset = 5;
    component.getResults(offset, limit);

    expect(getDepartments).toHaveBeenCalledWith({offset, limit});
  });

  it('should onSelect', () => {
    const department = {id: 1, name: 'name'} as Department;
    component.onSelect(department);

    expect(component.departmentChildSelect).toEqual(department);
  });
});
