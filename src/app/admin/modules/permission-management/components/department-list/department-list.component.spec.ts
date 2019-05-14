import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';
import { Subject } from 'rxjs';
import { DepartmentListComponent } from './department-list.component';

function generateDepartments(n?: number): Department[] {
  n = n || 5;
  const depart: Department[] = [];
  for (let i = 0; i < n; i++) {
    depart.push({id: i, name: `${i}`, users: [1, ], admins: [2, ]});
  }
  return depart;
}

describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;
  let getTopDepartments$: Subject<Department[]>;

  beforeEach(async(() => {
    getTopDepartments$ = new Subject();
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
            getTopDepartments: () => getTopDepartments$,
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
    const n = 5;
    getTopDepartments$.next(generateDepartments(n));

    expect(component.departmentList.length).toBe(n);
  });

  it('should onSelect', () => {
    const department = {id: 1, name: 'name'} as Department;
    component.onSelect(department);

    expect(component.departmentChildSelect).toEqual(department);
  });
});
