import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { RecordDetailResolverService } from './record-detail-resolver.service';
import { RecordService } from './record.service';

describe('RecordDetailResolverService', () => {
  let getRecordWithDetail: jasmine.Spy;
  beforeEach(() => {
    getRecordWithDetail = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RecordService,
          useValue: { getRecordWithDetail }
        }
      ]
    });
  });

  it('should be created', () => {
    const service: RecordDetailResolverService = TestBed.get(RecordDetailResolverService);
    expect(service).toBeTruthy();
  });

  it('should resolve data', () => {
    const service: RecordDetailResolverService = TestBed.get(RecordDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getRecordWithDetail.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();

    expect(getRecordWithDetail).toHaveBeenCalled();
  });
});
