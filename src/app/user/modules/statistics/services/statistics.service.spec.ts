import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StatisticsService } from './statistics.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

describe('StatisticsService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
          },
        }
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: StatisticsService = TestBed.get(StatisticsService);
    expect(service).toBeTruthy();
  });

  it('should return null if not authenticated', () => {
    const service: StatisticsService = TestBed.get(StatisticsService);
    service.getPersonalSummary().subscribe(
      data => {
        expect(data).toBeNull();
      }
    );
  });

  it('should retrieve data if authenticated', () => {
    const service: StatisticsService = TestBed.get(StatisticsService);
    const authService = TestBed.get(AUTH_SERVICE);
    authService.isAuthenticated = true;
    service.getPersonalSummary().subscribe(
      data => {
        expect(data).not.toBeNull();
      }
    );

    const req = httpTestingController.expectOne('/aggregate-data/data/?method_name=personal_summary');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
