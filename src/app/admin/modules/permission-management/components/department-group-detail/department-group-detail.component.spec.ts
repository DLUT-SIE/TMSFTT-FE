import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DepartmentGroupDetailComponent } from './department-group-detail.component';
import { Group } from 'src/app/shared/interfaces/group';
import { AppDepartmentGroupPermissionStub } from 'src/testing/app-department-group-permission-stub';
import { AppDepartmentGroupUserStub } from 'src/testing/app-department-group-user-stub';

describe('DepartmentGroupDetailComponent', () => {
  let component: DepartmentGroupDetailComponent;
  let fixture: ComponentFixture<DepartmentGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepartmentGroupDetailComponent,
        AppDepartmentGroupPermissionStub,
        AppDepartmentGroupUserStub,
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
            data: observableOf({ group: {
              id: 1,
              user: 1,
              group: 1,
            } as Group}),
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
