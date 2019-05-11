import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';

import { CanvasService } from './canvas.service';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { OptionType } from '../../interfaces/option-type';

describe('CanvasService', () => {
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
    const service: CanvasService = TestBed.get(CanvasService);
    expect(service).toBeTruthy();
  });

  it('should get options', () => {
    const service: CanvasService = TestBed.get(CanvasService);
    const url = '/aggregate-data/canvas-options/';
    service.getCanvasOptions().subscribe();
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBeTruthy('GET');
    req.flush([
      {type: 0, name: '123', key: 'staff_statistics', subOption: []},
      {type: 1, name: '456', key: 'trainee_statistics', subOption: []}
    ]);

    service.getCanvasOptions().subscribe((data: OptionType[]) => {
      expect(data.length).toEqual(2);
    });
    const options: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedGroupType: 0,
      selectedStartYear: 0,
      selectedEndYear: 0,
      selectedDepartment: 0
    };
    const canvasUrl = '/aggregate-data/data/';
    const methodName = 'staff_statistics';
    const groupBy = options.selectedGroupType;
    const startYear = options.selectedStartYear;
    const endYear = options.selectedEndYear;
    const region = options.selectedDepartment;
    const queryUrl = canvasUrl +
      `?method_name=${methodName}&group_by=${groupBy}&start_year=` +
      `${startYear}&end_year=${endYear}&region=${region}/`;
    service.getCanvasData(options).subscribe();
    const canvasReq = httpTestingController.expectOne(queryUrl);
    expect(canvasReq.request.method).toBeTruthy('GET');
  });
});
