import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  MatPaginatorModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSnackBar,
  MatInputModule,
  MatChipsModule,
  MatDividerModule,
  MatDialog,
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        DepartmentGroupDetailComponent,
        DepartmentGroupPermissionComponent,
        DepartmentGroupUserComponent,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatInputModule,
        MatChipsModule,
        MatDividerModule,
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
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
