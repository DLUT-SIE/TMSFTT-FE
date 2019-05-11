import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGroupPermissionComponent } from './department-group-permission.component';
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
import { GroupPermission, GroupPermissionStatus, Permission } from 'src/app/shared/interfaces/permission';
import { Subject } from 'rxjs';

function generatePermissions(n?: number): Permission[] {
  n = n || 5;
  const res: Permission[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, codename: `${i}`, label: `${i}`});
  }
  return res;
}

function generateGroupPermissions(n?: number): GroupPermission[] {
  n = n || 2;
  const res: GroupPermission[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, group: 1, permission: i});
  }
  return res;
}

function generateGroupPermissionStatus(n?: number, k?: number): GroupPermissionStatus[] {
  n = n || 5;
  k = k || 2;
  const permissions = generatePermissions(n);
  const res: GroupPermissionStatus[] = [];
  for (let i = 0; i < n; i++) {
    res.push({id: i, group: 1, permission: permissions[i], hasPermission: i < k});
  }
  return res;

}

describe('DepartmentGroupPermissionComponent', () => {
  let component: DepartmentGroupPermissionComponent;
  let fixture: ComponentFixture<DepartmentGroupPermissionComponent>;
  let createGroupPermissions$: Subject<Array<{}>>;
  let deleteGroupPermissions$: Subject<Array<{}>>;
  let getPermissions$: Subject<Array<{}>>;
  let getGroupPermissions$: Subject<Array<{}>>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    createGroupPermissions$ = new Subject();
    deleteGroupPermissions$ = new Subject();
    getPermissions$ = new Subject();
    getGroupPermissions$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupPermissionComponent ],
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
          provide: PermissionService,
          useValue: {
            getPermissions: () => getPermissions$,
            getGroupPermissions: (id: number) => getGroupPermissions$,
            deleteGroupPermissions: (permissionIds: number[]) => deleteGroupPermissions$,
            createGroupPermissions: (reqs: GroupPermission[]) => createGroupPermissions$,
          },
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupPermissionComponent);
    component = fixture.componentInstance;
    const group = {
      id: 1,
      name: '1',
    };
    component.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve group permissions.', () => {
    component.retrieveGroupPermissions();
    const n = 5;
    const k = 2;

    expect(component.isLoading).toBeTruthy();

    getPermissions$.next(generatePermissions(n));
    getGroupPermissions$.next(generateGroupPermissions(k));

    expect(component.originalPermissions.length).toBe(n);
    for (let i = 0 ; i < n; i++) {
      expect(component.originalPermissions[i].hasPermission).toEqual(i < k);
    }
    expect(component.newPermissions.length).toBe(n);
    expect(component.isLoading).toBeFalsy();
  });

  it('should get empty groups.', () => {
    component.retrieveGroupPermissions();
    const n = 5;
    const k = 2;

    getPermissions$.next(generatePermissions(n));
    getGroupPermissions$.next(generateGroupPermissions(k));

  });

  it('should update group permissions.', () => {

    const permissions = generateGroupPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => {
      x = Object.assign({}, x);
      x.hasPermission = !x.hasPermission;
      return x;
    });

    const spy = spyOn(component, 'retrieveGroupPermissions');

    component.updatePermissions();
    createGroupPermissions$.next();
    deleteGroupPermissions$.next();

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('用户权限更新成功', '关闭');
    expect(spy).toHaveBeenCalled();
  });

  it('should display error when updateGroupPermissions failed.', () => {
    const permissions = generateGroupPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => {
      x = Object.assign({}, x);
      x.hasPermission = !x.hasPermission;
      return x;
    });

    component.updatePermissions();
    createGroupPermissions$.next();
    deleteGroupPermissions$.error({ message: 'Error' });

    expect(component.isLoading).toBeFalsy();
    expect(snackBarOpen).toHaveBeenCalledWith('更新失败，请尝试刷新页面并重试!', '关闭');
  });

  it('should skip if permissions are changed.', () => {

    const permissions = generateGroupPermissionStatus();
    component.originalPermissions = permissions.map(x => Object.assign({}, x));
    component.newPermissions = permissions.map(x => Object.assign({}, x));

    component.updatePermissions();

    expect(snackBarOpen).toHaveBeenCalledWith('未检测到权限改动，无需保存', '关闭');
  });
});
