import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentGroupComponent } from './department-group.component';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Department } from 'src/app/shared/interfaces/department';
import { Subject } from 'rxjs';
import { Group } from 'src/app/shared/interfaces/group';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

function generatePaginatedGroups(n?: number): PaginatedResponse<Group> {
  n = n || 5;
  const group: Group[] = [];
  for (let i = 0; i < n; i++) {
    group.push({id: i, name: `${i}`});
  }
  const res = { count: n, previous: '', next: '', results: group};
  return res;
}

describe('DepartmentGroupComponent', () => {
  let component: DepartmentGroupComponent;
  let fixture: ComponentFixture<DepartmentGroupComponent>;
  let getGroupByDepartmentName$: Subject<{}>;

  beforeEach(async(() => {
    getGroupByDepartmentName$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupComponent ],
      providers: [
        {
          provide: GroupService,
          useValue: {
            getGroupByDepartmentName: () => getGroupByDepartmentName$,
          },
        },
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Groups from department', () => {
    const n = 5;
    const department = {id: 1, name: 'name'} as Department;
    component.departmentSelected = department;
    getGroupByDepartmentName$.next(generatePaginatedGroups(n));

    expect(component.departmentGroup.length).toBe(n);
  });
});
