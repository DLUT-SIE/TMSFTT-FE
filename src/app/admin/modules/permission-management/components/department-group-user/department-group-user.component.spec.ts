import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule,
         MatIconModule,
         MatPaginatorModule,
         MatSelectModule,
         MatInputModule,
         MatDividerModule,
         MatProgressSpinnerModule,
         MatDialog,
        } from '@angular/material';
import { Location } from '@angular/common';
import { DepartmentGroupUserComponent } from './department-group-user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { AdduserDialogComponent } from '../adduser-dialog/adduser-dialog.component';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { User } from 'src/app/shared/interfaces/user';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';

describe('DepartmentGroupUserComponent', () => {
  let component: DepartmentGroupUserComponent;
  let fixture: ComponentFixture<DepartmentGroupUserComponent>;
  let open: jasmine.Spy;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AdduserDialogComponent>>;
  let afterClosed$: Subject<string>;

  let addUserGroup: jasmine.Spy;
  let userGroup$: Subject<{}>;

  let removeUserByUserGroupId: jasmine.Spy;
  let removeUserByUserGroupId$: Subject<{}>;

  let getUsersByGroupId: jasmine.Spy;
  let getUsersByGroupId$: Subject<PaginatedResponse<User>>;

  beforeEach(async(() => {
    open = jasmine.createSpy();
    dialogRef = jasmine.createSpyObj('', ['afterClosed']);
    afterClosed$ = new Subject();

    addUserGroup = jasmine.createSpy();
    userGroup$ = new Subject();

    removeUserByUserGroupId = jasmine.createSpy();
    removeUserByUserGroupId$ = new Subject();

    getUsersByGroupId = jasmine.createSpy();
    getUsersByGroupId$ = new Subject<PaginatedResponse<User>>();
    getUsersByGroupId.and.returnValue(getUsersByGroupId$);

    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupUserComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
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
          }
        },
        {
          provide: Location,
          useValue: {
            go: () => null,
            replaceState: () => null,
          },
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: GroupService,
          useValue: {
            getUsersByGroupId: () => getUsersByGroupId$,
            addUserGroup,
            removeUserByUserGroupId,
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupUserComponent);
    component = fixture.componentInstance;
    const group = {
      id: 1,
      user: 1,
      group: 1,
    };
    component.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get results', () => {
    expect(component.getResults(0, 0)).toBe(getUsersByGroupId$);
  });

  it('should on Group remove', () => {
    const id = 5;
    removeUserByUserGroupId.and.returnValue(removeUserByUserGroupId$);
    component.onGroupRemove(id);

    removeUserByUserGroupId$.next({});

    expect(removeUserByUserGroupId).toHaveBeenCalledWith(id);
  });

  it('should open dialog', () => {
    open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(afterClosed$);
    addUserGroup.and.returnValue(userGroup$);

    component.openDialog();

    afterClosed$.next('123');
    userGroup$.next({});
    expect(open).toHaveBeenCalled();
    expect(addUserGroup).toHaveBeenCalledWith('123', component.group.id);
  });


});
