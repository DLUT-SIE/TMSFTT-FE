import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventService } from './event.service';
import { environment } from 'src/environments/environment';
import {
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';

describe('EventService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
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
    const req = httpTestingController.expectOne(environment.OFF_CAMPUS_EVENT_SERVICE_URL);
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
    const req = httpTestingController.expectOne(environment.OFF_CAMPUS_EVENT_SERVICE_URL + id + '/');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

});
