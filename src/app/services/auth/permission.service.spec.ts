import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { UserPermission, Permission } from 'src/app/interfaces/permission';
import { Subject, of as observableOf } from 'rxjs';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { UserService } from './user.service';

describe('PermissionService', () => {
  let httpTestingController: HttpTestingController;
  let getUserByUsername$: Subject<PaginatedResponse<{ id: number }>>;
  beforeEach(() => {
    getUserByUsername$ = new Subject();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserByUsername: (username: string) => getUserByUsername$,
          },
        },
      ],
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    expect(service).toBeTruthy();
  });

  it('should get all permissions', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.getAllPermissions().subscribe(() => { });

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/permissions/`);

    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get all user permissions', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const userId = 1;
    const dummyResponse: UserPermission[] = [
      {
        user: null,
        permission: null,
        hasPerm: false,
      },
      {
        user: null,
        permission: null,
        hasPerm: false,
      },
    ];

    service.listUserPermissions(userId).subscribe(res => {
      expect(res.length).toBe(dummyResponse.length);
      res.map(x => {
        expect(x.hasPerm).toBeTruthy();
      });
    });

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/user-permissions/?user=${userId}`);

    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should list user permission status', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const username = 'abc';
    const userId = 123;
    const getAllPermissionsResponse: Permission[] = [
      {
        id: 1,
        codename: '1',
        label: '1',
      },
      {
        id: 2,
        codename: '2',
        label: '2',
      },
      {
        id: 3,
        codename: '3',
        label: '3',
      },
    ];
    const listUserPermissionsResponse: UserPermission[] = [
      {
        id: 11,
        user: userId,
        permission: {
          id: 1,
          codename: '1',
          label: '1',
        },
        hasPerm: true,
      },
      {
        id: 12,
        user: userId,
        permission: {
          id: 2,
          codename: '2',
          label: '2',
        },
        hasPerm: true,
      }
    ];

    spyOn(service, 'getAllPermissions').and.returnValue(
      observableOf(getAllPermissionsResponse));

    spyOn(service, 'listUserPermissions').and.returnValue(
      observableOf(listUserPermissionsResponse));

    service.listUserPermissionStatus(username).subscribe(res => {
      expect(res.length).toBe(3);
      res.map((x, idx) => {
        if (idx === 2) {
          expect(x.id).toBeUndefined();
          expect(x.hasPerm).toBeFalsy();
        } else {
          expect(x.id).toBe(listUserPermissionsResponse[idx].id);
          expect(x.hasPerm).toBeTruthy();
        }
        expect(x.user).toBe(userId);
        expect(x.permission).toEqual(getAllPermissionsResponse[idx]);
      });
    });

    getUserByUsername$.next(
      { count: 1, next: '', previous: '', results: [{ id: userId }] });
  });

  it('should raise error if user does not exist.', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const username = 'abc';
    const userId = 123;

    service.listUserPermissionStatus(username).subscribe(
      {
        error: (err) => {
          expect(err.message).toEqual('系统中无此用户!');
        }
      }
    );

    getUserByUsername$.next(
      { count: 2, next: '', previous: '', results: [{ id: userId }] });
  });
  it('should create user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.createUserPermission({
      user: 1,
      permission_id: 2,
    }).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/user-permissions/`);

    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should create user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.createUserPermissions([
      {
        user: 1,
        permission_id: 2,
      },
      {
        user: 1,
        permission_id: 2,
      }
    ]).subscribe();

    const req = httpTestingController.match(
      `${environment.API_URL}/user-permissions/`);

    expect(req.length).toBe(2);
    expect(req[0].request.method).toEqual('POST');
    expect(req[1].request.method).toEqual('POST');
    req.map(x => x.flush({}));
  });

  it('should delete user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const permissionId = 1;

    service.deleteUserPermission(permissionId).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/user-permissions/${permissionId}/`);

    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should delete user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const permissionIds = [1, 2, 3];

    service.deleteUserPermissions(permissionIds).subscribe();

    permissionIds.map(x => {
      const req = httpTestingController.expectOne(
        `${environment.API_URL}/user-permissions/${x}/`);

      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });

  it('should return empty list if permissionIds is empty.', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.deleteUserPermissions([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });

  it('should return empty list if reqs is empty.', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.createUserPermissions([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });
});
