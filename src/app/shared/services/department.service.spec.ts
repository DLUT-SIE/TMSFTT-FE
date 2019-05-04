import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DepartmentService', () => {
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
    const service: DepartmentService = TestBed.get(DepartmentService);
    expect(service).toBeTruthy();
  });

  it('should get departments', () => {
    const service: DepartmentService = TestBed.get(DepartmentService);
    const limit = 5;
    const offset = 10;
    service.getDepartments({ limit, offset }).subscribe();

    const params = `limit=${limit}&offset=${offset}`;
    const url = `/departments/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get deparmtent', () => {
    const service: DepartmentService = TestBed.get(DepartmentService);
    const id = 5;
    service.getDepartment(id).subscribe();

    const url = `/departments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });


});
