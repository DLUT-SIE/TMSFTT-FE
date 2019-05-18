import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { Department } from 'src/app/shared/interfaces/department';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramService } from './program.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Program } from 'src/app/shared/interfaces/program';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

describe('ProgramService', () => {
  let httpTestingController: HttpTestingController;
  let getDepartment$: Subject<Department>;
  let getProgramCategories$: Subject<ProgramCategory>;

  beforeEach(() => {
    getDepartment$ = new Subject();
    getProgramCategories$ = new Subject();

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
        {
          provide: DepartmentService,
          useValue: {
            getDepartment: () => getDepartment$,
            getProgramCategories: () => getProgramCategories$,
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
    const service: ProgramService = TestBed.get(ProgramService);
    expect(service).toBeTruthy();
  });

  it('should get programs', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getPrograms({offset: 0, limit: 10}).subscribe();

    const url = `/programs/?limit=-1&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  it('should get program', () => {
    const service: ProgramService = TestBed.get(ProgramService);
    const id = 1;

    service.getProgram(id).subscribe();

    const url = `/programs/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get program-categories.', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getProgramCategories().subscribe((data: ProgramCategory[]) => {
      expect(data.length).toEqual(2);
    });
    const url = `/program-categories/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([{val: 1, name: 'test1'}, {val: 2, name: 'test2'}]);

    service.getProgramCategories().subscribe((data: ProgramCategory[]) => {
      expect(data.length).toEqual(2);
    });
  });

  it('should use default if no value provided', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getPrograms({offset: 0, limit: 10}).subscribe();

    const url = `/programs/?limit=-1&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2, results: [], next: '', previous: ''});
  });

  it('should create admin-program-form', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    const createReq: Program = {
      department: 1,
      name: 'test',
      category: 2,
    };

    service.createProgram(createReq).subscribe();

    const req = httpTestingController.expectOne(
      `/programs/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
