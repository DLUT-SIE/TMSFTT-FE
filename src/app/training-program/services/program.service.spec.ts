import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { ProgramService } from './program.service';
import { environment } from 'src/environments/environment';
import { ProgramRequest } from 'src/app/shared/interfaces/program';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

describe('ProgramService', () => {
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
    const service: ProgramService = TestBed.get(ProgramService);
    expect(service).toBeTruthy();
  });

  it('should get programs', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getPrograms({}).subscribe();

    const url = `${environment.API_URL}/programs/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2, results: [], next: '', previous: ''});
  });

  it('should get program', () => {
    const service: ProgramService = TestBed.get(ProgramService);
    const id = 1;

    service.getProgram(id).subscribe();

    const url = `${environment.API_URL}/programs/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should use default if no value provided', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getPrograms({}).subscribe();

    const url = `${environment.API_URL}/programs/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2, results: [], next: '', previous: ''});
  });

  it('should create program-form', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    const createReq: ProgramRequest = {
      department: 1,
      name: 'test',
      category: 2,
      form: [1, 2],
    };

    service.createProgram(createReq).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/programs/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get program-form', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getProgramForm().subscribe();

    const url = `${environment.API_URL}/program-forms/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get program-category', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getProgramCategory().subscribe();

    const url = `${environment.API_URL}/program-categories/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

});
