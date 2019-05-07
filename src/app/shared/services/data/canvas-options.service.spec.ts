import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';

import { CanvasOptionsService } from './canvas-options.service';
import { OptionType } from 'src/app/shared/interfaces/option-type';

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
    req.flush({});
  });

  it('should judge is ByDepartment', () => {
    const options: OptionType[] = [{
      type: 0,
      option: {
          name: '教职工人数统计',
          subOption: [
              {
                  type: 0,
                  name: '按学院'
              },
              {
                  type: 1,
                  name: '按人员类别'
              },
              {
                  type: 1,
                  name: '按职称'
              },
              {
                  type: 3,
                  name: '按最高学位'
              },
              {
                  type: 2,
                  name: '按年龄分布'
              }
          ]
      }
    }];
    const service: CanvasOptionsService = TestBed.get(CanvasOptionsService);
    expect(service.isByDepartment(options, 0, 0)).toBeTruthy();
  });
});
