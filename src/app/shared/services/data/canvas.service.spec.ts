import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';

import { CanvasService } from './canvas.service';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { OptionType } from '../../interfaces/option-type';
import { Department } from 'src/app/shared/interfaces/department';
import { Program } from 'src/app/shared/interfaces/programs-option';

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
      {type: 0, name: '123', key: 'teachers_statistics', subOption: []},
      {type: 1, name: '456', key: 'records_statistics', subOption: []}
    ]);

    service.getCanvasOptions().subscribe((data: OptionType[]) => {
      expect(data.length).toEqual(2);
    });
    const options: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedStartYear: 0,
      selectedEndYear: 0,
      selectedDepartment: {id: 0, name: '大连理工大学'} as Department
    };
    let canvasUrl = '/aggregate-data/data/?department_id=0&end_year=2016&group_by=0' +
      '&method_name=teachers_statistics&program_id=0&start_year=2016';
    service.getCanvasData(options).subscribe();
    let canvasReq = httpTestingController.expectOne(canvasUrl);
    expect(canvasReq.request.method).toBeTruthy('GET');
    const options1: DataGraphConfiguration = {
      selectedStatisticsType: 0,
      selectedStartYear: 0,
      selectedEndYear: 0,
      selectedDepartment: {id: 0, name: '大连理工大学'} as Department,
      selectedProgram: {id: 1, name: '名师讲堂', department: 1} as Program
    };
    canvasUrl = '/aggregate-data/data/?department_id=0&end_year=2016&group_by=0' +
      '&method_name=teachers_statistics&program_id=1&start_year=2016';
    service.getCanvasData(options1).subscribe();
    canvasReq = httpTestingController.expectOne(canvasUrl);
    expect(canvasReq.request.method).toBeTruthy('GET');
  });

  it('should get group programs', () => {
    const service: CanvasService = TestBed.get(CanvasService);
    const url = '/programs/group-programs/';
    service.getGroupPrograms().subscribe();
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBeTruthy('GET');
  });
});
