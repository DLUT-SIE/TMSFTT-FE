import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { EventService } from './event.service';
import { environment } from 'src/environments/environment';
import {
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';


describe('EventService', () => {
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

  it('should use default if no value provided', () => {
    const service: EventService = TestBed.get(EventService);

    service.getEvents().subscribe();

    const url = `${environment.API_URL}/campus-events/?offset=0&limit=10`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({count: 2});
  });

  it('should get event', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 1;

    service.getEvent(id).subscribe();

    const url = `${environment.API_URL}/campus-events/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
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
