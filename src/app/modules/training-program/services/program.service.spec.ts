import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { ProgramService } from './program.service';
import { environment } from 'src/environments/environment';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';

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
    const offset = 0;
    const limit = 20;

    service.getPrograms(offset, limit).subscribe();

    const url = `${environment.API_URL}/programs/?offset=${offset}&limit=${limit}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2, results: [], next: "", previous: ""});
  });


  it('should use default if no value provided', () => {
    const service: ProgramService = TestBed.get(ProgramService);

    service.getPrograms().subscribe();

    const url = `${environment.API_URL}/programs/?offset=0&limit=10`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2, results: [], next: "", previous: ""});
  });

});
