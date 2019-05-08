import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { MatPaginatorModule, MatProgressSpinnerModule, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentGroupDetailComponent } from './department-group-detail.component';
import { DepartmentGroupPermissionComponent } from '../department-group-permission/department-group-permission.component';
import { DepartmentGroupUserComponent } from '../department-group-user/department-group-user.component';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Location } from '@angular/common';
import { Group } from 'src/app/shared/interfaces/group';

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
      imports: [
        MatPaginatorModule,
        MatProgressSpinnerModule,
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
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: GroupService,
          useValue: {
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open,
          }
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
