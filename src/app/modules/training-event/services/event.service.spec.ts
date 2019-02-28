import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { EventService } from './event.service';
import { environment } from 'src/environments/environment';
import {
  CampusEventResponse,
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

describe('EventService', () => {
  let httpTestingController: HttpTestingController;
  const dummyEvent: CampusEventResponse = {
    id: 601,
    create_time: '2019-02-26T15:04:24.232265+08:00',
    update_time: '2019-02-26T15:04:24.232288+08:00',
    name: '介绍需要关系如此.',
    time: '2019-04-06T01:07:39.333288+08:00',
    location: '济南街D座',
    num_hours: 1.155832407467451,
    num_participants: 62,
    deadline: '2019-02-26T15:04:24.231857+08:00',
    num_enrolled: 0,
    description: '问题解决是一对于营.内容她的北京发现项目经济更多.',
    program: 157
  };

  const dummyResponse: PaginatedResponse<CampusEventResponse> = {
    count: 100,
    next: 'next',
    previous: 'previous',
    results: [dummyEvent, dummyEvent],
  };
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(() => {
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

  it('should use default if no value provided', () => {
    const service: EventService = TestBed.get(EventService);

    service.getEvents().subscribe(
      data => {
        expect(data.results.length).toEqual(2);
      });

    const url = `${environment.API_URL}/campus-events/?offset=0&limit=10`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should get events', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 1;

    service.getEvent(id).subscribe();

    const url = `${environment.API_URL}/campus-events/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyEvent);
  });

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });

  it('should create OffCampusEvent', () => {
    const service: EventService = TestBed.get(EventService);

    service.createOffCampusEvent({
      name: 'name',
      time: '2019-01-01',
      location: 'location',
      num_hours: 10,
      num_participants: 50,
    } as OffCampusEventRequest).subscribe();
    const req = httpTestingController.expectOne(
      `${environment.API_URL}/off-campus-events/`);
    expect(req.request.method).toEqual('POST');
    req.flush({
      name: 'name',
      time: '2019-01-01',
      location: 'location',
      num_hours: 10,
      num_participants: 50,
    } as OffCampusEventResponse);
  });

  it('should delete OffCampusEvent', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 5;

    service.deleteOffCampusEvent(id).subscribe();
    const req = httpTestingController.expectOne(
      `${environment.API_URL}/off-campus-events/${id}/`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

});
