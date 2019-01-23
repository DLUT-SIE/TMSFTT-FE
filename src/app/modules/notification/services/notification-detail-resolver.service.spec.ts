import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { NotificationDetailResolverService } from './notification-detail-resolver.service';
import { NotificationService } from './notification.service';

describe('NotificationDetailResolverService', () => {
  let getNotification: jasmine.Spy;
  beforeEach(() => {
    getNotification = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: NotificationService,
          useValue: { getNotification }
        }
      ]
    });
  });

  it('should be created', () => {
    const service: NotificationDetailResolverService = TestBed.get(NotificationDetailResolverService);
    expect(service).toBeTruthy();
  });

  it('should resolve data', () => {
    const service: NotificationDetailResolverService = TestBed.get(NotificationDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getNotification.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();

    expect(getNotification).toHaveBeenCalledWith(id);
  });
});
