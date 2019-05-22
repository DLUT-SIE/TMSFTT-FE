import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { EventService } from './event.service';
import {
  OffCampusEvent,
  CampusEvent,
} from 'src/app/shared/interfaces/event';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { RoundChoices } from 'src/app/shared/interfaces/round-choices';


describe('EventService', () => {
  let httpTestingController: HttpTestingController;
  // let getRoundChoices$: Subject<RoundChoices>;

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

  it('should get campus events', () => {
    const service: EventService = TestBed.get(EventService);

    service.getCampusEvents({}).subscribe();

    const url = `/campus-events/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get off-campus events', () => {
    const service: EventService = TestBed.get(EventService);

    service.getOffCampusEvents({}).subscribe();

    const url = `/off-campus-events/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get event', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 1;

    service.getEvent(id).subscribe();

    const url = `/campus-events/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get off-campus event', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 1;

    service.getOffCampusEvent(id).subscribe();

    const url = `/off-campus-events/${id}/`;

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
    } as OffCampusEvent).subscribe();
    const req = httpTestingController.expectOne(
      `/off-campus-events/`);
    expect(req.request.method).toEqual('POST');
    req.flush({
      name: 'name',
      time: '2019-01-01',
      location: 'location',
      num_hours: 10,
      num_participants: 50,
    } as OffCampusEvent);
  });

  it('should delete OffCampusEvent', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 5;

    service.deleteOffCampusEvent(id).subscribe();
    const req = httpTestingController.expectOne(
      `/off-campus-events/${id}/`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should create event-form', () => {
    const service: EventService = TestBed.get(EventService);

    const createReq: CampusEvent = {
      name: 'test',
      time: 'time',
      location: 'location',
      num_hours: 12,
      num_participants: 1,
      deadline: 'deadline',
      description: '666',
      program: 1,
    };

    service.createCampusEvent(createReq).subscribe();

    const req = httpTestingController.expectOne(
      `/campus-events/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update event-form.', () => {
    const service: EventService = TestBed.get(EventService);
    const updateReq: CampusEvent = {
      id: 1,
      name: 'test',
      time: 'time',
      location: 'location',
      num_hours: 12,
      num_participants: 1,
      deadline: 'deadline',
      description: '666',
      program: 1,
    };

    service.updateCampusEvent(updateReq).subscribe();
    const req = httpTestingController.expectOne(
      `/campus-events/1/`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should enroll campusevent', () => {
    const service: EventService = TestBed.get(EventService);
    const event: CampusEvent = {
      id: 1,
      name: 'test',
      time: 'time',
      location: 'location',
      num_hours: 12,
      num_participants: 1,
      deadline: 'deadline',
      description: '666',
      program: 1,
    };
    service.enrollCampusEvent(event).subscribe();

    const req = httpTestingController.expectOne(`/enrollments/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('shoule delete enrollment.', () => {
    const service: EventService = TestBed.get(EventService);
    const id = 1;

    service.deleteEventEnrollment(id).subscribe();

    const url = `/enrollments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should get round-choices.', () => {
    const service: EventService = TestBed.get(EventService);

    service.getRoundChoices().subscribe((data: RoundChoices[]) => {
      expect(data.length).toEqual(2);
    });
    const url = `/round-choices/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([{val: 1, name: 'test1'}, {val: 2, name: 'test2'}]);

    service.getRoundChoices().subscribe((data: RoundChoices[]) => {
      expect(data.length).toEqual(2);
    });
  });

});
