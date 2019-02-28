import { TestBed } from '@angular/core/testing';

import { EventDetailResolverService } from './event-detail-resolver.service';

describe('EventDetailResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventDetailResolverService = TestBed.get(EventDetailResolverService);
    expect(service).toBeTruthy();
  });
});
