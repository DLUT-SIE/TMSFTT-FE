import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementComponent } from './user-management.component';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSnackBar,
  MatInputModule,
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { UserPermissionRequest, UserPermissionStatus } from 'src/app/shared/interfaces/permission';
import { Subject } from 'rxjs';

function generateUserPermissions(): UserPermissionStatus[] {
  return [
    {
      id: 1,
      user: 1,
      permission: {
        id: 1,
        codename: '1',
        label: '1',
      },
      hasPermission: true,
    }, {
      id: 2,
      user: 1,
      permission: {
        id: 2,
        codename: '2',
        label: '2',
      },
      hasPermission: false,
    },
  ];
}

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let getUserPermissionStatus$: Subject<UserPermissionStatus[]>;
  let createUserPermissions$: Subject<Array<{}>>;
  let deleteUserPermissions$: Subject<Array<{}>>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    getUserPermissionStatus$ = new Subject();
    createUserPermissions$ = new Subject();
    deleteUserPermissions$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ UserManagementComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
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
          provide: PermissionService,
          useValue: {
            getUserPermissionStatus: (username: string) => getUserPermissionStatus$,
            deleteUserPermissions: (permissionIds: number[]) => deleteUserPermissions$,
            createUserPermissions: (reqs: UserPermissionRequest[]) => createUserPermissions$,
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

  it('should display error if username is empty.', () => {
    component.retrieveUserPermissions();

    expect(component.errorMessage).toEqual('用户名长度不能为0');
  });

  it('should retrieve user permissions.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();

    expect(component.isLoading).toBeTruthy();

    getUserPermissionStatus$.next(generateUserPermissions());

    expect(component.originalPermissions.length).toBe(2);
    expect(component.newPermissions.length).toBe(2);
    expect(component.isLoading).toBeFalsy();
  });

  it('should display error message.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();
    const errorMessage = 'Error message';

    expect(component.isLoading).toBeTruthy();

    getUserPermissionStatus$.error({message: errorMessage});

    expect(component.originalPermissions.length).toBe(0);
    expect(component.newPermissions.length).toBe(0);
    expect(component.isLoading).toBeFalsy();
    expect(component.errorMessage).toEqual(errorMessage);
  });

  it('should update user permissions.', () => {
    component.username = 'abc';

    const permissions = generateUserPermissions();
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

    const permissions = generateUserPermissions();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => {
      x = Object.assign({}, x);
      x.hasPermission = !x.hasPermission;
      return x;
    });

    component.updatePermissions();
    createUserPermissions$.next();
    deleteUserPermissions$.error({message: 'Error'});

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('更新失败，请尝试刷新页面并重试!', '关闭');
  });

  it('should skip if permissions are changed.', () => {
    component.username = 'abc';

    const permissions = generateUserPermissions();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => Object.assign({}, x));

    component.updatePermissions();

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('未检测到权限改动，无需保存', '关闭');
  });
});
