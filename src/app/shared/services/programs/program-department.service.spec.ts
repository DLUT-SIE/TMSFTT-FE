import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { ProgramDepartmentService } from './program-department.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { environment } from 'src/environments/environment';

describe('ProgramDepartmentService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const authenticationSucceed$ = new Subject<void>();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            authenticationSucceed: authenticationSucceed$,
            isAuthenticated: true,
          },
        },
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: ProgramDepartmentService = TestBed.get(ProgramDepartmentService);
    expect(service).toBeTruthy();
  });
  
  it('should get admin-program-departments', () => {
    const service: ProgramDepartmentService = TestBed.get(ProgramDepartmentService);

    service.getProgramDepartments({}).subscribe();

    const url = `${environment.API_URL}/departments/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get admin-program-department', () => {
    const service: ProgramDepartmentService = TestBed.get(ProgramDepartmentService);

    service.getProgramDepartment(2).subscribe();

    const url = `${environment.API_URL}/departments/2/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

});
