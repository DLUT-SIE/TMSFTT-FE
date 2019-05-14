import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DepartmentManagementComponent } from './department-management.component';
import { Department } from 'src/app/shared/interfaces/department';
import { DepartmentGroupComponent } from '../department-group/department-group.component';
import { DepartmentListComponent } from '../department-list/department-list.component';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Subject } from 'rxjs';

describe('DepartmentManagementComponent', () => {
  let component: DepartmentManagementComponent;
  let fixture: ComponentFixture<DepartmentManagementComponent>;
  let getTopDepartments$: Subject<Department[]>;
  let getGroupByDepartmentName$: Subject<{}>;

  beforeEach(async(() => {
    getTopDepartments$ = new Subject();
    getGroupByDepartmentName$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [
        DepartmentManagementComponent,
        DepartmentGroupComponent,
        DepartmentListComponent,
      ],
      imports: [
          MatIconModule,
          MatProgressSpinnerModule,
          MatPaginatorModule,
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
          {
            provide: GroupService,
            useValue: {
              getGroupByDepartmentName: () => getGroupByDepartmentName$,
            },
          },
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get departmentSelected', () => {
    const department = {id: 1, name: 'name'} as Department;
    component.onchanged(department);

    expect(component.departmentSelected).toEqual(department);
  });
});
