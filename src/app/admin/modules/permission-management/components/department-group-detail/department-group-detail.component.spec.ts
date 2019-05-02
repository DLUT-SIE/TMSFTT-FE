import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DepartmentGroupDetailComponent } from './department-group-detail.component';
import { DepartmentGroupPermissionComponent } from '../department-group-permission/department-group-permission.component';
import { DepartmentGroupUserComponent } from '../department-group-user/department-group-user.component';

describe('DepartmentGroupDetailComponent', () => {
  let component: DepartmentGroupDetailComponent;
  let fixture: ComponentFixture<DepartmentGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepartmentGroupDetailComponent,
        DepartmentGroupPermissionComponent,
        DepartmentGroupUserComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
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
