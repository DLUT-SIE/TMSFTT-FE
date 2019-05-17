import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { CampusEventDetailResolverService } from './campus-event-detail-resolver.service';
import { EventService } from './event.service';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Subject } from 'rxjs';

describe('CampusEventDetailResolverService', () => {
  let getEvent: jasmine.Spy;
  let getEvent$: Subject<CampusEvent>;

  beforeEach(() => {
    getEvent = jasmine.createSpy();

    getEvent$ = new Subject<CampusEvent>();
    getEvent.and.returnValue(getEvent$);

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
    const service: CampusEventDetailResolverService = TestBed.get(CampusEventDetailResolverService);
    expect(service).toBeTruthy();
  });
  it('should resolve data', () => {
    const service: CampusEventDetailResolverService = TestBed.get(CampusEventDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getEvent.and.returnValue(observableOf(null));
    service.resolve(route, null).subscribe();
  });
});
