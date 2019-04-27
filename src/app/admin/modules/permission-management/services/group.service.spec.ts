import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
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

    const url = `${environment.API_URL}/groups/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should get Group2', () => {
    const department = {id: 1, name: 'name'} as Department;
    const service: GroupService = TestBed.get(GroupService);
    service.getGroupByDepartmentName(department.name).subscribe();

    const params = `name__startswith=${department.name}`;
    const url = `${environment.API_URL}/groups/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });
});
