import { TestBed } from '@angular/core/testing';

import { RecordDetailResolverService } from './record-detail-resolver.service';

describe('RecordDetailResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecordDetailResolverService = TestBed.get(RecordDetailResolverService);
    expect(service).toBeTruthy();
  });
});
