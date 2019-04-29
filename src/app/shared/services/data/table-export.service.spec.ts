import { TestBed } from '@angular/core/testing';
import { TableExportService } from './table-export.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';

describe('TableExportService', () => {
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
    const service: TableExportService = TestBed.get(TableExportService);
    expect(service).toBeTruthy();
  });

  it('should export table', () => {
    const service: TableExportService = TestBed.get(TableExportService);
    const url = `${environment.API_URL}/data-management/table-export`;
    service.exportTable(url).subscribe();
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBeTruthy('GET');
    req.flush({});
  });
});
