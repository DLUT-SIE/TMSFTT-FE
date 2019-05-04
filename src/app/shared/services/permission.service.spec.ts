import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserPermission, GroupPermission } from 'src/app/shared/interfaces/permission';
import { Subject } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
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

    service.getPermissions().subscribe(() => { });

    const req = httpTestingController.expectOne(
      `/permissions/?limit=-1`);

    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should return cached permissions', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.getPermissions().subscribe();

    const req = httpTestingController.expectOne(
      `/permissions/?limit=-1`);

    expect(req.request.method).toEqual('GET');
    req.flush({});

    service.getPermissions().subscribe();
  });

  it('should get all user permissions', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const userId = 1;
    const dummyResponse: UserPermission[] = [
      {
        user: null,
        permission: null,
      },
      {
        user: null,
        permission: null,
      },
    ];

    service.getUserPermissions(userId).subscribe(res => {
      expect(res.length).toBe(dummyResponse.length);
    });

    const req = httpTestingController.expectOne(
      `/user-permissions/?user=${userId}&limit=-1`);

    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should create user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.createUserPermission({
      user: 1,
      permission: 2,
    }).subscribe();

    const req = httpTestingController.expectOne(
      `/user-permissions/`);

    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should create user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);

    service.createUserPermissions([
      {
        user: 1,
        permission: 2,
      },
      {
        user: 1,
        permission: 2,
      }
    ]).subscribe();

    const req = httpTestingController.match(
      `/user-permissions/`);

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
      `/user-permissions/${permissionId}/`);

    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should delete user permission', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const permissionIds = [1, 2, 3];

    service.deleteUserPermissions(permissionIds).subscribe();

    permissionIds.map(x => {
      const req = httpTestingController.expectOne(
        `/user-permissions/${x}/`);

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

  it('should get all group permissions', () => {
    const service: PermissionService = TestBed.get(PermissionService);
    const groupId = 1;
    const dummyResponse: GroupPermission[] = [
      {
        group: null,
        permission: null,
      },
      {
        group: null,
        permission: null,
      },
    ];
    service.getGroupPermissions(groupId).subscribe(res => {
      expect(res.length).toBe(dummyResponse.length);
    });

    const req = httpTestingController.expectOne(
      `/group-permissions/?group=${groupId}&limit=-1`);

    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });
});
