import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';

import { CanvasOptionsService } from './canvas-options.service';
import { OptionType } from '../../interfaces/option-type';

describe('CanvasOptionsService', () => {
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
    const service: CanvasOptionsService = TestBed.get(CanvasOptionsService);
    expect(service).toBeTruthy();
  });

  it('should get options', () => {
    const service: CanvasOptionsService = TestBed.get(CanvasOptionsService);
    const url = '/canvas-data/canvas-options/';
    service.getCanvasOptions().subscribe();
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBeTruthy('GET');
    req.flush([
      {type: 0, name: '123', subOption: []},
      {type: 1, name: '456', subOption: []}
    ]);

    service.getCanvasOptions().subscribe((data: OptionType[]) => {
      expect(data.length).toEqual(2);
    });
  });
});
