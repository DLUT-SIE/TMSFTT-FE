import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentGroupComponent } from './department-group.component';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Department } from 'src/app/shared/interfaces/department';
import { of as observableOf, Subject } from 'rxjs';
import { Group } from 'src/app/shared/interfaces/group';

function generateGroups(n?: number): Group[] {
  n = n || 5;
  const group: Group[] = [];
  for (let i = 0; i < n; i++) {
    group.push({id: i, name: `${i}`});
  }
  return group;
}
describe('DepartmentGroupComponent', () => {
  let component: DepartmentGroupComponent;
  let fixture: ComponentFixture<DepartmentGroupComponent>;
  let getGroupsByTopDepartmentId$: Subject<{}>;
  let navigate: jasmine.Spy;
  const route = {
    queryParams: observableOf({ group_id: 1 }),
    snapshot: {
      queryParamMap: {
        get: () => '1',
      },
    }
  };

  const dummyGroup: Group = {
    id: 1,
    name: 'name',
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getGroupsByTopDepartmentId$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupComponent ],
      providers: [
        {
          provide: GroupService,
          useValue: {
            getGroupsByTopDepartmentId: () => getGroupsByTopDepartmentId$,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: Router,
          useValue: {
            navigate,
          },
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
    getGroupsByTopDepartmentId$.next(generateGroups(n));

    expect(component.departmentGroup.length).toBe(n);
  });

  it('should navigate to detail', () => {
    component.navigateToDetail(dummyGroup);

    expect(navigate).toHaveBeenCalledWith(
      ['../groups', dummyGroup.id], { relativeTo: route });
  });
});
