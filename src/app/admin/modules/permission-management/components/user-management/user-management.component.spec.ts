import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementComponent } from './user-management.component';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSnackBar,
  MatInputModule,
  MatChipsModule,
  MatDividerModule,
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { UserPermissionStatus, Permission, UserPermission } from 'src/app/shared/interfaces/permission';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { User } from 'src/app/shared/interfaces/user';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';

function generatePermissions(n?: number): Permission[] {
  n = n || 5;
  const res: Permission[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, codename: `${i}`, label: `${i}`});
  }
  return res;
}

function generateUserPermissions(n?: number): UserPermission[] {
  n = n || 2;
  const res: UserPermission[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, user: 1, permission: i});
  }
  return res;
}

function generateUserPermissionStatus(n?: number, k?: number): UserPermissionStatus[] {
  n = n || 5;
  k = k || 2;
  const permissions = generatePermissions(n);
  const res: UserPermissionStatus[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, user: 1, permission: permissions[i], hasPermission: i < k});
  }
  return res;

}

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let getUserByUsername$: Subject<PaginatedResponse<User>>;
  let getGroupsByIds$: Subject<{}>;
  let createUserPermissions$: Subject<Array<{}>>;
  let deleteUserPermissions$: Subject<Array<{}>>;
  let getPermissions$: Subject<Array<{}>>;
  let getUserPermissions$: Subject<Array<{}>>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    getUserByUsername$ = new Subject();
    getGroupsByIds$ = new Subject();
    createUserPermissions$ = new Subject();
    deleteUserPermissions$ = new Subject();
    getPermissions$ = new Subject();
    getUserPermissions$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatChipsModule,
        MatCheckboxModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByUsername: () => getUserByUsername$,
          }
        },
        {
          provide: GroupService,
          useValue: {
            getGroupsByIds: () => getGroupsByIds$,
          }
        },
        {
          provide: PermissionService,
          useValue: {
            getPermissions: () => getPermissions$,
            getUserPermissions: (id: number) => getUserPermissions$,
            deleteUserPermissions: (permissionIds: number[]) => deleteUserPermissions$,
            createUserPermissions: (reqs: UserPermission[]) => createUserPermissions$,
          },
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve user permissions.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();
    const n = 5;
    const k = 2;

    expect(component.isLoading).toBeTruthy();

    getUserByUsername$.next({ count: 1, previous: '', next: '', results: [{ id: 1, groups: [1, 2]} as User] });
    getGroupsByIds$.next({});
    getPermissions$.next(generatePermissions(n));
    getUserPermissions$.next(generateUserPermissions(k));

    expect(component.originalPermissions.length).toBe(n);
    for (let i = 0 ; i < n; i++) {
      expect(component.originalPermissions[i].hasPermission).toEqual(i < k);
    }
    expect(component.newPermissions.length).toBe(n);
    expect(component.isLoading).toBeFalsy();
  });

  it('should get empty groups.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();
    const n = 5;
    const k = 2;

    getUserByUsername$.next({ count: 1, previous: '', next: '', results: [{ id: 1, groups: []} as User] });
    getGroupsByIds$.next({});
    getPermissions$.next(generatePermissions(n));
    getUserPermissions$.next(generateUserPermissions(k));

    expect(component.groups.length).toBe(0);
  });

  it('should display error message.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();
    const errorMessage = '系统中无此用户!';

    expect(component.isLoading).toBeTruthy();

    getUserByUsername$.next({count: 0, results: [], previous: '', next: ''});

    expect(component.originalPermissions.length).toBe(0);
    expect(component.newPermissions.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.errorMessage).toEqual(errorMessage);
  });

  it('should update user permissions.', () => {
    component.username = 'abc';

    const permissions = generateUserPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => {
      x = Object.assign({}, x);
      x.hasPermission = !x.hasPermission;
      return x;
    });

    const spy = spyOn(component, 'retrieveUserPermissions');

    component.updatePermissions();
    createUserPermissions$.next();
    deleteUserPermissions$.next();

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('用户权限更新成功', '关闭');
    expect(spy).toHaveBeenCalled();
  });

  it('should display error when updateUserPermissions failed.', () => {
    component.username = 'abc';

    const permissions = generateUserPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => {
      x = Object.assign({}, x);
      x.hasPermission = !x.hasPermission;
      return x;
    });

    component.updatePermissions();
    createUserPermissions$.next();
    deleteUserPermissions$.error({ message: 'Error' });

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('更新失败，请尝试刷新页面并重试!', '关闭');
  });

  it('should skip if permissions are changed.', () => {
    component.username = 'abc';

    const permissions = generateUserPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => Object.assign({}, x));

    component.updatePermissions();

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('未检测到权限改动，无需保存', '关闭');
  });
});
