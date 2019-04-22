import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { EventDetailResolverService } from './event-detail-resolver.service';
import { EventService } from './event.service';

describe('EventDetailResolverService', () => {
  let getEvent: jasmine.Spy;
  beforeEach(() => {
    getEvent = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventService,
          useValue: { getEvent }
        }
      ]
    });
  });
  it('should be created', () => {
    const service: EventDetailResolverService = TestBed.get(EventDetailResolverService);
    expect(service).toBeTruthy();
  });
  it('should resolve data', () => {
    const service: EventDetailResolverService = TestBed.get(EventDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getEvent.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();

    expect(getEvent).toHaveBeenCalledWith(id);
  });
});
