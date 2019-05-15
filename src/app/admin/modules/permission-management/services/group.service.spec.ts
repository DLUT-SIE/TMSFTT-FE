import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Department } from 'src/app/shared/interfaces/department';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: GroupService = TestBed.get(GroupService);
    expect(service).toBeTruthy();
  });

  it('should get Group', () => {
    const service: GroupService = TestBed.get(GroupService);
    const id = 5;
    service.getGroupById(5).subscribe();

    const url = `/groups/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should get Group2', () => {
    const department = {id: 1, name: 'name'} as Department;
    const service: GroupService = TestBed.get(GroupService);
    service.getGroupByDepartmentName(department.name).subscribe();

    const params = `name__startswith=${department.name}`;
    const url = `/groups/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should get Groups by ByTopDepartmentId', () => {
    const department = {id: 1, name: 'name'} as Department;
    const service: GroupService = TestBed.get(GroupService);
    service.getGroupsByTopDepartmentId(department.id).subscribe();

    const params = `department_id=${department.id}`;
    const url = `/groups/top-department-related-groups/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should get User By GroupID', () => {
    const service: GroupService = TestBed.get(GroupService);
    const limit = 5;
    const offset = 10;
    service.getUsersByGroupId({ limit, offset }).subscribe();

    const params = `limit=${limit}&offset=${offset}`;
    const url = `/user-groups/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should create UserGroup', () => {
    const service: GroupService = TestBed.get(GroupService);

    service.addUserGroup(1, 1).subscribe();
    const req =  httpTestingController.expectOne(`/user-groups/`);
    expect(req.request.method).toEqual('POST');
    req.flush({
      user: '1',
      group: '1',
    });
  });

  it('should delete UserGroup', () => {
    const service: GroupService = TestBed.get(GroupService);
    const id = 5;

    service.removeUserByUserGroupId(id).subscribe();
    const req = httpTestingController.expectOne(
      `/user-groups/${id}/`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

});
