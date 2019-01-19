import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventService } from './event.service';
import { environment } from '../../../environments/environment';

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
      time: 'time',
      location: 'location',
      num_hours: 5,
      num_participants: 10,
    }).subscribe();
    const req = httpTestingController.expectOne(environment.OFF_CAMPUS_EVENT_SERVICE_URL);
    expect(req.request.method).toEqual('POST');
    req.flush({});
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
